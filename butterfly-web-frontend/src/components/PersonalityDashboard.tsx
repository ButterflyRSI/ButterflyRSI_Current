import React from 'react';
import { Brain, Sparkles, Heart, Search, Minimize2, Maximize2 } from 'lucide-react';
import type { PersonalityTraits } from '../types';

interface PersonalityDashboardProps {
  traits: PersonalityTraits;
  dominantTrait: string;
}

const traitIcons: Record<string, React.ReactNode> = {
  analytical: <Brain className="w-4 h-4" />,
  creative: <Sparkles className="w-4 h-4" />,
  empathic: <Heart className="w-4 h-4" />,
  curious: <Search className="w-4 h-4" />,
  concise: <Minimize2 className="w-4 h-4" />,
  detailed: <Maximize2 className="w-4 h-4" />,
};

const traitColors: Record<string, string> = {
  analytical: 'from-blue-500 to-blue-600',
  creative: 'from-purple-500 to-purple-600',
  empathic: 'from-pink-500 to-pink-600',
  curious: 'from-yellow-500 to-yellow-600',
  concise: 'from-green-500 to-green-600',
  detailed: 'from-orange-500 to-orange-600',
};

export function PersonalityDashboard({ traits, dominantTrait }: PersonalityDashboardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200">Personality Profile</h3>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Dominant:</span>
          <span className="text-butterfly-400 font-medium capitalize">
            {dominantTrait}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(traits).map(([trait, value]) => {
          const isDominant = trait === dominantTrait;
          const percentage = Math.round(value * 100);
          
          return (
            <div key={trait} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className={`${isDominant ? 'text-butterfly-400' : 'text-gray-400'}`}>
                    {traitIcons[trait]}
                  </span>
                  <span className={`capitalize ${isDominant ? 'text-butterfly-400 font-medium' : 'text-gray-400'}`}>
                    {trait}
                  </span>
                </div>
                <span className={`${isDominant ? 'text-butterfly-400 font-medium' : 'text-gray-500'}`}>
                  {percentage}%
                </span>
              </div>
              
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${traitColors[trait]} transition-all duration-500 ease-out ${
                    isDominant ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 italic">
          Traits evolve based on conversation patterns and response quality
        </p>
      </div>
    </div>
  );
}
