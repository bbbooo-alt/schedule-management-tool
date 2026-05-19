import React, { useCallback, useRef } from 'react';
import { useSchedule } from './hooks/useSchedule';
import { Header } from './components/Header';
import { Timeline } from './components/Timeline';
import { AddCommonTaskForm } from './components/AddCommonTaskForm';
import { TaskLibrary } from './components/TaskLibrary';
import { Stats } from './components/Stats';

function App() {
  const {
    granularity,
    setGranularity,
    commonTasks,
    tempTasks,
    schedule,
    unscheduledTempTasks,
    loading,
    error,
    addCommonTask,
    deleteCommonTask,
    addTempTask,
    removeTaskFromSlot,
    getTaskById,
  } = useSchedule();

  // 处理任务拖拽到时间轴
  const handleTaskDrop = useCallback((slotId, task) => {
    // 检查该时间块是否已有任务
    const existingTaskId = schedule[slotId];
    if (existingTaskId) {
      const existingTask = getTaskById(existingTaskId);
      // 如果已有临时任务，删除它
      if (existingTask && !existingTask.isCommon) {
        // 这里需要通过 hook 删除临时任务
      }
    }
    
    // 如果是临时任务，先添加到临时任务列表
    if (!task.isCommon) {
      // 临时任务已经在时间轴上创建了
    }
  }, [schedule, getTaskById]);

  // 快速添加临时任务
  const handleQuickAdd = useCallback((slotId, title) => {
    const newTask = {
      id: `temp-task-${Date.now()}`,
      title,
      description: '',
      priority: 'medium',
      isCommon: false,
      createdAt: Date.now()
    };
    addTempTask(newTask);
    // 需要更新 schedule，但 addTempTask 不直接操作 schedule
    // 这里需要额外的逻辑
  }, [addTempTask]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-muted">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-red-500">错误: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header granularity={granularity} setGranularity={setGranularity} />
      
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧：时间轴 */}
          <div className="col-span-8">
            <Timeline
              granularity={granularity}
              schedule={schedule}
              getTaskById={getTaskById}
              onRemoveTask={removeTaskFromSlot}
              onQuickAdd={handleQuickAdd}
              onTaskDrop={handleTaskDrop}
            />
          </div>

          {/* 右侧：任务管理 */}
          <div className="col-span-4 space-y-4">
            {/* 添加常用任务 */}
            <div className="glass-panel rounded-2xl shadow-soft p-5">
              <h3 className="font-display text-base font-semibold mb-4 text-text">
                添加常用任务
              </h3>
              <p className="text-xs text-text-muted mb-3">
                日常频发任务（如健身、吃饭、学习）会保存在任务库中，可反复使用
              </p>
              <AddCommonTaskForm onAdd={addCommonTask} />
            </div>

            {/* 任务库 */}
            <TaskLibrary
              commonTasks={commonTasks}
              tempTasks={unscheduledTempTasks}
              onDeleteCommonTask={deleteCommonTask}
            />

            {/* 统计信息 */}
            <Stats schedule={schedule} commonTasks={commonTasks} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
