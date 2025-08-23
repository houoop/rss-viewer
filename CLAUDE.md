# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个用户脚本项目，包含一个 RSS 阅读器用户脚本（rss-reader.user.js）。该脚本用于将 XML RSS 源转换为人类可读的 RSS 界面。

## 项目结构

- `rss-reader.user.js` - 主要的用户脚本文件
- `rss-parser.min.js` - RSS 解析器的压缩版本（外部依赖）

## 技术栈

- **用户脚本**: 使用 Tampermonkey 脚本格式
- **RSS 解析**: 使用 rbren/rss-parser 库
- **样式**: 原生 CSS，支持明亮/暗黑主题
- **功能**: 双栏布局，左侧文章列表，右侧内容展示

## 核心功能

### 主要功能模块

1. **RSS 检测** (`isRSSFeed`)
   - 检查页面 Content-Type
   - 支持多种 RSS 格式（RSS、Atom、XML）

2. **RSS 解析** (`extractRSS`)
   - 使用 RSSParser 解析 XML 内容
   - 提取标题、描述、文章等信息

3. **界面渲染** (`createReaderInterface`)
   - 创建双栏阅读器界面
   - 左侧文章列表，右侧内容展示
   - 支持主题切换（明亮/暗黑）

4. **文章展示** (`renderArticleContent`)
   - 渲染文章详情
   - 支持点击/双击链接跳转
   - 保持原文 HTML 格式

### 样式特性

- **响应式设计**: 适配不同屏幕尺寸
- **主题系统**: 明亮/暗黑主题切换
- **交互效果**: hover、active 状态
- **排版优化**: 文章内容美化，支持代码块、引用等

## 开发注意事项

1. **用户脚本特性**:
   - 使用 `@grant GM_xmlhttpRequest` 获取网络权限
   - 支持 `@connect` 指定的域名访问
   - 运行时机为 `document-end`

2. **依赖管理**:
   - RSS 解析器通过 CDN 加载
   - 需要确保网络连接可用

3. **测试建议**:
   - 在实际 RSS 源页面上测试
   - 验证不同 RSS 格式的兼容性
   - 检查主题切换功能