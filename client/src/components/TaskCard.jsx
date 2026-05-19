import React, { useRef, useState } from 'react';

const priorityColors = {
  high: 'bg-red-50 border-red-200 text-red-800',
  medium: 'bg-amber-50 border-amber-200 text-amber-800',
  low: 'bg-emerald-50 border-emerald-200 text-emerald-800'
};

export const TaskCard = ({ 
  task, 
  draggable = false, 
  onDragStart, 
  onDragEnd, 
  onClick,
  className = '' 
}) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    if (!draggable) return;
    if (onClick) return;
    
    setIsDragging(true);
    
    // 创建拖拽预览元素
    const preview = cardRef.current.cloneNode(true);
    preview.classList.add('task-card', 'drag-preview');
    preview.style.width = `${cardRef.current.offsetWidth}px`;
    document.body.appendChild(preview);
    
    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    preview.style.left = `${e.clientX - offsetX}px`;
    preview.style.top = `${e.clientY - offsetY}px`;
    
    onDragStart?.(task, { x: offsetX, y: offsetY });

    const handleMouseMove = (moveEvent) => {
      preview.style.left = `${moveEvent.clientX - offsetX}px`;
      preview.style.top = `${moveEvent.clientY - offsetY}px`;
    };

    const handleMouseUp = (upEvent) => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      preview.remove();
      onDragEnd?.(task, upEvent);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      className={`
        task-card
        p-3 rounded-xl border-2 
        ${priorityColors[task.priority] || priorityColors.medium}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${isDragging ? 'dragging' : ''}
        ${className}
        select-none
      `}
    >
      <div className="flex items-start gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0 opacity-60"></div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-relaxed truncate">{task.title}</p>
          {task.description && (
            <p className="text-xs opacity-70 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
