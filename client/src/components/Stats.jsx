import React from 'react';

export const Stats = ({ schedule, commonTasks }) => {
  return (
    <div className="glass-panel rounded-2xl shadow-soft p-5">
      <h3 className="font-display text-base font-semibold mb-4 text-text">
        今日概览
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 rounded-xl bg-bg">
          <div className="text-2xl font-bold text-accent">
            {Object.keys(schedule).length}
          </div>
          <div className="text-xs text-text-muted mt-1">已安排时间段</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-bg">
          <div className="text-2xl font-bold text-success">
            {commonTasks.length}
          </div>
          <div className="text-xs text-text-muted mt-1">常用任务数</div>
        </div>
      </div>
    </div>
  );
};
