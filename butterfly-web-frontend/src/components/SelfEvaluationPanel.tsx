import React from 'react';
import { MessageSquare, Eye } from 'lucide-react';

interface SelfEvaluationPanelProps {
  selfEvaluation: string | null;
}

export function SelfEvaluationPanel({ selfEvaluation }: SelfEvaluationPanelProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Eye className="w-5 h-5 text-butterfly-400" />
        <h3 className="text-lg font-semibold text-gray-200">Self-Reflection</h3>
      </div>

      {selfEvaluation ? (
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-4 h-4 text-butterfly-400 mt-1 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {selfEvaluation}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No reflection yet</p>
          <p className="text-xs mt-1">Echo reflects after each response</p>
        </div>
      )}

      <div className="pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 italic">
          Echo evaluates her own responses to continuously improve
        </p>
      </div>
    </div>
  );
}
