// 生成时间块
export const generateTimeSlots = (granularity) => {
  const slots = [];
  const totalMinutes = 24 * 60;
  const slotMinutes = granularity;
  
  for (let i = 0; i < totalMinutes; i += slotMinutes) {
    const hour = Math.floor(i / 60);
    const minute = i % 60;
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push({
      id: `slot-${i}`,
      time: timeStr,
      hour,
      minute,
      index: i / slotMinutes
    });
  }
  return slots;
};

// 格式化时间显示
export const formatTimeRange = (slot, granularity) => {
  const startHour = slot.hour;
  const startMinute = slot.minute;
  const endTotalMinutes = startHour * 60 + startMinute + granularity;
  const endHour = Math.floor(endTotalMinutes / 60) % 24;
  const endMinute = endTotalMinutes % 60;
  
  const start = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
  const end = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  return { start, end };
};

// 获取今日日期
export const getTodayString = () => {
  return new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });
};
