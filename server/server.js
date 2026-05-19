const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'schedule-data.json');

// 中间件
app.use(cors());
app.use(express.json());

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// 读取数据
async function readData() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    // 返回默认数据结构
    return {
      commonTasks: [],
      tempTasks: [],
      schedule: {},
      granularity: 60,
      lastUpdated: new Date().toISOString()
    };
  }
}

// 写入数据
async function writeData(data) {
  await ensureDataDir();
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 获取所有数据
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data', message: error.message });
  }
});

// 保存所有数据
app.post('/api/data', async (req, res) => {
  try {
    const { commonTasks, tempTasks, schedule, granularity } = req.body;
    const data = {
      commonTasks: commonTasks || [],
      tempTasks: tempTasks || [],
      schedule: schedule || {},
      granularity: granularity || 60
    };
    await writeData(data);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data', message: error.message });
  }
});

// 导出数据（备份）
app.get('/api/export', async (req, res) => {
  try {
    const data = await readData();
    const backupName = `schedule-backup-${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Disposition', `attachment; filename="${backupName}"`);
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data', message: error.message });
  }
});

// 导入数据（恢复）
app.post('/api/import', async (req, res) => {
  try {
    const data = req.body;
    await writeData(data);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import data', message: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data file location: ${DATA_FILE}`);
});
