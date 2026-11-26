/**
 * Lifecycle Hook Handler for `md-notes` (`PreToolUse` & `PreInvocation`).
 *
 * 1. `PreToolUse`:
 *    - Blocks read tools if `agentRead === false`.
 *    - Blocks write/edit tools if `agentWrite === false` or user has active focus + unsaved edits.
 *
 * 2. `PreInvocation` (`@@` Selection Box Context Injection):
 *    - Mode A (`quoteMode === "modeA"`, default, mutually exclusive with Mode B):
 *      Sends ONLY a 1-turn file URI + line-range index pointer to the host/model,
 *      then immediately marks `selection.consumed = true` so the selection box in
 *      the notebook UI automatically turns gray after 1 turn.
 *    - Mode B (`quoteMode === "modeB"`, mutually exclusive with Mode A):
 *      Directly injects ONLY the selected raw snippet text (zero outside file content,
 *      zero file path leakage), staying blue & persistently active across turns
 *      with per-conversation content-hash deduplication until the user deletes the box.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, isAbsolute, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = dirname(__dirname);
const BUSY_LOCK_TTL_MS = 8000;

const READ_TOOLS = new Set([
  'read_file',
  'view_file',
  'view_file_outline',
  'view_code_item',
  'grep_search',
  'find_by_name',
  'list_dir',
]);

const WRITE_TOOLS = new Set([
  'write_file',
  'write_to_file',
  'edit_file',
  'replace_file_content',
  'multi_replace_file_content',
  'delete_file',
]);

function writeJsonStdout(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function findCandidateStateDirs(payload) {
  const dirs = [];
  const envExec = String(process.env.ANTIGRAVITY_EXECUTABLE_DATA_DIR || '').trim();
  if (envExec) {
    dirs.push(envExec);
  }
  const tp = String(payload?.transcriptPath || '').trim();
  if (tp) {
    for (let d = tp; d && d !== dirname(d); d = dirname(d)) {
      if (basename(d).toLowerCase() === 'brain') {
        const appData = dirname(d);
        dirs.push(join(appData, 'sidecar_data', 'md-notes', 'notebook', 'data'));
        break;
      }
    }
  }
  const pData = String(process.env.PLUGIN_DATA || '').trim();
  if (pData) {
    const parent = dirname(pData);
    if (basename(parent).toLowerCase() === 'plugin_data') {
      dirs.push(join(dirname(parent), 'sidecar_data', 'md-notes', 'notebook', 'data'));
    }
    dirs.push(pData);
  }
  const home = homedir();
  for (const product of ['antigravity', 'antigravity-ide', 'antigravity-cli']) {
    dirs.push(join(home, '.gemini', product, 'sidecar_data', 'md-notes', 'notebook', 'data'));
  }
  dirs.push(join(PLUGIN_ROOT, 'sidecars', 'notebook', '.data'));
  return dirs;
}

function readJsonIfExists(filePath) {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function resolvePrimaryStateDir(payload) {
  const dirs = findCandidateStateDirs(payload);
  for (const d of dirs) {
    if (existsSync(join(d, 'settings.json')) || existsSync(join(d, 'selection-state.json'))) {
      return d;
    }
  }
  return dirs[0];
}

function loadAllState(payload) {
  const dirs = findCandidateStateDirs(payload);
  let settings = null;
  let busy = null;
  let selection = null;
  let selectionDir = dirs[0];

  for (const d of dirs) {
    if (!settings) settings = readJsonIfExists(join(d, 'settings.json'));
    if (!busy) busy = readJsonIfExists(join(d, 'busy-lock.json'));
    if (!selection) {
      const sel = readJsonIfExists(join(d, 'selection-state.json'));
      if (sel) {
        selection = sel;
        selectionDir = d;
      }
    }
  }

  return {
    stateDir: selection ? selectionDir : resolvePrimaryStateDir(payload),
    settings: {
      mode: settings?.mode === 'custom' ? 'custom' : 'workspace',
      customDir: typeof settings?.customDir === 'string' ? settings.customDir.trim() : '',
      workspaceSubdir:
        typeof settings?.workspaceSubdir === 'string' ? settings.workspaceSubdir.trim() : 'notes',
      agentRead: settings?.agentRead !== false,
      agentWrite: settings?.agentWrite !== false,
      quoteMode: settings?.quoteMode === 'modeB' ? 'modeB' : 'modeA',
    },
    busy: busy && typeof busy === 'object' ? busy : null,
    selection: selection && typeof selection === 'object' ? selection : null,
  };
}

function saveSelectionFile(stateDir, nextSel) {
  try {
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(join(stateDir, 'selection-state.json'), JSON.stringify(nextSel, null, 2), 'utf8');
  } catch {
    // ignore write failure in hook
  }
}

function sanitizeSubdir(sub) {
  const cleaned = String(sub || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');
  if (!cleaned) return '';
  return cleaned
    .split('/')
    .filter((p) => p && p !== '.' && p !== '..')
    .join(sep);
}

function decodeWorkspacePath(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('file://')) {
    try {
      return normalize(fileURLToPath(trimmed));
    } catch {
      return '';
    }
  }
  return isAbsolute(trimmed) ? normalize(trimmed) : '';
}

function resolveProtectedDirs(payload, settings) {
  if (settings.mode === 'custom' && settings.customDir && isAbsolute(settings.customDir)) {
    return [{ dir: resolve(settings.customDir), rootMode: false }];
  }

  const wsList = Array.isArray(payload?.workspacePaths) ? [...payload.workspacePaths] : [];
  if (payload?.cwd && !wsList.includes(payload.cwd)) {
    wsList.push(payload.cwd);
  }
  const sub = sanitizeSubdir(settings.workspaceSubdir);
  const out = [];
  for (const rawWs of wsList) {
    const ws = decodeWorkspacePath(rawWs);
    if (!ws) continue;
    if (sub) {
      out.push({ dir: resolve(ws, sub), rootMode: false });
    } else {
      out.push({ dir: resolve(ws), rootMode: true });
    }
  }
  if (!out.length) {
    out.push({ dir: resolve(homedir(), 'Documents', 'AntigravityNotes'), rootMode: false });
  }
  return out;
}

function normCase(p) {
  const r = resolve(p);
  return process.platform === 'win32' ? r.toLowerCase() : r;
}

function pathTouchesProtected(targetPath, protectedList) {
  if (!targetPath || typeof targetPath !== 'string') return false;
  let abs;
  try {
    abs = normCase(targetPath);
  } catch {
    return false;
  }

  for (const item of protectedList) {
    const dirNorm = normCase(item.dir);
    const prefix = dirNorm.endsWith(sep) ? dirNorm : dirNorm + sep;
    if (item.rootMode) {
      if (dirname(abs) === dirNorm.replace(/[\\/]+$/, '') && abs.endsWith('.md')) {
        const base = basename(abs).toLowerCase();
        if (
          ![
            'gemini.md',
            'agents.md',
            'claude.md',
            'readme.md',
            'license.md',
            'changelog.md',
            'contributing.md',
          ].includes(base)
        ) {
          return true;
        }
      }
    } else if (abs === dirNorm || abs.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}

function extractToolPaths(args, cwd) {
  if (!args || typeof args !== 'object') return [];
  const candidates = [
    args.Path,
    args.path,
    args.TargetFile,
    args.targetFile,
    args.AbsolutePath,
    args.absolutePath,
    args.SearchPath,
    args.searchPath,
    args.DirectoryPath,
    args.directoryPath,
    args.SearchDirectory,
    args.searchDirectory,
  ];
  if (Array.isArray(args.Paths)) candidates.push(...args.Paths);
  const out = [];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) {
      const p = c.trim();
      out.push(isAbsolute(p) ? p : resolve(cwd || process.cwd(), p));
    }
  }
  return out;
}

function commandTouchesProtected(cmdLine, protectedList) {
  if (!cmdLine || typeof cmdLine !== 'string') return { touches: false, writes: false };
  const lowerCmd = process.platform === 'win32' ? cmdLine.toLowerCase() : cmdLine;

  let touches = false;
  for (const item of protectedList) {
    if (item.rootMode) continue;
    const d1 = process.platform === 'win32' ? item.dir.toLowerCase() : item.dir;
    const d2 = d1.replace(/\\/g, '/');
    const subName = basename(d1);
    if (
      lowerCmd.includes(d1) ||
      lowerCmd.includes(d2) ||
      new RegExp(
        `(^|[\\\\/\\s"'])${subName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\\\/\\s"']|$)`
      ).test(lowerCmd)
    ) {
      touches = true;
      break;
    }
  }
  if (!touches) return { touches: false, writes: false };

  const writePattern =
    /\b(set-content|add-content|out-file|remove-item|del|rm|mv|move-item|cp|copy-item|new-item|ni|ri|sc|ac)\b|>>?|writefilesync|writefile|unlink/i;
  return {
    touches: true,
    writes: writePattern.test(cmdLine),
  };
}

// ---------------------------------------------------------------------------
// 1. PreToolUse Evaluation
// ---------------------------------------------------------------------------

export function evaluateGuard(payload) {
  const toolName = String(payload?.toolCall?.name || '').toLowerCase();
  const args = payload?.toolCall?.args || {};
  const cwd = payload?.cwd || process.cwd();

  const { settings, busy } = loadAllState(payload);
  const isBusy =
    Boolean(busy?.focusedAndUnsaved) &&
    typeof busy?.updatedAt === 'number' &&
    Date.now() - busy.updatedAt < BUSY_LOCK_TTL_MS;

  if (settings.agentRead && settings.agentWrite && !isBusy) {
    return { decision: 'allow' };
  }

  const protectedList = resolveProtectedDirs(payload, settings);

  if (READ_TOOLS.has(toolName)) {
    if (!settings.agentRead) {
      const paths = extractToolPaths(args, cwd);
      if (paths.some((p) => pathTouchesProtected(p, protectedList))) {
        return {
          decision: 'deny',
          reason: '笔记本已在设置中关闭「允许 Agent 读取笔记」权限锁，无法读取笔记目录。',
        };
      }
    }
    return { decision: 'allow' };
  }

  if (WRITE_TOOLS.has(toolName)) {
    const paths = extractToolPaths(args, cwd);
    if (paths.some((p) => pathTouchesProtected(p, protectedList))) {
      if (!settings.agentWrite) {
        return {
          decision: 'deny',
          reason: '笔记本已在设置中关闭「允许 Agent 修改笔记」权限锁，禁止写入或修改笔记。',
        };
      }
      if (isBusy) {
        return {
          decision: 'deny',
          reason:
            '用户当前键盘焦点正停留在右侧笔记本中且存在未保存内容，已暂停 Agent 写入；请等用户移开光标或保存后再试。',
        };
      }
    }
    return { decision: 'allow' };
  }

  if (toolName === 'run_command') {
    const cmdCheck = commandTouchesProtected(args.CommandLine || args.command || '', protectedList);
    if (cmdCheck.touches) {
      if (!settings.agentRead) {
        return {
          decision: 'deny',
          reason: '笔记本已开启读取权限锁，禁止通过命令行访问笔记目录。',
        };
      }
      if (cmdCheck.writes && !settings.agentWrite) {
        return {
          decision: 'deny',
          reason: '笔记本已开启修改权限锁，禁止通过命令行修改笔记目录。',
        };
      }
      if (cmdCheck.writes && isBusy) {
        return {
          decision: 'deny',
          reason: '用户当前光标正在右侧笔记本中编辑且尚未保存，已暂停命令行写入笔记目录。',
        };
      }
    }
  }

  return { decision: 'allow' };
}

// ---------------------------------------------------------------------------
// 2. PreInvocation Evaluation (Mode A vs Mode B, strictly mutually exclusive)
// ---------------------------------------------------------------------------

function hashText(str) {
  return createHash('sha1').update(String(str || ''), 'utf8').digest('hex').slice(0, 16);
}

export function evaluatePreInvocation(payload) {
  // Only fire at the start of a user turn (invocationNum === 0), never mid-tool-loop
  if (Number(payload?.invocationNum || 0) > 0) {
    return {};
  }

  const { stateDir, settings, selection } = loadAllState(payload);
  if (!selection) return {};

  const convId = String(payload?.conversationId || 'default');
  const deliveredMap =
    selection.deliveredByConv && typeof selection.deliveredByConv === 'object'
      ? { ...selection.deliveredByConv }
      : {};

  // Active Mode is strictly governed by settings.quoteMode ('modeA' vs 'modeB')
  const mode = settings.quoteMode === 'modeB' ? 'modeB' : 'modeA';

  if (mode === 'modeA') {
    // Mode A: Single-turn file URI + line range index reference.
    // Once delivered for 1 turn, mark `consumed = true` so the box turns gray!
    if (!selection.active || selection.consumed) {
      return {};
    }

    const filePath = String(selection.filePath || '').trim();
    const noteName = String(selection.noteName || '笔记.md').trim();
    const startLine = Number(selection.startLine) || 1;
    const endLine = Number(selection.endLine) || startLine;
    let fileUri = String(selection.fileUri || '').trim();
    if (!fileUri && filePath) {
      try {
        fileUri = pathToFileURL(filePath).href;
      } catch {
        fileUri = filePath;
      }
    }

    // Mark consumed immediately so this reference only fires for 1 turn and UI turns gray
    const updatedSel = {
      ...selection,
      consumed: true,
      consumedAt: Date.now(),
    };
    saveSelectionFile(stateDir, updatedSel);

    const lineLabel = startLine === endLine ? `第 ${startLine} 行` : `第 ${startLine}–${endLine} 行`;
    return {
      injectSteps: [
        {
          systemMessage: {
            systemMessage:
              `用户在右侧笔记本中框选了文档索引：` +
              `${filePath || fileUri}（${lineLabel}，URI: ${fileUri}#L${startLine}-L${endLine}）。` +
              `请根据该路径与行号范围定位并读取对应段落来回答本轮问题。`,
          },
        },
      ],
    };
  }

  // Mode B: Persistent direct pure-snippet injection (zero outside file content, zero file path).
  // Stays blue across turns; uses per-conversation hash deduplication to avoid wasting tokens.
  if (!selection.active) {
    // If previously injected in this conversation and user just deleted the box (`✕`), notify once
    if (deliveredMap[convId] && deliveredMap[convId] !== '__CLEARED__') {
      deliveredMap[convId] = '__CLEARED__';
      saveSelectionFile(stateDir, { ...selection, deliveredByConv: deliveredMap });
      return {
        injectSteps: [
          {
            systemMessage: {
              systemMessage:
                '用户已移除右侧笔记本中的固定选区片段',
            },
          },
        ],
      };
    }
    return {};
  }

  const snippet = String(selection.selectedText || '').trim();
  if (!snippet) return {};

  const digest = hashText(snippet);
  if (deliveredMap[convId] === digest) {
    // Exact same snippet is already in this conversation's history -> zero extra tokens!
    return {};
  }

  deliveredMap[convId] = digest;
  saveSelectionFile(stateDir, {
    ...selection,
    consumed: false, // Mode B never turns gray
    deliveredByConv: deliveredMap,
  });

  return {
    injectSteps: [
      {
        systemMessage: {
          systemMessage:
            `以下是用户在右侧笔记本中通过 \`@@\` 固定框选的参考内容：\n` +
            `"""\n${snippet}\n"""`,
        },
      },
    ],
  };
}

function isMain() {
  try {
    return resolve(process.argv[1] || '') === resolve(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMain()) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    raw += chunk;
  });
  process.stdin.on('end', () => {
    try {
      const payload = raw.trim() ? JSON.parse(raw) : {};
      const eventName = String(payload?.hookEventName || '');
      if (eventName === 'PreInvocation' || (!payload?.toolCall && payload?.invocationNum !== undefined)) {
        writeJsonStdout(evaluatePreInvocation(payload));
      } else {
        writeJsonStdout(evaluateGuard(payload));
      }
    } catch {
      writeJsonStdout({ decision: 'allow' });
    }
  });
  process.stdin.on('error', () => writeJsonStdout({ decision: 'allow' }));
}
