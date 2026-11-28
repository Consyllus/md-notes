# Notebook (`notebook-antigravity-plugin`)

<p>
  <a href="https://antigravity.google"><img src="https://img.shields.io/badge/Google_Antigravity-Plugin-4285F4?style=flat-square" alt="Google Antigravity Plugin" height="20" /></a>
  <a href="https://github.com/Consyllus/notebook-antigravity-plugin/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-CB4B16?style=flat-square" alt="License: MIT" height="20" /></a>
</p>

English | [简体中文](./README.zh-CN.md)

A minimalist, **directly editable** local notebook plugin running in the right-hand side pane of **Google Antigravity** (Antigravity 2.0, IDE, and CLI / `agy`) — built for **live human-AI co-editing**, **`@@` cross-conversation persistent context reference**, and **native adaptation to the host's Light, Dark, and corresponding sub-themes**.

<p align="center">
  <img src="./assets/hero.png" alt="Notebook in Google Antigravity" width="100%" />
</p>

## Quick Install

### Antigravity One-Line Install (Recommended)

```bash
agy plugin install https://github.com/Consyllus/notebook-antigravity-plugin
```

> Once installed, ask *"Open the notebook"* or type `/notebook` in chat to open the right-hand side pane.

---

## Key Features

- **Directly Editable Live Blocks & Bi-Directional Co-Editing (`Ctrl+E`)**: Unlike read-only previewers, every rendered block is **directly editable in place** — click any paragraph, heading (`H1`–`H4`), **multi-level bullet / numbered / task list** (`• / ◦ / ▪` with auto-renumbering), table, code block, or quote to edit immediately, toggle full Markdown source (`Ctrl+E`), or co-edit the same local `.md` files with the Agent in real time (with instant hot-sync and `conversation://` / `file://` jump links).

  <p align="center">
    <img src="./assets/feature-1-en.webp" alt="Live Markdown Block Preview, Nested Lists & Function Reference Table" width="100%" />
  </p>

- **LaTeX Math Rendering & `0ms` Syntax Autocomplete**:
  - **Full Offline KaTeX Engine**: Supports inline `$...$` and centered display `$$...$$` math blocks (with live formula preview while editing source), bundled with `mhchem` chemical equations (`\ce{...}`), `physics`-style calculus/vector macros, cross-block `\gdef` custom macros, and `copy-tex` LaTeX source copying.
  - **Instant `\command` Autocomplete & Brace Tab-Jump**: Typing `\` inside any formula pops up a `0ms` completion menu across **950+ official KaTeX commands and environments** with live rendered symbol previews; press `Tab` / `Enter` to insert and land inside `{}` braces, and press `Tab` to jump across arguments (plus `￥￥` → `$|$` auto-conversion for Chinese IME).

  <p align="center">
    <img src="./assets/feature-2-en.webp" alt="Live Math Block Preview & 0ms LaTeX Command Autocomplete" width="100%" />
  </p>

- **Cross-Conversation Persistent Reference (`@@` Context Selection Box)**: Type `@@` on any line to spawn an upward-draggable selection frame and control exactly what the Agent sees across turns and conversations:
  - **Mode B · Cross-Conversation Persistent Snippet**: Pins the selected text across **both multi-turn chats and newly opened conversations** without re-selecting (injecting only the selected snippet with zero outside file or path exposure, backed by per-conversation `SHA-1` hash deduplication so zero duplicate tokens are wasted, and auto-refreshing if you edit the pinned text).
  - **Mode A · Single-Turn Line Reference (Default)**: Sends only the file URI and line range (`#L start-end`) for a single chat turn; the blue frame automatically turns gray once consumed.

  <p align="center">
    <img src="./assets/feature-3-en.webp" alt="@@ Draggable Context Selection" width="100%" />
  </p>

- **Agent Access Locks (`PreToolUse` Engine Guard)**:
  - Independent toggles for **Allow Agent to Read Notes** and **Allow Agent to Edit Notes**.
  - **Dynamic Focus Busy-Lock**: Automatically pauses Agent writes while your cursor is focused inside the notebook with unsaved edits, resuming as soon as you save or move focus away.
- **Multi-Note Management & Flexible Storage**:
  - Create, search, switch, inline-rename, and delete notes with automatic local saving.
  - Follows `<workspace>/notes` by default, or points to any fixed local folder via the built-in directory browser.

  <p align="center">
    <img src="./assets/feature-4-en.webp" alt="Multi-Note Slide-Over Drawer & PreToolUse Access Locks" width="100%" />
  </p>

- **Host Light / Dark Theme & Sub-Theme Adaptation + Bilingual UI**: Dynamically inherits Antigravity's semantic design tokens (`--background`, `--card`, `--foreground`, `--primary`, `--border`), seamlessly adapting surfaces, cards, borders, scrollbars, active highlights, and KaTeX math rendering in real time to the host's **Light theme, Dark theme, and all of their corresponding sub-themes** — alongside instant English and Simplified Chinese UI switching.

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
