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
    schedule,
    unscheduledTempTasks,
    loading,
    error,
    currentDate,
    scheduledDates,
    isReadOnly,
    addCommonTask,
    deleteCommonTask,
    addTempTask,
    addTaskToSlot,
    removeTaskFromSlot,
    getTaskById,
    changeDate,
  } = useSchedule();

  const timelineRef = useRef(null);

  // 处理拖拽开始
  const handleDragStart = useCallback((task) => {
    if (timelineRef.current) {
      timelineRef.current.setDraggedTask(task);
    }
  }, []);

  // 处理拖拽结束
  const handleDragEnd = useCallback((task, event) => {
    if (timelineRef.current) {
      timelineRef.current.handleDragEnd(task, event);
    }
  }, []);

  // 处理任务拖拽到时间轴
  const handleTaskDrop = useCallback(async (slotId, task) => {
    await addTaskToSlot(slotId, task.id);
  }, [addTaskToSlot]);

  // 快速添加临时任务
  const handleQuickAdd = useCallback(async (slotId, title) => {
    const newTask = {
      id: `temp-task-${Date.now()}`,
      title,
      description: '',
      priority: 'medium',
      isCommon: false,
      createdAt: Date.now()
    };
    const createdTask = await addTempTask(newTask);
    if (createdTask) {
      await addTaskToSlot(slotId, createdTask.id);
    }
  }, [addTempTask, addTaskToSlot]);

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
      <Header 
        granularity={granularity} 
        setGranularity={setGranularity}
        currentDate={currentDate}
        scheduledDates={scheduledDates}
        onDateChange={changeDate}
        isReadOnly={isReadOnly}
      />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧：时间轴 */}
          <div className="col-span-8">
            <Timeline
              ref={timelineRef}
              granularity={granularity}
              schedule={schedule}
              getTaskById={getTaskById}
              onRemoveTask={removeTaskFromSlot}
              onQuickAdd={handleQuickAdd}
              onTaskDrop={handleTaskDrop}
              isReadOnly={isReadOnly}
            />
          </div>

          {/* 右侧：任务管理 */}
          <div className="col-span-4 space-y-4">
            {/* 添加常用任务 */}
            {!isReadOnly && (
              <div className="glass-panel rounded-2xl shadow-soft p-5">
                <h3 className="font-display text-base font-semibold mb-4 text-text">
                  添加常用任务
                </h3>
                <p className="text-xs text-text-muted mb-3">
                  日常频发任务（如健身、吃饭、学习）会保存在任务库中，可反复使用
                </p>
                <AddCommonTaskForm onAdd={addCommonTask} />
              </div>
            )}

            {/* 任务库 */}
            <TaskLibrary
              commonTasks={commonTasks}
              tempTasks={unscheduledTempTasks}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDeleteCommonTask={deleteCommonTask}
              isReadOnly={isReadOnly}
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
