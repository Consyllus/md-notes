---
name: notebook
description: Open the right-hand Markdown Notes side pane (md-notes/notebook), or create, organize, and append Markdown notes in the active workspace's notes directory. Use when the user asks to open the notebook, take notes, save takeaways to notes, or invokes /notebook (打开笔记本、记笔记).
---

# Markdown Notes (`md-notes`)

## 1. Open the Right-Hand Notebook Side Pane

When the user wants to open or toggle the notebook panel, output the sidecar pill on its own line (use a label matching the user's language, e.g. `Markdown Notes` or `笔记本`):

- [Markdown Notes](sidecar://md-notes/notebook/)

To manage or reload the plugin on the Customizations page, provide:

- [Markdown Notes](customization://md-notes)

## 2. Read & Update Note Files

- By default, `.md` notes are stored in `<workspace>/notes/` (if the user configured a custom folder, inspect `<appDataDir>/sidecar_data/md-notes/notebook/data/settings.json` for `mode: "custom"` and `customDir`).
- When the user asks to save or append content to a note, read the target `.md` file first to confirm its existing structure, then append clean Markdown headings and nested lists (`2` spaces per indent level). If blocked by the notebook's `PreToolUse` write lock, politely ask the user to enable **Allow Agent to Edit Notes**（「允许 Agent 修改笔记」）in Notebook Settings.
