import React, { useState } from 'react';
import { TaskCard } from './TaskCard';

export const TaskLibrary = ({ 
  commonTasks, 
  tempTasks, 
  onDragStart, 
  onDragEnd, 
  onDeleteCommonTask,
  isReadOnly
}) => {
  const [activeTab, setActiveTab] = useState('common');

  return (
    <div className="glass-panel rounded-2xl shadow-soft overflow-hidden">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('common')}
          className={`
            flex-1 py-3 px-4 text-sm font-medium transition-all
            ${activeTab === 'common' 
              ? 'text-accent border-b-2 border-accent bg-accent-light' 
              : 'text-text-muted hover:bg-surface-hover'
            }
          `}
        >
          常用任务库
          <span className="ml-2 text-xs bg-white px-2 py-0.5 rounded-full">
            {commonTasks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('temp')}
          className={`
            flex-1 py-3 px-4 text-sm font-medium transition-all
            ${activeTab === 'temp' 
              ? 'text-accent border-b-2 border-accent bg-accent-light' 
              : 'text-text-muted hover:bg-surface-hover'
            }
          `}
        >
          今日临时任务
          <span className="ml-2 text-xs bg-white px-2 py-0.5 rounded-full">
            {tempTasks.length}
          </span>
        </button>
      </div>
      
      <div className="p-5">
        {isReadOnly ? (
          <div className="text-center py-6 text-text-muted">
            <p className="text-sm">历史计划不可修改</p>
            <p className="text-xs opacity-70 mt-1">切换到今天的日期来管理任务</p>
          </div>
        ) : activeTab === 'common' ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
            {commonTasks.length === 0 ? (
              <div className="text-center py-6 text-text-muted">
                <p className="text-sm">暂无常用任务</p>
                <p className="text-xs opacity-70 mt-1">添加日常频发任务到任务库</p>
              </div>
            ) : (
              commonTasks.map((task) => (
                <div key={task.id} className="group relative">
                  <TaskCard 
                    task={task} 
                    draggable={true}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                  <button
                    onClick={() => onDeleteCommonTask(task.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 text-white 
                             rounded-full opacity-0 group-hover:opacity-100 
                             transition-opacity flex items-center justify-center 
                             text-xs shadow-sm hover:bg-red-400"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
            {tempTasks.length === 0 ? (
              <div className="text-center py-6 text-text-muted">
                <p className="text-sm">暂无临时任务</p>
                <p className="text-xs opacity-70 mt-1">点击时间轴空白处添加临时任务</p>
              </div>
            ) : (
              tempTasks.map((task) => (
                <div key={task.id}>
                  <TaskCard 
                    task={task} 
                    draggable={true}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
