# 日程管理工具 | Schedule Master

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
</p>

<p align="center">
  一个优雅的个人日程管理应用，支持时间块规划、AI 智能分析和数据持久化存储。
</p>

## ✨ 功能特性

### 核心功能
- **⏰ 时间块管理** - 支持 15/30/60 分钟三种时间粒度，自由规划一天的时间
- **📚 常用任务库** - 保存日常频发任务（健身、吃饭、学习等），可无限次重复使用
- **📝 临时任务** - 点击时间轴直接添加当天特殊任务，灵活应对突发安排
- **🎯 拖拽安排** - 直观的拖拽操作，将任务快速分配到任意时间段
- **📅 日期切换** - 支持查看和编辑不同日期的计划，历史计划只读
- **🤖 AI 智能分析** - 基于日程和描述，AI 提供总结、优化建议和未来计划推荐
- **💾 数据持久化** - 数据保存在 SQLite 数据库，服务重启数据不丢失
- **📤 数据备份** - 支持导出/导入数据，方便迁移和备份

### 设计亮点
- 🎨 温暖的米白色调 + 珊瑚色强调色，营造舒适的使用氛围
- 🔤 Playfair Display 衬线字体标题，搭配 Noto Sans SC 中文字体
- 🪟 毛玻璃效果卡片设计，柔和阴影营造层次感
- ✨ 流畅的拖拽动画和微交互

## 🏗️ 项目结构

```
schedule-management/
├── 📁 server/                 # 后端服务 (Node.js + Express + SQLite)
│   ├── 📄 package.json
│   ├── 📄 server.js           # Express 服务器入口
│   ├── 📄 database.sqlite     # SQLite 数据库文件
│   ├── 📁 models/             # 数据模型
│   │   └── 📄 index.js        # Sequelize 模型定义
│   ├── 📁 config/             # 配置文件
│   │   └── 📄 llm.js          # LLM API 配置（需手动配置）
│   ├── 📁 services/           # 服务层
│   │   └── 📄 llmService.js   # LLM 服务封装
│   └── 📁 node_modules/
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
│       │   ├── 📄 Header.jsx           # 顶部导航（含日期选择）
│       │   ├── 📄 Timeline.jsx         # 时间轴容器
│       │   ├── 📄 TimeSlot.jsx         # 时间块
│       │   ├── 📄 TaskCard.jsx         # 任务卡片
│       │   ├── 📄 TaskLibrary.jsx      # 任务库
│       │   ├── 📄 AddCommonTaskForm.jsx # 添加常用任务表单
│       │   ├── 📄 QuickInput.jsx       # 快速输入组件
│       │   ├── 📄 Stats.jsx            # 统计面板
│       │   ├── 📄 DatePicker.jsx       # 日期选择器
│       │   └── 📄 AIAnalysis.jsx       # AI 分析面板
│       ├── 📁 hooks/          # 自定义 Hooks
│       │   └── 📄 useSchedule.js       # 日程状态管理
│       ├── 📁 services/       # API 服务
│       │   └── 📄 api.js               # 后端接口封装
│       └── 📁 utils/          # 工具函数
│           └── 📄 timeUtils.js         # 时间处理工具
│
├── 📄 package.json            # 根目录配置（含 concurrently）
├── 📄 README.md               # 项目说明
└── 📄 .gitignore              # Git 忽略配置
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

### 2️⃣ 安装所有依赖

```bash
npm run install:all
```

这会同时安装根目录、前端和后端的依赖。

### 3️⃣ 配置 AI 分析功能（可选）

**注意**：AI 分析功能需要配置 API Key 才能使用。

1. 打开 `server/config/llm.js` 文件
2. 将 `apiKey: ''` 修改为你的 LongCat API Key：

```javascript
const LLM_CONFIG = {
  apiKey: 'ak_你的API密钥',  // 在这里填写你的 API Key
  baseUrl: 'https://api.longcat.chat/openai/v1',
  model: 'LongCat-Flash-Chat',
  maxTokens: 2000,
  temperature: 0.7,
};
```

> **隐私保护**：`server/config/llm.js` 已添加到 `.gitignore`，不会被提交到远程仓库。

### 4️⃣ 一键启动（推荐）

```bash
npm run dev
```

这会同时启动：
- 后端服务：http://localhost:3002
- 前端应用：http://localhost:3000

### 5️⃣ 访问应用

打开浏览器访问 http://localhost:3000

---

**手动启动（可选）：**

```bash
# 后端（端口 3002）
cd server && npm start

# 前端（端口 3000，新终端）
cd client && npm run dev
```

## 📖 使用指南

### 切换日期
- 点击顶部导航栏的日期选择器
- 有计划的日期显示为黑色，无计划的日期显示为灰色
- 过去的日期为只读模式，不可修改

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

### AI 智能分析
1. 在日程表下方的"AI 计划分析"区域输入今日执行描述
2. 点击"获取 AI 分析建议"按钮
3. AI 将基于你的日程和描述，提供：
   - 今日计划总结
   - 可优化方向
   - 明日推荐计划
4. 历史分析记录会自动保存，可随时查看

## 🔌 API 接口

### 任务相关
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/tasks` | 获取所有任务 |
| GET | `/api/tasks/common` | 获取常用任务 |
| GET | `/api/tasks/temp` | 获取临时任务 |
| POST | `/api/tasks` | 创建任务 |
| PUT | `/api/tasks/:id` | 更新任务 |
| DELETE | `/api/tasks/:id` | 删除任务 |

### 日程相关
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/schedule?date=YYYY-MM-DD` | 获取指定日期日程 |
| GET | `/api/schedule/dates` | 获取有计划的日期列表 |
| POST | `/api/schedule` | 添加任务到时间块 |
| DELETE | `/api/schedule/:slotId?date=YYYY-MM-DD` | 从时间块移除任务 |

### 每日笔记相关
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/daily-note?date=YYYY-MM-DD` | 获取每日笔记 |
| POST | `/api/daily-note` | 保存每日描述 |

### AI 分析相关
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/analyze` | 调用 AI 分析日程 |

### 数据管理
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/export` | 导出数据（下载 JSON 文件） |
| POST | `/api/import` | 导入数据 |

## 💾 数据存储

数据存储在 `server/database.sqlite` SQLite 数据库中，包含以下表：

- **tasks** - 任务表（常用任务和临时任务）
- **schedules** - 日程安排表
- **settings** - 设置表
- **daily_notes** - 每日笔记表（描述和 AI 回复）
- **ai_history** - AI 分析历史记录表

## 🛠️ 技术栈

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **SQLite** - 轻量级数据库
- **Sequelize** - ORM 框架
- **node-fetch** - HTTP 请求库

### 前端
- **React 18** - UI 框架
- **Vite** - 构建工具
- **Tailwind CSS** - 原子化 CSS 框架
- **自定义拖拽** - 原生 HTML5 Drag and Drop API

## 📝 开发计划

- [x] 基础功能实现
- [x] 文件持久化
- [x] 前后端分离架构
- [x] 数据备份/恢复 API
- [x] 数据库持久化（SQLite + Sequelize）
- [x] 日期切换功能
- [x] AI 智能分析
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
