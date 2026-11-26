/**
 * Hot-reloadable API handlers for `md-notes` sidecar.
 * Loaded dynamically by `main.mjs` whenever this file's `mtimeMs` changes,
 * keeping `SidecarApp`'s HTTP port alive across backend updates.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, extname, isAbsolute, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAX_NOTE_BYTES = 5 * 1024 * 1024; // 5 MiB guard

function getSettingsDir() {
  const envDir = String(process.env.ANTIGRAVITY_EXECUTABLE_DATA_DIR || '').trim();
  return envDir || join(__dirname, '.data');
}

function getSettingsFile() {
  return join(getSettingsDir(), 'settings.json');
}

function getBusyLockFile() {
  return join(getSettingsDir(), 'busy-lock.json');
}

function getSelectionFile() {
  return join(getSettingsDir(), 'selection-state.json');
}

function loadRawSettingsObj() {
  try {
    const raw = readFileSync(getSettingsFile(), 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    // ignore
  }
  return {};
}

function loadSettings() {
  const parsed = loadRawSettingsObj();
  return {
    mode: parsed.mode === 'custom' ? 'custom' : 'workspace',
    customDir: typeof parsed.customDir === 'string' ? parsed.customDir.trim() : '',
    workspaceSubdir:
      typeof parsed.workspaceSubdir === 'string' ? parsed.workspaceSubdir.trim() : 'notes',
    agentRead: parsed.agentRead !== false,
    agentWrite: parsed.agentWrite !== false,
    quoteMode: parsed.quoteMode === 'modeB' ? 'modeB' : 'modeA',
  };
}

function saveSettings(next) {
  const dir = getSettingsDir();
  mkdirSync(dir, { recursive: true });
  const rawPrev = loadRawSettingsObj();
  const current = loadSettings();
  const normalized = {
    ...rawPrev,
    mode: next.mode !== undefined ? (next.mode === 'custom' ? 'custom' : 'workspace') : current.mode,
    customDir:
      next.customDir !== undefined ? String(next.customDir || '').trim() : current.customDir,
    workspaceSubdir:
      next.workspaceSubdir !== undefined
        ? String(next.workspaceSubdir || '').trim()
        : current.workspaceSubdir,
    agentRead: next.agentRead !== undefined ? Boolean(next.agentRead) : current.agentRead,
    agentWrite: next.agentWrite !== undefined ? Boolean(next.agentWrite) : current.agentWrite,
    quoteMode:
      next.quoteMode !== undefined
        ? next.quoteMode === 'modeB'
          ? 'modeB'
          : 'modeA'
        : current.quoteMode,
  };
  writeFileSync(getSettingsFile(), JSON.stringify(normalized, null, 2), 'utf8');
  return normalized;
}

function writeBusyLock(focusedAndUnsaved, activeNote = '') {
  const dir = getSettingsDir();
  mkdirSync(dir, { recursive: true });
  const state = {
    focusedAndUnsaved: Boolean(focusedAndUnsaved),
    activeNote: String(activeNote || ''),
    updatedAt: Date.now(),
  };
  writeFileSync(getBusyLockFile(), JSON.stringify(state), 'utf8');
  return state;
}

function loadSelectionState() {
  try {
    const raw = readFileSync(getSelectionFile(), 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // No selection yet
  }
  return { active: false, consumed: false };
}

function saveSelectionState(next) {
  const dir = getSettingsDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(getSelectionFile(), JSON.stringify(next, null, 2), 'utf8');
  return next;
}

export function decodeFileUriToPath(uri) {
  if (!uri || typeof uri !== 'string') return '';
  const trimmed = uri.trim();
  if (!trimmed) return '';
  if (!trimmed.startsWith('file://')) {
    return isAbsolute(trimmed) ? normalize(trimmed) : '';
  }
  try {
    return normalize(fileURLToPath(trimmed));
  } catch {
    try {
      let decoded = decodeURIComponent(trimmed.replace(/^file:\/\//i, ''));
      if (/^\/[a-zA-Z]:/.test(decoded)) {
        decoded = decoded.slice(1);
      }
      return normalize(decoded);
    } catch {
      return '';
    }
  }
}

function sanitizeSubdir(sub) {
  const cleaned = String(sub || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');
  if (!cleaned) return '';
  const parts = cleaned.split('/').filter((p) => p && p !== '.' && p !== '..');
  return parts.join(sep);
}

function resolveStorageInfo(workspaceUri) {
  const settings = loadSettings();
  const workspacePath = decodeFileUriToPath(workspaceUri);
  const safeSub = sanitizeSubdir(settings.workspaceSubdir);
  const fallbackDir = join(homedir(), 'Documents', 'AntigravityNotes');

  const defaultDir = workspacePath
    ? safeSub
      ? join(workspacePath, safeSub)
      : workspacePath
    : fallbackDir;

  let activeDir = defaultDir;
  let effectiveMode = 'workspace';

  if (settings.mode === 'custom' && settings.customDir && isAbsolute(settings.customDir)) {
    activeDir = normalize(settings.customDir);
    effectiveMode = 'custom';
  }

  return {
    mode: settings.mode,
    effectiveMode,
    customDir: settings.customDir,
    workspaceSubdir: safeSub,
    agentRead: settings.agentRead,
    agentWrite: settings.agentWrite,
    quoteMode: settings.quoteMode,
    workspacePath,
    defaultDir,
    fallbackDir,
    activeDir,
    activeDirExists: existsSync(activeDir),
  };
}

function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

const INVALID_CHARS_RE = /[<>:"/\\|?*\x00-\x1F]/g;
const WINDOWS_RESERVED_RE = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

export function sanitizeNoteFilename(input) {
  let raw = String(input || '').trim();
  raw = basename(raw.replace(/\\/g, '/'));
  raw = raw.replace(INVALID_CHARS_RE, '').trim();
  raw = raw.replace(/^\.+/, '').replace(/\.+$/, '').trim();
  if (!raw) {
    throw new Error('笔记文件名不能为空');
  }
  if (!raw.toLowerCase().endsWith('.md')) {
    raw += '.md';
  }
  const stem = raw.slice(0, -3).trim();
  if (!stem || WINDOWS_RESERVED_RE.test(stem)) {
    throw new Error('文件名不合法，请换一个名称');
  }
  if (raw.length > 120) {
    throw new Error('文件名过长（最多 120 个字符）');
  }
  return `${stem}.md`;
}

function resolveContainedFile(activeDir, filename) {
  const safeName = sanitizeNoteFilename(filename);
  const root = resolve(activeDir);
  const target = resolve(root, safeName);
  const prefix = root.endsWith(sep) ? root : root + sep;
  if (!target.startsWith(prefix)) {
    throw new Error('不允许访问存储目录之外的文件');
  }
  return { safeName, fullPath: target };
}

function extractPreview(content) {
  const lines = String(content || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^---+$/.test(l));
  if (!lines.length) return '空笔记';
  const clean = lines
    .slice(0, 2)
    .join(' · ')
    .replace(/^#+\s*/, '')
    .replace(/[*_`~>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.slice(0, 72) || '空笔记';
}

function listNotesInDir(activeDir) {
  if (!existsSync(activeDir)) {
    return [];
  }
  let entries;
  try {
    entries = readdirSync(activeDir, { withFileTypes: true });
  } catch (err) {
    throw new Error(`无法读取目录 ${activeDir}: ${err.message}`);
  }

  const notes = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (extname(entry.name).toLowerCase() !== '.md') continue;
    const fullPath = join(activeDir, entry.name);
    try {
      const st = statSync(fullPath);
      let preview = '';
      if (st.size > 0 && st.size <= MAX_NOTE_BYTES) {
        const snippet = readFileSync(fullPath, 'utf8').slice(0, 600);
        preview = extractPreview(snippet);
      } else if (st.size === 0) {
        preview = '空笔记';
      } else {
        preview = '文件较大';
      }
      notes.push({
        name: entry.name,
        title: entry.name.replace(/\.md$/i, ''),
        updatedAt: st.mtimeMs,
        size: st.size,
        preview,
      });
    } catch {
      // Skip unreadable file
    }
  }
  notes.sort((a, b) => b.updatedAt - a.updatedAt);
  return notes;
}

function computeDirDigest(activeDir) {
  if (!existsSync(activeDir)) return '0';
  try {
    const entries = readdirSync(activeDir, { withFileTypes: true });
    const parts = [];
    for (const e of entries) {
      if (!e.isFile() || extname(e.name).toLowerCase() !== '.md') continue;
      try {
        const st = statSync(join(activeDir, e.name));
        parts.push(`${e.name}:${Math.round(st.mtimeMs)}:${st.size}`);
      } catch {
        // ignore
      }
    }
    parts.sort();
    return parts.join('|') || 'empty';
  } catch {
    return 'err';
  }
}

function browseDirectories(targetPath) {
  const raw = String(targetPath || '').trim();
  if (!raw) {
    if (process.platform === 'win32') {
      const drives = [];
      for (let code = 65; code <= 90; code++) {
        const drive = `${String.fromCharCode(code)}:\\`;
        try {
          if (existsSync(drive)) {
            drives.push({ name: drive, path: drive });
          }
        } catch {
          // ignore unavailable drive
        }
      }
      return { current: '', parent: '', dirs: drives };
    }
    return browseDirectories('/');
  }

  const resolved = normalize(resolve(raw));
  if (!existsSync(resolved)) {
    throw new Error(`目录不存在：${resolved}`);
  }
  const st = statSync(resolved);
  if (!st.isDirectory()) {
    throw new Error(`不是有效目录：${resolved}`);
  }

  const parentDir = dirname(resolved);
  const parent = parentDir !== resolved ? parentDir : '';

  const dirs = [];
  const entries = readdirSync(resolved, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') && entry.name !== '.notes') continue;
    dirs.push({
      name: entry.name,
      path: join(resolved, entry.name),
    });
  }
  dirs.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  return { current: resolved, parent, dirs };
}

function defaultNoteName() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} 笔记.md`;
}

export const handlers = {
  getConfig(data = {}) {
    return resolveStorageInfo(data.workspaceUri);
  },

  updateConfig(data = {}) {
    const current = loadSettings();
    const mode =
      data.mode !== undefined ? (data.mode === 'custom' ? 'custom' : 'workspace') : current.mode;
    const customDir =
      data.customDir !== undefined ? String(data.customDir || '').trim() : current.customDir;
    const workspaceSubdir =
      data.workspaceSubdir !== undefined
        ? sanitizeSubdir(data.workspaceSubdir)
        : current.workspaceSubdir;
    const agentRead = data.agentRead !== undefined ? Boolean(data.agentRead) : current.agentRead;
    const agentWrite =
      data.agentWrite !== undefined ? Boolean(data.agentWrite) : current.agentWrite;
    const quoteMode =
      data.quoteMode !== undefined
        ? data.quoteMode === 'modeB'
          ? 'modeB'
          : 'modeA'
        : current.quoteMode;

    if (mode === 'custom') {
      if (!customDir) {
        throw new Error('请输入自定义存储目录的绝对路径');
      }
      if (!isAbsolute(customDir)) {
        throw new Error('自定义目录必须是绝对路径（例如 C:\\Notes 或 D:\\Study\\Notes）');
      }
      const norm = normalize(customDir);
      if (existsSync(norm)) {
        if (!statSync(norm).isDirectory()) {
          throw new Error('指定路径已存在且不是文件夹');
        }
      } else {
        mkdirSync(norm, { recursive: true });
      }
      saveSettings({ mode: 'custom', customDir: norm, workspaceSubdir, agentRead, agentWrite, quoteMode });
    } else {
      saveSettings({ mode: 'workspace', customDir, workspaceSubdir, agentRead, agentWrite, quoteMode });
    }

    const existingSel = loadSelectionState();
    if (existingSel.active && quoteMode !== current.quoteMode) {
      saveSelectionState({
        ...existingSel,
        consumed: false,
        deliveredByConv: {},
      });
    }

    return resolveStorageInfo(data.workspaceUri);
  },

  updateLockState(data = {}) {
    return writeBusyLock(Boolean(data.focusedAndUnsaved), data.activeNote || '');
  },

  getSelection() {
    return loadSelectionState();
  },

  updateSelection(data = {}) {
    const existing = loadSelectionState();
    if (!data.active) {
      return saveSelectionState({
        active: false,
        consumed: false,
        deliveredByConv: existing.deliveredByConv || {},
        updatedAt: Date.now(),
      });
    }

    const info = resolveStorageInfo(data.workspaceUri);
    const { safeName, fullPath } = resolveContainedFile(info.activeDir, data.noteName);
    let fileUri = '';
    try {
      fileUri = pathToFileURL(fullPath).href;
    } catch {
      fileUri = fullPath;
    }

    const preserveConsumed = Boolean(data.preserveConsumed && existing.consumed);
    const nextState = {
      active: true,
      consumed: info.quoteMode === 'modeB' ? false : preserveConsumed,
      noteName: safeName,
      activeDir: info.activeDir,
      filePath: fullPath,
      fileUri,
      startBlockIdx: Math.max(0, Number(data.startBlockIdx) || 0),
      endBlockIdx: Math.max(0, Number(data.endBlockIdx) || 0),
      startLine: Math.max(1, Number(data.startLine) || 1),
      endLine: Math.max(1, Number(data.endLine) || 1),
      selectedText: String(data.selectedText || ''),
      deliveredByConv: data.resetDelivery ? {} : existing.deliveredByConv || {},
      updatedAt: Date.now(),
    };
    return saveSelectionState(nextState);
  },

  poll(data = {}) {
    const info = resolveStorageInfo(data.workspaceUri);
    const dirDigest = computeDirDigest(info.activeDir);
    const sel = loadSelectionState();
    let noteMtime = 0;
    let noteExists = false;
    if (data.name) {
      try {
        const { fullPath } = resolveContainedFile(info.activeDir, data.name);
        if (existsSync(fullPath)) {
          noteExists = true;
          noteMtime = statSync(fullPath).mtimeMs;
        }
      } catch {
        // ignore
      }
    }
    return {
      dirDigest,
      noteExists,
      noteMtime,
      agentRead: info.agentRead,
      agentWrite: info.agentWrite,
      quoteMode: info.quoteMode,
      selection: {
        active: Boolean(sel.active),
        consumed: Boolean(sel.consumed),
        noteName: sel.noteName || '',
        activeDir: sel.activeDir || '',
        startBlockIdx: sel.startBlockIdx ?? 0,
        endBlockIdx: sel.endBlockIdx ?? 0,
      },
    };
  },

  listNotes(data = {}) {
    const info = resolveStorageInfo(data.workspaceUri);
    const notes = listNotesInDir(info.activeDir);
    return {
      ...info,
      dirDigest: computeDirDigest(info.activeDir),
      selection: loadSelectionState(),
      notes,
    };
  },

  readNote(data = {}) {
    const info = resolveStorageInfo(data.workspaceUri);
    const { safeName, fullPath } = resolveContainedFile(info.activeDir, data.name);
    if (!existsSync(fullPath)) {
      throw new Error(`找不到笔记：${safeName}`);
    }
    const st = statSync(fullPath);
    if (st.size > MAX_NOTE_BYTES) {
      throw new Error('该笔记文件超过 5MB，暂不支持在侧边栏直接打开');
    }
    const content = readFileSync(fullPath, 'utf8');
    return {
      name: safeName,
      title: safeName.replace(/\.md$/i, ''),
      content,
      updatedAt: st.mtimeMs,
      dirDigest: computeDirDigest(info.activeDir),
      activeDir: info.activeDir,
    };
  },

  createNote(data = {}) {
    const info = resolveStorageInfo(data.workspaceUri);
    ensureDir(info.activeDir);
    const desired = sanitizeNoteFilename(data.name || defaultNoteName());
    let finalName = desired;
    let { fullPath } = resolveContainedFile(info.activeDir, desired);

    if (existsSync(fullPath)) {
      const stem = desired.slice(0, -3);
      let idx = 2;
      while (idx < 1000) {
        const candidate = `${stem} (${idx}).md`;
        const check = resolveContainedFile(info.activeDir, candidate);
        if (!existsSync(check.fullPath)) {
          finalName = check.safeName;
          fullPath = check.fullPath;
          break;
        }
        idx++;
      }
    }

    const title = finalName.replace(/\.md$/i, '');
    const initialContent =
      typeof data.content === 'string' ? data.content : `# ${title}\n\n`;
    writeFileSync(fullPath, initialContent, 'utf8');
    const st = statSync(fullPath);
    return {
      ok: true,
      name: finalName,
      title,
      content: initialContent,
      updatedAt: st.mtimeMs,
      dirDigest: computeDirDigest(info.activeDir),
      activeDir: info.activeDir,
    };
  },

  saveNote(data = {}) {
    const info = resolveStorageInfo(data.workspaceUri);
    ensureDir(info.activeDir);
    const { safeName, fullPath } = resolveContainedFile(info.activeDir, data.name);
    const content = typeof data.content === 'string' ? data.content : '';
    if (Buffer.byteLength(content, 'utf8') > MAX_NOTE_BYTES) {
      throw new Error('笔记内容超过 5MB 限制');
    }
    writeFileSync(fullPath, content, 'utf8');
    writeBusyLock(false, safeName);
    const st = statSync(fullPath);
    return {
      ok: true,
      name: safeName,
      title: safeName.replace(/\.md$/i, ''),
      updatedAt: st.mtimeMs,
      size: st.size,
      preview: extractPreview(content),
      dirDigest: computeDirDigest(info.activeDir),
      activeDir: info.activeDir,
    };
  },

  renameNote(data = {}) {
    const info = resolveStorageInfo(data.workspaceUri);
    const src = resolveContainedFile(info.activeDir, data.oldName);
    const dst = resolveContainedFile(info.activeDir, data.newName);
    if (!existsSync(src.fullPath)) {
      throw new Error(`找不到原笔记：${src.safeName}`);
    }
    if (src.safeName.toLowerCase() === dst.safeName.toLowerCase()) {
      if (src.safeName !== dst.safeName) {
        renameSync(src.fullPath, dst.fullPath);
      }
      const st = statSync(dst.fullPath);
      return {
        ok: true,
        name: dst.safeName,
        title: dst.safeName.replace(/\.md$/i, ''),
        updatedAt: st.mtimeMs,
      };
    }
    if (existsSync(dst.fullPath)) {
      throw new Error(`已存在同名笔记：${dst.safeName}`);
    }
    renameSync(src.fullPath, dst.fullPath);
    const st = statSync(dst.fullPath);
    return {
      ok: true,
      name: dst.safeName,
      title: dst.safeName.replace(/\.md$/i, ''),
      updatedAt: st.mtimeMs,
    };
  },

  deleteNote(data = {}) {
    const info = resolveStorageInfo(data.workspaceUri);
    const { safeName, fullPath } = resolveContainedFile(info.activeDir, data.name);
    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
    }
    const sel = loadSelectionState();
    if (sel.active && sel.noteName === safeName) {
      saveSelectionState({ ...sel, active: false, consumed: false });
    }
    return { ok: true, deleted: safeName };
  },

  browse(data = {}) {
    return browseDirectories(data.path);
  },
};
