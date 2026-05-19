import React, { useState } from 'react';

export const AddCommonTaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({
      id: `common-task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      isCommon: true,
      createdAt: Date.now()
    });
    
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入常用任务名称（如：健身、吃饭、学习）..."
          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white 
                   focus:border-accent focus:outline-none transition-colors text-sm"
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="任务描述（可选）..."
          rows="2"
          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white 
                   focus:border-accent focus:outline-none transition-colors text-sm resize-none"
        />
      </div>
      <div className="flex gap-2">
        {['high', 'medium', 'low'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`
              flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all
              ${priority === p 
                ? p === 'high' ? 'bg-red-100 text-red-700 border-2 border-red-300'
                : p === 'medium' ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
              }
            `}
          >
            {p === 'high' ? '高优先级' : p === 'medium' ? '中优先级' : '低优先级'}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="btn-primary w-full py-3 rounded-xl font-medium text-sm"
      >
        添加到常用任务库
      </button>
    </form>
  );
};
