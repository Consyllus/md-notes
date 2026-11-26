(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);

  const el = {
    btnDrawer: $('btn-drawer'),
    btnTitle: $('btn-title'),
    inputTitle: $('input-title'),
    btnNew: $('btn-new'),
    btnMode: $('btn-mode'),
    btnSettings: $('btn-settings'),
    fmtBar: $('fmt-bar'),
    saveStatus: $('save-status'),
    emptyState: $('empty-state'),
    emptyDir: $('empty-dir'),
    btnEmptyCreate: $('btn-empty-create'),
    liveEditor: $('live-editor'),
    blocksRoot: $('blocks-root'),
    selectionBox: $('selection-box'),
    selDragBar: $('sel-drag-bar'),
    selBadge: $('sel-badge'),
    btnSelClose: $('btn-sel-close'),
    sourceEditor: $('source-editor'),
    btnLockBadge: $('btn-lock-badge'),
    btnQuoteBadge: $('btn-quote-badge'),
    btnDirIndicator: $('btn-dir-indicator'),
    wordCount: $('word-count'),
    drawerBackdrop: $('drawer-backdrop'),
    drawer: $('drawer'),
    btnDrawerNew: $('btn-drawer-new'),
    btnDrawerClose: $('btn-drawer-close'),
    inputSearch: $('input-search'),
    newNoteBox: $('new-note-box'),
    inputNewName: $('input-new-name'),
    btnNewConfirm: $('btn-new-confirm'),
    btnNewCancel: $('btn-new-cancel'),
    noteList: $('note-list'),
    btnDrawerSettings: $('btn-drawer-settings'),
    settingsBackdrop: $('settings-backdrop'),
    btnSettingsClose: $('btn-settings-close'),
    btnSettingsCancel: $('btn-settings-cancel'),
    btnSettingsSave: $('btn-settings-save'),
    cardQuoteA: $('card-quote-a'),
    cardQuoteB: $('card-quote-b'),
    chkAgentRead: $('chk-agent-read'),
    chkAgentWrite: $('chk-agent-write'),
    cardModeWorkspace: $('card-mode-workspace'),
    cardModeCustom: $('card-mode-custom'),
    inputWsSubdir: $('input-ws-subdir'),
    btnPresetNotes: $('btn-preset-notes'),
    btnPresetRoot: $('btn-preset-root'),
    wsResolvedPreview: $('ws-resolved-preview'),
    inputCustomDir: $('input-custom-dir'),
    btnBrowseToggle: $('btn-browse-toggle'),
    folderBrowser: $('folder-browser'),
    btnBrowseUp: $('btn-browse-up'),
    browserCurrent: $('browser-current'),
    btnBrowseSelect: $('btn-browse-select'),
    browserList: $('browser-list'),
    settingsError: $('settings-error'),
    toast: $('toast'),
  };

  let blockUidSeq = 1;
  const makeBlock = (type, props = {}) => ({
    id: `b${blockUidSeq++}`,
    type,
    text: '',
    ...props,
  });

  const state = {
    workspaceUri: '',
    storage: null,
    notes: [],
    currentName: '',
    blocks: [],
    activeBlockIndex: -1,
    sourceMode: false,
    dirty: false,
    saving: false,
    saveTimer: null,
    lastNoteMtime: 0,
    lastDirDigest: '',
    lastSentBusyLock: null,
    pollInFlight: false,
    searchQuery: '',
    confirmDeleteName: '',
    browserPath: '',
    browserParent: '',
    toastTimer: null,
    // @@ Selection Box State
    selBox: {
      active: false,
      unpinned: false,
      dragging: false,
      dragTopPx: null,
      consumed: false,
      noteName: '',
      topIdx: 0,
      anchorIdx: 0, // Fixed bottom-left anchor block index
    },
  };

  window.addEventListener('error', (e) => {
    console.error('[md-notes]', e.error || e.message);
    el.drawerBackdrop.classList.add('hidden');
    el.drawer.classList.remove('open');
    el.settingsBackdrop.classList.add('hidden');
  });

  // -------------------------------------------------------------------------
  // API Helpers
  // -------------------------------------------------------------------------

  async function apiGet(path, params = {}) {
    const url = new URL(path, window.location.origin);
    if (state.workspaceUri) {
      url.searchParams.set('workspaceUri', state.workspaceUri);
    }
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    }
    const fetcher = window.sidecar?.fetch ? window.sidecar.fetch.bind(window.sidecar) : fetch;
    const res = await fetcher(url.pathname + url.search, { method: 'GET' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `请求失败 (${res.status})`);
    return json;
  }

  async function apiPost(path, payload = {}) {
    const fetcher = window.sidecar?.fetch ? window.sidecar.fetch.bind(window.sidecar) : fetch;
    const body = JSON.stringify({
      ...payload,
      workspaceUri: state.workspaceUri,
    });
    const res = await fetcher(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `保存失败 (${res.status})`);
    return json;
  }

  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.remove('hidden');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      el.toast.classList.add('hidden');
    }, 2000);
  }

  // -------------------------------------------------------------------------
  // @@ Floating Selection Box Engine (Bottom-Left Anchor -> Drag Up -> Pin)
  // -------------------------------------------------------------------------

  function getActiveQuoteMode() {
    return state.storage?.quoteMode === 'modeB' ? 'modeB' : 'modeA';
  }

  function computeLineRangeAndText(topIdx, anchorIdx) {
    const safeTop = Math.max(0, Math.min(state.blocks.length - 1, topIdx));
    const safeBot = Math.max(safeTop, Math.min(state.blocks.length - 1, anchorIdx));

    let currentLine = 1;
    let startLine = 1;
    let endLine = 1;
    const selectedPieces = [];

    for (let i = 0; i < state.blocks.length; i++) {
      const serialized = serializeBlock(state.blocks[i]);
      const lineSpan = serialized.split('\n').length;
      if (i === safeTop) {
        startLine = currentLine;
      }
      if (i >= safeTop && i <= safeBot) {
        selectedPieces.push(serialized);
        endLine = currentLine + lineSpan - 1;
      }
      currentLine += lineSpan;
    }

    // Trim trailing completely blank line if user typed @@ on a fresh empty line below content
    while (selectedPieces.length > 1 && !selectedPieces[selectedPieces.length - 1].trim()) {
      selectedPieces.pop();
      endLine = Math.max(startLine, endLine - 1);
    }

    return {
      startBlockIdx: safeTop,
      endBlockIdx: safeBot,
      startLine,
      endLine,
      selectedText: selectedPieces.join('\n').trim(),
    };
  }

  function renderSelectionOverlay() {
    const sb = state.selBox;
    if (
      !sb.active ||
      state.sourceMode ||
      !state.currentName ||
      sb.noteName !== state.currentName ||
      !el.blocksRoot.children.length
    ) {
      el.selectionBox.classList.add('hidden');
      return;
    }

    const maxIdx = el.blocksRoot.children.length - 1;
    const safeAnchor = Math.max(0, Math.min(maxIdx, sb.anchorIdx));
    const safeTop = Math.max(0, Math.min(safeAnchor, sb.topIdx));
    const topEl = el.blocksRoot.children[safeTop];
    const botEl = el.blocksRoot.children[safeAnchor];
    if (!topEl || !botEl) {
      el.selectionBox.classList.add('hidden');
      return;
    }

    // Coordinates relative to #live-editor (blocksRoot offset + child offset)
    const rootTop = el.blocksRoot.offsetTop;
    const rootLeft = el.blocksRoot.offsetLeft;
    const anchorBottomPx = rootTop + botEl.offsetTop + botEl.offsetHeight + 3;
    const snappedTopPx = Math.max(4, rootTop + topEl.offsetTop - 3);
    const topPx =
      sb.dragging && typeof sb.dragTopPx === 'number'
        ? Math.min(anchorBottomPx - 24, Math.max(4, sb.dragTopPx))
        : snappedTopPx;

    const leftPx = Math.max(8, rootLeft + botEl.offsetLeft - 6);
    const widthPx = botEl.offsetWidth + 12;
    const heightPx = Math.max(24, anchorBottomPx - topPx);

    el.selectionBox.style.left = `${leftPx}px`;
    el.selectionBox.style.top = `${topPx}px`;
    el.selectionBox.style.width = `${widthPx}px`;
    el.selectionBox.style.height = `${heightPx}px`;

    const isModeB = getActiveQuoteMode() === 'modeB';
    const isConsumed = !isModeB && Boolean(sb.consumed);

    el.selectionBox.classList.remove('hidden');
    el.selectionBox.classList.toggle('is-unpinned', Boolean(sb.unpinned));
    el.selectionBox.classList.toggle('is-dragging', Boolean(sb.dragging));
    el.selectionBox.classList.toggle('is-consumed', isConsumed);

    const lineCount = safeAnchor - safeTop + 1;
    if (sb.dragging || sb.unpinned) {
      el.selBadge.textContent = `⇕ 向上拖拽框选（${lineCount} 块），松手固定`;
    } else if (isModeB) {
      el.selBadge.textContent = `📌 方式B · 常驻生效中（${lineCount} 块）`;
    } else if (isConsumed) {
      el.selBadge.textContent = `✓ 方式A · 已引用（拖拽可重激活）`;
    } else {
      el.selBadge.textContent = `📎 方式A · 待随下条消息引用（${lineCount} 块）`;
    }
  }

  async function syncSelectionToBackend({ resetDelivery = false, preserveConsumed = false } = {}) {
    const sb = state.selBox;
    if (!sb.active || !state.currentName) {
      await apiPost('/api/selection', { active: false }).catch(() => {});
      return;
    }
    const info = computeLineRangeAndText(sb.topIdx, sb.anchorIdx);
    await apiPost('/api/selection', {
      active: true,
      noteName: state.currentName,
      ...info,
      resetDelivery,
      preserveConsumed,
    }).catch(() => {});
  }

  function spawnSelectionBoxAt(anchorIdx) {
    state.selBox = {
      active: true,
      unpinned: true,
      dragging: false,
      dragTopPx: null,
      consumed: false,
      noteName: state.currentName,
      topIdx: anchorIdx,
      anchorIdx,
    };
    renderSelectionOverlay();
    // Immediately sync initial single-block selection so even without dragging it works
    void syncSelectionToBackend({ resetDelivery: true, preserveConsumed: false });
    showToast('已生成 @@ 选框：向上拖拽框选范围，松手固定');
  }

  function clearSelectionBox() {
    state.selBox.active = false;
    state.selBox.unpinned = false;
    state.selBox.dragging = false;
    state.selBox.consumed = false;
    renderSelectionOverlay();
    void apiPost('/api/selection', { active: false }).catch(() => {});
  }

  function setupSelectionDragEvents() {
    const startDrag = (e) => {
      if (e.target.closest('#btn-sel-close')) return;
      if (!state.selBox.active) return;
      // Only allow dragging from the top bar once pinned, or anywhere on the box while unpinned
      if (!state.selBox.unpinned && !e.target.closest('#sel-drag-bar')) return;

      e.preventDefault();
      e.stopPropagation();
      state.selBox.dragging = true;
      state.selBox.consumed = false;
      el.selectionBox.setPointerCapture?.(e.pointerId);
      renderSelectionOverlay();
    };

    const onMove = (e) => {
      if (!state.selBox.dragging) return;
      e.preventDefault();
      const editorRect = el.liveEditor.getBoundingClientRect();

      // Auto-scroll #live-editor when dragging near top or bottom edge
      if (e.clientY < editorRect.top + 28) {
        el.liveEditor.scrollTop = Math.max(0, el.liveEditor.scrollTop - 14);
      } else if (e.clientY > editorRect.bottom - 28) {
        el.liveEditor.scrollTop += 14;
      }

      const relY = e.clientY - editorRect.top + el.liveEditor.scrollTop;
      state.selBox.dragTopPx = relY;

      // Determine topIdx: earliest block from [0 .. anchorIdx] whose vertical midpoint >= relY
      const rootTop = el.blocksRoot.offsetTop;
      let matchedTop = state.selBox.anchorIdx;
      for (let i = state.selBox.anchorIdx; i >= 0; i--) {
        const bEl = el.blocksRoot.children[i];
        if (!bEl) continue;
        const bBottom = rootTop + bEl.offsetTop + bEl.offsetHeight * 0.75;
        if (relY <= bBottom) {
          matchedTop = i;
        } else {
          break;
        }
      }
      state.selBox.topIdx = matchedTop;
      renderSelectionOverlay();
    };

    const endDrag = (e) => {
      if (!state.selBox.dragging) return;
      e.preventDefault();
      state.selBox.dragging = false;
      state.selBox.unpinned = false;
      state.selBox.dragTopPx = null;
      state.selBox.consumed = false;
      el.selectionBox.releasePointerCapture?.(e.pointerId);
      renderSelectionOverlay();
      // Ensure latest block edits are saved so Mode A line numbers match disk
      if (state.dirty) void flushSave();
      void syncSelectionToBackend({ resetDelivery: true, preserveConsumed: false });
      const modeText =
        getActiveQuoteMode() === 'modeB' ? '常驻上下文已固定' : '单轮引用已固定（发消息后自动变灰）';
      showToast(`@@ ${modeText}`);
    };

    el.selectionBox.addEventListener('pointerdown', startDrag);
    el.selDragBar.addEventListener('pointerdown', startDrag);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    el.btnSelClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearSelectionBox();
      showToast('已删除 @@ 选框');
    });

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        if (state.selBox.active) renderSelectionOverlay();
      });
      ro.observe(el.blocksRoot);
    }
  }

  // -------------------------------------------------------------------------
  // Focus + Unsaved Busy Lock & Live Sync Engine
  // -------------------------------------------------------------------------

  function isFocusUnsavedLocked() {
    return Boolean(document.hasFocus() && state.dirty && state.currentName);
  }

  function reportBusyLock(force = false) {
    const locked = isFocusUnsavedLocked();
    if (!force && state.lastSentBusyLock === locked) return;
    state.lastSentBusyLock = locked;
    void apiPost('/api/lock-state', {
      focusedAndUnsaved: locked,
      activeNote: state.currentName,
    }).catch(() => {});
  }

  async function pollExternalChanges() {
    if (document.hidden || state.pollInFlight || state.saving) return;
    if (!el.settingsBackdrop.classList.contains('hidden')) return;

    state.pollInFlight = true;
    try {
      const snap = await apiGet('/api/poll', { name: state.currentName || '' });
      if (state.storage) {
        state.storage.agentRead = snap.agentRead;
        state.storage.agentWrite = snap.agentWrite;
        state.storage.quoteMode = snap.quoteMode;
        updateBadgesUI();
      }

      // Sync Mode A consumed (blue -> gray) transition from backend PreInvocation hook!
      if (
        state.selBox.active &&
        !state.selBox.dragging &&
        snap.selection &&
        snap.selection.active &&
        snap.selection.noteName === state.currentName
      ) {
        const nextConsumed = snap.quoteMode === 'modeB' ? false : Boolean(snap.selection.consumed);
        if (state.selBox.consumed !== nextConsumed) {
          state.selBox.consumed = nextConsumed;
          renderSelectionOverlay();
        }
      }

      if (isFocusUnsavedLocked()) {
        return;
      }

      const mtimeChanged =
        state.currentName &&
        snap.noteExists &&
        Math.abs((snap.noteMtime || 0) - (state.lastNoteMtime || 0)) > 1;
      const noteDeletedExternally = state.currentName && !snap.noteExists;
      const dirChanged = state.lastDirDigest && snap.dirDigest !== state.lastDirDigest;

      if (!mtimeChanged && !noteDeletedExternally && !dirChanged) {
        return;
      }

      clearTimeout(state.saveTimer);
      state.saveTimer = null;
      state.dirty = false;
      reportBusyLock();

      if (noteDeletedExternally) {
        state.currentName = '';
        await loadNotesAndOpen();
        showToast('外部已移除当前笔记，已刷新');
        return;
      }

      if (dirChanged) {
        const listData = await apiGet('/api/notes');
        state.storage = listData;
        state.notes = Array.isArray(listData.notes) ? listData.notes : [];
        state.lastDirDigest = listData.dirDigest || snap.dirDigest;
        updateDirIndicators();
        renderNoteList();
        if (!state.currentName && state.notes.length > 0) {
          await openNote(state.notes[0].name);
          return;
        }
      }

      if (mtimeChanged && state.currentName) {
        const fresh = await apiGet('/api/note', { name: state.currentName });
        state.lastNoteMtime = fresh.updatedAt || 0;
        state.lastDirDigest = fresh.dirDigest || snap.dirDigest;
        const nextMd = fresh.content;
        if (nextMd !== getCurrentMarkdown()) {
          state.blocks = parseMarkdownToBlocks(nextMd);
          state.activeBlockIndex = -1;
          el.sourceEditor.value = nextMd;
          if (!state.sourceMode) {
            renderLiveBlocks();
          }
          updateStatusUI();
          showToast('已同步聊天窗口修改');
        }
      }
    } catch {
      // Ignore transient poll errors
    } finally {
      state.pollInFlight = false;
    }
  }

  // -------------------------------------------------------------------------
  // Markdown <-> Blocks Parser & Serializer
  // -------------------------------------------------------------------------

  const MAX_LIST_INDENT = 6;
  const UL_MARKERS = ['•', '◦', '▪'];

  function isListBlock(b) {
    return Boolean(b && (b.type === 'ul' || b.type === 'ol' || b.type === 'todo'));
  }

  function parseIndentLevel(leadingWs) {
    if (!leadingWs) return 0;
    const spaces = String(leadingWs).replace(/\t/g, '  ').length;
    if (spaces <= 0) return 0;
    return Math.min(MAX_LIST_INDENT, Math.floor((spaces + 1) / 2));
  }

  function renumberOrderedLists(blocks = state.blocks) {
    const counters = new Map();
    for (const b of blocks) {
      if (!isListBlock(b)) {
        counters.clear();
        continue;
      }
      const lvl = b.indent || 0;
      for (const k of Array.from(counters.keys())) {
        if (k > lvl) counters.delete(k);
      }
      if (b.type === 'ol') {
        const next = (counters.get(lvl) || 0) + 1;
        b.num = next;
        counters.set(lvl, next);
      } else {
        counters.delete(lvl);
      }
    }
  }

  function syncOrderedMarkersInDom() {
    const children = el.blocksRoot.children;
    const len = Math.min(children.length, state.blocks.length);
    for (let i = 0; i < len; i++) {
      const b = state.blocks[i];
      if (b.type === 'ol') {
        const marker = children[i].querySelector('.block-marker[data-prefix="1"]');
        if (marker) marker.textContent = `${b.num || 1}.`;
      }
    }
  }

  function parseMarkdownToBlocks(md) {
    const lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
    const blocks = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      const fenceMatch = line.match(/^\s*```(\S*)\s*$/);
      if (fenceMatch) {
        const lang = fenceMatch[1] || '';
        const codeLines = [];
        i++;
        while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
          codeLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) i++;
        blocks.push(makeBlock('code', { lang, text: codeLines.join('\n') }));
        continue;
      }

      if (
        line.includes('|') &&
        i + 1 < lines.length &&
        /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(lines[i + 1])
      ) {
        const tLines = [line, lines[i + 1]];
        i += 2;
        while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
          tLines.push(lines[i]);
          i++;
        }
        blocks.push(makeBlock('table', { text: tLines.join('\n') }));
        continue;
      }

      if (/^\s*([-*_])\1\1+\s*$/.test(line)) {
        blocks.push(makeBlock('hr', { text: '' }));
        i++;
        continue;
      }

      const hMatch = line.match(/^(#{1,4}) (.*)$/);
      if (hMatch) {
        blocks.push(makeBlock(`h${hMatch[1].length}`, { text: hMatch[2] }));
        i++;
        continue;
      }

      const qMatch = line.match(/^> ?(.*)$/);
      if (qMatch) {
        blocks.push(makeBlock('quote', { text: qMatch[1] }));
        i++;
        continue;
      }

      const todoMatch = line.match(/^([ \t]*)[-*+] \[([ xX])\] (.*)$/);
      if (todoMatch) {
        blocks.push(
          makeBlock('todo', {
            indent: parseIndentLevel(todoMatch[1]),
            checked: todoMatch[2].toLowerCase() === 'x',
            text: todoMatch[3],
          })
        );
        i++;
        continue;
      }

      const ulMatch = line.match(/^([ \t]*)[-*+] (.*)$/);
      if (ulMatch) {
        blocks.push(
          makeBlock('ul', {
            indent: parseIndentLevel(ulMatch[1]),
            text: ulMatch[2],
          })
        );
        i++;
        continue;
      }

      const olMatch = line.match(/^([ \t]*)(\d+)\. (.*)$/);
      if (olMatch) {
        blocks.push(
          makeBlock('ol', {
            indent: parseIndentLevel(olMatch[1]),
            num: Number(olMatch[2]) || 1,
            text: olMatch[3],
          })
        );
        i++;
        continue;
      }

      blocks.push(makeBlock('p', { text: line }));
      i++;
    }

    if (!blocks.length) {
      blocks.push(makeBlock('p', { text: '' }));
    }
    return blocks;
  }

  function serializeBlock(b) {
    const pad = isListBlock(b) && b.indent ? '  '.repeat(b.indent) : '';
    switch (b.type) {
      case 'h1': return `# ${b.text}`;
      case 'h2': return `## ${b.text}`;
      case 'h3': return `### ${b.text}`;
      case 'h4': return `#### ${b.text}`;
      case 'quote': return `> ${b.text}`;
      case 'ul': return `${pad}- ${b.text}`;
      case 'ol': return `${pad}${b.num || 1}. ${b.text}`;
      case 'todo': return `${pad}- [${b.checked ? 'x' : ' '}] ${b.text}`;
      case 'hr': return '---';
      case 'code': return `\`\`\`${b.lang || ''}\n${b.text}\n\`\`\``;
      case 'table': return b.text;
      default: return b.text;
    }
  }

  function getCurrentMarkdown() {
    if (state.sourceMode) {
      return el.sourceEditor.value;
    }
    return state.blocks.map(serializeBlock).join('\n');
  }

  // -------------------------------------------------------------------------
  // Safe Inline Markdown & Table Renderer
  // -------------------------------------------------------------------------

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderInline(text) {
    let s = escapeHtml(text);
    const codeTokens = [];
    s = s.replace(/`([^`]+)`/g, (_, inner) => {
      const idx = codeTokens.length;
      codeTokens.push(`<code>${inner}</code>`);
      return `\u0000CODE${idx}\u0000`;
    });
    s = s.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    s = s.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codeTokens[Number(idx)] || '');
    return s;
  }

  function renderTableHtml(raw) {
    const lines = String(raw || '').trim().split(/\r?\n/);
    if (lines.length < 2) return `<p>${renderInline(raw)}</p>`;
    const splitRow = (r) =>
      r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
    const headers = splitRow(lines[0]);
    const rows = lines.slice(2).map(splitRow);
    const thead = `<thead><tr>${headers.map((h) => `<th>${renderInline(h)}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows
      .map((r) => `<tr>${headers.map((_, idx) => `<td>${renderInline(r[idx] || '')}</td>`).join('')}</tr>`)
      .join('')}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
  }

  function autoResizeTextarea(ta) {
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.max(ta.scrollHeight, 24)}px`;
  }

  // -------------------------------------------------------------------------
  // Live Preview Editor (IME-Safe In-Place Transforms + @@ Trigger)
  // -------------------------------------------------------------------------

  function blockPlaceholder(b, idx) {
    if (b.type === 'h1') return '一级标题';
    if (b.type === 'h2') return '二级标题';
    if (b.type === 'h3') return '三级标题';
    if (b.type === 'h4') return '四级标题';
    if (b.type === 'quote') return '引用内容…';
    if (b.type === 'ul' || b.type === 'ol') return '列表项…';
    if (b.type === 'todo') return '待办事项…';
    if (b.type === 'code') return '输入代码…';
    if (idx === 0 && state.blocks.length <= 2) {
      return '输入 ## + 空格 建标题，输入 @@ 呼出上下文框选…';
    }
    return '';
  }

  function computeBlockClass(block, isActive) {
    return `block block-${block.type}${isActive ? ' is-active' : ''}${
      block.type === 'p' && !block.text ? ' is-empty' : ''
    }${block.type === 'todo' && block.checked ? ' is-checked' : ''}`;
  }

  function applyRowListIndent(row, block) {
    if (isListBlock(block) && block.indent) {
      row.style.setProperty('--list-indent', String(block.indent));
      row.dataset.indent = String(block.indent);
    } else {
      row.style.removeProperty('--list-indent');
      delete row.dataset.indent;
    }
  }

  function buildBlockPrefixNode(block, isActive, row) {
    if (isActive && /^h[1-4]$/.test(block.type)) {
      const tag = document.createElement('span');
      tag.className = 'block-tag';
      tag.dataset.prefix = '1';
      tag.textContent = block.type.toUpperCase();
      return tag;
    }
    if (block.type === 'ul') {
      const dot = document.createElement('span');
      const lvl = block.indent || 0;
      dot.className = `block-marker ul-lvl-${lvl % 3}`;
      dot.dataset.prefix = '1';
      dot.textContent = UL_MARKERS[lvl % 3];
      return dot;
    }
    if (block.type === 'ol') {
      const num = document.createElement('span');
      num.className = 'block-marker';
      num.dataset.prefix = '1';
      num.textContent = `${block.num || 1}.`;
      return num;
    }
    if (block.type === 'todo') {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'block-checkbox';
      cb.dataset.prefix = '1';
      cb.checked = Boolean(block.checked);
      cb.addEventListener('click', (e) => e.stopPropagation());
      cb.addEventListener('change', () => {
        block.checked = cb.checked;
        row.classList.toggle('is-checked', block.checked);
        scheduleSave();
      });
      return cb;
    }
    return null;
  }

  function syncActiveBlockInPlace(row, block, idx, ta, newCaret = null) {
    row.className = computeBlockClass(block, true);
    applyRowListIndent(row, block);
    const oldPrefix = row.querySelector('[data-prefix="1"]');
    if (oldPrefix) oldPrefix.remove();

    const body = row.querySelector('.block-body');
    const nextPrefix = buildBlockPrefixNode(block, true, row);
    if (nextPrefix && body) {
      row.insertBefore(nextPrefix, body);
    }

    if (ta) {
      if (ta.value !== block.text) {
        ta.value = block.text;
      }
      ta.placeholder = blockPlaceholder(block, idx);
      if (newCaret !== null) {
        const clamped = Math.max(0, Math.min(ta.value.length, newCaret));
        ta.setSelectionRange(clamped, clamped);
      }
      autoResizeTextarea(ta);
    }
    if (state.selBox.active) renderSelectionOverlay();
  }

  /**
   * Checks if the user just typed `@@` (outside code blocks).
   * Strips `@@` in-place and triggers the upward-draggable selection box!
   */
  function tryExtractAtAtTrigger(block, ta, idx) {
    if (block.type === 'code') return false;
    const val = ta.value;
    const atPos = val.indexOf('@@');
    if (atPos === -1) return false;

    const cleaned = val.slice(0, atPos) + val.slice(atPos + 2);
    block.text = cleaned;
    ta.value = cleaned;
    const nextCaret = Math.max(0, Math.min(cleaned.length, atPos));
    ta.setSelectionRange(nextCaret, nextCaret);
    autoResizeTextarea(ta);
    scheduleSave();
    spawnSelectionBoxAt(idx);
    return true;
  }

  function tryLiveTransform(block, ta) {
    const val = ta.value;
    const caret = ta.selectionStart;

    if (block.type === 'p') {
      const hMatch = val.match(/^(#{1,4}) (.*)$/);
      if (hMatch) {
        const prefixLen = hMatch[1].length + 1;
        block.type = `h${hMatch[1].length}`;
        block.text = hMatch[2];
        return Math.max(0, caret - prefixLen);
      }
      const qMatch = val.match(/^> (.*)$/);
      if (qMatch) {
        block.type = 'quote';
        block.text = qMatch[1];
        return Math.max(0, caret - 2);
      }
      const todoMatch = val.match(/^([ \t]*)[-*+] \[([ xX])\] (.*)$/);
      if (todoMatch) {
        const prefixLen = todoMatch[1].length + 6;
        block.type = 'todo';
        block.indent = parseIndentLevel(todoMatch[1]);
        block.checked = todoMatch[2].toLowerCase() === 'x';
        block.text = todoMatch[3];
        renumberOrderedLists();
        syncOrderedMarkersInDom();
        return Math.max(0, caret - prefixLen);
      }
      const ulMatch = val.match(/^([ \t]*)[-*+] (.*)$/);
      if (ulMatch) {
        const prefixLen = ulMatch[1].length + 2;
        block.type = 'ul';
        block.indent = parseIndentLevel(ulMatch[1]);
        block.text = ulMatch[2];
        renumberOrderedLists();
        syncOrderedMarkersInDom();
        return Math.max(0, caret - prefixLen);
      }
      const olMatch = val.match(/^([ \t]*)(\d+)\. (.*)$/);
      if (olMatch) {
        const prefixLen = olMatch[1].length + olMatch[2].length + 2;
        block.type = 'ol';
        block.indent = parseIndentLevel(olMatch[1]);
        block.num = Number(olMatch[2]) || 1;
        block.text = olMatch[3];
        renumberOrderedLists();
        syncOrderedMarkersInDom();
        return Math.max(0, caret - prefixLen);
      }
    } else if (block.type === 'ul') {
      const upgradeTodo = val.match(/^\[([ xX])\] (.*)$/);
      if (upgradeTodo) {
        block.type = 'todo';
        block.checked = upgradeTodo[1].toLowerCase() === 'x';
        block.text = upgradeTodo[2];
        return Math.max(0, caret - 4);
      }
      const switchOl = val.match(/^(\d+)\. (.*)$/);
      if (switchOl) {
        block.type = 'ol';
        block.num = Number(switchOl[1]) || 1;
        block.text = switchOl[2];
        renumberOrderedLists();
        syncOrderedMarkersInDom();
        return Math.max(0, caret - (switchOl[1].length + 2));
      }
    }
    return null;
  }

  function replaceSingleBlockNode(idx) {
    if (idx < 0 || idx >= state.blocks.length) return;
    const existing = el.blocksRoot.children[idx];
    if (!existing) {
      renderLiveBlocks();
      return;
    }
    const nextNode = buildBlockElement(state.blocks[idx], idx);
    el.blocksRoot.replaceChild(nextNode, existing);
    if (state.selBox.active) renderSelectionOverlay();
  }

  function activateBlock(index, caretPos = null, forceFullRender = false) {
    if (index < 0 || index >= state.blocks.length) return;
    const prevIdx = state.activeBlockIndex;
    state.activeBlockIndex = index;

    if (forceFullRender || el.blocksRoot.children.length !== state.blocks.length) {
      renderLiveBlocks();
    } else {
      if (prevIdx !== -1 && prevIdx !== index && prevIdx < state.blocks.length) {
        replaceSingleBlockNode(prevIdx);
      }
      replaceSingleBlockNode(index);
    }

    const activeRow = el.blocksRoot.children[index];
    const activeInput = activeRow?.querySelector('.block-input');
    if (activeInput) {
      activeInput.focus();
      autoResizeTextarea(activeInput);
      const len = activeInput.value.length;
      const pos = caretPos === null ? len : Math.max(0, Math.min(len, caretPos));
      activeInput.setSelectionRange(pos, pos);
    } else if (activeRow && activeRow.tabIndex >= 0) {
      activeRow.focus();
    }
    if (state.selBox.active) renderSelectionOverlay();
  }

  function deactivateBlocks() {
    if (state.activeBlockIndex === -1) return;
    const prevIdx = state.activeBlockIndex;
    state.activeBlockIndex = -1;
    if (prevIdx >= 0 && prevIdx < state.blocks.length && el.blocksRoot.children.length === state.blocks.length) {
      replaceSingleBlockNode(prevIdx);
    } else {
      renderLiveBlocks();
    }
  }

  function buildBlockElement(block, idx) {
    const isActive = idx === state.activeBlockIndex;
    const row = document.createElement('div');
    row.className = computeBlockClass(block, isActive);
    row.dataset.index = String(idx);
    applyRowListIndent(row, block);

    if (block.type === 'hr') {
      const hr = document.createElement('hr');
      row.appendChild(hr);
      row.tabIndex = 0;
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        activateBlock(idx);
      });
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          state.blocks.splice(idx, 1);
          if (!state.blocks.length) state.blocks.push(makeBlock('p'));
          scheduleSave();
          activateBlock(Math.max(0, idx - 1), null, true);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          state.blocks.splice(idx + 1, 0, makeBlock('p'));
          scheduleSave();
          activateBlock(idx + 1, 0, true);
        } else if (e.key === 'ArrowUp' && idx > 0) {
          e.preventDefault();
          activateBlock(idx - 1);
        } else if (e.key === 'ArrowDown' && idx + 1 < state.blocks.length) {
          e.preventDefault();
          activateBlock(idx + 1, 0);
        }
      });
      return row;
    }

    if (block.type === 'code') {
      const bar = document.createElement('div');
      bar.className = 'code-lang-bar';
      if (isActive) {
        const langInput = document.createElement('input');
        langInput.className = 'code-lang-input';
        langInput.type = 'text';
        langInput.value = block.lang || '';
        langInput.placeholder = 'language';
        langInput.addEventListener('input', () => {
          block.lang = langInput.value.trim();
          scheduleSave();
        });
        const hint = document.createElement('span');
        hint.textContent = 'Ctrl+Enter 离开代码块';
        bar.append(langInput, hint);
      } else {
        const lbl = document.createElement('span');
        lbl.textContent = block.lang || 'code';
        bar.appendChild(lbl);
      }
      row.appendChild(bar);
    }

    const prefixNode = buildBlockPrefixNode(block, isActive, row);
    if (prefixNode) {
      row.appendChild(prefixNode);
    }

    const body = document.createElement('div');
    body.className = 'block-body';

    if (isActive) {
      const ta = document.createElement('textarea');
      ta.className = 'block-input';
      ta.rows = 1;
      ta.spellcheck = false;
      ta.value = block.text;
      ta.placeholder = blockPlaceholder(block, idx);

      let composing = false;
      ta.addEventListener('compositionstart', () => { composing = true; });
      ta.addEventListener('blur', () => { composing = false; });
      ta.addEventListener('compositionend', () => {
        composing = false;
        requestAnimationFrame(() => {
          if (!ta.isConnected) return;
          block.text = ta.value;
          if (tryExtractAtAtTrigger(block, ta, idx)) return;
          const newCaret = tryLiveTransform(block, ta);
          if (newCaret !== null) {
            syncActiveBlockInPlace(row, block, idx, ta, newCaret);
            scheduleSave();
            return;
          }
          row.classList.toggle('is-empty', block.type === 'p' && !block.text);
          autoResizeTextarea(ta);
          scheduleSave();
        });
      });

      ta.addEventListener('input', (e) => {
        block.text = ta.value;
        if (!composing && !e.isComposing) {
          if (tryExtractAtAtTrigger(block, ta, idx)) return;
          const newCaret = tryLiveTransform(block, ta);
          if (newCaret !== null) {
            syncActiveBlockInPlace(row, block, idx, ta, newCaret);
            scheduleSave();
            return;
          }
        }
        row.classList.toggle('is-empty', block.type === 'p' && !block.text);
        autoResizeTextarea(ta);
        if (state.selBox.active) renderSelectionOverlay();
        scheduleSave();
      });

      ta.addEventListener('paste', (e) => {
        if (block.type === 'code' || block.type === 'table') return;
        const pasted = e.clipboardData?.getData('text/plain');
        if (!pasted || !pasted.includes('\n')) return;
        e.preventDefault();
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = ta.value.slice(0, start);
        const after = ta.value.slice(end);
        const parsed = parseMarkdownToBlocks(pasted);
        if (!parsed.length) return;
        if (before) {
          block.text = before + parsed[0].text;
          const rest = parsed.slice(1);
          if (rest.length) {
            rest[rest.length - 1].text += after;
            state.blocks.splice(idx + 1, 0, ...rest);
            scheduleSave();
            activateBlock(idx + rest.length, null, true);
          } else {
            block.text += after;
            scheduleSave();
            syncActiveBlockInPlace(row, block, idx, ta, block.text.length);
          }
        } else {
          parsed[parsed.length - 1].text += after;
          state.blocks.splice(idx, 1, ...parsed);
          scheduleSave();
          activateBlock(idx + parsed.length - 1, null, true);
        }
      });

      ta.addEventListener('keydown', (e) => {
        if (composing || e.isComposing || e.keyCode === 229) return;

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
          e.preventDefault();
          applyFormat('bold');
          return;
        }

        if (e.key === 'Tab') {
          e.preventDefault();
          if (isListBlock(block)) {
            const curIndent = block.indent || 0;
            const nextIndent = e.shiftKey
              ? Math.max(0, curIndent - 1)
              : Math.min(MAX_LIST_INDENT, curIndent + 1);
            if (nextIndent !== curIndent) {
              const s = ta.selectionStart;
              const end = ta.selectionEnd;
              block.indent = nextIndent;
              renumberOrderedLists();
              syncActiveBlockInPlace(row, block, idx, ta);
              ta.setSelectionRange(s, end);
              syncOrderedMarkersInDom();
              scheduleSave();
            }
            return;
          }
          if (!e.shiftKey) {
            const s = ta.selectionStart;
            const end = ta.selectionEnd;
            ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(end);
            block.text = ta.value;
            ta.setSelectionRange(s + 2, s + 2);
            autoResizeTextarea(ta);
            scheduleSave();
          }
          return;
        }

        if ((block.type === 'code' || block.type === 'table') && e.key === 'Enter') {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            state.blocks.splice(idx + 1, 0, makeBlock('p'));
            scheduleSave();
            activateBlock(idx + 1, 0, true);
          }
          return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const s = ta.selectionStart;
          const end = ta.selectionEnd;
          const val = ta.value;

          if (block.type === 'p' && /^\s*([-*_])\1\1+\s*$/.test(val)) {
            block.type = 'hr';
            block.text = '';
            state.blocks.splice(idx + 1, 0, makeBlock('p'));
            scheduleSave();
            activateBlock(idx + 1, 0, true);
            return;
          }

          const codeFence = block.type === 'p' && val.match(/^\s*```(\S*)\s*$/);
          if (codeFence) {
            block.type = 'code';
            block.lang = codeFence[1] || '';
            block.text = '';
            scheduleSave();
            activateBlock(idx, 0, true);
            return;
          }

          if (['ul', 'ol', 'todo', 'quote'].includes(block.type) && !val.trim()) {
            if (isListBlock(block) && (block.indent || 0) > 0) {
              block.indent = (block.indent || 0) - 1;
              renumberOrderedLists();
              syncActiveBlockInPlace(row, block, idx, ta, 0);
              syncOrderedMarkersInDom();
              scheduleSave();
              return;
            }
            block.type = 'p';
            block.text = '';
            delete block.checked;
            delete block.num;
            delete block.indent;
            renumberOrderedLists();
            syncActiveBlockInPlace(row, block, idx, ta, 0);
            syncOrderedMarkersInDom();
            scheduleSave();
            return;
          }

          const before = val.slice(0, s);
          const after = val.slice(end);
          block.text = before;

          let nextBlock;
          const curIndent = block.indent || 0;
          if (block.type === 'ul') {
            nextBlock = makeBlock('ul', { indent: curIndent, text: after });
          } else if (block.type === 'ol') {
            nextBlock = makeBlock('ol', { indent: curIndent, num: (block.num || 1) + 1, text: after });
          } else if (block.type === 'todo') {
            nextBlock = makeBlock('todo', { indent: curIndent, checked: false, text: after });
          } else if (block.type === 'quote') {
            nextBlock = makeBlock('quote', { text: after });
          } else {
            nextBlock = makeBlock('p', { text: after });
          }

          state.blocks.splice(idx + 1, 0, nextBlock);
          renumberOrderedLists();
          if (state.selBox.active && idx < state.selBox.anchorIdx) {
            if (idx < state.selBox.topIdx) state.selBox.topIdx++;
            state.selBox.anchorIdx++;
          }
          scheduleSave();
          activateBlock(idx + 1, 0, true);
          return;
        }

        if (e.key === 'Backspace' && ta.selectionStart === 0 && ta.selectionEnd === 0) {
          if (block.type === 'code' && block.text) return;
          if (isListBlock(block) && (block.indent || 0) > 0) {
            e.preventDefault();
            block.indent = (block.indent || 0) - 1;
            renumberOrderedLists();
            syncActiveBlockInPlace(row, block, idx, ta, 0);
            syncOrderedMarkersInDom();
            scheduleSave();
            return;
          }
          if (block.type !== 'p') {
            e.preventDefault();
            const wasCode = block.type === 'code';
            block.type = 'p';
            delete block.checked;
            delete block.num;
            delete block.lang;
            delete block.indent;
            renumberOrderedLists();
            scheduleSave();
            if (wasCode) {
              activateBlock(idx, 0, true);
            } else {
              syncActiveBlockInPlace(row, block, idx, ta, 0);
              syncOrderedMarkersInDom();
            }
            return;
          }
          if (idx > 0) {
            e.preventDefault();
            const prev = state.blocks[idx - 1];
            if (prev.type === 'hr') {
              state.blocks.splice(idx - 1, 1);
              renumberOrderedLists();
              scheduleSave();
              activateBlock(idx - 1, 0, true);
            } else if (prev.type !== 'code' && prev.type !== 'table') {
              const joinPos = prev.text.length;
              prev.text += block.text;
              state.blocks.splice(idx, 1);
              if (state.selBox.active) {
                if (idx <= state.selBox.topIdx && state.selBox.topIdx > 0) state.selBox.topIdx--;
                if (idx <= state.selBox.anchorIdx && state.selBox.anchorIdx > 0) state.selBox.anchorIdx--;
              }
              renumberOrderedLists();
              scheduleSave();
              activateBlock(idx - 1, joinPos, true);
            } else {
              activateBlock(idx - 1);
            }
          }
          return;
        }

        if (e.key === 'ArrowUp' && idx > 0) {
          const beforeCaret = ta.value.slice(0, ta.selectionStart);
          if (!beforeCaret.includes('\n') && ta.selectionStart === 0) {
            e.preventDefault();
            activateBlock(idx - 1);
          }
        } else if (e.key === 'ArrowDown' && idx + 1 < state.blocks.length) {
          const afterCaret = ta.value.slice(ta.selectionEnd);
          if (!afterCaret.includes('\n') && ta.selectionEnd === ta.value.length) {
            e.preventDefault();
            activateBlock(idx + 1, 0);
          }
        }
      });

      body.appendChild(ta);
      requestAnimationFrame(() => {
        autoResizeTextarea(ta);
        if (state.selBox.active) renderSelectionOverlay();
      });
    } else {
      const view = document.createElement('div');
      view.className = 'block-view';
      if (block.type === 'code') {
        view.textContent = block.text || ' ';
      } else if (block.type === 'table') {
        view.innerHTML = renderTableHtml(block.text);
      } else if (block.text) {
        view.innerHTML = renderInline(block.text);
      } else {
        const ph = blockPlaceholder(block, idx);
        view.innerHTML = ph ? `<span class="block-placeholder">${escapeHtml(ph)}</span>` : '&nbsp;';
      }

      row.addEventListener('click', (e) => {
        if (e.target instanceof Element && e.target.closest('a')) return;
        e.stopPropagation();
        activateBlock(idx);
      });

      body.appendChild(view);
    }

    row.appendChild(body);
    return row;
  }

  function renderLiveBlocks() {
    const scrollTop = el.liveEditor.scrollTop;
    el.blocksRoot.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < state.blocks.length; i++) {
      frag.appendChild(buildBlockElement(state.blocks[i], i));
    }
    el.blocksRoot.appendChild(frag);
    el.liveEditor.scrollTop = scrollTop;
    renderSelectionOverlay();
  }

  // -------------------------------------------------------------------------
  // Formatting Toolbar Actions
  // -------------------------------------------------------------------------

  function applyFormat(kind) {
    if (!state.currentName) return;

    if (state.sourceMode) {
      const ta = el.sourceEditor;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      const sel = val.slice(start, end);
      if (['bold', 'italic', 'code'].includes(kind)) {
        const wrap = kind === 'bold' ? '**' : kind === 'italic' ? '*' : '`';
        const fallback = kind === 'bold' ? '加粗文本' : kind === 'italic' ? '斜体文本' : 'code';
        const insert = `${wrap}${sel || fallback}${wrap}`;
        ta.value = val.slice(0, start) + insert + val.slice(end);
        ta.focus();
        const pos = sel ? start + insert.length : start + wrap.length;
        ta.setSelectionRange(pos, sel ? pos : start + insert.length - wrap.length);
      } else {
        const prefixMap = { h1: '# ', h2: '## ', quote: '> ', list: '- ', ol: '1. ', todo: '- [ ] ' };
        const prefix = prefixMap[kind] || '';
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        ta.value = val.slice(0, lineStart) + prefix + val.slice(lineStart);
        ta.focus();
        ta.setSelectionRange(start + prefix.length, end + prefix.length);
      }
      scheduleSave();
      return;
    }

    if (state.activeBlockIndex < 0 || state.activeBlockIndex >= state.blocks.length) {
      activateBlock(Math.max(0, state.blocks.length - 1));
    }
    const idx = state.activeBlockIndex;
    const block = state.blocks[idx];
    if (!block) return;

    const row = el.blocksRoot.children[idx];
    const ta = row?.querySelector('.block-input');

    const toggleMap = { h1: 'h1', h2: 'h2', quote: 'quote', list: 'ul', ol: 'ol', todo: 'todo' };
    if (toggleMap[kind]) {
      const targetType = toggleMap[kind];
      if (block.type === targetType) {
        block.type = 'p';
        delete block.checked;
        delete block.num;
        delete block.indent;
      } else {
        const prevIndent = isListBlock(block) ? block.indent || 0 : 0;
        block.type = targetType;
        if (isListBlock(block)) {
          block.indent = prevIndent;
        } else {
          delete block.indent;
        }
        if (targetType === 'todo') {
          block.checked = false;
        } else {
          delete block.checked;
        }
        if (targetType === 'ol') {
          block.num = 1;
        } else {
          delete block.num;
        }
      }
      renumberOrderedLists();
      if (row && ta) {
        syncActiveBlockInPlace(row, block, idx, ta);
        syncOrderedMarkersInDom();
        ta.focus();
      } else {
        activateBlock(idx);
      }
      scheduleSave();
      return;
    }

    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;
    const sel = val.slice(start, end);
    const wrap = kind === 'bold' ? '**' : kind === 'italic' ? '*' : '`';
    const fallback = kind === 'bold' ? '加粗文本' : kind === 'italic' ? '斜体文本' : 'code';
    const insert = `${wrap}${sel || fallback}${wrap}`;
    ta.value = val.slice(0, start) + insert + val.slice(end);
    block.text = ta.value;
    ta.focus();
    if (sel) {
      ta.setSelectionRange(start + insert.length, start + insert.length);
    } else {
      ta.setSelectionRange(start + wrap.length, start + insert.length - wrap.length);
    }
    autoResizeTextarea(ta);
    scheduleSave();
  }

  // -------------------------------------------------------------------------
  // Status & Mode Switching
  // -------------------------------------------------------------------------

  function countChars(text) {
    return String(text || '').replace(/\s+/g, '').length;
  }

  function formatTime(ms) {
    if (!ms) return '';
    const d = new Date(ms);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    if (d.toDateString() === now.toDateString()) {
      return `今天 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function updateStatusUI() {
    el.wordCount.textContent = `${countChars(getCurrentMarkdown())} 字`;
    if (!state.currentName) {
      el.saveStatus.textContent = '';
      el.saveStatus.classList.remove('dirty');
      return;
    }
    if (state.saving) {
      el.saveStatus.textContent = '保存中…';
      el.saveStatus.classList.add('dirty');
    } else if (state.dirty) {
      el.saveStatus.textContent = '未保存';
      el.saveStatus.classList.add('dirty');
    } else {
      el.saveStatus.textContent = '已保存';
      el.saveStatus.classList.remove('dirty');
    }
  }

  function updateBadgesUI() {
    if (!state.storage) return;
    const r = state.storage.agentRead !== false;
    const w = state.storage.agentWrite !== false;
    if (!r) {
      el.btnLockBadge.textContent = '🔒 禁访';
      el.btnLockBadge.classList.add('locked');
    } else if (!w) {
      el.btnLockBadge.textContent = '👁 只读';
      el.btnLockBadge.classList.add('locked');
    } else {
      el.btnLockBadge.textContent = '🔓 读写';
      el.btnLockBadge.classList.remove('locked');
    }

    const isModeB = state.storage.quoteMode === 'modeB';
    el.btnQuoteBadge.textContent = isModeB ? '@@ 方式B·常驻' : '@@ 方式A·单轮';
    el.btnQuoteBadge.classList.toggle('mode-b', isModeB);
  }

  function updateDirIndicators() {
    if (!state.storage) return;
    const tag = state.storage.effectiveMode === 'custom' ? '自定义' : '工作区';
    el.btnDirIndicator.textContent = `${tag}: ${state.storage.activeDir}`;
    el.btnDrawerSettings.textContent = `📁 ${state.storage.activeDir}`;
    el.emptyDir.textContent = `保存位置：${state.storage.activeDir}`;
    updateBadgesUI();
  }

  function setSourceMode(toSource) {
    const next = Boolean(toSource);
    if (!state.currentName) {
      el.liveEditor.classList.add('hidden');
      el.sourceEditor.classList.add('hidden');
      el.fmtBar.classList.add('hidden');
      el.emptyState.classList.remove('hidden');
      return;
    }

    el.emptyState.classList.add('hidden');
    el.fmtBar.classList.remove('hidden');

    if (next && !state.sourceMode) {
      el.sourceEditor.value = state.blocks.map(serializeBlock).join('\n');
    } else if (!next && state.sourceMode) {
      state.blocks = parseMarkdownToBlocks(el.sourceEditor.value);
      state.activeBlockIndex = -1;
    }

    state.sourceMode = next;
    if (state.sourceMode) {
      el.liveEditor.classList.add('hidden');
      el.sourceEditor.classList.remove('hidden');
      el.btnMode.textContent = '实时';
      el.btnMode.classList.add('active');
      el.sourceEditor.focus();
    } else {
      el.sourceEditor.classList.add('hidden');
      el.liveEditor.classList.remove('hidden');
      el.btnMode.textContent = '源码';
      el.btnMode.classList.remove('active');
      renderLiveBlocks();
    }
    updateStatusUI();
  }

  // -------------------------------------------------------------------------
  // Notes Data Lifecycle
  // -------------------------------------------------------------------------

  async function flushSave() {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
    if (!state.dirty || !state.currentName) {
      reportBusyLock();
      return;
    }
    const targetName = state.currentName;
    const content = getCurrentMarkdown();
    state.saving = true;
    updateStatusUI();
    try {
      const saved = await apiPost('/api/note/save', { name: targetName, content });
      if (state.currentName === targetName) {
        state.dirty = getCurrentMarkdown() !== content;
        state.lastNoteMtime = saved.updatedAt || state.lastNoteMtime;
        if (saved.dirDigest) state.lastDirDigest = saved.dirDigest;
      }
      // Keep active @@ selection text/line-numbers synced if text inside box changed!
      if (state.selBox.active && state.selBox.noteName === targetName) {
        void syncSelectionToBackend({ resetDelivery: false, preserveConsumed: true });
      }
      const item = state.notes.find((n) => n.name === targetName);
      if (item) {
        item.updatedAt = saved.updatedAt;
        item.preview = saved.preview;
        item.size = saved.size;
        state.notes.sort((a, b) => b.updatedAt - a.updatedAt);
        renderNoteList();
      }
    } catch (err) {
      showToast(`保存失败：${err.message}`);
    } finally {
      state.saving = false;
      updateStatusUI();
      reportBusyLock();
    }
  }

  function scheduleSave() {
    state.dirty = true;
    updateStatusUI();
    reportBusyLock();
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => {
      void flushSave();
    }, 450);
  }

  async function loadNotesAndOpen(preferredName = '') {
    try {
      const data = await apiGet('/api/notes');
      state.storage = data;
      state.lastDirDigest = data.dirDigest || '';
      state.notes = Array.isArray(data.notes) ? data.notes : [];

      if (data.selection && data.selection.active) {
        state.selBox = {
          active: true,
          unpinned: false,
          dragging: false,
          dragTopPx: null,
          consumed: data.quoteMode === 'modeB' ? false : Boolean(data.selection.consumed),
          noteName: data.selection.noteName || '',
          topIdx: data.selection.startBlockIdx ?? 0,
          anchorIdx: data.selection.endBlockIdx ?? 0,
        };
      }

      updateDirIndicators();
      renderNoteList();

      if (!state.notes.length) {
        state.currentName = '';
        state.blocks = [];
        state.activeBlockIndex = -1;
        state.dirty = false;
        state.lastNoteMtime = 0;
        el.sourceEditor.value = '';
        el.btnTitle.textContent = '笔记本';
        setSourceMode(false);
        updateStatusUI();
        reportBusyLock();
        return;
      }

      const target =
        (preferredName && state.notes.find((n) => n.name === preferredName)?.name) ||
        (state.currentName && state.notes.find((n) => n.name === state.currentName)?.name) ||
        state.notes[0].name;

      await openNote(target);
    } catch (err) {
      showToast(err.message);
    }
  }

  async function openNote(name, focusLastLine = false) {
    if (state.dirty && state.currentName && state.currentName !== name) {
      await flushSave();
    }
    try {
      const note = await apiGet('/api/note', { name });
      state.currentName = note.name;
      state.lastNoteMtime = note.updatedAt || 0;
      if (note.dirDigest) state.lastDirDigest = note.dirDigest;
      state.dirty = false;
      el.btnTitle.textContent = note.title;
      state.blocks = parseMarkdownToBlocks(note.content);
      state.activeBlockIndex = -1;
      el.sourceEditor.value = note.content;
      setSourceMode(state.sourceMode);
      if (!state.sourceMode && focusLastLine) {
        activateBlock(state.blocks.length - 1, null, true);
      }
      updateStatusUI();
      renderNoteList();
      renderSelectionOverlay();
      reportBusyLock();
    } catch (err) {
      showToast(err.message);
    }
  }

  async function createNewNote(customName = '') {
    if (state.dirty && state.currentName) {
      await flushSave();
    }
    try {
      const created = await apiPost('/api/note/create', { name: customName });
      hideNewNoteBox();
      closeDrawer();
      state.sourceMode = false;
      await loadNotesAndOpen(created.name);
      activateBlock(state.blocks.length - 1, 0, true);
      showToast(`已新建：${created.title}`);
    } catch (err) {
      showToast(err.message);
    }
  }

  async function renameCurrentNote(newTitle) {
    const trimmed = String(newTitle || '').trim();
    if (!state.currentName || !trimmed) return;
    if (state.dirty) await flushSave();
    try {
      const res = await apiPost('/api/note/rename', {
        oldName: state.currentName,
        newName: trimmed,
      });
      if (state.selBox.active && state.selBox.noteName === state.currentName) {
        state.selBox.noteName = res.name;
      }
      state.currentName = res.name;
      el.btnTitle.textContent = res.title;
      await loadNotesAndOpen(res.name);
      if (state.selBox.active) {
        void syncSelectionToBackend({ resetDelivery: false, preserveConsumed: true });
      }
      showToast('已重命名');
    } catch (err) {
      showToast(err.message);
    }
  }

  async function deleteNoteByName(name) {
    try {
      await apiPost('/api/note/delete', { name });
      state.confirmDeleteName = '';
      if (state.selBox.active && state.selBox.noteName === name) {
        state.selBox.active = false;
      }
      if (state.currentName === name) {
        state.currentName = '';
        state.dirty = false;
      }
      await loadNotesAndOpen();
      showToast('已删除笔记');
    } catch (err) {
      showToast(err.message);
    }
  }

  // -------------------------------------------------------------------------
  // Drawer Rendering & Actions
  // -------------------------------------------------------------------------

  function openDrawer() {
    state.confirmDeleteName = '';
    renderNoteList();
    el.drawerBackdrop.classList.remove('hidden');
    el.drawer.classList.add('open');
  }

  function closeDrawer() {
    el.drawer.classList.remove('open');
    el.drawerBackdrop.classList.add('hidden');
    hideNewNoteBox();
  }

  function showNewNoteBox() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    el.inputNewName.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} 笔记`;
    el.newNoteBox.classList.remove('hidden');
    el.inputNewName.focus();
    el.inputNewName.select();
  }

  function hideNewNoteBox() {
    el.newNoteBox.classList.add('hidden');
  }

  function renderNoteList() {
    const q = state.searchQuery.trim().toLowerCase();
    const filtered = q
      ? state.notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            (n.preview && n.preview.toLowerCase().includes(q))
        )
      : state.notes;

    if (!filtered.length) {
      el.noteList.innerHTML = `<div class="note-list-empty">${
        q ? '没有匹配的笔记' : '暂无笔记，点上方「+ 新建」开始记录'
      }</div>`;
      return;
    }

    el.noteList.innerHTML = '';
    for (const note of filtered) {
      const isCurrent = note.name === state.currentName;
      const isConfirming = note.name === state.confirmDeleteName;

      const row = document.createElement('div');
      row.className = `note-item${isCurrent ? ' active' : ''}${isConfirming ? ' confirming' : ''}`;

      const top = document.createElement('div');
      top.className = 'note-item-top';

      const title = document.createElement('div');
      title.className = 'note-item-title';
      title.textContent = note.title;
      top.appendChild(title);

      const actions = document.createElement('div');
      actions.className = 'note-item-actions';

      if (isConfirming) {
        const yes = document.createElement('button');
        yes.className = 'item-act-btn danger';
        yes.textContent = '确认删除';
        yes.addEventListener('click', (e) => {
          e.stopPropagation();
          void deleteNoteByName(note.name);
        });
        const no = document.createElement('button');
        no.className = 'item-act-btn';
        no.textContent = '取消';
        no.addEventListener('click', (e) => {
          e.stopPropagation();
          state.confirmDeleteName = '';
          renderNoteList();
        });
        actions.append(yes, no);
      } else {
        const del = document.createElement('button');
        del.className = 'item-act-btn danger';
        del.textContent = '删除';
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          state.confirmDeleteName = note.name;
          renderNoteList();
        });
        actions.appendChild(del);
      }

      top.appendChild(actions);
      row.appendChild(top);

      const preview = document.createElement('div');
      preview.className = 'note-item-preview';
      preview.textContent = note.preview || '空笔记';
      row.appendChild(preview);

      const time = document.createElement('div');
      time.className = 'note-item-time';
      time.textContent = formatTime(note.updatedAt);
      row.appendChild(time);

      row.addEventListener('click', () => {
        closeDrawer();
        void openNote(note.name);
      });

      el.noteList.appendChild(row);
    }
  }

  // -------------------------------------------------------------------------
  // Inline Title Rename
  // -------------------------------------------------------------------------

  function startTitleRename() {
    if (!state.currentName) return;
    el.inputTitle.value = state.currentName.replace(/\.md$/i, '');
    el.btnTitle.classList.add('hidden');
    el.inputTitle.classList.remove('hidden');
    el.inputTitle.focus();
    el.inputTitle.select();
  }

  function finishTitleRename(commit) {
    if (el.inputTitle.classList.contains('hidden')) return;
    const nextVal = el.inputTitle.value.trim();
    el.inputTitle.classList.add('hidden');
    el.btnTitle.classList.remove('hidden');
    if (commit && nextVal && `${nextVal}.md` !== state.currentName) {
      void renameCurrentNote(nextVal);
    }
  }

  // -------------------------------------------------------------------------
  // Settings Modal
  // -------------------------------------------------------------------------

  function getSelectedStorageMode() {
    const checked = document.querySelector('input[name="storage-mode"]:checked');
    return checked ? checked.value : 'workspace';
  }

  function getSelectedQuoteMode() {
    const checked = document.querySelector('input[name="quote-mode"]:checked');
    return checked && checked.value === 'modeB' ? 'modeB' : 'modeA';
  }

  function syncSettingsCards() {
    const sMode = getSelectedStorageMode();
    el.cardModeWorkspace.classList.toggle('selected', sMode === 'workspace');
    el.cardModeCustom.classList.toggle('selected', sMode === 'custom');

    const qMode = getSelectedQuoteMode();
    el.cardQuoteA.classList.toggle('selected', qMode === 'modeA');
    el.cardQuoteB.classList.toggle('selected', qMode === 'modeB');

    updateWorkspacePathPreview();
  }

  function updateWorkspacePathPreview() {
    const sub = el.inputWsSubdir.value.trim().replace(/^[\\/]+|[\\/]+$/g, '');
    const ws = state.storage?.workspacePath || '';
    if (ws) {
      const sepChar = ws.includes('\\') ? '\\' : '/';
      const joined = sub ? `${ws}${ws.endsWith(sepChar) ? '' : sepChar}${sub}` : ws;
      el.wsResolvedPreview.textContent = `当前解析路径：${joined}`;
    } else {
      el.wsResolvedPreview.textContent = `未检测到打开的工作区，将回退至：${state.storage?.fallbackDir || ''}`;
    }
  }

  async function openSettings() {
    if (state.dirty) await flushSave();
    closeDrawer();
    el.settingsError.classList.add('hidden');
    el.folderBrowser.classList.add('hidden');

    try {
      const cfg = await apiGet('/api/config');
      state.storage = cfg;
      el.chkAgentRead.checked = cfg.agentRead !== false;
      el.chkAgentWrite.checked = cfg.agentWrite !== false;

      const qVal = cfg.quoteMode === 'modeB' ? 'modeB' : 'modeA';
      const qRadio = document.querySelector(`input[name="quote-mode"][value="${qVal}"]`);
      if (qRadio) qRadio.checked = true;

      const sRadio = document.querySelector(`input[name="storage-mode"][value="${cfg.mode}"]`);
      if (sRadio) sRadio.checked = true;

      el.inputWsSubdir.value = cfg.workspaceSubdir ?? 'notes';
      el.inputCustomDir.value = cfg.customDir || cfg.activeDir || '';
      syncSettingsCards();
      el.settingsBackdrop.classList.remove('hidden');
    } catch (err) {
      showToast(err.message);
    }
  }

  function closeSettings() {
    el.settingsBackdrop.classList.add('hidden');
  }

  async function loadFolderBrowser(targetPath) {
    try {
      const data = await apiGet('/api/fs/browse', { path: targetPath });
      state.browserPath = data.current || '';
      state.browserParent = data.parent || '';
      el.browserCurrent.textContent = state.browserPath || '选择磁盘';
      el.browserList.innerHTML = '';

      if (!data.dirs.length) {
        const empty = document.createElement('div');
        empty.className = 'note-list-empty';
        empty.textContent = '此目录下没有子文件夹';
        el.browserList.appendChild(empty);
        return;
      }

      for (const d of data.dirs) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'browser-row';
        btn.textContent = `📁 ${d.name}`;
        btn.addEventListener('click', () => {
          void loadFolderBrowser(d.path);
        });
        el.browserList.appendChild(btn);
      }
    } catch (err) {
      el.settingsError.textContent = err.message;
      el.settingsError.classList.remove('hidden');
    }
  }

  async function saveSettingsForm() {
    el.settingsError.classList.add('hidden');
    const mode = getSelectedStorageMode();
    const quoteMode = getSelectedQuoteMode();
    const customDir = el.inputCustomDir.value.trim();
    const workspaceSubdir = el.inputWsSubdir.value.trim();
    const agentRead = Boolean(el.chkAgentRead.checked);
    const agentWrite = Boolean(el.chkAgentWrite.checked);

    try {
      const prevDir = state.storage?.activeDir || '';
      const prevQuoteMode = state.storage?.quoteMode || 'modeA';
      const updated = await apiPost('/api/config', {
        mode,
        quoteMode,
        customDir,
        workspaceSubdir,
        agentRead,
        agentWrite,
      });
      state.storage = updated;
      if (state.selBox.active && quoteMode !== prevQuoteMode) {
        state.selBox.consumed = false;
      }
      updateDirIndicators();
      renderSelectionOverlay();
      closeSettings();
      if (updated.activeDir !== prevDir) {
        state.currentName = '';
        state.dirty = false;
        await loadNotesAndOpen();
      }
      showToast('设置已保存');
    } catch (err) {
      el.settingsError.textContent = err.message;
      el.settingsError.classList.remove('hidden');
    }
  }

  // -------------------------------------------------------------------------
  // Event Bindings
  // -------------------------------------------------------------------------

  window.addEventListener('focus', () => {
    reportBusyLock(true);
    void pollExternalChanges();
  });

  window.addEventListener('blur', () => {
    reportBusyLock(true);
  });

  el.liveEditor.addEventListener('click', (e) => {
    if (e.target !== el.liveEditor && e.target !== el.blocksRoot) return;
    if (!state.blocks.length) {
      state.blocks.push(makeBlock('p'));
      activateBlock(0, 0, true);
      return;
    }
    const last = state.blocks[state.blocks.length - 1];
    if (last.type === 'p' && !last.text) {
      activateBlock(state.blocks.length - 1, 0);
    } else {
      state.blocks.push(makeBlock('p'));
      scheduleSave();
      activateBlock(state.blocks.length - 1, 0, true);
    }
  });

  document.addEventListener('click', (e) => {
    if (state.sourceMode || state.activeBlockIndex === -1) return;
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;
    if (!target.closest('#live-editor') && !target.closest('#fmt-bar')) {
      deactivateBlocks();
      if (state.dirty) void flushSave();
    }
  });

  el.btnDrawer.addEventListener('click', openDrawer);
  el.btnDrawerClose.addEventListener('click', closeDrawer);
  el.drawerBackdrop.addEventListener('click', closeDrawer);

  el.btnNew.addEventListener('click', () => {
    openDrawer();
    showNewNoteBox();
  });
  el.btnDrawerNew.addEventListener('click', showNewNoteBox);
  el.btnEmptyCreate.addEventListener('click', () => void createNewNote());
  el.btnNewCancel.addEventListener('click', hideNewNoteBox);
  el.btnNewConfirm.addEventListener('click', () => void createNewNote(el.inputNewName.value));
  el.inputNewName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void createNewNote(el.inputNewName.value);
    } else if (e.key === 'Escape') {
      hideNewNoteBox();
    }
  });

  el.inputSearch.addEventListener('input', () => {
    state.searchQuery = el.inputSearch.value;
    renderNoteList();
  });

  el.btnTitle.addEventListener('click', startTitleRename);
  el.inputTitle.addEventListener('blur', () => finishTitleRename(true));
  el.inputTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishTitleRename(true);
    } else if (e.key === 'Escape') {
      finishTitleRename(false);
    }
  });

  el.btnMode.addEventListener('click', () => {
    if (!state.currentName) return;
    if (state.dirty) void flushSave();
    setSourceMode(!state.sourceMode);
  });

  el.fmtBar.addEventListener('mousedown', (e) => {
    if (e.target instanceof Element && e.target.closest('.fmt-btn')) {
      e.preventDefault();
    }
  });
  el.fmtBar.addEventListener('click', (e) => {
    const btn = e.target instanceof Element ? e.target.closest('.fmt-btn') : null;
    if (!btn) return;
    applyFormat(btn.dataset.fmt);
  });

  el.sourceEditor.addEventListener('input', scheduleSave);
  el.sourceEditor.addEventListener('blur', () => void flushSave());
  el.sourceEditor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = el.sourceEditor.selectionStart;
      const end = el.sourceEditor.selectionEnd;
      el.sourceEditor.value =
        el.sourceEditor.value.slice(0, s) + '  ' + el.sourceEditor.value.slice(end);
      el.sourceEditor.setSelectionRange(s + 2, s + 2);
      scheduleSave();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      applyFormat('bold');
    }
  });

  el.btnSettings.addEventListener('click', () => void openSettings());
  el.btnLockBadge.addEventListener('click', () => void openSettings());
  el.btnQuoteBadge.addEventListener('click', () => void openSettings());
  el.btnDirIndicator.addEventListener('click', () => void openSettings());
  el.btnDrawerSettings.addEventListener('click', () => void openSettings());
  el.btnSettingsClose.addEventListener('click', closeSettings);
  el.btnSettingsCancel.addEventListener('click', closeSettings);
  el.settingsBackdrop.addEventListener('click', (e) => {
    if (e.target === el.settingsBackdrop) closeSettings();
  });
  el.btnSettingsSave.addEventListener('click', () => void saveSettingsForm());

  el.chkAgentRead.addEventListener('change', () => {
    if (!el.chkAgentRead.checked) {
      el.chkAgentWrite.checked = false;
    }
  });
  el.chkAgentWrite.addEventListener('change', () => {
    if (el.chkAgentWrite.checked) {
      el.chkAgentRead.checked = true;
    }
  });

  for (const radio of document.querySelectorAll('input[name="storage-mode"], input[name="quote-mode"]')) {
    radio.addEventListener('change', syncSettingsCards);
  }
  el.inputWsSubdir.addEventListener('input', updateWorkspacePathPreview);
  el.btnPresetNotes.addEventListener('click', () => {
    document.querySelector('input[name="storage-mode"][value="workspace"]').checked = true;
    el.inputWsSubdir.value = 'notes';
    syncSettingsCards();
  });
  el.btnPresetRoot.addEventListener('click', () => {
    document.querySelector('input[name="storage-mode"][value="workspace"]').checked = true;
    el.inputWsSubdir.value = '';
    syncSettingsCards();
  });
  el.inputCustomDir.addEventListener('focus', () => {
    document.querySelector('input[name="storage-mode"][value="custom"]').checked = true;
    syncSettingsCards();
  });

  el.btnBrowseToggle.addEventListener('click', () => {
    document.querySelector('input[name="storage-mode"][value="custom"]').checked = true;
    syncSettingsCards();
    const isHidden = el.folderBrowser.classList.contains('hidden');
    el.folderBrowser.classList.toggle('hidden', !isHidden);
    if (isHidden) {
      const seed = el.inputCustomDir.value.trim() || state.storage?.workspacePath || '';
      void loadFolderBrowser(seed);
    }
  });

  el.btnBrowseUp.addEventListener('click', () => {
    void loadFolderBrowser(state.browserParent);
  });

  el.btnBrowseSelect.addEventListener('click', () => {
    if (state.browserPath) {
      el.inputCustomDir.value = state.browserPath;
      el.folderBrowser.classList.add('hidden');
    }
  });

  window.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 's') {
      e.preventDefault();
      void flushSave().then(() => showToast('已保存'));
    } else if (mod && e.key.toLowerCase() === 'e') {
      if (state.currentName && el.settingsBackdrop.classList.contains('hidden')) {
        e.preventDefault();
        if (state.dirty) void flushSave();
        setSourceMode(!state.sourceMode);
      }
    } else if (mod && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      openDrawer();
      showNewNoteBox();
    } else if (e.key === 'Escape') {
      if (!el.settingsBackdrop.classList.contains('hidden')) {
        closeSettings();
      } else if (el.drawer.classList.contains('open')) {
        closeDrawer();
      } else if (!state.sourceMode && state.activeBlockIndex !== -1) {
        deactivateBlocks();
        if (state.dirty) void flushSave();
      }
    }
  });

  window.addEventListener('beforeunload', () => {
    state.lastSentBusyLock = null;
    void apiPost('/api/lock-state', { focusedAndUnsaved: false, activeNote: '' }).catch(() => {});
    if (state.dirty) {
      void flushSave();
    }
  });

  // -------------------------------------------------------------------------
  // Bootstrap
  // -------------------------------------------------------------------------

  async function applyWorkspaceUris(uris) {
    const nextUri = Array.isArray(uris) && uris.length > 0 ? String(uris[0]) : '';
    if (nextUri === state.workspaceUri && state.storage) return;
    if (state.dirty) await flushSave();
    state.workspaceUri = nextUri;
    state.currentName = '';
    await loadNotesAndOpen();
  }

  async function init() {
    setupSelectionDragEvents();

    setInterval(() => {
      void pollExternalChanges();
    }, 1200);

    setInterval(() => {
      if (isFocusUnsavedLocked()) {
        reportBusyLock(true);
      }
    }, 3000);

    if (window.sidecar?.onWorkspaceChange) {
      window.sidecar.onWorkspaceChange((uris) => {
        void applyWorkspaceUris(uris);
      });
    }
    if (window.sidecar?.getWorkspaceUris) {
      try {
        const uris = await Promise.race([
          window.sidecar.getWorkspaceUris(),
          new Promise((resolve) => setTimeout(() => resolve([]), 600)),
        ]);
        await applyWorkspaceUris(uris);
        return;
      } catch {
        // Fall through
      }
    }
    await loadNotesAndOpen();
  }

  void init();
})();
