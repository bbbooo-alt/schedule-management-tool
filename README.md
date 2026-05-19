# 日程管理工具 | Schedule Management Tool

一个支持文件持久化的个人日程管理应用，采用前后端分离架构。

## 项目结构

```
schedule-management/
├── server/                 # 后端服务
│   ├── package.json
│   ├── server.js          # Express 服务器
│   └── data/              # 数据存储目录
│       └── schedule-data.json
├── client/                # 前端 React 应用
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/    # 组件目录
│       │   ├── Header.jsx
│       │   ├── Timeline.jsx
│       │   ├── TimeSlot.jsx
│       │   ├── TaskCard.jsx
│       │   ├── TaskLibrary.jsx
│       │   ├── AddCommonTaskForm.jsx
│       │   ├── QuickInput.jsx
│       │   └── Stats.jsx
│       ├── hooks/         # 自定义 Hooks
│       │   └── useSchedule.js
│       ├── services/      # API 服务
│       │   └── api.js
│       └── utils/         # 工具函数
│           └── timeUtils.js
└── index.html             # 旧版本（已废弃）
```

## 功能特性

- **时间块管理**：支持 15/30/60 分钟三种时间粒度
- **常用任务库**：保存日常频发任务（健身、吃饭、学习等），可重复使用
- **临时任务**：点击时间轴直接添加当天特殊任务
- **拖拽安排**：从任务库拖拽任务到时间轴
- **文件持久化**：数据保存在服务器 JSON 文件中，服务重启不丢失
- **数据备份/恢复**：支持导出和导入数据

## 技术栈

### 后端
- Node.js
- Express
- 文件系统存储 (JSON)

### 前端
- React 18
- Vite
- Tailwind CSS
- 自定义拖拽实现

## 安装和运行

### 1. 安装后端依赖

```bash
cd server
npm install
```

### 2. 安装前端依赖

```bash
cd client
npm install
```

### 3. 启动后端服务

```bash
cd server
npm start
# 或开发模式
npm run dev
```

后端服务将在 http://localhost:3001 运行

### 4. 启动前端开发服务器

```bash
cd client
npm run dev
```

前端将在 http://localhost:3000 运行

## API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/data | 获取所有数据 |
| POST | /api/data | 保存所有数据 |
| GET | /api/export | 导出数据（备份） |
| POST | /api/import | 导入数据（恢复） |

## 数据存储

数据存储在 `server/data/schedule-data.json` 文件中，格式如下：

```json
{
  "commonTasks": [],
  "tempTasks": [],
  "schedule": {},
  "granularity": 60,
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

## 开发计划

- [x] 基础功能实现
- [x] 文件持久化
- [x] 前后端分离
- [ ] 数据备份/恢复 UI
- [ ] 多用户支持
- [ ] 数据同步
