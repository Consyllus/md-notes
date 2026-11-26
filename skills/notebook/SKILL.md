---
name: notebook
description: 打开右侧 Markdown 笔记本面板（md-notes/notebook），或协助在当前工作区的笔记目录中新建、整理与追加学习笔记。当用户提到打开笔记本、记笔记或调用 /notebook 时使用。
---

# Markdown 笔记本（`md-notes`）

## 1. 打开右侧笔记本面板

当用户希望打开笔记本侧边栏时，直接在回复中输出以下胶囊链接（单独一行或清晰列出）：

- [笔记本](sidecar://md-notes/notebook/)

如需管理或重启插件，提供插件详情页链接：

- [Markdown 笔记本](customization://md-notes)

## 2. 协助读写笔记文件

- 默认情况下，笔记本将 `.md` 文件保存在 `<当前工作区>/notes/` 目录（若用户在设置中开启了自定义目录，可通过 `<appDataDir>/sidecar_data/md-notes/notebook/data/settings.json` 查看 `mode: "custom"` 与 `customDir`）。
- 当用户要求“把刚才讲的内容记进笔记”时，先读取目标 `.md` 文件确认现有结构，再用清晰的 Markdown 标题与多级列表追加保存（若触发笔记本只读权限锁拦截，请提示用户在右侧笔记本设置中开启「允许 Agent 修改笔记」），完成后提醒用户在右侧笔记本查看。
