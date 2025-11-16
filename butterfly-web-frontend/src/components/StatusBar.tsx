import React from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';

interface StatusBarProps {
  connected: boolean;
  messageCount: number;
  constraintCount: number;
  model: string;
}

export function StatusBar({ connected, messageCount, constraintCount, model }: StatusBarProps) {
  return (
    <div className="bg-gray-900 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Side - Title */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🦋</span>
          <div>
            <h1 className="text-lg font-bold text-gray-200">Butterfly RSI v2.0</h1>
            <p className="text-xs text-gray-500">Echo Interface with Positive Reinforcement</p>
          </div>
        </div>

        {/* Right Side - Status */}
        <div className="flex items-center space-x-6 text-sm">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {connected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Disconnected</span>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>{messageCount} messages</span>
            </div>
            <span>|</span>
            <span>{constraintCount} guidelines</span>
            <span>|</span>
            <span className="text-butterfly-400">{model}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
