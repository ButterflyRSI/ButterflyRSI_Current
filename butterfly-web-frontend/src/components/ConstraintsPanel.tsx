import React from 'react';
import { ShieldCheck, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import type { BehavioralConstraint, ConstraintUpdate } from '../types';

interface ConstraintsPanelProps {
  constraints: BehavioralConstraint[];
  recentUpdates: ConstraintUpdate[];
}

export function ConstraintsPanel({ constraints, recentUpdates }: ConstraintsPanelProps) {
  // Sort constraints by strength
  const sortedConstraints = [...constraints].sort((a, b) => b.strength - a.strength);
  const topConstraints = sortedConstraints.slice(0, 5);

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-butterfly-400" />
          <span>Learned Guidelines</span>
        </h3>
        <span className="text-sm text-gray-400">{constraints.length} total</span>
      </div>

      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Recent Changes</h4>
          <div className="space-y-1">
            {recentUpdates.map((update, index) => (
              <div
                key={index}
                className="text-xs flex items-start space-x-2 bg-gray-700/50 rounded px-2 py-1"
              >
                {update.action === 'strengthened' && (
                  <TrendingUp className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                )}
                {update.action === 'added' && (
                  <Plus className="w-3 h-3 text-butterfly-400 mt-0.5 flex-shrink-0" />
                )}
                {update.action === 'weakened' && (
                  <TrendingDown className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-gray-300">
                  {update.action === 'strengthened' && 'Strengthened: '}
                  {update.action === 'added' && 'Added: '}
                  {update.action === 'reinforced_existing' && 'Reinforced: '}
                  {update.constraint.substring(0, 60)}
                  {update.constraint.length > 60 && '...'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Constraints */}
      {topConstraints.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Strongest Guidelines</h4>
          <div className="space-y-2">
            {topConstraints.map((constraint, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-300 flex-1">
                    {constraint.rule}
                  </p>
                  <div className="flex-shrink-0 ml-2">
                    <div className="text-xs text-right">
                      <div className="text-gray-400">Strength</div>
                      <div className={`font-medium ${
                        constraint.strength >= 1.5 ? 'text-green-400' :
                        constraint.strength >= 1.0 ? 'text-butterfly-400' :
                        'text-gray-400'
                      }`}>
                        {constraint.strength.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strength Bar */}
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      constraint.strength >= 1.5 ? 'bg-green-500' :
                      constraint.strength >= 1.0 ? 'bg-butterfly-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${Math.min(100, (constraint.strength / 2.0) * 100)}%` }}
                  />
                </div>

                {/* Success/Failure Stats */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>✓ {constraint.successes} successes</span>
                  <span>✗ {constraint.failures} failures</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No guidelines learned yet</p>
          <p className="text-xs mt-1">Echo will learn from your conversations</p>
        </div>
      )}
    </div>
  );
}
