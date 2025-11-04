# OpenTracker 🔍

开源全链路埋点监控平台，集成前端监控 SDK，支持代码报错、性能数据、用户行为、录屏与白屏检测等指标的采集与可视化展示 ✨

## 📦 项目结构

这是一个 Monorepo 项目，使用 packages 目录管理多个子项目：

```
OpenTracker/
├── packages/
│   ├── sdk/
│   ├── admin/
│   └── server/
└── README.md
```

### 🎯 子项目说明

- **sdk** 📱: 提供数据追踪和上报功能的 SDK 包
- **admin** 🎨: 提供数据查看、分析和管理功能的后台管理系统
- **server** 🚀: 提供数据接收、处理和存储功能的服务端应用
