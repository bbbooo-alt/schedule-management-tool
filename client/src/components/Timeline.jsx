import React, { useRef, useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { generateTimeSlots } from '../utils/timeUtils';
import { TimeSlot } from './TimeSlot';

export const Timeline = forwardRef(({
  granularity,
  schedule,
  getTaskById,
  onRemoveTask,
  onQuickAdd,
  onTaskDrop,
  isReadOnly
}, ref) => {
  const timeSlots = generateTimeSlots(granularity);
  const containerRef = useRef(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    setDraggedTask,
    handleDragEnd
  }));

  const handleDragEnd = useCallback((task, event) => {
    // 只读模式下不允许拖拽
    if (isReadOnly) {
      setDraggedTask(null);
      setDragOverSlot(null);
      return;
    }

    setDraggedTask(null);
    setDragOverSlot(null);

    const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
    if (!elementBelow) return;

    const slotElement = elementBelow.closest('[data-slot-id]');
    if (!slotElement) return;

    const slotId = slotElement.getAttribute('data-slot-id');
    if (!slotId) return;

    onTaskDrop(slotId, task);
  }, [onTaskDrop, isReadOnly]);

  const handleMouseMove = useCallback((e) => {
    if (!draggedTask) {
      setDragOverSlot(null);
      return;
    }

    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementBelow) {
      setDragOverSlot(null);
      return;
    }

    const slotElement = elementBelow.closest('[data-slot-id]');
    if (slotElement) {
      setDragOverSlot(slotElement.getAttribute('data-slot-id'));
    } else {
      setDragOverSlot(null);
    }
  }, [draggedTask]);

  useEffect(() => {
    if (draggedTask) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [draggedTask, handleMouseMove]);

  return (
    <div className="glass-panel rounded-2xl shadow-soft overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-white to-bg">
        <h2 className="font-display text-lg font-semibold text-text">
          {isReadOnly ? '历史计划' : '今日时间轴'}
        </h2>
        <p className="text-xs text-text-muted mt-1">
          {isReadOnly 
            ? '过去的计划不可修改，仅供查看' 
            : '点击空白时间块添加临时任务，或从右侧拖拽常用任务'}
        </p>
      </div>
      <div
        ref={containerRef}
        className="max-h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide"
      >
        {timeSlots.map((slot) => (
          <TimeSlot
            key={slot.id}
            slot={slot}
            granularity={granularity}
            assignedTask={schedule[slot.id] ? getTaskById(schedule[slot.id]) : null}
            onRemoveTask={onRemoveTask}
            isDragOver={dragOverSlot === slot.id}
            onQuickAdd={onQuickAdd}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';
