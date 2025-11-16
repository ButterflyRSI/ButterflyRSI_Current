export interface PersonalityTraits {
  analytical: number;
  creative: number;
  empathic: number;
  curious: number;
  concise: number;
  detailed: number;
}

export interface BehavioralConstraint {
  rule: string;
  context: string;
  strength: number;
  successes: number;
  failures: number;
  created_at: string;
  last_reinforced: string;
}

export interface QualitySignals {
  asked_questions: boolean;
  appropriate_length: boolean;
  followed_constraints: boolean;
  shows_self_awareness: boolean;
  quality_score: number;
  deserves_reinforcement: boolean;
}

export interface ConstraintUpdate {
  action: 'strengthened' | 'reinforced_existing' | 'added' | 'weakened';
  constraint: string;
  new_strength?: number;
  strength?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  response: string;
  self_evaluation: string;
  quality_signals: QualitySignals;
  constraints: BehavioralConstraint[];
  personality: PersonalityTraits;
  dominant_trait: string;
  mirror_loop: boolean;
  message_count: number;
  constraint_updates: ConstraintUpdate[];
}

export interface AgentStatus {
  model: string;
  message_count: number;
  constraint_count: number;
  personality: PersonalityTraits;
  dominant_trait: string;
  last_quality: QualitySignals;
}
