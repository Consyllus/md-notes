# 笔记本 (`notebook-antigravity-plugin`)

<p>
  <a href="https://antigravity.google"><img src="https://img.shields.io/badge/Google_Antigravity-Plugin-4285F4?style=flat-square" alt="Google Antigravity Plugin" height="20" /></a>
  <a href="https://github.com/Consyllus/notebook-antigravity-plugin/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-CB4B16?style=flat-square" alt="License: MIT" height="20" /></a>
</p>

[English](./README.md) | 简体中文

一个运行在 **Google Antigravity**（Antigravity 2.0、IDE、CLI / `agy`）右侧辅助面板中的极简本地笔记本插件。

## 快速安装

### Antigravity 一键安装（推荐）

```bash
agy plugin install https://github.com/Consyllus/notebook-antigravity-plugin
```

> 安装完成后，在对话中输入「打开笔记本」或调用 `/notebook` 即可唤起右侧笔记本面板。

---

## 核心特性

- **实时分块编辑与 Markdown 排版（`Ctrl+E`）**：支持普通文本直接编辑与工具栏快捷排版，同时支持 Markdown 语法实时分块预览（`H1`–`H4` 标题、**多级无序 / 有序 / 待办列表** `• / ◦ / ▪` 自动切换层级符号与自动编号、代码块、表格、引用块），可一键切换源码模式。
- **`@@` 框选上下文投喂（双模式互斥）**：在任意行输入 `@@` 即可呼出向上拖拽选框，精准控制向 Agent 暴露的笔记内容：
  - **方式 A · 单轮文档索引引用（默认）**：向 Agent 发送单轮文件 URI 与起止行号索引，发送一轮消息后选框自动变灰失效。
  - **方式 B · 常驻纯片段直投**：仅注入框选区域的纯文本片段（不暴露文档其余内容与路径），跨轮次常驻生效并内置会话级内容哈希去重，避免重复消耗 Token。
- **Agent 访问权限锁（`PreToolUse` 引擎级拦截）**：
  - 独立开关控制「允许 Agent 读取笔记」与「允许 Agent 修改笔记」。
  - **防编辑冲突动态写锁**：当用户光标正聚焦在笔记本内且有未保存修改时，自动临时拦截 Agent 写入，移开焦点或保存后自动放行。
- **多笔记管理与灵活存储**：
  - 支持新建、全文搜索、切换、内联重命名与删除多个笔记文件，实时自动保存。
  - 默认跟随 `<当前工作区>/notes` 目录，也可在设置面板指定任意本地自定义文件夹（内置目录浏览器）。

## 常用快捷键

| 快捷键 / 触发词 | 功能说明 |
| :--- | :--- |
| `@@` | 在当前块生成上下文选框，向上拖拽框选范围 |
| `Tab` / `Shift+Tab` | 在无序、有序、待办列表项中缩进 / 退回层级 |
| `Enter` / `Backspace` | 延续当前列表层级；在空子列表项按回车或行首退格逐级退回 |
| `Ctrl+S` / `Cmd+S` | 立即保存当前笔记 |
| `Ctrl+E` / `Cmd+E` | 切换「实时预览」与「Markdown 源码」模式 |
| `Ctrl+B` / `Cmd+B` | 加粗选中文本 |
| `Ctrl+N` / `Cmd+N` | 新建笔记 |

## 其它安装方式

### 手动克隆至全局插件目录（Antigravity App / IDE）

**Windows (PowerShell)**
```powershell
git clone https://github.com/Consyllus/notebook-antigravity-plugin.git "$HOME\.gemini\config\plugins\md-notes"
```

**macOS / Linux**
```bash
git clone https://github.com/Consyllus/notebook-antigravity-plugin.git ~/.gemini/config/plugins/md-notes
```

> 若只需在单个项目内启用，也可克隆至项目根目录下的 `.agents/plugins/md-notes`。

## 关于与版权

- **Organization**: [Consyllus](https://consyllus.com)
- **Author**: FalsenJing
- **License**: [MIT](./LICENSE)
