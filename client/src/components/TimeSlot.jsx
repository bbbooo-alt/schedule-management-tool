import React, { useState } from 'react';
import { formatTimeRange } from '../utils/timeUtils';
import { TaskCard } from './TaskCard';
import { QuickInput } from './QuickInput';

export const TimeSlot = ({ 
  slot, 
  granularity, 
  assignedTask, 
  onRemoveTask, 
  isDragOver, 
  onQuickAdd 
}) => {
  const { start, end } = formatTimeRange(slot, granularity);
  const isHourStart = slot.minute === 0;
  const [showQuickInput, setShowQuickInput] = useState(false);

  const handleClick = () => {
    if (!assignedTask && !showQuickInput) {
      setShowQuickInput(true);
    }
  };

  const handleQuickSubmit = (title) => {
    onQuickAdd(slot.id, title);
    setShowQuickInput(false);
  };

  return (
    <div
      data-slot-id={slot.id}
      className={`
        time-slot relative border-b border-border
        ${isDragOver ? 'drag-over' : ''}
        ${isHourStart ? 'bg-gradient-to-r from-white to-bg' : ''}
      `}
      style={{ minHeight: granularity <= 30 ? '60px' : '80px' }}
    >
      <div className="flex">
        {/* 时间标签 */}
        <div className={`
          w-20 flex-shrink-0 py-2 px-3 text-right
          ${isHourStart ? 'font-semibold text-text' : 'text-text-muted text-sm'}
        `}>
          <span>{start}</span>
        </div>
        
        {/* 任务放置区域 */}
        <div 
          className="flex-1 p-2 relative cursor-pointer"
          onClick={handleClick}
        >
          {assignedTask ? (
            <div className="relative group">
              <TaskCard task={assignedTask} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTask(slot.id);
                }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 text-white rounded-full 
                         opacity-0 group-hover:opacity-100 transition-opacity
                         flex items-center justify-center text-xs shadow-sm"
              >
                ×
              </button>
            </div>
          ) : showQuickInput ? (
            <QuickInput
              onSubmit={handleQuickSubmit}
              onCancel={() => setShowQuickInput(false)}
              placeholder={`${start} 添加临时任务...`}
            />
          ) : (
            <div className="h-full min-h-[40px] rounded-lg border-2 border-dashed 
                          border-border opacity-0 hover:opacity-100 
                          transition-opacity flex items-center justify-center">
              <span className="text-xs text-text-muted">点击添加临时任务</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
