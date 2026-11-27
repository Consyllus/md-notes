# Notebook (`notebook-antigravity-plugin`)

<p>
  <a href="https://antigravity.google"><img src="https://img.shields.io/badge/Google_Antigravity-Plugin-4285F4?style=flat-square" alt="Google Antigravity Plugin" height="20" /></a>
  <a href="https://github.com/Consyllus/notebook-antigravity-plugin/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-CB4B16?style=flat-square" alt="License: MIT" height="20" /></a>
</p>

English | [简体中文](./README.zh-CN.md)

A minimalist local notebook plugin running in the right-hand side pane of **Google Antigravity** (Antigravity 2.0, IDE, and CLI / `agy`).

## Quick Install

### Antigravity One-Line Install (Recommended)

```bash
agy plugin install https://github.com/Consyllus/notebook-antigravity-plugin
```

> Once installed, ask *"Open the notebook"* or type `/notebook` in chat to open the right-hand side pane.

---

## Key Features

- **Live Block Editing & Markdown Formatting (`Ctrl+E`)**: Supports direct plain-text editing and toolbar formatting, as well as live Markdown block preview (`H1`–`H4` headings, **multi-level bullet, numbered, and task lists** with `• / ◦ / ▪` markers & auto-renumbering, code blocks, tables, and blockquotes) and instant raw source toggling.
- **LaTeX Math Rendering & `0ms` Syntax Autocomplete**:
  - **Full Offline KaTeX Engine**: Supports inline `$...$` and centered display `$$...$$` math blocks (with live formula preview while editing source), bundled with `mhchem` chemical equations (`\ce{...}`), `physics`-style calculus/vector macros, cross-block `\gdef` custom macros, and `copy-tex` LaTeX source copying.
  - **Instant `\command` Autocomplete & Brace Tab-Jump**: Typing `\` inside any formula pops up a `0ms` completion menu across **950+ official KaTeX commands and environments** with live rendered symbol previews; press `Tab` / `Enter` to insert and land inside `{}` braces, and press `Tab` to jump across arguments (plus `￥￥` → `$|$` auto-conversion for Chinese IME).
- **`@@` Context Selection Box (Two Mutually Exclusive Modes)**: Type `@@` in any line to spawn an upward-draggable selection frame and control exactly what the Agent sees:
  - **Mode A · Single-Turn Line Reference (Default)**: Sends only the file URI and line range for a single chat turn; the blue frame automatically turns gray once consumed.
  - **Mode B · Persistent Snippet Injection**: Injects only the selected plain text (zero file path or outside content exposure), staying active across turns with per-conversation SHA-1 deduplication to save tokens.
- **Agent Access Locks (`PreToolUse` Engine Guard)**:
  - Independent toggles for **Allow Agent to Read Notes** and **Allow Agent to Edit Notes**.
  - **Dynamic Focus Busy-Lock**: Automatically pauses Agent writes while your cursor is focused inside the notebook with unsaved edits, resuming as soon as you save or move focus away.
- **Multi-Note Management & Flexible Storage**:
  - Create, search, switch, inline-rename, and delete notes with automatic local saving.
  - Follows `<workspace>/notes` by default, or points to any fixed local folder via the built-in directory browser.
- **Host-Synced Theme Colors & Bilingual UI**: Automatically syncs background surfaces, text, borders, accent colors, and math formula rendering with the Antigravity host's Light / Dark theme in real time, with built-in English and Simplified Chinese switching.

## Keyboard Shortcuts

| Shortcut / Trigger | Action |
| :--- | :--- |
| `@@` | Spawn context selection frame at current block; drag upward to select range |
| `\` + letters (in math) | Open `0ms` LaTeX command/environment autocomplete (`Tab` / `Enter` to insert & jump `{}` args) |
| `￥￥` (Chinese IME) | Auto-convert to `$$` and place cursor right in the middle |
| `Tab` / `Shift+Tab` | Indent / outdent bullet, numbered, or task list items |
| `Enter` / `Backspace` | Continue current list level; outdent step-by-step on empty nested items |
| `Ctrl+S` / `Cmd+S` | Save current note immediately |
| `Ctrl+E` / `Cmd+E` | Toggle between Live Preview and Raw Markdown Source |
| `Ctrl+B` / `Cmd+B` | Bold selected text |
| `Ctrl+N` / `Cmd+N` | Create a new note |

## Alternative Installation

### Manual Clone (Antigravity App / IDE)

**Windows (PowerShell)**
```powershell
git clone https://github.com/Consyllus/notebook-antigravity-plugin.git "$HOME\.gemini\config\plugins\md-notes"
```

**macOS / Linux**
```bash
git clone https://github.com/Consyllus/notebook-antigravity-plugin.git ~/.gemini/config/plugins/md-notes
```

> For workspace-only installation, clone into `.agents/plugins/md-notes` inside your project root.

## Credits & License

- **Organization**: [Consyllus](https://consyllus.com)
- **Author**: FalsenJing
- **License**: [MIT](./LICENSE)
