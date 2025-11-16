import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, CheckCircle } from 'lucide-react';
import type { Message, ChatResponse } from '../types';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  currentResponse: ChatResponse | null;
  isLoading: boolean;
}

export function ChatInterface({ onSendMessage, messages, currentResponse, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-float">🦋</div>
              <h2 className="text-2xl font-bold text-gray-300">
                Welcome to Echo v2.0
              </h2>
              <p className="text-gray-400 max-w-md">
                I'm Echo, an AI with evolving personality traits and positive reinforcement learning.
                Watch my traits evolve as we chat!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-butterfly-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Show quality signals for assistant messages */}
                {message.role === 'assistant' && currentResponse && index === messages.length - 1 && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    {/* Quality Score */}
                    <div className="flex items-center space-x-2 text-sm">
                      {currentResponse.quality_signals.deserves_reinforcement ? (
                        <>
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">
                            High Quality Response (Score: {(currentResponse.quality_signals.quality_score * 100).toFixed(0)}%)
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">
                          Quality Score: {(currentResponse.quality_signals.quality_score * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    
                    {/* Quality Signals */}
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {currentResponse.quality_signals.asked_questions && (
                        <span className="flex items-center space-x-1 bg-green-900/30 text-green-400 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" />
                          <span>Asked Questions</span>
                        </span>
                      )}
                      {currentResponse.quality_signals.appropriate_length && (
                        <span className="flex items-center space-x-1 bg-green-900/30 text-green-400 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" />
                          <span>Good Length</span>
                        </span>
                      )}
                      {currentResponse.quality_signals.followed_constraints && (
                        <span className="flex items-center space-x-1 bg-green-900/30 text-green-400 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" />
                          <span>Followed Guidelines</span>
                        </span>
                      )}
                      {currentResponse.quality_signals.shows_self_awareness && (
                        <span className="flex items-center space-x-1 bg-green-900/30 text-green-400 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" />
                          <span>Self-Aware</span>
                        </span>
                      )}
                    </div>

                    {/* Mirror Loop Indicator */}
                    {currentResponse.mirror_loop && (
                      <div className="mt-2 text-xs bg-butterfly-900/30 text-butterfly-400 px-2 py-1 rounded inline-block">
                        🪞 Mirror Loop Triggered (Message #{currentResponse.message_count})
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={isLoading ? 'Echo is thinking...' : 'Talk to Echo...'}
            className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-butterfly-500 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-lg bg-butterfly-600 hover:bg-butterfly-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
