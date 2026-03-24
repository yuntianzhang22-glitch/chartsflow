# ChartFlow 技术规格文档

## 产品概述
- **产品名称**: ChartFlow - 在线交互式图表编辑器
- **核心功能**: 快速创建可自定义的数据可视化图表，支持静态图和交互式HTML导出
- **目标用户**: 非技术用户（运营、市场、HR等需要做数据呈现的人）

## 技术栈
- **前端框架**: React 19 + Vite
- **图表库**: ECharts (echarts-for-react)
- **状态管理**: Zustand
- **数据处理**: xlsx (Excel/CSV 导入)
- **部署平台**: Vercel

## 页面结构

### 1. 首页 (Home)
- 产品 Logo + 标题
- 核心功能介绍
- "创建图表" 入口

### 2. 数据导入页 (DataInput)
- 上传文件区域 (Excel/CSV)
- 手动输入表格

### 3. 图表编辑页 (Editor)
- 左侧：图表类型选择
- 中间：实时图表预览
- 右侧：配置面板

## 设计系统

### 主题
- 浅色模式 (默认)
- 深色模式
- 切换按钮位于右上角

### 配色
- 主色: #2563EB (蓝色)
- 成功: #10B981
- 警告: #F59E0B
- 错误: #EF4444

### 图表配色主题
- Blue: #2563EB → #3B82F6
- Green: #059669 → #10B981
- Purple: #7C3AED → #8B5CF6
- Red: #DC2626 → #EF4444
- Amber: #D97706 → #F59E0B

## 组件列表
1. ThemeToggle - 主题切换
2. HomePage - 首页
3. DataInputPage - 数据导入
4. EditorPage - 图表编辑器
5. ChartCanvas - 图表画布
6. ConfigPanel - 配置面板
7. ExportModal - 导出弹窗

## 功能清单 (MVP)
- [x] 浅色/深色主题切换
- [x] 数据手动输入
- [x] 数据文件上传 (Excel/CSV)
- [x] 柱状图/折线图/饼图切换
- [x] 图表标题编辑
- [x] 颜色主题选择
- [x] 样式配置 (圆角、线宽、网格、图例)
- [x] 动画配置
- [x] PNG 导出
- [x] 交互 HTML 导出
- [x] ECharts 代码复制
- [x] JSON 配置导出