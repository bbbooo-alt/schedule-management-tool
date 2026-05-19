import React, { useState, useEffect, useRef } from 'react';

export const QuickInput = ({ onSubmit, onCancel, placeholder = "输入任务..." }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="quick-input">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border-2 border-accent bg-white focus:outline-none text-sm"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="flex-1 py-1.5 px-3 rounded-lg bg-accent text-white text-xs font-medium"
        >
          确认
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-1.5 px-3 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium"
        >
          取消
        </button>
      </div>
    </form>
  );
};
