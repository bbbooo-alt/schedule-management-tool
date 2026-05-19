import React from 'react';
import { getTodayString } from '../utils/timeUtils';

export const Header = ({ granularity, setGranularity }) => {
  return (
    <header className="glass-panel sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl font-bold text-text">
              日程管理
            </h1>
            <span className="text-text-muted text-sm">
              {getTodayString()}
            </span>
          </div>
          
          {/* 时间粒度选择器 */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-border">
            <span className="text-xs text-text-muted px-2">时间粒度:</span>
            {[15, 30, 60].map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${granularity === g 
                    ? 'bg-accent text-white shadow-sm' 
                    : 'text-text-muted hover:bg-surface-hover'
                  }
                `}
              >
                {g}分钟
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
