# 日程管理工具 | Schedule Master

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
</p>

<p align="center">
  一个优雅的个人日程管理应用，支持时间块规划和文件持久化存储。
</p>

## ✨ 功能特性

### 核心功能
- **⏰ 时间块管理** - 支持 15/30/60 分钟三种时间粒度，自由规划一天的时间
- **📚 常用任务库** - 保存日常频发任务（健身、吃饭、学习等），可无限次重复使用
- **📝 临时任务** - 点击时间轴直接添加当天特殊任务，灵活应对突发安排
- **🎯 拖拽安排** - 直观的拖拽操作，将任务快速分配到任意时间段
- **💾 文件持久化** - 数据保存在本地 JSON 文件，服务重启数据不丢失
- **📤 数据备份** - 支持导出/导入数据，方便迁移和备份

### 设计亮点
- 🎨 温暖的米白色调 + 珊瑚色强调色，营造舒适的使用氛围
- 🔤 Playfair Display 衬线字体标题，搭配 Noto Sans SC 中文字体
- 🪟 毛玻璃效果卡片设计，柔和阴影营造层次感
- ✨ 流畅的拖拽动画和微交互

## 🏗️ 项目结构

```
schedule-management/
├── 📁 server/                 # 后端服务 (Node.js + Express)
│   ├── 📄 package.json
│   ├── 📄 server.js           # Express 服务器入口
│   └── 📁 data/               # 数据存储目录
│       └── 📄 schedule-data.json
│
├── 📁 client/                 # 前端应用 (React + Vite)
│   ├── 📄 package.json
│   ├── 📄 vite.config.js      # Vite 配置
│   ├── 📄 index.html
│   ├── 📄 tailwind.config.js  # Tailwind 配置
│   ├── 📄 postcss.config.js
│   └── 📁 src/
│       ├── 📄 main.jsx        # 应用入口
│       ├── 📄 App.jsx         # 根组件
│       ├── 📄 index.css       # 全局样式
│       ├── 📁 components/     # React 组件
│       │   ├── 📄 Header.jsx           # 顶部导航
│       │   ├── 📄 Timeline.jsx         # 时间轴容器
│       │   ├── 📄 TimeSlot.jsx         # 时间块
│       │   ├── 📄 TaskCard.jsx         # 任务卡片
│       │   ├── 📄 TaskLibrary.jsx      # 任务库
│       │   ├── 📄 AddCommonTaskForm.jsx # 添加常用任务表单
│       │   ├── 📄 QuickInput.jsx       # 快速输入组件
│       │   └── 📄 Stats.jsx            # 统计面板
│       ├── 📁 hooks/          # 自定义 Hooks
│       │   └── 📄 useSchedule.js       # 日程状态管理
│       ├── 📁 services/       # API 服务
│       │   └── 📄 api.js               # 后端接口封装
│       └── 📁 utils/          # 工具函数
│           └── 📄 timeUtils.js         # 时间处理工具
│
├── 📄 README.md               # 项目说明
└── 📄 index.html              # 旧版本（已废弃）
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1️⃣ 克隆项目

```bash
git clone https://github.com/bbbooo-alt/Schedule-management-tool.git
cd Schedule-management-tool
```

### 2️⃣ 安装后端依赖

```bash
cd server
npm install
```

### 3️⃣ 安装前端依赖

```bash
cd ../client
npm install
```

### 4️⃣ 启动服务

**启动后端（端口 3001）：**
```bash
cd server
npm start
# 或使用 nodemon 开发模式
npm run dev
```

**启动前端（端口 3000）：**
```bash
cd client
npm run dev
```

### 5️⃣ 访问应用

打开浏览器访问 http://localhost:3000

## 📖 使用指南

### 添加常用任务
1. 在右侧"添加常用任务"区域输入任务名称
2. 选择优先级（高/中/低）
3. 点击"添加到常用任务库"
4. 常用任务会保存在任务库中，可反复使用

### 安排日程
**方式一：拖拽安排**
1. 从右侧"常用任务库"拖拽任务到左侧时间轴
2. 同一个任务可以拖拽到多个时间段

**方式二：快速添加临时任务**
1. 点击时间轴上的空白时间块
2. 输入任务名称，按回车确认
3. 临时任务会自动添加到当前时间段

### 删除任务
- **常用任务**：hover 任务卡片，点击右上角的 × 删除
- **时间块任务**：hover 时间块中的任务，点击右上角的 × 移除

### 切换时间粒度
点击顶部导航栏的"15分钟/30分钟/60分钟"按钮，调整时间块粒度。

## 🔌 API 接口

| 方法 | 路径 | 描述 | 请求体 |
|------|------|------|--------|
| GET | `/api/data` | 获取所有数据 | - |
| POST | `/api/data` | 保存所有数据 | `{ commonTasks, tempTasks, schedule, granularity }` |
| GET | `/api/export` | 导出数据（下载 JSON 文件） | - |
| POST | `/api/import` | 导入数据 | JSON 文件内容 |

## 💾 数据存储

数据存储在 `server/data/schedule-data.json` 文件中：

```json
{
  "commonTasks": [
    {
      "id": "common-task-xxx",
      "title": "健身",
      "description": "",
      "priority": "high",
      "isCommon": true,
      "createdAt": 1234567890
    }
  ],
  "tempTasks": [
    {
      "id": "temp-task-xxx",
      "title": "临时会议",
      "description": "",
      "priority": "medium",
      "isCommon": false,
      "createdAt": 1234567890
    }
  ],
  "schedule": {
    "slot-480": "common-task-xxx",
    "slot-840": "temp-task-xxx"
  },
  "granularity": 60,
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **CORS** - 跨域处理
- **fs/promises** - 文件系统操作

### 前端
- **React 18** - UI 框架
- **Vite** - 构建工具
- **Tailwind CSS** - 原子化 CSS 框架
- **自定义拖拽** - 原生鼠标事件实现

## 📝 开发计划

- [x] 基础功能实现
- [x] 文件持久化
- [x] 前后端分离架构
- [x] 数据备份/恢复 API
- [ ] 数据备份/恢复 UI
- [ ] 任务完成状态追踪
- [ ] 多用户支持
- [ ] 数据同步

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

<p align="center">
  Made with ❤️ by bbbooo-alt
</p>
