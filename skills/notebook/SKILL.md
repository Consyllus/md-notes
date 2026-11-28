---
name: notebook
description: Open the right-hand Notebook side pane / sidebar scratchpad (md-notes/notebook), or create, organize, summarize, and append notes and memos in the active workspace's notes directory. Use when the user asks to open the notebook or scratchpad, take notes, jot down memos, save takeaways to notes, or invokes /notebook (打开笔记本、记笔记、便签、整理追加笔记).
---

# Notebook (`md-notes`)

## 1. Open the Right-Hand Notebook Side Pane

When the user wants to open or toggle the notebook panel, output the sidecar pill on its own line (use a label matching the user's language, e.g. `Notebook` or `笔记本`):

- [Notebook](sidecar://md-notes/notebook/)

To manage or reload the plugin on the Customizations page, provide:

- [Notebook](customization://md-notes)

## 2. Read & Update Note Files

- By default, notes are stored as `.md` files in `<workspace>/notes/` (if the user configured a custom folder, inspect `<appDataDir>/sidecar_data/md-notes/notebook/data/settings.json` for `mode: "custom"` and `customDir`).
- Users can type `@@` in the notebook to pin context snippets, or type `||` to insert a `[<title>](conversation://<conversation-id>)` jump link to the current host chat window.
- When the user asks to save or append content to a note, read the target `.md` file first to confirm its existing structure, then append clean headings and nested lists (`2` spaces per indent level). If blocked by the notebook's `PreToolUse` write lock, politely ask the user to enable **Allow Agent to Edit Notes**（「允许 Agent 修改笔记」）in Notebook Settings.
