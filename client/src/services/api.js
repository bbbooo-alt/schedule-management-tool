const API_BASE_URL = '/api';

// 获取所有数据
export const fetchData = async () => {
  const response = await fetch(`${API_BASE_URL}/data`);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

// 保存所有数据
export const saveData = async (data) => {
  const response = await fetch(`${API_BASE_URL}/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to save data');
  }
  return response.json();
};

// 导出数据（备份）
export const exportData = async () => {
  const response = await fetch(`${API_BASE_URL}/export`);
  if (!response.ok) {
    throw new Error('Failed to export data');
  }
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to import data');
  }
  return response.json();
};
