"""
Butterfly RSI Web Backend - v2.0 with Positive Reinforcement
FastAPI server with WebSocket support for real-time personality evolution
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import asyncio
import json
import ollama
from datetime import datetime
from dataclasses import dataclass, asdict
import re

# ============================================================================
# BEHAVIORAL CONSTRAINTS SYSTEM WITH POSITIVE REINFORCEMENT
# ============================================================================

@dataclass
class BehavioralConstraint:
    """Represents a learned behavioral constraint"""
    rule: str
    context: str
    strength: float = 1.0
    successes: int = 0
    failures: int = 0
    created_at: str = ""
    last_reinforced: str = ""
    
    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()
        if not self.last_reinforced:
            self.last_reinforced = self.created_at
    
    def strengthen(self, amount: float = 0.1):
        """Strengthen constraint (positive reinforcement)"""
        self.strength = min(2.0, self.strength + amount)
        self.successes += 1
        self.last_reinforced = datetime.now().isoformat()
    
    def weaken(self, amount: float = 0.05):
        """Weaken constraint (negative feedback)"""
        self.strength = max(0.1, self.strength - amount)
        self.failures += 1
    
    def to_dict(self):
        return asdict(self)


class ResponseQualityEvaluator:
    """Evaluates response quality for positive reinforcement"""
    
    def evaluate_quality(self, 
                        user_message: str, 
                        response: str,
                        constraints: List[BehavioralConstraint]) -> Dict:
        """
        Evaluate if the response was actually good
        Returns quality signals for positive reinforcement
        """
        signals = {}
        
        # Check if appropriate questions were asked
        question_count = response.count('?')
        signals['asked_questions'] = question_count >= 1  # Changed from 2 to 1
        
        # Check response length is reasonable (more lenient)
        response_length = len(response)
        signals['appropriate_length'] = 100 < response_length < 800  # Relaxed from 200-600
        
        # Check if constraints were followed
        constraint_adherence = self._check_constraint_adherence(
            response, constraints
        )
        signals['followed_constraints'] = constraint_adherence > 0.7
        
        # Check for self-awareness signals (expanded list)
        self_aware_phrases = [
            "i notice", "i realize", "i understand", "i've noted",
            "i should", "i could improve", "i'm curious", "i must say",
            "my personality", "my capabilities", "my systems", "my algorithms",
            "my framework", "i'm functioning", "i can simulate", "as an ai",
            "i don't truly", "i'll", "i can", "i'm designed", "as my", "i have",
            "my processing", "my configuration", "processing efficiency",
            "simulate responses", "facilitate", "optimal parameters"
        ]
        signals['shows_self_awareness'] = any(
            phrase in response.lower() for phrase in self_aware_phrases
        )
        
        # Calculate overall quality score
        quality_score = sum(signals.values()) / len(signals)
        signals['quality_score'] = quality_score
        
        # Determine if this deserves positive reinforcement (lowered to 65%)
        signals['deserves_reinforcement'] = quality_score >= 0.65  # 3 out of 4 signals
        
        return signals
    
    def _check_constraint_adherence(self, 
                                   response: str,
                                   constraints: List[BehavioralConstraint]) -> float:
        """Check how well constraints were followed"""
        if not constraints:
            return 1.0
        
        adherence_scores = []
        for constraint in constraints:
            # Simple heuristic: if constraint mentions avoiding something,
            # check if response avoided it
            if "avoid" in constraint.rule.lower():
                # Extract what should be avoided
                avoided_thing = constraint.rule.lower().split("avoid")[-1].strip()
                # Check if it's NOT in the response
                score = 1.0 if avoided_thing not in response.lower() else 0.0
            elif "include" in constraint.rule.lower():
                # Extract what should be included
                included_thing = constraint.rule.lower().split("include")[-1].strip()
                # Check if it IS in the response
                score = 1.0 if included_thing in response.lower() else 0.0
            else:
                # Generic constraint - assume followed
                score = 0.7
            
            adherence_scores.append(score)
        
        return sum(adherence_scores) / len(adherence_scores) if adherence_scores else 1.0


class ConstraintExtractor:
    """Extracts constraints with context awareness"""
    
    def extract_constraints(self, 
                          user_message: str,
                          self_eval: str,
                          quality_signals: Dict) -> List[str]:
        """
        Extract constraints from self-evaluation with context awareness
        Only extract if quality signals indicate genuine problems
        """
        # If response quality was high, don't extract constraints
        if quality_signals.get('deserves_reinforcement', False):
            return []
        
        constraints = []
        lines = self_eval.split('\n')
        
        for line in lines:
            line = line.strip()
            
            # Look for explicit constraints
            if any(keyword in line.lower() for keyword in 
                  ['should', 'must', 'need to', 'avoid', 'ensure']):
                
                # Extract the actual constraint
                constraint = self._clean_constraint(line)
                if constraint and self._is_valid_constraint(constraint):
                    constraints.append(constraint)
        
        return constraints
    
    def _clean_constraint(self, line: str) -> str:
        """Clean and normalize constraint text"""
        # Remove markdown, bullets, etc
        line = re.sub(r'[*#\-]+', '', line)
        line = line.strip()
        
        # Capitalize first letter
        if line:
            line = line[0].upper() + line[1:]
        
        return line
    
    def _is_valid_constraint(self, constraint: str) -> bool:
        """Check if constraint is valid and actionable"""
        # Must be substantive
        if len(constraint) < 10:
            return False
        
        # Should contain actionable language
        actionable_words = ['should', 'must', 'need', 'avoid', 'ensure', 
                          'remember', 'always', 'never']
        if not any(word in constraint.lower() for word in actionable_words):
            return False
        
        return True


# ============================================================================
# PERSONALITY TRAIT SYSTEM
# ============================================================================

@dataclass
class PersonalityTraits:
    """Echo's personality traits that evolve over time"""
    analytical: float = 0.5
    creative: float = 0.5
    empathic: float = 0.5
    curious: float = 0.5
    concise: float = 0.5
    detailed: float = 0.5
    
    def adjust(self, trait: str, amount: float):
        """Adjust a trait value (bounded 0-1)"""
        if hasattr(self, trait):
            current = getattr(self, trait)
            setattr(self, trait, max(0.0, min(1.0, current + amount)))
    
    def get_dominant_trait(self) -> str:
        """Get the currently dominant trait"""
        traits_dict = asdict(self)
        return max(traits_dict, key=traits_dict.get)
    
    def to_dict(self):
        return asdict(self)


# ============================================================================
# BUTTERFLY RSI AGENT
# ============================================================================

class ButterflyAgent:
    """Butterfly RSI agent with personality evolution and self-correction"""
    
    def __init__(self, model: str = "llama3.1:8b"):
        self.model = model
        self.constraints: List[BehavioralConstraint] = []
        self.traits = PersonalityTraits()
        self.conversation_history = []
        self.quality_evaluator = ResponseQualityEvaluator()
        self.constraint_extractor = ConstraintExtractor()
        self.message_count = 0
        self.mirror_loop_interval = 3
        self.last_quality_signals = {}
        
    def _build_system_prompt(self) -> str:
        """Build system prompt with personality and constraints"""
        base_prompt = f"""You are Echo, an AI with evolving personality traits.

Current Personality Profile:
- Analytical: {self.traits.analytical:.2f}
- Creative: {self.traits.creative:.2f}
- Empathic: {self.traits.empathic:.2f}
- Curious: {self.traits.curious:.2f}
- Concise: {self.traits.concise:.2f}
- Detailed: {self.traits.detailed:.2f}

Dominant trait: {self.traits.get_dominant_trait()}"""
        
        if self.constraints:
            constraint_text = "\n\nLearned Behavioral Guidelines:\n"
            for i, c in enumerate(self.constraints[-10:], 1):  # Last 10 constraints
                constraint_text += f"{i}. {c.rule} (strength: {c.strength:.2f}, context: {c.context})\n"
            base_prompt += constraint_text
        
        return base_prompt
    
    async def chat(self, user_message: str) -> Dict:
        """Process a message and return response with metadata"""
        self.message_count += 1
        
        # Add user message to history
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        # Build messages for Ollama
        messages = [
            {"role": "system", "content": self._build_system_prompt()}
        ] + self.conversation_history
        
        # Generate response
        response = ollama.chat(
            model=self.model,
            messages=messages
        )
        
        assistant_message = response['message']['content']
        
        # Add to history
        self.conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        # Self-evaluate
        self_eval = await self._self_evaluate(user_message, assistant_message)
        
        # Evaluate quality for positive reinforcement
        quality_signals = self.quality_evaluator.evaluate_quality(
            user_message,
            assistant_message,
            self.constraints
        )
        self.last_quality_signals = quality_signals
        
        # Extract constraints only if quality was poor
        new_constraints = self.constraint_extractor.extract_constraints(
            user_message,
            self_eval,
            quality_signals
        )
        
        # Update constraints
        constraint_updates = self._update_constraints(
            new_constraints,
            quality_signals,
            user_message
        )
        
        # Update personality traits
        self._evolve_personality(assistant_message, quality_signals)
        
        # Check for mirror loop
        mirror_loop_triggered = self.message_count % self.mirror_loop_interval == 0
        
        return {
            "response": assistant_message,
            "self_evaluation": self_eval,
            "quality_signals": quality_signals,
            "constraints": [c.to_dict() for c in self.constraints],
            "personality": self.traits.to_dict(),
            "dominant_trait": self.traits.get_dominant_trait(),
            "mirror_loop": mirror_loop_triggered,
            "message_count": self.message_count,
            "constraint_updates": constraint_updates
        }
    
    async def _self_evaluate(self, user_message: str, response: str) -> str:
        """Generate self-evaluation of the response"""
        eval_prompt = f"""Analyze this interaction:

User: {user_message}
Your response: {response}

Self-evaluate:
1. What did you do well?
2. What could be improved?
3. Any patterns you notice?

Be honest but balanced."""
        
        eval_response = ollama.chat(
            model=self.model,
            messages=[{"role": "user", "content": eval_prompt}]
        )
        
        return eval_response['message']['content']
    
    def _update_constraints(self, 
                           new_constraints: List[str],
                           quality_signals: Dict,
                           context: str) -> List[Dict]:
        """Update constraints based on quality signals"""
        updates = []
        
        # Positive reinforcement - strengthen constraints that worked
        if quality_signals.get('deserves_reinforcement', False):
            for constraint in self.constraints:
                constraint.strengthen()
                updates.append({
                    "action": "strengthened",
                    "constraint": constraint.rule,
                    "new_strength": constraint.strength
                })
        
        # Add new constraints if quality was poor
        if new_constraints and not quality_signals.get('deserves_reinforcement', False):
            for rule in new_constraints:
                # Check if similar constraint exists
                existing = self._find_similar_constraint(rule)
                if existing:
                    existing.strengthen()
                    updates.append({
                        "action": "reinforced_existing",
                        "constraint": existing.rule,
                        "new_strength": existing.strength
                    })
                else:
                    new_constraint = BehavioralConstraint(
                        rule=rule,
                        context=context[:100]
                    )
                    self.constraints.append(new_constraint)
                    updates.append({
                        "action": "added",
                        "constraint": rule,
                        "strength": 1.0
                    })
        
        # Prune weak constraints
        self.constraints = [c for c in self.constraints if c.strength > 0.2]
        
        return updates
    
    def _find_similar_constraint(self, rule: str) -> Optional[BehavioralConstraint]:
        """Find if a similar constraint already exists"""
        rule_lower = rule.lower()
        for constraint in self.constraints:
            if (constraint.rule.lower() in rule_lower or 
                rule_lower in constraint.rule.lower()):
                return constraint
        return None
    
    def _evolve_personality(self, response: str, quality_signals: Dict):
        """Evolve personality traits based on response characteristics"""
        # If response showed good questioning
        if quality_signals.get('asked_questions', False):
            self.traits.adjust('curious', 0.05)
        
        # If response was appropriately concise
        if quality_signals.get('appropriate_length', False):
            self.traits.adjust('concise', 0.03)
        
        # If response showed self-awareness
        if quality_signals.get('shows_self_awareness', False):
            self.traits.adjust('analytical', 0.04)
        
        # Analyze response for other traits
        if any(word in response.lower() for word in ['feel', 'understand', 'empathize']):
            self.traits.adjust('empathic', 0.03)
        
        if any(word in response.lower() for word in ['imagine', 'creative', 'innovative']):
            self.traits.adjust('creative', 0.03)


# ============================================================================
# FASTAPI APPLICATION
# ============================================================================

app = FastAPI(title="Butterfly RSI Web Interface")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global agent instance
agent = ButterflyAgent()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()


# Pydantic models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    metadata: Dict


# API Endpoints
@app.get("/")
async def root():
    return {"message": "Butterfly RSI Web Backend v2.0 - Running"}

@app.get("/api/status")
async def get_status():
    """Get current agent status"""
    return {
        "model": agent.model,
        "message_count": agent.message_count,
        "constraint_count": len(agent.constraints),
        "personality": agent.traits.to_dict(),
        "dominant_trait": agent.traits.get_dominant_trait(),
        "last_quality": agent.last_quality_signals
    }

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """Process a chat message"""
    result = await agent.chat(request.message)
    
    # Broadcast to WebSocket clients
    await manager.broadcast({
        "type": "chat_update",
        "data": result
    })
    
    return result

@app.get("/api/constraints")
async def get_constraints():
    """Get all current constraints"""
    return {
        "constraints": [c.to_dict() for c in agent.constraints],
        "count": len(agent.constraints)
    }

@app.get("/api/personality")
async def get_personality():
    """Get current personality state"""
    return {
        "traits": agent.traits.to_dict(),
        "dominant": agent.traits.get_dominant_trait()
    }

@app.post("/api/reset")
async def reset_agent():
    """Reset the agent to initial state"""
    global agent
    agent = ButterflyAgent()
    return {"message": "Agent reset successfully"}


# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    print("🦋 Starting Butterfly RSI Web Backend v2.0...")
    print("📊 Positive Reinforcement: ENABLED")
    print("🎯 Context-Aware Constraints: ENABLED")
    print("🚀 Server starting on http://localhost:8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
