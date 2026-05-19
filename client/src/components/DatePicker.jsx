import React, { useState, useRef, useEffect } from 'react';

export const DatePicker = ({ currentDate, scheduledDates, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const containerRef = useRef(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 同步当前日期
  useEffect(() => {
    setViewDate(new Date(currentDate));
  }, [currentDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // 获取月份第一天是星期几
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // 获取月份天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // 获取上一个月天数
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // 格式化日期为 YYYY-MM-DD
  const formatDate = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  // 判断日期是否有计划
  const hasSchedule = (dateStr) => {
    return scheduledDates.includes(dateStr);
  };

  // 判断是否是今天
  const isToday = (dateStr) => {
    return dateStr === new Date().toISOString().split('T')[0];
  };

  // 判断是否是选中的日期
  const isSelected = (dateStr) => {
    return dateStr === currentDate;
  };

  // 生成日历格子
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date().toISOString().split('T')[0];

    // 上个月的日期
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dateStr = formatDate(year, month - 1, day);
      days.push({
        day,
        dateStr,
        isCurrentMonth: false,
        hasSchedule: hasSchedule(dateStr),
        isToday: isToday(dateStr),
        isSelected: isSelected(dateStr),
        isPast: dateStr < today
      });
    }

    // 当前月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      days.push({
        day,
        dateStr,
        isCurrentMonth: true,
        hasSchedule: hasSchedule(dateStr),
        isToday: isToday(dateStr),
        isSelected: isSelected(dateStr),
        isPast: dateStr < today
      });
    }

    // 下个月的日期（补齐一行）
    const remainingDays = 42 - days.length; // 6行 x 7列 = 42
    for (let day = 1; day <= remainingDays; day++) {
      const dateStr = formatDate(year, month + 1, day);
      days.push({
        day,
        dateStr,
        isCurrentMonth: false,
        hasSchedule: hasSchedule(dateStr),
        isToday: isToday(dateStr),
        isSelected: isSelected(dateStr),
        isPast: dateStr < today
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (dateStr) => {
    onDateChange(dateStr);
    setIsOpen(false);
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  // 格式化显示日期
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    
    if (dateStr === today) return '今天';
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split('T')[0]) return '明天';
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().split('T')[0]) return '昨天';
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg hover:bg-bg transition-colors"
      >
        <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-medium text-text">{formatDisplayDate(currentDate)}</span>
        <svg className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-lg border border-border z-50 min-w-[320px]">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-bg rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-semibold text-text">
              {year}年 {monthNames[month]}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-bg rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-text-muted py-1">
                {day}
              </div>
            ))}
          </div>

          {/* 日期格子 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayInfo, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(dayInfo.dateStr)}
                className={`
                  relative h-9 w-9 rounded-lg text-sm font-medium transition-all
                  ${dayInfo.isCurrentMonth ? 'text-text' : 'text-text-muted'}
                  ${dayInfo.isSelected ? 'bg-coral text-white' : 'hover:bg-bg'}
                  ${dayInfo.isToday && !dayInfo.isSelected ? 'ring-2 ring-coral ring-offset-1' : ''}
                `}
              >
                {dayInfo.day}
                {/* 有计划指示点 */}
                {dayInfo.hasSchedule && (
                  <span className={`
                    absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full
                    ${dayInfo.isSelected ? 'bg-white' : 'bg-text'}
                  `} />
                )}
              </button>
            ))}
          </div>

          {/* 图例 */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-text" />
              <span>有计划</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-coral" />
              <span>今天</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
