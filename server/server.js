const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Task, Schedule, Setting, DailyNote, AIHistory, initDatabase } = require('./models');

const app = express();
const PORT = process.env.PORT || 3002;

// LLM API 配置
const LLM_API_KEY = process.env.LLM_API_KEY || '';
const LLM_API_URL = 'https://api.longcat.chat/openai/v1/chat/completions';
const LLM_MODEL = 'LongCat-Flash-Chat';

// 中间件
app.use(cors());
app.use(express.json());

// 初始化数据库
initDatabase();

// ========== 任务相关 API ==========

// 获取所有任务
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks', message: error.message });
  }
});

// 获取常用任务
app.get('/api/tasks/common', async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { isCommon: true } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch common tasks', message: error.message });
  }
});

// 获取临时任务
app.get('/api/tasks/temp', async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { isCommon: false } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch temp tasks', message: error.message });
  }
});

// 创建任务
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task', message: error.message });
  }
});

// 更新任务
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task', message: error.message });
  }
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // 删除相关的日程安排
    await Schedule.destroy({ where: { taskId: req.params.id } });
    
    await task.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task', message: error.message });
  }
});

// ========== 日程相关 API ==========

// 获取指定日期的日程
app.get('/api/schedule', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const schedules = await Schedule.findAll({
      where: { date },
      include: [{ model: Task, as: 'task' }]
    });
    
    // 转换为前端需要的格式
    const scheduleMap = {};
    schedules.forEach(s => {
      scheduleMap[s.slotId] = s.taskId;
    });
    
    res.json({ date, schedule: scheduleMap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule', message: error.message });
  }
});

// 获取有计划的日期列表
app.get('/api/schedule/dates', async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      attributes: ['date'],
      group: ['date'],
      raw: true
    });
    
    const dates = schedules.map(s => s.date);
    res.json(dates);
  } catch (error) {
    console.error('Error fetching schedule dates:', error);
    res.status(500).json({ error: 'Failed to fetch schedule dates', message: error.message });
  }
});

// 添加任务到时间块
app.post('/api/schedule', async (req, res) => {
  try {
    const { slotId, taskId, date } = req.body;
    const scheduleDate = date || new Date().toISOString().split('T')[0];
    
    // 删除该日期时间块已有的安排
    await Schedule.destroy({ where: { slotId, date: scheduleDate } });
    
    // 创建新的安排
    const schedule = await Schedule.create({
      slotId,
      taskId,
      date: scheduleDate
    });
    
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to schedule', message: error.message });
  }
});

// 从时间块移除任务
app.delete('/api/schedule/:slotId', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    await Schedule.destroy({
      where: { slotId: req.params.slotId, date }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from schedule', message: error.message });
  }
});

// ========== 每日笔记相关 API ==========

// 获取指定日期的笔记
app.get('/api/daily-note', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    const [dailyNote, aiHistory] = await Promise.all([
      DailyNote.findOne({ where: { date } }),
      AIHistory.findAll({
        where: { date },
        order: [['createdAt', 'DESC']]
      })
    ]);
    
    res.json({
      date,
      description: dailyNote?.description || '',
      aiResponse: dailyNote?.aiResponse || null,
      aiHistory: aiHistory || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily note', message: error.message });
  }
});

// 保存每日描述
app.post('/api/daily-note', async (req, res) => {
  try {
    const { date, description } = req.body;
    
    const [dailyNote, created] = await DailyNote.findOrCreate({
      where: { date },
      defaults: { description, updatedAt: new Date() }
    });
    
    if (!created) {
      await dailyNote.update({ description, updatedAt: new Date() });
    }
    
    res.json(dailyNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save daily note', message: error.message });
  }
});

// ========== AI 分析相关 API ==========

// 调用 LLM 进行分析
app.post('/api/analyze', async (req, res) => {
  try {
    const { date, description } = req.body;
    
    if (!LLM_API_KEY) {
      return res.status(500).json({ error: 'LLM API key not configured' });
    }
    
    // 获取当天的日程
    const schedules = await Schedule.findAll({
      where: { date },
      include: [{ model: Task, as: 'task' }]
    });
    
    // 构建日程文本
    const scheduleText = schedules.map(s => {
      const time = s.slotId.replace('slot-', '').replace('-', ':');
      return `- ${time} ${s.task?.title || '未知任务'}`;
    }).join('\n');
    
    // 构建提示词
    const prompt = `请分析以下日程安排和执行情况，给出总结、优化建议和明日推荐计划。

## 今日日程
${scheduleText || '（今日无安排）'}

## 用户执行描述
${description || '（用户未提供描述）'}

请从以下几个方面分析：
1. 今日计划总结：简要总结今日计划的完成情况
2. 可优化方向：指出时间管理和任务安排中可以改进的地方
3. 明日推荐计划：根据今日情况，推荐明天的任务安排建议

请用中文回答，格式清晰。`;

    // 调用 LLM API
    const response = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }
    
    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content || '分析失败，请重试';
    
    // 保存到历史记录
    await AIHistory.create({
      date,
      content: aiContent
    });
    
    // 更新或创建 DailyNote
    const [dailyNote] = await DailyNote.findOrCreate({
      where: { date },
      defaults: { description: description || '', aiResponse: aiContent }
    });
    
    if (dailyNote) {
      await dailyNote.update({
        description: description || dailyNote.description,
        aiResponse: aiContent,
        updatedAt: new Date()
      });
    }
    
    res.json({
      content: aiContent,
      createdAt: new Date()
    });
    
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze', message: error.message });
  }
});

// ========== 设置相关 API ==========

// 获取设置
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings', message: error.message });
  }
});

// 更新设置
app.put('/api/settings/:key', async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Setting.findOne({ where: { key: req.params.key } });
    
    if (setting) {
      await setting.update({ value });
    } else {
      await Setting.create({ key: req.params.key, value });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting', message: error.message });
  }
});

// ========== 数据汇总 API ==========

// 获取所有数据（兼容旧接口）
app.get('/api/data', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const [commonTasks, tempTasks, schedule, settings, dailyNote] = await Promise.all([
      Task.findAll({ where: { isCommon: true } }),
      Task.findAll({ where: { isCommon: false } }),
      Schedule.findAll({ where: { date } }),
      Setting.findAll(),
      DailyNote.findOne({ where: { date } })
    ]);
    
    // 转换日程为 map 格式
    const scheduleMap = {};
    schedule.forEach(s => {
      scheduleMap[s.slotId] = s.taskId;
    });
    
    // 获取粒度设置
    const granularitySetting = settings.find(s => s.key === 'granularity');
    
    res.json({
      commonTasks,
      tempTasks,
      schedule: scheduleMap,
      granularity: parseInt(granularitySetting?.value || '60'),
      date,
      dailyNote: dailyNote || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data', message: error.message });
  }
});

// 导出数据（备份）
app.get('/api/export', async (req, res) => {
  try {
    const [tasks, schedules, settings, dailyNotes, aiHistory] = await Promise.all([
      Task.findAll(),
      Schedule.findAll(),
      Setting.findAll(),
      DailyNote.findAll(),
      AIHistory.findAll()
    ]);
    
    const data = {
      tasks,
      schedules,
      settings,
      dailyNotes,
      aiHistory,
      exportDate: new Date().toISOString()
    };
    
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
    const { tasks, schedules, settings, dailyNotes, aiHistory } = req.body;
    
    // 清空现有数据
    await Schedule.destroy({ where: {} });
    await Task.destroy({ where: {} });
    await Setting.destroy({ where: {} });
    await DailyNote.destroy({ where: {} });
    await AIHistory.destroy({ where: {} });
    
    // 导入数据
    if (tasks && tasks.length > 0) {
      await Task.bulkCreate(tasks);
    }
    if (schedules && schedules.length > 0) {
      await Schedule.bulkCreate(schedules);
    }
    if (settings && settings.length > 0) {
      await Setting.bulkCreate(settings);
    }
    if (dailyNotes && dailyNotes.length > 0) {
      await DailyNote.bulkCreate(dailyNotes);
    }
    if (aiHistory && aiHistory.length > 0) {
      await AIHistory.bulkCreate(aiHistory);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import data', message: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database: SQLite (database.sqlite)`);
  console.log(`LLM API: ${LLM_API_KEY ? 'Configured' : 'Not configured'}`);
});
