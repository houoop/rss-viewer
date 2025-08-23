// ==UserScript==
// @name         RSS Reader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convert XML RSS feed to a human read RSS interface
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @require      https://raw.githubusercontent.com/rbren/rss-parser/refs/heads/master/dist/rss-parser.min.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 检查页面是否是RSS源
    function isRSSFeed() {
        // 检查Content-Type
        const contentType = document.contentType?.toLowerCase() || "";
        const validContentTypes = [
            "application/rss+xml",
            "application/atom+xml",
            "application/xml",
            "text/xml",
            'text/plain' // 有些RSS使用text/plain
        ];
        
        if (validContentTypes.includes(contentType)) {
            return true
        }
        return false
    }


    // 提取和解析RSS内容
    async function extractRSS() {
        try {
            // 获取XML内容
            let xmlContent;
            const prettyPrintElement = document.querySelector("#webkit-xml-viewer-source-xml");
            if (prettyPrintElement) {
                xmlContent = prettyPrintElement.innerHTML;
            } else {
                xmlContent = document.body.textContent;
            }

            // 使用RSSParser解析XML
            const parser = new RSSParser();
            const parsedFeed = await parser.parseString(xmlContent);
            
            return {
                title: parsedFeed.title || "RSS Feed",
                description: parsedFeed.description || "",
                items: parsedFeed.items.map(item => ({
                    title: item.title || "",
                    link: item.link || "",
                    description: item.contentSnippet || item.description || "",
                    content: item.content || item["content:encoded"] || "",
                    pubDate: item.pubDate || item.isoDate || "",
                    author: item.creator || item.author || "",
                    categories: item.categories || []
                }))
            };
        } catch (e) {
            console.error("这不是rss xml", e);
            return null;
        }
    }


    // 渲染文章内容
    function renderArticleContent(article, container, doc) {
        container.textContent = ""; // 清空容器

        // 创建文章头部
        const header = doc.createElement("div");
        header.className = "article-header";

        // 创建标题
        const title = doc.createElement("h1");
        title.className = "article-title";
        title.textContent = article.title;
        // 添加点击事件打开文章链接
        if (article.link) {
            title.style.cursor = "pointer";
            title.addEventListener("click", () => {
                window.open(article.link, "_blank");
            });
        }
        header.appendChild(title);

        // 创建元信息
        const meta = doc.createElement("div");
        meta.className = "article-meta";

        if (article.author) {
            const authorSpan = doc.createElement("span");
            authorSpan.textContent = `作者: ${article.author}`;
            meta.appendChild(authorSpan);
        }

        if (article.pubDate) {
            const dateSpan = doc.createElement("span");
            dateSpan.textContent = `发布时间: ${new Date(article.pubDate).toLocaleString()}`;
            meta.appendChild(dateSpan);
        }

        if (article.categories && article.categories.length) {
            const categorySpan = doc.createElement("span");
            categorySpan.textContent = `分类: ${article.categories.join(", ")}`;
            meta.appendChild(categorySpan);
        }

        header.appendChild(meta);

        // 创建文章内容
        const body = doc.createElement("div");
        body.className = "article-body";

        // 使用DOMParser来解析文章内容中的HTML
        const parser = new DOMParser();
        const contentDoc = parser.parseFromString(
            article.content || article.description || "",
            "text/html",
        );
        const contentNodes = contentDoc.body.childNodes;
        contentNodes.forEach((node) => {
            body.appendChild(doc.importNode(node, true));
        });

        // 添加所有元素到容器
        container.appendChild(header);
        container.appendChild(body);
    }

    // 创建阅读器界面
    async function createReaderInterface(rssData) {
        // 创建新的HTML文档
        const newDoc = document.implementation.createHTMLDocument();
        const container = newDoc.createElement("div");
        container.className = "rss-reader-container";
        
        // 创建顶部header
        const header = newDoc.createElement("div");
        header.className = "reader-header";
        
        // 创建header信息容器
        const headerInfo = newDoc.createElement("div");
        headerInfo.className = "header-info";
        
        // RSS标题
        const feedTitle = newDoc.createElement("h1");
        feedTitle.className = "feed-title";
        feedTitle.textContent = rssData.title;
        headerInfo.appendChild(feedTitle);
        
        // RSS元信息
        const feedMeta = newDoc.createElement("div");
        feedMeta.className = "feed-meta";
        
        // 获取最新的文章日期
        const latestDate = rssData.items
            .map((item) => new Date(item.pubDate))
            .reduce(
                (latest, current) => (current > latest ? current : latest),
                new Date(0),
            );
        
        feedMeta.textContent = `最后更新: ${latestDate.toLocaleString()}`;
        headerInfo.appendChild(feedMeta);
        
        // RSS描述
        if (rssData.description) {
            const feedDesc = newDoc.createElement("div");
            feedDesc.className = "feed-description";
            feedDesc.textContent = rssData.description;
            headerInfo.appendChild(feedDesc);
        }
        
        // 将header信息容器添加到header
        header.appendChild(headerInfo);
        container.appendChild(header);
        
        // 创建主内容容器
        const readerContent = newDoc.createElement("div");
        readerContent.className = "reader-content";
        
        // 创建左侧文章列表
        const articleList = newDoc.createElement("div");
        articleList.className = "article-list";
        
        // 创建右侧内容区
        const articleContent = newDoc.createElement("div");
        articleContent.className = "article-content";
        
        // 渲染文章列表
        rssData.items.forEach((item, index) => {
            const articleItem = newDoc.createElement("div");
            articleItem.className = "article-item";
            
            const title = newDoc.createElement("h3");
            title.textContent = item.title;
            articleItem.appendChild(title);
            
            // 添加发布日期
            const date = newDoc.createElement("div");
            date.style.fontSize = "12px";
            date.style.color = "#5f6368";
            date.style.marginTop = "4px";
            date.textContent = new Date(item.pubDate).toLocaleDateString();
            articleItem.appendChild(date);
            
            // 添加双击事件监听器
            articleItem.addEventListener("dblclick", () => {
                if (item.link) {
                    window.open(item.link, "_blank");
                }
            });
            
            articleItem.addEventListener("click", () => {
                // 移除其他文章的active状态
                newDoc.querySelectorAll(".article-item").forEach((item) => {
                    item.classList.remove("active");
                });
                
                // 添加当前文章的active状态
                articleItem.classList.add("active");
                
                // 更新右侧内容
                renderArticleContent(item, articleContent, newDoc);
                
                // 滚动到顶部
                articleContent.scrollTop = 0;
            });
            
            articleList.appendChild(articleItem);
            
            // 默认显示第一篇文章
            if (index === 0) {
                articleItem.classList.add("active");
                renderArticleContent(item, articleContent, newDoc);
            }
        });
        
        readerContent.appendChild(articleList);
        readerContent.appendChild(articleContent);
        container.appendChild(readerContent);
        
        // 清空原有内容并添加阅读器界面
        document.documentElement.innerHTML = "";
        
        // 添加样式到新文档
        const styleElement = newDoc.createElement('style');
        styleElement.textContent = `
            /* 主题变量 */
            :root {
              /* 明亮主题 */
              --bg-primary: #ffffff;
              --bg-secondary: #f8f9fa;
              --text-primary: #202124;
              --text-secondary: #5f6368;
              --border-color: #e0e0e0;
              --hover-bg: #e8f0fe;
              --active-border: #1a73e8;
              --header-bg: #ffffff;
              --button-primary-bg: #2ecc71;
              --button-primary-hover: #27ae60;
              --button-secondary-bg: #ecf0f1;
              --button-secondary-hover: #bdc3c7;
              --shadow-color: rgba(0, 0, 0, 0.1);
            }
            
            /* 暗黑主题 */
            [data-theme="dark"] {
              --bg-primary: #1a1a1a;
              --bg-secondary: #2d2d2d;
              --text-primary: #e0e0e0;
              --text-secondary: #9e9e9e;
              --border-color: #404040;
              --hover-bg: #3d3d3d;
              --active-border: #64b5f6;
              --header-bg: #2d2d2d;
              --button-primary-bg: #2ecc71;
              --button-primary-hover: #27ae60;
              --button-secondary-bg: #424242;
              --button-secondary-hover: #616161;
              --shadow-color: rgba(0, 0, 0, 0.3);
            }
            
            body {
              margin: 0;
              padding: 0;
              background-color: var(--bg-primary);
              color: var(--text-primary);
              transition: background-color 0.3s ease, color 0.3s ease;
            }
            
            .rss-reader-container {
              display: flex;
              flex-direction: column;
              height: 100vh;
              width: 100%;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background-color: var(--bg-primary);
            }
            
            .reader-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 20px;
              border-bottom: 1px solid var(--border-color);
              background-color: var(--header-bg);
              position: sticky;
              top: 0;
              z-index: 100;
              box-shadow: 0 2px 4px var(--shadow-color);
            }
            
            .header-info {
              flex: 1;
              min-width: 0;
              margin-right: 20px;
            }
            
            .feed-title {
              font-size: 24px;
              font-weight: 600;
              color: var(--text-primary);
              margin: 0 0 8px 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              letter-spacing: -0.5px;
            }
            
            .feed-meta {
              font-size: 13px;
              color: var(--text-secondary);
              margin-bottom: 8px;
            }
            
            .feed-description {
              font-size: 14px;
              color: var(--text-secondary);
              margin: 8px 0;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 1.5;
            }
            
            .reader-content {
              display: flex;
              flex: 1;
              overflow: hidden;
              background-color: var(--bg-primary);
            }
            
            .article-list {
              width: 320px;
              border-right: 1px solid var(--border-color);
              overflow-y: auto;
              background: var(--bg-secondary);
            }
            
            .article-item {
              padding: 16px;
              border-bottom: 1px solid var(--border-color);
              cursor: pointer;
              transition: all 0.2s ease;
            }
            
            .article-item h3 {
              font-size: 15px;
              margin: 0;
              line-height: 1.5;
              color: var(--text-primary);
              font-weight: 500;
            }
            
            .article-item:hover {
              background: var(--hover-bg);
            }
            
            .article-item.active {
              background: var(--hover-bg);
              border-left: 4px solid var(--active-border);
            }
            
            .article-content {
              flex: 1;
              padding: 30px 40px;
              overflow-y: auto;
              background: var(--bg-primary);
              line-height: 1.6;
            }
            
            .article-header {
              margin-bottom: 24px;
              padding-bottom: 20px;
              border-bottom: 1px solid var(--border-color);
            }
            
            .article-title {
              font-size: 28px;
              color: var(--text-primary);
              margin-bottom: 16px;
              line-height: 1.4;
              font-weight: 600;
              letter-spacing: -0.5px;
            }
            
            .article-meta {
              color: var(--text-secondary);
              font-size: 14px;
              margin: 12px 0;
              display: flex;
              flex-wrap: wrap;
              gap: 16px;
            }
            
            .article-body {
              color: var(--text-primary);
              font-size: 16px;
              line-height: 1.8;
              max-width: 800px;
              margin: 0 auto;
            }
            
            .article-body img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 20px auto;
              border-radius: 8px;
              box-shadow: 0 4px 12px var(--shadow-color);
            }
            
            .header-actions {
              display: flex;
              align-items: center;
              gap: 12px;
              flex-shrink: 0;
              position: relative;
            }
            
            .subscribe-button-group {
              display: flex;
              align-items: stretch;
              box-shadow: 0 2px 4px var(--shadow-color);
              border-radius: 6px;
              overflow: hidden;
            }
            
            .main-subscribe-button {
              background-color: var(--button-primary-bg);
              color: white;
              border: none;
              padding: 10px 20px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s ease;
              white-space: nowrap;
            }
            
            .main-subscribe-button:hover {
              background-color: var(--button-primary-hover);
            }
            
            .dropdown-button {
              background-color: var(--button-primary-bg);
              color: white;
              border: none;
              border-left: 1px solid rgba(255, 255, 255, 0.2);
              padding: 10px 12px;
              cursor: pointer;
              font-size: 12px;
              transition: all 0.2s ease;
            }
            
            .dropdown-button:hover {
              background-color: var(--button-primary-hover);
            }
            
            .settings-button, .theme-toggle {
              background-color: var(--button-secondary-bg);
              color: var(--text-primary);
              border: none;
              border-radius: 6px;
              padding: 10px;
              cursor: pointer;
              font-size: 18px;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 40px;
              height: 40px;
            }
            
            .settings-button:hover, .theme-toggle:hover {
              background-color: var(--button-secondary-hover);
            }
            
            .dropdown-menu {
              position: absolute;
              top: calc(100% + 8px);
              right: 0;
              background-color: var(--bg-primary);
              border-radius: 8px;
              box-shadow: 0 4px 12px var(--shadow-color);
              min-width: 200px;
              z-index: 1000;
              border: 1px solid var(--border-color);
              overflow: hidden;
            }
            
            .dropdown-item {
              padding: 12px 16px;
              cursor: pointer;
              transition: all 0.2s ease;
              color: var(--text-primary);
            }
            
            .dropdown-item:hover {
              background-color: var(--hover-bg);
            }
            
            /* 滚动条美化 */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: var(--bg-secondary);
            }
            
            ::-webkit-scrollbar-thumb {
              background: var(--text-secondary);
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: var(--text-primary);
            }
            
            /* 文章内容排版美化 */
            .article-body p {
              margin: 1.5em 0;
            }
            
            .article-body a {
              color: var(--active-border);
              text-decoration: none;
            }
            
            .article-body a:hover {
              text-decoration: underline;
            }
            
            .article-body blockquote {
              margin: 1.5em 0;
              padding: 1em 2em;
              border-left: 4px solid var(--active-border);
              background: var(--bg-secondary);
              border-radius: 4px;
            }
            
            .article-body code {
              background: var(--bg-secondary);
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Fira Code', monospace;
              font-size: 0.9em;
            }
            
            .article-body pre {
              background: var(--bg-secondary);
              padding: 1em;
              border-radius: 8px;
              overflow-x: auto;
            }
            
            .article-body h1, .article-body h2, .article-body h3, 
            .article-body h4, .article-body h5, .article-body h6 {
              color: var(--text-primary);
              margin: 1.5em 0 1em;
              line-height: 1.3;
              font-weight: 600;
            }
        `;
        newDoc.head.appendChild(styleElement);
        
        const newBody = newDoc.createElement("body");
        newBody.appendChild(container);
        newDoc.documentElement.appendChild(newBody);
        document.documentElement.appendChild(newDoc.documentElement);
    }

    // 主函数
    async function init() {
        // 检查是否是RSS源
        if (!isRSSFeed()) {
            return;
        }

        // 提取和解析RSS
        const feed = await extractRSS();
        if (!feed) {
            return;
        }

        // 创建阅读器界面
        createReaderInterface(feed);
    }

    // 启动程序
    init();
})();