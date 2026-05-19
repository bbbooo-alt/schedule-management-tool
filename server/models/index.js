const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// 创建 Sequelize 实例，使用 SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// 定义 Task 模型（常用任务和临时任务）
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  priority: {
    type: DataTypes.ENUM('high', 'medium', 'low'),
    defaultValue: 'medium'
  },
  isCommon: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_common'
  },
  createdAt: {
    type: DataTypes.BIGINT,
    field: 'created_at'
  }
}, {
  tableName: 'tasks',
  timestamps: false
});

// 定义 Schedule 模型（日程安排）
const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  slotId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'slot_id'
  },
  taskId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'task_id'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'schedules',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['slot_id', 'date']
    }
  ]
});

// 定义 Setting 模型（设置）
const Setting = sequelize.define('Setting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'settings',
  timestamps: false
});

// 定义 DailyNote 模型（每日描述和AI分析）
const DailyNote = sequelize.define('DailyNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  aiResponse: {
    type: DataTypes.TEXT,
    field: 'ai_response'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'daily_notes',
  timestamps: false
});

// 定义 AIHistory 模型（AI分析历史记录）
const AIHistory = sequelize.define('AIHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'ai_history',
  timestamps: false
});

// 初始化数据库
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // 同步模型到数据库
    await sequelize.sync();
    console.log('Database synchronized.');
    
    // 初始化默认设置
    const granularitySetting = await Setting.findOne({ where: { key: 'granularity' } });
    if (!granularitySetting) {
      await Setting.create({ key: 'granularity', value: '60' });
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  Task,
  Schedule,
  Setting,
  DailyNote,
  AIHistory,
  initDatabase
};
