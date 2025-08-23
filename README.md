# RSS Viewer / RSS 预览

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/houoop/rss-viewer)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-published-green.svg)](https://greasyfork.org/)

一个优雅的 RSS 阅读器用户脚本，将 XML RSS 源转换为人类可读的界面。

## 🌟 功能特性

- 🔄 **自动检测**: 自动识别 RSS 源并转换为可读界面
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🌓 **主题切换**: 支持明暗主题切换，记住用户偏好
- 🌍 **多语言支持**: 中文简体/繁体、英文、日文、韩文
- 📋 **双栏布局**: 左侧文章列表，右侧内容展示
- 🎨 **美观界面**: 现代化设计，平滑动画效果
- 🔖 **文章预览**: 显示文章摘要和分类标签
- ⬆️ **返回顶部**: 便捷的返回顶部按钮
- 📜 **格式支持**: 支持 RSS、Atom、XML 格式

## 🚀 安装方法

### 从 Greasy Fork 安装 (推荐)

1. 访问 [RSS Viewer - Greasy Fork](https://greasyfork.org/)
2. 点击 "Install this script"
3. 确认安装到 Tampermonkey 或其他用户脚本管理器

### 手动安装

1. 确保已安装 [Tampermonkey](https://www.tampermonkey.net/) 或其他用户脚本管理器
2. 复制 `rss-reader.user.js` 文件内容
3. 在 Tampermonkey 中创建新脚本并粘贴代码
4. 保存脚本

## 📖 使用说明

1. **访问 RSS 源**: 打开任何 RSS 或 XML Feed 页面
2. **自动转换**: 脚本会自动检测并转换界面
3. **浏览文章**: 点击左侧文章列表查看内容
4. **切换主题**: 点击右上角主题按钮
5. **返回顶部**: 滚动时点击右下角返回顶部按钮

## 🎯 支持的格式

- RSS 2.0
- Atom 1.0
- XML 格式
- Content-Type: `application/rss+xml`
- Content-Type: `application/atom+xml`
- Content-Type: `application/xml`
- Content-Type: `text/xml`

## 🌐 多语言支持

| 语言 | 代码 | 状态 |
|------|------|------|
| English | en | ✅ |
| 中文简体 | zh-CN | ✅ |
| 中文繁体 | zh-TW | ✅ |
| 日本語 | ja | ✅ |
| 한국어 | ko | ✅ |

脚本会根据浏览器语言自动选择界面语言，也可以在设置中手动切换。

## 🎨 主题样式

### 明亮主题
- 清爽的白色背景
- 深色文字，高对比度
- 适合白天使用

### 暗黑主题
- 护眼的深色背景
- 柔和的浅色文字
- 适合夜间使用

## 🛠️ 开发信息

### 技术栈
- **用户脚本**: Tampermonkey 格式
- **RSS 解析**: rss-parser 库
- **样式**: 原生 CSS
- **语言**: JavaScript (ES6+)

### 浏览器兼容性
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### 版本信息
- **当前版本**: 1.0.0
- **发布日期**: 2024-08-23
- **许可证**: MIT

## 📋 更新日志

### v1.0.0 (2024-08-23)
- 初始版本发布
- 支持RSS/Atom格式解析
- 双栏布局界面
- 明暗主题切换
- 返回顶部按钮
- 响应式设计
- 多语言支持
- 文章预览和分类标签
- 平滑动画效果

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 🐛 问题反馈

如果您遇到问题或有改进建议，请：

1. 查看 [常见问题](#常见问题)
2. 搜索现有的 [Issues](https://github.com/houoop/rss-viewer/issues)
3. 创建新的 Issue，包含：
   - 问题描述
   - 复现步骤
   - 浏览器和版本信息
   - 错误截图（如果有）

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [rss-parser](https://github.com/rbren/rss-parser) - RSS 解析库
- [Tampermonkey](https://www.tampermonkey.net/) - 用户脚本管理器
- [Greasy Fork](https://greasyfork.org/) - 脚本发布平台

## 📞 联系方式

- **作者**: houoop
- **GitHub**: [houoop](https://github.com/houoop)
- **Issues**: [GitHub Issues](https://github.com/houoop/rss-viewer/issues)

---

⭐ 如果这个项目对您有帮助，请给个星标！