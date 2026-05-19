const API_BASE_URL = '/api';

// ========== 任务相关 API ==========

// 获取所有任务
export const fetchTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

// 获取常用任务
export const fetchCommonTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks/common`);
  if (!response.ok) throw new Error('Failed to fetch common tasks');
  return response.json();
};

// 获取临时任务
export const fetchTempTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks/temp`);
  if (!response.ok) throw new Error('Failed to fetch temp tasks');
  return response.json();
};

// 创建任务
export const createTask = async (task) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

// 更新任务
export const updateTask = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

// 删除任务
export const deleteTask = async (id) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return response.json();
};

// ========== 日程相关 API ==========

// 获取指定日期的日程
export const fetchSchedule = async (date) => {
  const url = date 
    ? `${API_BASE_URL}/schedule?date=${date}` 
    : `${API_BASE_URL}/schedule`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch schedule');
  return response.json();
};

// 获取有计划的日期列表
export const fetchScheduleDates = async () => {
  const response = await fetch(`${API_BASE_URL}/schedule/dates`);
  if (!response.ok) throw new Error('Failed to fetch schedule dates');
  return response.json();
};

// 添加任务到时间块
export const addToSchedule = async (slotId, taskId, date) => {
  const response = await fetch(`${API_BASE_URL}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slotId, taskId, date }),
  });
  if (!response.ok) throw new Error('Failed to add to schedule');
  return response.json();
};

// 从时间块移除任务
export const removeFromSchedule = async (slotId, date) => {
  const url = date 
    ? `${API_BASE_URL}/schedule/${slotId}?date=${date}` 
    : `${API_BASE_URL}/schedule/${slotId}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove from schedule');
  return response.json();
};

// ========== 每日笔记相关 API ==========

// 获取指定日期的笔记
export const fetchDailyNote = async (date) => {
  const url = date 
    ? `${API_BASE_URL}/daily-note?date=${date}` 
    : `${API_BASE_URL}/daily-note`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch daily note');
  return response.json();
};

// 保存每日描述
export const saveDailyNote = async (date, description) => {
  const response = await fetch(`${API_BASE_URL}/daily-note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, description }),
  });
  if (!response.ok) throw new Error('Failed to save daily note');
  return response.json();
};

// ========== AI 分析相关 API ==========

// 调用 AI 分析
export const analyzeWithAI = async (date, description) => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, description }),
  });
  if (!response.ok) throw new Error('Failed to analyze');
  return response.json();
};

// ========== 设置相关 API ==========

// 获取设置
export const fetchSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/settings`);
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
};

// 更新设置
export const updateSetting = async (key, value) => {
  const response = await fetch(`${API_BASE_URL}/settings/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  if (!response.ok) throw new Error('Failed to update setting');
  return response.json();
};

// ========== 数据汇总 API ==========

// 获取所有数据（兼容旧接口）
export const fetchData = async (date) => {
  const url = date 
    ? `${API_BASE_URL}/data?date=${date}` 
    : `${API_BASE_URL}/data`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

// 导出数据（备份）
export const exportData = async () => {
  const response = await fetch(`${API_BASE_URL}/export`);
  if (!response.ok) throw new Error('Failed to export data');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedule-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// 导入数据（恢复）
export const importData = async (file) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const response = await fetch(`${API_BASE_URL}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to import data');
  return response.json();
};
