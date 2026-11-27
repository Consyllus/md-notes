# Markdown Notes (`md-notes`)

English | [简体中文](./README.zh-CN.md)

A minimalist local Markdown notebook running inside the Google Antigravity Auxiliary Pane. Built-in bilingual UI (**English** & **简体中文**, auto-detected from your system or switchable anytime in Settings).

## Quick Install

### Antigravity One-Line Install (Recommended)

```bash
agy plugin install https://github.com/Consyllus/md-notes
```

> Once installed, ask *"Open the notebook"* or type `/notebook` in chat to open the right-hand side pane.

---

## Key Features

- **Live Block Preview & Raw Source Mode (`Ctrl+E`)**: Distraction-free WYSIWYG block editing supporting headings (`H1`–`H4`), **multi-level bullet, numbered, and task lists** (`• / ◦ / ▪` markers & auto-renumbering), code blocks, tables, blockquotes, and inline formatting.
- **`@@` Context Selection Box (Two Mutually Exclusive Modes)**: Type `@@` in any block to spawn an upward-draggable selection frame and control exactly what the Agent sees:
  - **Mode A · Single-Turn Line Reference (Default)**: Sends only the file URI and line range for a single chat turn; the blue frame automatically turns gray once consumed.
  - **Mode B · Persistent Snippet Injection**: Injects only the selected plain text (zero file path or outside content exposure), staying active across turns with per-conversation SHA-1 deduplication to save tokens.
- **Agent Access Locks (`PreToolUse` Engine Guard)**:
  - Independent toggles for **Allow Agent to Read Notes** and **Allow Agent to Edit Notes**.
  - **Dynamic Focus Busy-Lock**: Automatically pauses Agent writes while your cursor is focused inside the notebook with unsaved edits, resuming as soon as you save or move focus away.
- **Multi-Note Management & Flexible Storage**:
  - Create, search, switch, inline-rename, and delete `.md` files with debounced auto-save.
  - Follows `<workspace>/notes` by default, or points to any fixed local folder via the built-in directory browser.
- **Built-in i18n (`en` & `zh-CN`)**: Automatically matches your system locale on first launch, with instant live language switching inside Notebook Settings.

## Keyboard Shortcuts

| Shortcut / Trigger | Action |
| :--- | :--- |
| `@@` | Spawn context selection frame at current block; drag upward to select range |
| `Tab` / `Shift+Tab` | Indent / outdent bullet, numbered, or task list items |
| `Enter` / `Backspace` | Continue current list level; outdent step-by-step on empty nested items |
| `Ctrl+S` / `Cmd+S` | Save current note immediately |
| `Ctrl+E` / `Cmd+E` | Toggle between Live Block Preview and Raw Markdown Source |
| `Ctrl+B` / `Cmd+B` | Bold selected text |
| `Ctrl+N` / `Cmd+N` | Create a new note |

## Alternative Installation

### Manual Clone (Antigravity App / IDE)

**Windows (PowerShell)**
```powershell
git clone https://github.com/Consyllus/md-notes.git "$HOME\.gemini\config\plugins\md-notes"
```

**macOS / Linux**
```bash
git clone https://github.com/Consyllus/md-notes.git ~/.gemini/config/plugins/md-notes
```

> For workspace-only installation, clone into `.agents/plugins/md-notes` inside your project root.

## Credits & License

- **Organization**: [Consyllus](https://consyllus.com)
- **Author**: FalsenJing
- **License**: [MIT](./LICENSE)
