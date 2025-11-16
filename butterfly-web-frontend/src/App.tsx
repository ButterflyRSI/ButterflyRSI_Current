import { useState, useCallback } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { PersonalityDashboard } from './components/PersonalityDashboard';
import { ConstraintsPanel } from './components/ConstraintsPanel';
import { SelfEvaluationPanel } from './components/SelfEvaluationPanel';
import { StatusBar } from './components/StatusBar';
import { useWebSocket } from './hooks/useWebSocket';
import type { Message, ChatResponse, AgentStatus } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentResponse, setCurrentResponse] = useState<ChatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<AgentStatus>({
    model: 'llama3.1:8b',
    message_count: 0,
    constraint_count: 0,
    personality: {
      analytical: 0.5,
      creative: 0.5,
      empathic: 0.5,
      curious: 0.5,
      concise: 0.5,
      detailed: 0.5,
    },
    dominant_trait: 'analytical',
    last_quality: {
      asked_questions: false,
      appropriate_length: false,
      followed_constraints: false,
      shows_self_awareness: false,
      quality_score: 0,
      deserves_reinforcement: false,
    },
  });

  // WebSocket connection for real-time updates
  const handleWebSocketUpdate = useCallback((data: ChatResponse) => {
    setCurrentResponse(data);
    setStatus(prev => ({
      ...prev,
      message_count: data.message_count,
      constraint_count: data.constraints.length,
      personality: data.personality,
      dominant_trait: data.dominant_trait,
      last_quality: data.quality_signals,
    }));
  }, []);

  const { connected } = useWebSocket(handleWebSocketUpdate);

  // Send message to backend
  const handleSendMessage = async (message: string) => {
    // Add user message to UI immediately
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data: ChatResponse = await response.json();

      // Add assistant message to UI
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Update current response data
      setCurrentResponse(data);
      setStatus(prev => ({
        ...prev,
        message_count: data.message_count,
        constraint_count: data.constraints.length,
        personality: data.personality,
        dominant_trait: data.dominant_trait,
        last_quality: data.quality_signals,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the backend is running on http://localhost:8000',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      <StatusBar
        connected={connected}
        messageCount={status.message_count}
        constraintCount={status.constraint_count}
        model={status.model}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface
            onSendMessage={handleSendMessage}
            messages={messages}
            currentResponse={currentResponse}
            isLoading={isLoading}
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-gray-900 border-l border-gray-700 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Personality Dashboard */}
            <PersonalityDashboard
              traits={status.personality}
              dominantTrait={status.dominant_trait}
            />

            {/* Self-Evaluation */}
            <SelfEvaluationPanel
              selfEvaluation={currentResponse?.self_evaluation || null}
            />

            {/* Constraints Panel */}
            <ConstraintsPanel
              constraints={currentResponse?.constraints || []}
              recentUpdates={currentResponse?.constraint_updates || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
