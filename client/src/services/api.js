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

// 获取今日日程
export const fetchSchedule = async () => {
  const response = await fetch(`${API_BASE_URL}/schedule`);
  if (!response.ok) throw new Error('Failed to fetch schedule');
  return response.json();
};

// 添加任务到时间块
export const addToSchedule = async (slotId, taskId) => {
  const response = await fetch(`${API_BASE_URL}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slotId, taskId }),
  });
  if (!response.ok) throw new Error('Failed to add to schedule');
  return response.json();
};

// 从时间块移除任务
export const removeFromSchedule = async (slotId) => {
  const response = await fetch(`${API_BASE_URL}/schedule/${slotId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to remove from schedule');
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
export const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/data`);
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
