(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);

  // -------------------------------------------------------------------------
  // Internationalization (zh-CN & en + Auto System Detection)
  // -------------------------------------------------------------------------

  const I18N = {
    'zh-CN': {
      appTitle: '笔记本',
      untitledNote: '未命名笔记',
      notebookTitleFallback: '笔记本',
      drawerTitleAttr: '笔记列表',
      renameNoteTitleAttr: '点击重命名当前笔记',
      renameNoteAria: '重命名笔记',
      newNoteTitleAttr: '新建笔记 (Ctrl+N)',
      modeBtnSource: '源码',
      modeBtnLive: '实时',
      modeBtnTitleAttr: '切换实时预览 / Markdown 源码 (Ctrl+E)',
      settingsBtnTitleAttr: '设置与权限锁',
      fmtH1Title: '一级标题 (# )',
      fmtH2Title: '二级标题 (## )',
      fmtBoldTitle: '加粗 (Ctrl+B)',
      fmtItalicTitle: '斜体',
      fmtCodeTitle: '行内代码',
      fmtQuoteTitle: '引用 (> )',
      fmtUlLabel: '• 列表',
      fmtUlTitle: '无序列表 (- ，Tab / Shift+Tab 调整层级)',
      fmtOlLabel: '1. 列表',
      fmtOlTitle: '有序列表 (1. ，Tab / Shift+Tab 调整层级)',
      fmtTodoLabel: '☐ 待办',
      fmtTodoTitle: '待办 (- [ ] ，Tab / Shift+Tab 调整层级)',
      statusReady: '就绪',
      statusSaving: '保存中…',
      statusUnsaved: '未保存',
      statusSaved: '已保存',
      boldFallback: '加粗文本',
      italicFallback: '斜体文本',
      emptyTitle: '还没有笔记',
      emptyCreateBtn: '新建第一篇笔记',
      emptyDirPrefix: (dir) => `保存位置：${dir}`,
      liveEditorAria: '实时预览编辑区',
      selBoxAria: '@@ 上下文框选区域',
      selDragTitle: '按住上下拖拽调整框选范围',
      selCloseTitle: '删除选框',
      sourcePlaceholder: '输入 Markdown 源码…',
      phH1: '一级标题',
      phH2: '二级标题',
      phH3: '三级标题',
      phH4: '四级标题',
      phQuote: '引用内容…',
      phList: '列表项…',
      phTodo: '待办事项…',
      phCode: '输入代码…',
      phMath: '输入 LaTeX 数学公式（支持 aligned、matrix、\\ce{...} 等）…',
      phFirstLine: '随手记录内容，输入 @@ 框选片段发给 AI，输入 || 插入当前对话链接…',
      codeLeaveHint: 'Ctrl+Enter 离开代码块',
      mathLeaveHint: 'Ctrl+Enter 离开公式块',
      mathPreviewEmpty: '输入 LaTeX 后在此实时预览公式',
      lockBadgeTitle: '点击修改权限与 @@ 模式设置',
      quoteBadgeTitle: '当前 @@ 框选模式（点击切换）',
      dirIndicatorTitle: '点击打开存储设置',
      badgeNoAccess: '🔒 禁访',
      badgeReadOnly: '👁 只读',
      badgeReadWrite: '🔓 读写',
      badgeModeA: '@@ 方式A·单轮',
      badgeModeB: '@@ 方式B·常驻',
      tagWorkspace: '工作区',
      tagCustom: '自定义',
      wordCount: (n) => `${n} 字`,
      drawerHeadTitle: '全部笔记',
      drawerNewBtn: '+ 新建',
      closeAria: '关闭',
      searchPlaceholder: '搜索笔记标题或内容…',
      newNamePlaceholder: '输入笔记名称（无需 .md）',
      defaultNewNoteName: (ymd) => `${ymd} 笔记`,
      btnCreate: '创建',
      btnCancel: '取消',
      noSearchMatch: '没有匹配的笔记',
      emptyNoteList: '暂无笔记，点上方「+ 新建」开始记录',
      btnDelete: '删除',
      btnConfirmDelete: '确认删除',
      emptyNotePreview: '空笔记',
      todayTime: (hm) => `今天 ${hm}`,
      drawerDirBtnTitle: '更改存储目录',
      settingsTitle: '笔记本设置',
      secLang: '界面语言',
      secQuoteMode: '@@ 框选上下文模式（二选一互斥）',
      quoteATitle: '方式 A · 单轮文档索引引用（默认）',
      quoteADesc:
        '给宿主发送文档位置与行号索引；初始为蓝色半透明框，在聊天窗口发送一轮消息后自动变灰失效。',
      quoteBTitle: '方式 B · 常驻纯片段直投',
      quoteBDesc:
        '仅直接注入框选区域的纯文本（不含文档其余内容与路径），选框一直保持蓝色常驻生效，直至点右上角 ✕ 删除。',
      secAgentPerm: 'Agent 访问权限锁（PreToolUse 引擎拦截）',
      permReadTitle: '允许 Agent 读取笔记',
      permReadDesc: '关闭后，宿主引擎将拒绝聊天窗口读取或检索笔记目录（不影响方式 B 的框选直投）。',
      permWriteTitle: '允许 Agent 修改笔记',
      permWriteDesc:
        '关闭后禁止 Agent 修改笔记；开启时若光标在笔记本内且未保存也会自动临时锁写，光标离开即放行。',
      secStorage: '笔记存储位置',
      modeWsTitle: '跟随当前工作区（默认）',
      modeWsDesc: '切换项目时自动保存到当前工作区目录中。',
      wsSubdirLabel: '工作区子目录（留空则直接存在根目录）',
      btnPresetRoot: '根目录',
      wsResolvedPath: (p) => `当前解析路径：${p}`,
      wsFallbackPath: (p) => `未检测到打开的工作区，将回退至：${p}`,
      modeCustomTitle: '自定义存储目录',
      modeCustomDesc: '固定将所有笔记保存在你指定的本地文件夹（不存在时会自动创建）。',
      customDirPlaceholder: '例如 C:\\MyNotes 或 D:\\Study\\Notes',
      btnBrowse: '浏览',
      btnBrowseUp: '↑ 上级',
      selectDrive: '选择磁盘',
      btnBrowseSelect: '选定此目录',
      noSubfolders: '此目录下没有子文件夹',
      btnSaveSettings: '保存设置',
      reqFailed: (s) => `请求失败 (${s})`,
      saveReqFailed: (s) => `保存失败 (${s})`,
      toastSpawnSel: '已生成 @@ 选框：向上拖拽框选范围，松手固定',
      toastPinnedModeB: '@@ 常驻上下文已固定',
      toastPinnedModeA: '@@ 单轮引用已固定（发消息后自动变灰）',
      toastClearedSel: '已删除 @@ 选框',
      toastNoteRemovedExt: '外部已移除当前笔记，已刷新',
      toastSyncedExt: '已同步聊天窗口修改',
      toastSaveErr: (m) => `保存失败：${m}`,
      toastCreated: (title) => `已新建：${title}`,
      toastRenamed: '已重命名',
      toastDeleted: '已删除笔记',
      toastSettingsSaved: '设置已保存',
      toastSaved: '已保存',
      convLinkTitle: (shortId) => `点击切换至宿主对话 (${shortId}…)`,
      fileLinkTitle: '点击打开关联文件',
      defaultConvLabel: (shortId) => `对话 ${shortId}`,
      toastInsertedConvLink: '已插入当前对话跳转链接',
      toastNoHostConv: '未检测到当前宿主对话窗口',
      toastHostConvUnsupported: '当前环境不支持直接跳转宿主对话窗口',
      toastHostFileUnsupported: '当前环境不支持直接打开本地文件视图',
    },
    en: {
      appTitle: 'Notebook',
      untitledNote: 'Untitled Note',
      notebookTitleFallback: 'Notebook',
      drawerTitleAttr: 'Notes list',
      renameNoteTitleAttr: 'Click to rename current note',
      renameNoteAria: 'Rename note',
      newNoteTitleAttr: 'New note (Ctrl+N)',
      modeBtnSource: 'Source',
      modeBtnLive: 'Live',
      modeBtnTitleAttr: 'Toggle Live Preview / Markdown Source (Ctrl+E)',
      settingsBtnTitleAttr: 'Settings & Permissions',
      fmtH1Title: 'Heading 1 (# )',
      fmtH2Title: 'Heading 2 (## )',
      fmtBoldTitle: 'Bold (Ctrl+B)',
      fmtItalicTitle: 'Italic',
      fmtCodeTitle: 'Inline code',
      fmtQuoteTitle: 'Blockquote (> )',
      fmtUlLabel: '• List',
      fmtUlTitle: 'Bullet list (- , Tab / Shift+Tab to indent)',
      fmtOlLabel: '1. List',
      fmtOlTitle: 'Numbered list (1. , Tab / Shift+Tab to indent)',
      fmtTodoLabel: '☐ Todo',
      fmtTodoTitle: 'Task list (- [ ] , Tab / Shift+Tab to indent)',
      statusReady: 'Ready',
      statusSaving: 'Saving…',
      statusUnsaved: 'Unsaved',
      statusSaved: 'Saved',
      boldFallback: 'bold text',
      italicFallback: 'italic text',
      emptyTitle: 'No notes yet',
      emptyCreateBtn: 'Create First Note',
      emptyDirPrefix: (dir) => `Location: ${dir}`,
      liveEditorAria: 'Live preview editor',
      selBoxAria: '@@ context selection area',
      selDragTitle: 'Drag up or down to adjust selection range',
      selCloseTitle: 'Remove selection',
      sourcePlaceholder: 'Write Markdown source…',
      phH1: 'Heading 1',
      phH2: 'Heading 2',
      phH3: 'Heading 3',
      phH4: 'Heading 4',
      phQuote: 'Quote…',
      phList: 'List item…',
      phTodo: 'To-do…',
      phCode: 'Enter code…',
      phMath: 'Enter LaTeX math formula (aligned, matrix, \\ce{...}, etc.)…',
      phFirstLine: 'Start typing to take notes — type @@ to share context, or || to link current chat…',
      codeLeaveHint: 'Ctrl+Enter to leave code block',
      mathLeaveHint: 'Ctrl+Enter to leave math block',
      mathPreviewEmpty: 'Live LaTeX preview appears here',
      lockBadgeTitle: 'Click to configure permissions & @@ mode',
      quoteBadgeTitle: 'Current @@ selection mode (click to change)',
      dirIndicatorTitle: 'Click to open storage settings',
      badgeNoAccess: '🔒 Locked',
      badgeReadOnly: '👁 Read-only',
      badgeReadWrite: '🔓 R/W',
      badgeModeA: '@@ Mode A·1-Turn',
      badgeModeB: '@@ Mode B·Pinned',
      tagWorkspace: 'Workspace',
      tagCustom: 'Custom',
      wordCount: (n) => `${n} chars`,
      drawerHeadTitle: 'All Notes',
      drawerNewBtn: '+ New',
      closeAria: 'Close',
      searchPlaceholder: 'Search title or content…',
      newNamePlaceholder: 'Note name (without .md)',
      defaultNewNoteName: (ymd) => `${ymd} Notes`,
      btnCreate: 'Create',
      btnCancel: 'Cancel',
      noSearchMatch: 'No matching notes',
      emptyNoteList: 'No notes yet — click "+ New" above to start',
      btnDelete: 'Delete',
      btnConfirmDelete: 'Confirm',
      emptyNotePreview: 'Empty note',
      todayTime: (hm) => `Today ${hm}`,
      drawerDirBtnTitle: 'Change storage directory',
      settingsTitle: 'Notebook Settings',
      secLang: 'Language',
      secQuoteMode: '@@ Context Selection Mode',
      quoteATitle: 'Mode A · Single-Turn Line Reference (Default)',
      quoteADesc:
        'Sends file URI and line numbers for one chat turn; the blue box automatically turns gray after sending a message.',
      quoteBTitle: 'Mode B · Persistent Snippet Injection',
      quoteBDesc:
        'Injects only the selected plain text (without file path or outside content); stays active across turns until closed with ✕.',
      secAgentPerm: 'Agent Access Permissions (PreToolUse Guard)',
      permReadTitle: 'Allow Agent to Read Notes',
      permReadDesc:
        'When off, blocks the Agent from reading or searching your notes directory (Mode B snippet injection still works).',
      permWriteTitle: 'Allow Agent to Edit Notes',
      permWriteDesc:
        'When off, blocks Agent edits; when on, writes are also temporarily paused while you have unsaved edits focused.',
      secStorage: 'Storage Location',
      modeWsTitle: 'Follow Current Workspace (Default)',
      modeWsDesc:
        'Automatically stores notes inside the active workspace folder when switching projects.',
      wsSubdirLabel: 'Workspace subdirectory (leave blank for workspace root)',
      btnPresetRoot: 'Root',
      wsResolvedPath: (p) => `Resolved path: ${p}`,
      wsFallbackPath: (p) => `No active workspace detected; falling back to: ${p}`,
      modeCustomTitle: 'Custom Directory',
      modeCustomDesc:
        'Stores all notes in a fixed local folder of your choice (created automatically if missing).',
      customDirPlaceholder: 'e.g. C:\\MyNotes or ~/Documents/Notes',
      btnBrowse: 'Browse',
      btnBrowseUp: '↑ Up',
      selectDrive: 'Select Drive',
      btnBrowseSelect: 'Select Folder',
      noSubfolders: 'No subfolders in this directory',
      btnSaveSettings: 'Save Settings',
      reqFailed: (s) => `Request failed (${s})`,
      saveReqFailed: (s) => `Save failed (${s})`,
      toastSpawnSel: '@@ selection created: drag up to adjust range, release to pin',
      toastPinnedModeB: '@@ persistent snippet pinned',
      toastPinnedModeA: '@@ 1-turn reference pinned (turns gray after next message)',
      toastClearedSel: '@@ selection removed',
      toastNoteRemovedExt: 'Current note was removed externally, refreshed',
      toastSyncedExt: 'Synced external changes',
      toastSaveErr: (m) => `Save failed: ${m}`,
      toastCreated: (title) => `Created: ${title}`,
      toastRenamed: 'Renamed',
      toastDeleted: 'Note deleted',
      toastSettingsSaved: 'Settings saved',
      toastSaved: 'Saved',
      convLinkTitle: (shortId) => `Switch to conversation (${shortId}…)`,
      fileLinkTitle: 'Open linked file',
      defaultConvLabel: (shortId) => `Chat ${shortId}`,
      toastInsertedConvLink: 'Inserted current chat jump link',
      toastNoHostConv: 'No active host conversation detected',
      toastHostConvUnsupported: 'Conversation jump requires the Antigravity host app',
      toastHostFileUnsupported: 'File preview requires the Antigravity host app',
    },
  };

  function detectBrowserLocale() {
    const langs =
      Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || 'en'];
    for (const l of langs) {
      if (/^zh\b/i.test(String(l).trim())) return 'zh-CN';
    }
    return 'en';
  }

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
    langSeg: $('lang-seg'),
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
    latexAc: $('latex-ac'),
    toast: $('toast'),
  };

  let blockUidSeq = 1;
  const makeBlock = (type, props = {}) => ({
    id: `b${blockUidSeq++}`,
    type,
    text: '',
    ...props,
  });

  function detectInitialHostConvId() {
    try {
      const fromSidecar = String(window.sidecar?.conversationId || '').trim();
      if (fromSidecar) return fromSidecar;
      const params = new URLSearchParams(window.location.search);
      return String(params.get('conversationId') || '').trim();
    } catch {
      return '';
    }
  }

  const initialHostConvId = detectInitialHostConvId();

  const state = {
    workspaceUri: '',
    hostConvId: initialHostConvId,
    hostConv: initialHostConvId
      ? { conversationId: initialHostConvId, title: '', hasRealTitle: false }
      : null,
    langPref: 'auto',
    pendingLangPref: 'auto',
    browserLocale: detectBrowserLocale(),
    storage: null,
    notes: [],
    currentName: '',
    blocks: [],
    activeBlockIndex: -1,
    activeBlockTouchedMacro: false,
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
      anchorIdx: 0,
    },
  };

  function getEffectiveLang(pref = state.langPref) {
    if (pref === 'zh-CN' || pref === 'en') return pref;
    return state.browserLocale;
  }

  function t(key, ...args) {
    const lang = getEffectiveLang();
    const dict = I18N[lang] || I18N.en;
    const entry = dict[key] !== undefined ? dict[key] : I18N.en[key];
    return typeof entry === 'function' ? entry(...args) : entry ?? key;
  }

  function applyI18nToDom() {
    const lang = getEffectiveLang();
    document.documentElement.lang = lang;
    document.title = t('appTitle');

    for (const node of document.querySelectorAll('[data-i18n]')) {
      node.textContent = t(node.dataset.i18n);
    }
    for (const node of document.querySelectorAll('[data-i18n-title]')) {
      node.title = t(node.dataset.i18nTitle);
    }
    for (const node of document.querySelectorAll('[data-i18n-placeholder]')) {
      node.placeholder = t(node.dataset.i18nPlaceholder);
    }
    for (const node of document.querySelectorAll('[data-i18n-aria]')) {
      node.setAttribute('aria-label', t(node.dataset.i18nAria));
    }

    if (!state.currentName) {
      el.btnTitle.textContent = state.notes.length ? t('untitledNote') : t('notebookTitleFallback');
    }
    el.btnMode.textContent = state.sourceMode ? t('modeBtnLive') : t('modeBtnSource');

    updateDirIndicators();
    updateStatusUI();
    renderNoteList();
    if (!state.sourceMode && state.currentName) {
      renderLiveBlocks();
    } else {
      renderSelectionOverlay();
    }
    if (!el.settingsBackdrop.classList.contains('hidden')) {
      updateWorkspacePathPreview();
      if (!el.folderBrowser.classList.contains('hidden') && !state.browserPath) {
        el.browserCurrent.textContent = t('selectDrive');
      }
    }
    syncLangSegmentUI();
  }

  function syncLangSegmentUI(pref = state.pendingLangPref) {
    const activeLang = getEffectiveLang(pref);
    for (const btn of el.langSeg.querySelectorAll('.lang-seg-btn')) {
      btn.classList.toggle('active', btn.dataset.lang === activeLang);
    }
  }

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
    if (
      state.hostConvId &&
      params.hostConvId === undefined &&
      params.conversationId === undefined
    ) {
      url.searchParams.set('hostConvId', state.hostConvId);
    }
    url.searchParams.set('clientLocale', getEffectiveLang());
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v));
      }
    }
    const fetcher = window.sidecar?.fetch ? window.sidecar.fetch.bind(window.sidecar) : fetch;
    const res = await fetcher(url.pathname + url.search, { method: 'GET' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || t('reqFailed', res.status));
    return json;
  }

  async function apiPost(path, payload = {}) {
    const fetcher = window.sidecar?.fetch ? window.sidecar.fetch.bind(window.sidecar) : fetch;
    const body = JSON.stringify({
      clientLocale: getEffectiveLang(),
      ...payload,
      workspaceUri: state.workspaceUri,
    });
    const res = await fetcher(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || t('saveReqFailed', res.status));
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

  function ingestHostConvInfo(info) {
    if (!info || typeof info !== 'object') return;
    const cid = String(info.conversationId || '').trim();
    if (!cid) return;
    const title = String(info.title || '').trim();
    state.hostConv = {
      conversationId: cid,
      title: title || t('defaultConvLabel', cid.slice(0, 8)),
      hasRealTitle: Boolean(info.hasRealTitle && title),
    };
  }

  async function refreshHostConversation(forceRefresh = false) {
    try {
      const info = await apiGet('/api/config', {
        hostConversation: '1',
        conversationId: state.hostConvId || undefined,
        forceRefresh: forceRefresh ? '1' : undefined,
      });
      ingestHostConvInfo(info);
      return state.hostConv;
    } catch {
      return state.hostConv;
    }
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
    void syncSelectionToBackend({ resetDelivery: true, preserveConsumed: false });
    showToast(t('toastSpawnSel'));
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

      if (e.clientY < editorRect.top + 28) {
        el.liveEditor.scrollTop = Math.max(0, el.liveEditor.scrollTop - 14);
      } else if (e.clientY > editorRect.bottom - 28) {
        el.liveEditor.scrollTop += 14;
      }

      const relY = e.clientY - editorRect.top + el.liveEditor.scrollTop;
      state.selBox.dragTopPx = relY;

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
      if (state.dirty) void flushSave();
      void syncSelectionToBackend({ resetDelivery: true, preserveConsumed: false });
      showToast(getActiveQuoteMode() === 'modeB' ? t('toastPinnedModeB') : t('toastPinnedModeA'));
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
      showToast(t('toastClearedSel'));
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
      ingestHostConvInfo(snap.hostConv);
      if (state.storage) {
        state.storage.agentRead = snap.agentRead;
        state.storage.agentWrite = snap.agentWrite;
        state.storage.quoteMode = snap.quoteMode;
        if (snap.lang && snap.lang !== state.langPref) {
          state.langPref = snap.lang;
          state.pendingLangPref = snap.lang;
          state.storage.lang = snap.lang;
          applyI18nToDom();
        } else {
          updateBadgesUI();
        }
      }

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
        showToast(t('toastNoteRemovedExt'));
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
          showToast(t('toastSyncedExt'));
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

      const singleDollarMath = line.match(/^\s*\$\$(.+?)\$\$\s*$/);
      if (singleDollarMath && !singleDollarMath[1].includes('$$')) {
        blocks.push(
          makeBlock('math', {
            delim: '$$',
            singleLine: true,
            text: singleDollarMath[1].trim(),
          })
        );
        i++;
        continue;
      }

      const openDollarFence = line.match(/^\s*\$\$(.*)$/);
      if (openDollarFence && !openDollarFence[1].includes('$$')) {
        const mathLines = [];
        const firstRest = openDollarFence[1].trim();
        if (firstRest) mathLines.push(firstRest);
        i++;
        while (i < lines.length) {
          const cur = lines[i];
          if (/^\s*\$\$\s*$/.test(cur)) {
            i++;
            break;
          }
          const trimmedEnd = cur.trimEnd();
          if (trimmedEnd.endsWith('$$') && !trimmedEnd.endsWith('\\$$')) {
            const beforeClose = trimmedEnd.slice(0, -2).trimEnd();
            if (beforeClose) mathLines.push(beforeClose);
            i++;
            break;
          }
          mathLines.push(cur);
          i++;
        }
        blocks.push(
          makeBlock('math', {
            delim: '$$',
            singleLine: false,
            text: mathLines.join('\n'),
          })
        );
        continue;
      }

      const singleBracketMath = line.match(/^\s*\\\[(.+?)\\\]\s*$/);
      if (singleBracketMath && !singleBracketMath[1].includes('\\]')) {
        blocks.push(
          makeBlock('math', {
            delim: '\\[',
            singleLine: true,
            text: singleBracketMath[1].trim(),
          })
        );
        i++;
        continue;
      }

      const openBracketFence = line.match(/^\s*\\\[(.*)$/);
      if (openBracketFence && !openBracketFence[1].includes('\\]')) {
        const mathLines = [];
        const firstRest = openBracketFence[1].trim();
        if (firstRest) mathLines.push(firstRest);
        i++;
        while (i < lines.length) {
          const cur = lines[i];
          if (/^\s*\\\]\s*$/.test(cur)) {
            i++;
            break;
          }
          const trimmedEnd = cur.trimEnd();
          if (trimmedEnd.endsWith('\\]')) {
            const beforeClose = trimmedEnd.slice(0, -2).trimEnd();
            if (beforeClose) mathLines.push(beforeClose);
            i++;
            break;
          }
          mathLines.push(cur);
          i++;
        }
        blocks.push(
          makeBlock('math', {
            delim: '\\[',
            singleLine: false,
            text: mathLines.join('\n'),
          })
        );
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
      case 'math': {
        const open = b.delim === '\\[' ? '\\[' : '$$';
        const close = b.delim === '\\[' ? '\\]' : '$$';
        if (b.singleLine && !String(b.text || '').includes('\n')) {
          return `${open} ${b.text} ${close}`;
        }
        return `${open}\n${b.text}\n${close}`;
      }
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
  // Safe Inline Markdown, LaTeX Math (KaTeX + mhchem + physics) & Table Renderer
  // -------------------------------------------------------------------------

  const DEFAULT_KATEX_MACROS = Object.freeze({
    '\\dd': '\\mathop{}\\!\\mathrm{d}',
    '\\dv': '\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}',
    '\\pdv': '\\frac{\\partial #1}{\\partial #2}',
    '\\fdv': '\\frac{\\delta #1}{\\delta #2}',
    '\\grad': '\\boldsymbol{\\nabla}',
    '\\curl': '\\boldsymbol{\\nabla}\\times',
    '\\divergence': '\\boldsymbol{\\nabla}\\cdot',
    '\\laplacian': '\\nabla^2',
    '\\abs': '\\left|#1\\right|',
    '\\norm': '\\left\\|#1\\right\\|',
    '\\eval': '\\left.#1\\right|',
    '\\order': '\\mathcal{O}\\left(#1\\right)',
    '\\ip': '\\left\\langle #1, #2 \\right\\rangle',
    '\\dyad': '\\left|#1\\middle\\rangle\\!\\middle\\langle #2\\right|',
    '\\mel': '\\left\\langle #1\\middle|#2\\middle|#3\\right\\rangle',
    '\\argmax': '\\operatorname*{arg\\,max}',
    '\\argmin': '\\operatorname*{arg\\,min}',
    '\\Tr': '\\operatorname{Tr}',
    '\\tr': '\\operatorname{tr}',
    '\\rank': '\\operatorname{rank}',
    '\\diag': '\\operatorname{diag}',
    '\\Var': '\\operatorname{Var}',
    '\\Cov': '\\operatorname{Cov}',
    '\\E': '\\mathbb{E}',
    '\\Prob': '\\mathbb{P}',
    '\\R': '\\mathbb{R}',
    '\\N': '\\mathbb{N}',
    '\\Z': '\\mathbb{Z}',
    '\\Q': '\\mathbb{Q}',
    '\\C': '\\mathbb{C}',
    '\\transpose': '^{\\mathsf{T}}',
  });

  const MACRO_DEF_RE =
    /\\(?:gdef|xdef|def|newcommand|renewcommand|providecommand|DeclareMathOperator)\b/;

  function createNoteMacros() {
    return { ...DEFAULT_KATEX_MACROS };
  }

  let katexFallbackPromise = null;

  function loadScriptDynamic(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }

  function ensureKatexLoaded() {
    if (
      typeof window.katex !== 'undefined' &&
      typeof window.KATEX_COMPLETIONS !== 'undefined'
    ) {
      return Promise.resolve(true);
    }
    if (katexFallbackPromise) return katexFallbackPromise;
    katexFallbackPromise = (async () => {
      try {
        if (typeof window.katex === 'undefined') {
          if (!document.getElementById('katex-hot-css')) {
            const link = document.createElement('link');
            link.id = 'katex-hot-css';
            link.rel = 'stylesheet';
            link.href = '/api/config?katexAsset=katex.min.css&v=2';
            const mainStyles = document.querySelector('link[href="/styles.css"]');
            if (mainStyles && mainStyles.parentNode) {
              mainStyles.parentNode.insertBefore(link, mainStyles);
            } else {
              document.head.appendChild(link);
            }
          }
          await loadScriptDynamic('/api/config?katexAsset=katex.min.js&v=2');
          await loadScriptDynamic('/api/config?katexAsset=mhchem.min.js&v=2').catch(() => {});
          await loadScriptDynamic('/api/config?katexAsset=copy-tex.min.js&v=2').catch(() => {});
        }
        if (typeof window.KATEX_COMPLETIONS === 'undefined') {
          await loadScriptDynamic('/api/config?katexAsset=completions.js&v=2').catch(() => {});
        }
        return typeof window.katex !== 'undefined';
      } catch {
        katexFallbackPromise = null;
        return false;
      }
    })();
    return katexFallbackPromise;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderKatexHtml(tex, displayMode, macros) {
    const cleanTex = String(tex || '').trim();
    if (!cleanTex) return '';
    if (typeof window.katex === 'undefined') {
      const delim = displayMode ? '$$' : '$';
      return `<code class="math-fallback">${escapeHtml(`${delim}${cleanTex}${delim}`)}</code>`;
    }
    const targetMacros = macros || createNoteMacros();
    const hasMacroDef = MACRO_DEF_RE.test(cleanTex);
    try {
      return window.katex.renderToString(cleanTex, {
        displayMode: Boolean(displayMode),
        throwOnError: false,
        errorColor: '#d14343',
        strict: 'ignore',
        trust: false,
        globalGroup: hasMacroDef,
        macros: targetMacros,
      });
    } catch {
      return `<code class="math-fallback">${escapeHtml(cleanTex)}</code>`;
    }
  }

  function findClosingSeq(str, startIdx, closeSeq) {
    let j = startIdx;
    while (j <= str.length - closeSeq.length) {
      if (str[j] === '\\') {
        if (str.startsWith(closeSeq, j)) return j;
        j += 2;
        continue;
      }
      if (str.startsWith(closeSeq, j)) return j;
      j++;
    }
    return -1;
  }

  function extractInlineMathTokens(str, mathTokens, macros) {
    let out = '';
    let i = 0;
    const len = str.length;

    while (i < len) {
      if (str[i] === '\\') {
        if (str.startsWith('\\\\', i)) {
          out += '\\\\';
          i += 2;
          continue;
        }
        if (str.startsWith('\\$', i)) {
          out += '\u0000ESCAPED_DOLLAR\u0000';
          i += 2;
          continue;
        }
        if (str.startsWith('\\[', i)) {
          const endIdx = findClosingSeq(str, i + 2, '\\]');
          if (endIdx !== -1) {
            const inner = str.slice(i + 2, endIdx);
            if (inner.trim()) {
              const tokenIdx = mathTokens.length;
              mathTokens.push(
                `<span class="math-inline-display">${renderKatexHtml(inner, true, macros)}</span>`
              );
              out += `\u0000MATH${tokenIdx}\u0000`;
              i = endIdx + 2;
              continue;
            }
          }
        }
        if (str.startsWith('\\(', i)) {
          const endIdx = findClosingSeq(str, i + 2, '\\)');
          if (endIdx !== -1) {
            const inner = str.slice(i + 2, endIdx);
            if (inner.trim()) {
              const tokenIdx = mathTokens.length;
              mathTokens.push(renderKatexHtml(inner, false, macros));
              out += `\u0000MATH${tokenIdx}\u0000`;
              i = endIdx + 2;
              continue;
            }
          }
        }
        out += '\\';
        i++;
        continue;
      }

      // Inline $$ ... $$
      if (str.startsWith('$$', i) && str[i + 2] !== '$') {
        const endIdx = findClosingSeq(str, i + 2, '$$');
        if (endIdx !== -1) {
          const inner = str.slice(i + 2, endIdx);
          if (inner.trim()) {
            const tokenIdx = mathTokens.length;
            mathTokens.push(
              `<span class="math-inline-display">${renderKatexHtml(inner, true, macros)}</span>`
            );
            out += `\u0000MATH${tokenIdx}\u0000`;
            i = endIdx + 2;
            continue;
          }
        }
      }

      // Inline $ ... $ (smart currency disambiguation)
      if (str[i] === '$' && str[i + 1] !== '$') {
        const prevCh = i > 0 ? str[i - 1] : '';
        const nextCh = i + 1 < len ? str[i + 1] : '';
        const prevOk = !prevCh || !/[0-9A-Za-z$]/.test(prevCh);
        const nextOk = Boolean(nextCh) && !/\s/.test(nextCh);

        if (prevOk && nextOk) {
          let j = i + 1;
          let matchedEnd = -1;
          while (j < len && str[j] !== '\n') {
            if (str[j] === '\\') {
              j += 2;
              continue;
            }
            if (str[j] === '$' && str[j + 1] !== '$') {
              const beforeClose = str[j - 1];
              const afterClose = j + 1 < len ? str[j + 1] : '';
              if (!/\s/.test(beforeClose) && !/[0-9]/.test(afterClose)) {
                matchedEnd = j;
              }
              break;
            }
            j++;
          }
          if (matchedEnd !== -1) {
            const inner = str.slice(i + 1, matchedEnd);
            if (inner.trim()) {
              const tokenIdx = mathTokens.length;
              mathTokens.push(renderKatexHtml(inner, false, macros));
              out += `\u0000MATH${tokenIdx}\u0000`;
              i = matchedEnd + 1;
              continue;
            }
          }
        }
      }

      out += str[i];
      i++;
    }

    return out.replace(/\u0000ESCAPED_DOLLAR\u0000/g, '$');
  }

  function formatInlineEmphasis(escaped) {
    let out = escaped;
    out = out.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    out = out.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    return out;
  }

  function buildMarkdownAnchorHtml(rawLabel, rawHref) {
    const href = String(rawHref || '').trim();
    const labelHtml = formatInlineEmphasis(escapeHtml(rawLabel));

    const convMatch = href.match(/^conversation:\/\/([A-Za-z0-9_-]+)\/?(?:#[^\s]*)?$/i);
    if (convMatch) {
      const convId = convMatch[1];
      const tip = escapeHtml(t('convLinkTitle', convId.slice(0, 8)));
      return `<a href="${escapeHtml(href)}" class="md-conv-link" data-conv-id="${escapeHtml(convId)}" title="${tip}">${labelHtml}</a>`;
    }

    if (/^file:\/\/\/?[^\s<>"]+$/i.test(href)) {
      const tip = escapeHtml(t('fileLinkTitle'));
      return `<a href="${escapeHtml(href)}" class="md-file-link" data-file-uri="${escapeHtml(href)}" title="${tip}">${labelHtml}</a>`;
    }

    if (/^(?:https?:\/\/|mailto:)[^\s<>"]+$/i.test(href)) {
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${labelHtml}</a>`;
    }

    return null;
  }

  function renderInline(text, macros) {
    const raw = String(text ?? '');
    const codeTokens = [];
    const mathTokens = [];
    const linkTokens = [];

    // 1. Protect inline code spans first so `$HOME` / `$1` inside backticks stay literal
    let s = raw.replace(/`([^`]+)`/g, (_, inner) => {
      const idx = codeTokens.length;
      codeTokens.push(`<code>${escapeHtml(inner)}</code>`);
      return `\u0000CODE${idx}\u0000`;
    });

    // 2. Extract and render LaTeX math before HTML escaping & Markdown emphasis (* / _)
    s = extractInlineMathTokens(s, mathTokens, macros);

    // 3. Extract Markdown links (https, mailto, conversation://, file://) before emphasis escaping
    s = s.replace(/\[([^\]]+)\]\(((?:[^\s()<>"]|\([^\s()<>"]*\))+)\)/g, (full, label, href) => {
      const anchorHtml = buildMarkdownAnchorHtml(label, href);
      if (!anchorHtml) return full;
      const idx = linkTokens.length;
      linkTokens.push(anchorHtml);
      return `\u0000LINK${idx}\u0000`;
    });

    // 4. Escape remaining plain-text HTML and apply emphasis
    s = formatInlineEmphasis(escapeHtml(s));

    // 5. Restore links first (so math/code inside link labels also restore), then math & code
    s = s.replace(/\u0000LINK(\d+)\u0000/g, (_, idx) => linkTokens[Number(idx)] || '');
    s = s.replace(/\u0000MATH(\d+)\u0000/g, (_, idx) => mathTokens[Number(idx)] || '');
    s = s.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codeTokens[Number(idx)] || '');
    return s;
  }

  function splitMarkdownTableRow(row) {
    let trimmed = String(row || '').trim();
    if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
    if (trimmed.endsWith('|') && !trimmed.endsWith('\\|')) trimmed = trimmed.slice(0, -1);

    const cells = [];
    let cur = '';
    let inCode = false;
    let inMathDollar = 0; // 0 = outside, 1 = $, 2 = $$
    let inMathBracket = ''; // '' | ')' | ']'

    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (ch === '\\' && i + 1 < trimmed.length) {
        const nxt = trimmed[i + 1];
        if (!inCode && inMathDollar === 0 && !inMathBracket) {
          if (nxt === '|') {
            cur += '|';
            i++;
            continue;
          }
          if (nxt === '(' || nxt === '[') {
            inMathBracket = nxt === '(' ? ')' : ']';
            cur += ch + nxt;
            i++;
            continue;
          }
        } else if (inMathBracket && nxt === inMathBracket) {
          inMathBracket = '';
          cur += ch + nxt;
          i++;
          continue;
        }
        cur += ch + nxt;
        i++;
        continue;
      }
      if (ch === '`' && inMathDollar === 0 && !inMathBracket) {
        inCode = !inCode;
        cur += ch;
        continue;
      }
      if (!inCode && !inMathBracket && ch === '$') {
        if (trimmed[i + 1] === '$') {
          inMathDollar = inMathDollar === 2 ? 0 : inMathDollar === 0 ? 2 : inMathDollar;
          cur += '$$';
          i++;
          continue;
        }
        inMathDollar = inMathDollar === 1 ? 0 : inMathDollar === 0 ? 1 : inMathDollar;
        cur += ch;
        continue;
      }
      if (ch === '|' && !inCode && inMathDollar === 0 && !inMathBracket) {
        cells.push(cur.trim());
        cur = '';
        continue;
      }
      cur += ch;
    }
    cells.push(cur.trim());
    return cells;
  }

  function renderTableHtml(raw, macros) {
    const lines = String(raw || '').trim().split(/\r?\n/);
    if (lines.length < 2) return `<p>${renderInline(raw, macros)}</p>`;
    const headers = splitMarkdownTableRow(lines[0]);
    const rows = lines.slice(2).map(splitMarkdownTableRow);
    const thead = `<thead><tr>${headers.map((h) => `<th>${renderInline(h, macros)}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${rows
      .map(
        (r) =>
          `<tr>${headers.map((_, idx) => `<td>${renderInline(r[idx] || '', macros)}</td>`).join('')}</tr>`
      )
      .join('')}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
  }

  function computeMacrosBeforeBlock(targetIdx) {
    const macros = createNoteMacros();
    const limit = Math.min(targetIdx, state.blocks.length);
    for (let i = 0; i < limit; i++) {
      const b = state.blocks[i];
      if (!b || !b.text || b.type === 'code' || b.type === 'hr') continue;
      if (!MACRO_DEF_RE.test(b.text)) continue;
      if (b.type === 'math') {
        renderKatexHtml(b.text, true, macros);
      } else if (b.type === 'table') {
        renderTableHtml(b.text, macros);
      } else {
        renderInline(b.text, macros);
      }
    }
    return macros;
  }

  function autoResizeTextarea(ta) {
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.max(ta.scrollHeight, 24)}px`;
  }

  // -------------------------------------------------------------------------
  // 0ms Offline KaTeX Command & Environment Autocomplete Engine
  // -------------------------------------------------------------------------

  const acPreviewCache = new Map();
  let caretMirrorEl = null;

  const acState = {
    open: false,
    ta: null,
    block: null,
    onAfterAccept: null,
    items: [],
    selectedIdx: 0,
    anchorPos: 0,
  };

  function getMathCaretContext(ta, block = null) {
    if (!ta || ta.selectionStart !== ta.selectionEnd) {
      return { inMath: false, multiline: false };
    }
    if (block) {
      if (block.type === 'code' || block.type === 'hr') {
        return { inMath: false, multiline: false };
      }
      if (block.type === 'math') {
        return { inMath: true, multiline: true };
      }
    }

    const val = ta.value;
    const caret = ta.selectionStart;
    const isSource = !block;

    let inCodeFence = false;
    let inInlineCode = false;
    let inDoubleDollar = false;
    let inSingleDollar = false;
    let inBracketDisplay = false;
    let inParenInline = false;

    let i = 0;
    while (i < caret) {
      if (isSource && (i === 0 || val[i - 1] === '\n')) {
        const lineEnd = val.indexOf('\n', i);
        const lineStr = lineEnd === -1 ? val.slice(i) : val.slice(i, lineEnd);
        if (/^\s*```/.test(lineStr)) {
          inCodeFence = !inCodeFence;
          if (lineEnd === -1 || lineEnd >= caret) {
            return { inMath: false, multiline: false };
          }
          i = lineEnd + 1;
          continue;
        }
      }

      if (inCodeFence) {
        i++;
        continue;
      }

      const ch = val[i];
      if (ch === '\n') {
        inInlineCode = false;
        inSingleDollar = false;
        i++;
        continue;
      }

      if (ch === '`') {
        inInlineCode = !inInlineCode;
        i++;
        continue;
      }
      if (inInlineCode) {
        i++;
        continue;
      }

      if (ch === '\\') {
        const nxt = val[i + 1];
        if (nxt === '[') {
          inBracketDisplay = true;
          i += 2;
          continue;
        }
        if (nxt === ']') {
          inBracketDisplay = false;
          i += 2;
          continue;
        }
        if (nxt === '(') {
          inParenInline = true;
          i += 2;
          continue;
        }
        if (nxt === ')') {
          inParenInline = false;
          i += 2;
          continue;
        }
        if (nxt === '$' || nxt === '\\' || nxt === '`') {
          i += 2;
          continue;
        }
        i++;
        continue;
      }

      if (ch === '$') {
        if (val[i + 1] === '$') {
          inDoubleDollar = !inDoubleDollar;
          i += 2;
          continue;
        }
        if (!inDoubleDollar) {
          inSingleDollar = !inSingleDollar;
        }
        i++;
        continue;
      }

      i++;
    }

    if (inBracketDisplay || inDoubleDollar) {
      return { inMath: true, multiline: isSource };
    }
    if (inParenInline || inSingleDollar) {
      return { inMath: true, multiline: false };
    }
    return { inMath: false, multiline: false };
  }

  function scoreAcCandidate(bare, query, tier) {
    if (!query) return 1000 + tier * 300 - bare.length * 5;
    const qLow = query.toLowerCase();
    const bLow = bare.toLowerCase();
    if (bare === query) return 10000 + tier * 200;
    if (bLow === qLow) return 9000 + tier * 200;
    if (bare.startsWith(query)) return 6000 + tier * 400 - bare.length * 8;
    if (bLow.startsWith(qLow)) return 4000 + tier * 350 - bare.length * 8;
    if (query.length >= 2) {
      const pos = bLow.indexOf(qLow);
      if (pos !== -1) {
        return 1500 + tier * 300 - pos * 15 - bare.length * 6;
      }
    }
    return -1;
  }

  function buildEnvInsertTemplate(envName, insArgs, multiline, afterCaret) {
    const hasEndAlready = afterCaret.includes(`\\end{${envName}}`);
    if (hasEndAlready) {
      return `\\begin{${envName}}${insArgs || '$0'}`;
    }
    const argPart = insArgs || '';
    const hasArgCursor = argPart.includes('$0');
    const bodyCursor = hasArgCursor ? '' : '$0';
    if (multiline) {
      return `\\begin{${envName}}${argPart}\n  ${bodyCursor}\n\\end{${envName}}`;
    }
    return `\\begin{${envName}}${argPart} ${bodyCursor} \\end{${envName}}`;
  }

  function queryLatexCompletions(beforeCaret, afterCaret, multiline) {
    const catalog = window.KATEX_COMPLETIONS;
    if (!catalog) return null;

    // 1. Inside \begin{... or \end{...
    const envTag = beforeCaret.match(/(?:^|[^\\])(?:\\\\)*(\\(begin|end)\{([A-Za-z*]*))$/);
    if (envTag) {
      const fullSeq = envTag[1];
      const tagKind = envTag[2];
      const query = envTag[3] || '';
      const replaceStart = beforeCaret.length - fullSeq.length;
      const consumeRight = afterCaret.startsWith('}') ? 1 : 0;
      const scored = [];

      for (const [envName, insArgs, prev, tier] of catalog.envs) {
        const sc = scoreAcCandidate(envName, query, tier);
        if (sc < 0) continue;
        const ins =
          tagKind === 'end'
            ? `\\end{${envName}}$0`
            : buildEnvInsertTemplate(envName, insArgs, multiline, afterCaret.slice(consumeRight));
        scored.push({
          score: sc,
          label: `\\${tagKind}{${envName}}`,
          ins,
          prev,
          replaceStart,
          replaceEnd: beforeCaret.length + consumeRight,
        });
      }
      scored.sort((a, b) => b.score - a.score);
      return scored.length ? { anchorPos: replaceStart, items: scored.slice(0, 12) } : null;
    }

    // 2. Command or shorthand environment after single unescaped \
    const cmdMatch = beforeCaret.match(/(?:^|[^\\])(?:\\\\)*(\\[A-Za-z]+)$/);
    if (!cmdMatch) return null;

    const fullCmd = cmdMatch[1]; // e.g. \fr
    const query = fullCmd.slice(1);
    const replaceStart = beforeCaret.length - fullCmd.length;
    const replaceEnd = beforeCaret.length;
    const scored = [];

    // Include \begin{...} trigger itself
    const beginScore = scoreAcCandidate('begin', query, 2);
    if (beginScore >= 0) {
      scored.push({
        score: beginScore,
        label: '\\begin{…}',
        ins: '\\begin{$0}',
        prev: '\\begin{bmatrix} a & b \\end{bmatrix}',
        replaceStart,
        replaceEnd,
        retrigger: true,
      });
    }

    for (const [name, ins, prev, tier] of catalog.cmds) {
      const bare = name.slice(1);
      const sc = scoreAcCandidate(bare, query, tier);
      if (sc < 0) continue;
      const fullIns = ins || name;
      scored.push({
        score: sc,
        label: fullIns.replace(/\$0/g, ''),
        ins: fullIns,
        prev: prev || name,
        replaceStart,
        replaceEnd,
      });
    }

    for (const [envName, insArgs, prev, tier] of catalog.envs) {
      const sc = scoreAcCandidate(envName, query, tier);
      if (sc < 0) continue;
      scored.push({
        score: sc + 20,
        label: `\\begin{${envName}}`,
        ins: buildEnvInsertTemplate(envName, insArgs, multiline, afterCaret),
        prev,
        replaceStart,
        replaceEnd,
      });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.length ? { anchorPos: replaceStart, items: scored.slice(0, 12) } : null;
  }

  function renderAcPreviewHtml(prevTex) {
    if (!prevTex) return '';
    if (acPreviewCache.has(prevTex)) {
      return acPreviewCache.get(prevTex);
    }
    let html = '';
    if (typeof window.katex !== 'undefined') {
      try {
        html = window.katex.renderToString(prevTex, {
          displayMode: false,
          throwOnError: false,
          strict: 'ignore',
          trust: false,
          macros: createNoteMacros(),
        });
      } catch {
        html = escapeHtml(prevTex);
      }
    } else {
      html = escapeHtml(prevTex);
    }
    acPreviewCache.set(prevTex, html);
    return html;
  }

  function getTextareaCaretCoords(ta, charIndex) {
    if (typeof window.getComputedStyle !== 'function') {
      return { left: 16, top: 40, lineHeight: 20 };
    }
    if (!caretMirrorEl) {
      caretMirrorEl = document.createElement('div');
      caretMirrorEl.id = 'latex-caret-mirror';
      caretMirrorEl.setAttribute('aria-hidden', 'true');
      caretMirrorEl.style.position = 'fixed';
      caretMirrorEl.style.top = '-9999px';
      caretMirrorEl.style.left = '-9999px';
      caretMirrorEl.style.visibility = 'hidden';
      caretMirrorEl.style.pointerEvents = 'none';
      caretMirrorEl.style.whiteSpace = 'pre-wrap';
      caretMirrorEl.style.wordBreak = 'break-word';
      document.body.appendChild(caretMirrorEl);
    }

    const cs = window.getComputedStyle(ta);
    const copyProps = [
      'boxSizing',
      'width',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontStyle',
      'lineHeight',
      'letterSpacing',
      'tabSize',
    ];
    for (const p of copyProps) {
      caretMirrorEl.style[p] = cs[p];
    }

    caretMirrorEl.textContent = ta.value.slice(0, charIndex);
    const marker = document.createElement('span');
    marker.textContent = ta.value.slice(charIndex, charIndex + 1) || '|';
    caretMirrorEl.appendChild(marker);

    const taRect = ta.getBoundingClientRect();
    const appNode = document.getElementById('app') || document.body;
    const appRect = appNode.getBoundingClientRect();
    const lineH = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) || 13) * 1.6;

    return {
      left: taRect.left - appRect.left + marker.offsetLeft - ta.scrollLeft,
      top: taRect.top - appRect.top + marker.offsetTop - ta.scrollTop,
      lineHeight: lineH,
      appWidth: appRect.width || 340,
      appHeight: appRect.height || 600,
    };
  }

  function positionLatexAcPopup() {
    if (!acState.open || !acState.ta || !el.latexAc) return;
    const coords = getTextareaCaretCoords(acState.ta, acState.anchorPos);
    const popupW = Math.min(280, Math.max(210, coords.appWidth - 16));
    el.latexAc.style.width = `${popupW}px`;

    const popupH = Math.min(228, el.latexAc.scrollHeight || 180);
    let left = Math.max(8, Math.min(coords.left, coords.appWidth - popupW - 8));
    let top = coords.top + coords.lineHeight + 4;
    if (top + popupH > coords.appHeight - 28 && coords.top - popupH - 4 > 36) {
      top = coords.top - popupH - 4;
    }
    el.latexAc.style.left = `${Math.round(left)}px`;
    el.latexAc.style.top = `${Math.round(top)}px`;
  }

  function closeLatexAc() {
    if (!acState.open && el.latexAc?.classList.contains('hidden')) return;
    acState.open = false;
    acState.ta = null;
    acState.block = null;
    acState.onAfterAccept = null;
    acState.items = [];
    acState.selectedIdx = 0;
    if (el.latexAc) {
      el.latexAc.classList.add('hidden');
      el.latexAc.innerHTML = '';
    }
  }

  function syncLatexAcSelectionInDom() {
    if (!el.latexAc) return;
    const children = el.latexAc.children;
    for (let i = 0; i < children.length; i++) {
      const isSel = i === acState.selectedIdx;
      children[i].classList.toggle('is-selected', isSel);
      if (isSel && typeof children[i].scrollIntoView === 'function') {
        children[i].scrollIntoView({ block: 'nearest' });
      }
    }
  }

  function acceptLatexAcItem(index = acState.selectedIdx) {
    const item = acState.items[index];
    const ta = acState.ta;
    const block = acState.block;
    const afterCb = acState.onAfterAccept;
    if (!item || !ta) {
      closeLatexAc();
      return false;
    }

    const val = ta.value;
    const cursorTokenPos = item.ins.indexOf('$0');
    const cleanIns = item.ins.replace(/\$0/g, '');
    const caretOffset = cursorTokenPos !== -1 ? cursorTokenPos : cleanIns.length;

    const nextVal = val.slice(0, item.replaceStart) + cleanIns + val.slice(item.replaceEnd);
    const nextCaret = item.replaceStart + caretOffset;

    ta.value = nextVal;
    ta.focus();
    ta.setSelectionRange(nextCaret, nextCaret);

    if (block) {
      block.text = nextVal;
      if (MACRO_DEF_RE.test(block.text)) {
        state.activeBlockTouchedMacro = true;
      }
      if (block.type === 'math' && block.text.includes('\n')) {
        block.singleLine = false;
      }
    }

    closeLatexAc();
    if (typeof afterCb === 'function') {
      afterCb();
    } else {
      scheduleSave();
    }

    if (item.retrigger) {
      updateLatexAcForTextarea(ta, block, afterCb);
    }
    return true;
  }

  function renderLatexAcPopup() {
    if (!el.latexAc || !acState.items.length) {
      closeLatexAc();
      return;
    }
    el.latexAc.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < acState.items.length; i++) {
      const it = acState.items[i];
      const row = document.createElement('div');
      row.className = `latex-ac-item${i === acState.selectedIdx ? ' is-selected' : ''}`;
      row.dataset.idx = String(i);
      row.setAttribute('role', 'option');

      const cmdSpan = document.createElement('span');
      cmdSpan.className = 'latex-ac-cmd';
      cmdSpan.textContent = it.label;

      const prevSpan = document.createElement('span');
      prevSpan.className = 'latex-ac-prev';
      prevSpan.innerHTML = renderAcPreviewHtml(it.prev);

      row.append(cmdSpan, prevSpan);
      frag.appendChild(row);
    }
    el.latexAc.appendChild(frag);
    el.latexAc.classList.remove('hidden');
    positionLatexAcPopup();
  }

  function updateLatexAcForTextarea(ta, block = null, onAfterAccept = null) {
    if (!ta || !el.latexAc) {
      closeLatexAc();
      return;
    }
    const mathCtx = getMathCaretContext(ta, block);
    if (!mathCtx.inMath) {
      closeLatexAc();
      return;
    }
    const caret = ta.selectionStart;
    const before = ta.value.slice(0, caret);
    const after = ta.value.slice(caret);
    const res = queryLatexCompletions(before, after, mathCtx.multiline);
    if (!res || !res.items.length) {
      closeLatexAc();
      return;
    }

    acState.open = true;
    acState.ta = ta;
    acState.block = block;
    acState.onAfterAccept = onAfterAccept;
    acState.anchorPos = res.anchorPos;
    acState.items = res.items;
    acState.selectedIdx = 0;
    renderLatexAcPopup();
  }

  function tryMathBraceTabJump(ta, block = null) {
    if (!ta || ta.selectionStart !== ta.selectionEnd) return false;
    if (!getMathCaretContext(ta, block).inMath) return false;
    const pos = ta.selectionStart;
    const after = ta.value.slice(pos);
    const nextArg = after.match(/^[ \t]*\}\{/);
    if (nextArg) {
      const target = pos + nextArg[0].length;
      ta.setSelectionRange(target, target);
      return true;
    }
    const exitDelim = after.match(/^[ \t]*(?:\}|\)|\]|\$\$|\$|\\\)|\\\])/);
    if (exitDelim) {
      const target = pos + exitDelim[0].length;
      ta.setSelectionRange(target, target);
      return true;
    }
    return false;
  }

  // Chinese IME helper:
  // 1) Typing `￥￥` (or `¥¥`) replaces it with `$$` and places the caret right in the middle (`$|$`);
  //    typing `￥￥` again inside empty `$|$` upgrades it to `$$|$$`.
  // 2) Typing Chinese `、` (from the `\` key while in Chinese IME) inside math mode auto-converts to `\`.
  function tryNormalizeChineseMathInput(ta, block = null) {
    if (!ta || ta.selectionStart !== ta.selectionEnd) return false;
    if (block && (block.type === 'code' || block.type === 'hr')) return false;

    const val = ta.value;
    const caret = ta.selectionStart;

    if (caret >= 2) {
      const prevTwo = val.slice(caret - 2, caret);
      if (/^[￥¥]{2}$/.test(prevTwo)) {
        if (!block) {
          // In raw source mode, ensure we're not inside a code block/span
          const probe = val.slice(0, caret - 2);
          const fenceCount = (probe.match(/^\s*```/gm) || []).length;
          const lineStart = probe.lastIndexOf('\n') + 1;
          const tickCount = (probe.slice(lineStart).match(/`/g) || []).length;
          if (fenceCount % 2 === 1 || tickCount % 2 === 1) return false;
        }
        const nextVal = val.slice(0, caret - 2) + '$$' + val.slice(caret);
        const nextCaret = caret - 1;
        ta.value = nextVal;
        ta.setSelectionRange(nextCaret, nextCaret);
        if (block) block.text = nextVal;
        return true;
      }
    }

    if (caret >= 1 && val[caret - 1] === '、') {
      if (getMathCaretContext(ta, block).inMath) {
        const nextVal = val.slice(0, caret - 1) + '\\' + val.slice(caret);
        ta.value = nextVal;
        ta.setSelectionRange(caret, caret);
        if (block) block.text = nextVal;
        return true;
      }
    }

    return false;
  }

  function tryDeleteEmptyDollarPair(e, ta, block = null) {
    if (e.key !== 'Backspace' || ta.selectionStart !== ta.selectionEnd) return false;
    if (block && (block.type === 'code' || block.type === 'hr' || block.type === 'math')) {
      return false;
    }
    const pos = ta.selectionStart;
    const val = ta.value;
    if (pos > 0 && val[pos - 1] === '$' && val[pos] === '$' && val[pos - 2] !== '\\') {
      e.preventDefault();
      const nextVal = val.slice(0, pos - 1) + val.slice(pos + 1);
      ta.value = nextVal;
      ta.setSelectionRange(pos - 1, pos - 1);
      if (block) block.text = nextVal;
      return true;
    }
    return false;
  }

  function handleLatexAcKeydown(e, ta, block = null) {
    if (!acState.open || acState.ta !== ta) return false;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      acState.selectedIdx = (acState.selectedIdx + 1) % acState.items.length;
      syncLatexAcSelectionInDom();
      return true;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      acState.selectedIdx =
        (acState.selectedIdx - 1 + acState.items.length) % acState.items.length;
      syncLatexAcSelectionInDom();
      return true;
    }
    if (
      (e.key === 'Tab' && !e.shiftKey) ||
      (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.shiftKey)
    ) {
      e.preventDefault();
      e.stopPropagation();
      return acceptLatexAcItem(acState.selectedIdx);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeLatexAc();
      return true;
    }
    return false;
  }

  // -------------------------------------------------------------------------
  // Live Preview Editor (IME-Safe In-Place Transforms + @@ Trigger)
  // -------------------------------------------------------------------------

  function blockPlaceholder(b, idx) {
    if (b.type === 'h1') return t('phH1');
    if (b.type === 'h2') return t('phH2');
    if (b.type === 'h3') return t('phH3');
    if (b.type === 'h4') return t('phH4');
    if (b.type === 'quote') return t('phQuote');
    if (b.type === 'ul' || b.type === 'ol') return t('phList');
    if (b.type === 'todo') return t('phTodo');
    if (b.type === 'code') return t('phCode');
    if (b.type === 'math') return t('phMath');
    if (idx === 0 && state.blocks.length <= 2) {
      return t('phFirstLine');
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

  let applyingPipeTrigger = false;

  function isCaretBlockedForPipeTrigger(ta, triggerStart, block = null) {
    if (
      block &&
      (block.type === 'code' || block.type === 'math' || block.type === 'table' || block.type === 'hr')
    ) {
      return true;
    }
    const val = ta.value;
    if (!block) {
      const beforeAll = val.slice(0, triggerStart);
      const fenceLines = (beforeAll.match(/^\s*```/gm) || []).length;
      if (fenceLines % 2 === 1) return true;
    }

    const lineStart = triggerStart > 0 ? val.lastIndexOf('\n', triggerStart - 1) + 1 : 0;
    const lineBefore = val.slice(lineStart, triggerStart);

    // Do not hijack Markdown table cells (lines starting with `|`)
    if (/^\s*\|/.test(lineBefore)) return true;

    // Do not hijack inline code spans (`a || b`)
    let unescapedTicks = 0;
    for (let k = 0; k < lineBefore.length; k++) {
      if (lineBefore[k] === '\\') {
        k++;
        continue;
      }
      if (lineBefore[k] === '`') unescapedTicks++;
    }
    if (unescapedTicks % 2 === 1) return true;

    // Do not hijack LaTeX math norms ($||x||$)
    if (getMathCaretContext(ta, block).inMath) return true;

    return false;
  }

  function replaceRangeInTextarea(ta, start, end, insertText) {
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    const expected = before + insertText + after;
    const nextCaret = start + insertText.length;

    applyingPipeTrigger = true;
    try {
      let applied = false;
      if (document.activeElement === ta && typeof document.execCommand === 'function') {
        ta.setSelectionRange(start, end);
        try {
          applied = document.execCommand('insertText', false, insertText);
        } catch {
          applied = false;
        }
      }
      if (!applied || ta.value !== expected) {
        ta.value = expected;
      }
      ta.setSelectionRange(nextCaret, nextCaret);
    } finally {
      applyingPipeTrigger = false;
    }
  }

  function upgradePlaceholderConvLink(targetBlock, targetIdx, oldLinkMd, newLinkMd) {
    if (!oldLinkMd || !newLinkMd || oldLinkMd === newLinkMd) return;
    const delta = newLinkMd.length - oldLinkMd.length;

    if (targetBlock) {
      if (!state.blocks.includes(targetBlock)) return;
      const pos = targetBlock.text.indexOf(oldLinkMd);
      if (pos === -1) return;
      targetBlock.text =
        targetBlock.text.slice(0, pos) + newLinkMd + targetBlock.text.slice(pos + oldLinkMd.length);

      const curIdx = state.blocks.indexOf(targetBlock);
      if (!state.sourceMode && curIdx !== -1) {
        if (state.activeBlockIndex === curIdx) {
          const row = el.blocksRoot.children[curIdx];
          const activeTa = row?.querySelector('.block-input');
          if (activeTa) {
            const s = activeTa.selectionStart;
            const e = activeTa.selectionEnd;
            applyingPipeTrigger = true;
            try {
              activeTa.value = targetBlock.text;
              const adj = (p) => (p >= pos + oldLinkMd.length ? p + delta : p);
              activeTa.setSelectionRange(adj(s), adj(e));
            } finally {
              applyingPipeTrigger = false;
            }
            autoResizeTextarea(activeTa);
          }
        } else {
          replaceSingleBlockNode(curIdx);
        }
      }
      if (state.selBox.active) renderSelectionOverlay();
      scheduleSave();
      return;
    }

    if (state.sourceMode && el.sourceEditor) {
      const curVal = el.sourceEditor.value;
      const pos = curVal.indexOf(oldLinkMd);
      if (pos === -1) return;
      const s = el.sourceEditor.selectionStart;
      const e = el.sourceEditor.selectionEnd;
      applyingPipeTrigger = true;
      try {
        el.sourceEditor.value =
          curVal.slice(0, pos) + newLinkMd + curVal.slice(pos + oldLinkMd.length);
        const adj = (p) => (p >= pos + oldLinkMd.length ? p + delta : p);
        el.sourceEditor.setSelectionRange(adj(s), adj(e));
      } finally {
        applyingPipeTrigger = false;
      }
      scheduleSave();
    }
  }

  // `||` (or full-width `｜｜` in Chinese IME) shortcut:
  // Instantly inserts `[Current Chat Title](conversation://<conversationId>)` at the caret.
  function tryExtractPipePipeTrigger(block, ta, idx = -1, inputEvent = null) {
    if (applyingPipeTrigger || !ta || ta.selectionStart !== ta.selectionEnd) return false;
    const inputType = String(inputEvent?.inputType || '');
    if (
      inputType === 'insertFromPaste' ||
      inputType === 'insertFromDrop' ||
      inputType === 'historyUndo' ||
      inputType === 'historyRedo' ||
      inputType.startsWith('delete')
    ) {
      return false;
    }

    const val = ta.value;
    const caret = ta.selectionStart;
    if (caret < 2) return false;

    const pair = val.slice(caret - 2, caret);
    if (pair !== '||' && pair !== '｜｜') return false;

    const prevCh = caret >= 3 ? val[caret - 3] : '';
    const nextCh = caret < val.length ? val[caret] : '';
    if (prevCh === '\\' || prevCh === '|' || prevCh === '｜') return false;
    if (nextCh === '|' || nextCh === '｜') return false;

    const triggerStart = caret - 2;
    if (isCaretBlockedForPipeTrigger(ta, triggerStart, block)) {
      return false;
    }

    const knownConvId = String(state.hostConv?.conversationId || state.hostConvId || '').trim();
    if (knownConvId) {
      const hasSameCached = state.hostConv?.conversationId === knownConvId;
      const initialTitle =
        hasSameCached && state.hostConv.title
          ? state.hostConv.title
          : t('defaultConvLabel', knownConvId.slice(0, 8));
      const initialMd = `[${initialTitle}](conversation://${knownConvId})`;

      replaceRangeInTextarea(ta, triggerStart, caret, initialMd);
      if (block) {
        block.text = ta.value;
        autoResizeTextarea(ta);
        if (state.selBox.active) renderSelectionOverlay();
      }
      scheduleSave();
      showToast(t('toastInsertedConvLink'));

      if (!hasSameCached || !state.hostConv?.hasRealTitle) {
        void refreshHostConversation(true).then((fresh) => {
          if (fresh?.conversationId === knownConvId && fresh.hasRealTitle && fresh.title) {
            const nextMd = `[${fresh.title}](conversation://${knownConvId})`;
            upgradePlaceholderConvLink(block, idx, initialMd, nextMd);
          }
        });
      }
      return true;
    }

    // Fallback when opened outside an Aux Pane with `?conversationId=` (e.g. cold global start)
    replaceRangeInTextarea(ta, triggerStart, caret, '');
    if (block) {
      block.text = ta.value;
      autoResizeTextarea(ta);
    }
    void refreshHostConversation(true).then((fresh) => {
      if (!fresh?.conversationId) {
        showToast(t('toastNoHostConv'));
        return;
      }
      const label = fresh.title || t('defaultConvLabel', fresh.conversationId.slice(0, 8));
      const linkMd = `[${label}](conversation://${fresh.conversationId})`;
      if (block) {
        if (!state.blocks.includes(block)) return;
        const curIdx = state.blocks.indexOf(block);
        const row = !state.sourceMode ? el.blocksRoot.children[curIdx] : null;
        const activeTa = row?.querySelector('.block-input');
        if (activeTa) {
          const insertPos = Math.min(activeTa.value.length, Math.max(triggerStart, activeTa.selectionStart));
          replaceRangeInTextarea(activeTa, insertPos, insertPos, linkMd);
          block.text = activeTa.value;
          autoResizeTextarea(activeTa);
        } else {
          const insertPos = Math.min(block.text.length, triggerStart);
          block.text = block.text.slice(0, insertPos) + linkMd + block.text.slice(insertPos);
          if (!state.sourceMode && curIdx !== -1) replaceSingleBlockNode(curIdx);
        }
        if (state.selBox.active) renderSelectionOverlay();
      } else if (state.sourceMode && el.sourceEditor) {
        const insertPos = Math.min(
          el.sourceEditor.value.length,
          Math.max(triggerStart, el.sourceEditor.selectionStart)
        );
        replaceRangeInTextarea(el.sourceEditor, insertPos, insertPos, linkMd);
      }
      scheduleSave();
      showToast(t('toastInsertedConvLink'));
    });
    return true;
  }

  function tryExtractAtAtTrigger(block, ta, idx) {
    if (block.type === 'code' || block.type === 'math') return false;
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
    if (
      !existing ||
      state.activeBlockTouchedMacro ||
      MACRO_DEF_RE.test(state.blocks[idx]?.text || '')
    ) {
      state.activeBlockTouchedMacro = false;
      renderLiveBlocks();
      return;
    }
    const macros = computeMacrosBeforeBlock(idx);
    const nextNode = buildBlockElement(state.blocks[idx], idx, macros);
    el.blocksRoot.replaceChild(nextNode, existing);
    if (state.selBox.active) renderSelectionOverlay();
  }

  function normalizeStandaloneMathParagraph(block) {
    if (!block || block.type !== 'p' || !block.text) return;
    const val = block.text;
    const oneLine =
      val.match(/^\s*(\$\$)(.+?)\$\$\s*$/) || val.match(/^\s*(\\\[)(.+?)\\\]\s*$/);
    if (oneLine && !oneLine[2].includes(oneLine[1] === '\\[' ? '\\]' : '$$')) {
      block.type = 'math';
      block.delim = oneLine[1] === '\\[' ? '\\[' : '$$';
      block.singleLine = true;
      block.text = oneLine[2].trim();
    }
  }

  function activateBlock(index, caretPos = null, forceFullRender = false) {
    if (index < 0 || index >= state.blocks.length) return;
    const prevIdx = state.activeBlockIndex;
    if (prevIdx !== -1 && prevIdx !== index && state.blocks[prevIdx]) {
      normalizeStandaloneMathParagraph(state.blocks[prevIdx]);
    }
    const prevHadMacro =
      state.activeBlockTouchedMacro ||
      (prevIdx >= 0 && MACRO_DEF_RE.test(state.blocks[prevIdx]?.text || ''));
    state.activeBlockIndex = index;
    state.activeBlockTouchedMacro = MACRO_DEF_RE.test(state.blocks[index]?.text || '');

    if (
      forceFullRender ||
      prevHadMacro ||
      el.blocksRoot.children.length !== state.blocks.length
    ) {
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
    closeLatexAc();
    if (state.activeBlockIndex === -1) return;
    const prevIdx = state.activeBlockIndex;
    if (state.blocks[prevIdx]) {
      normalizeStandaloneMathParagraph(state.blocks[prevIdx]);
    }
    state.activeBlockIndex = -1;
    if (
      prevIdx >= 0 &&
      prevIdx < state.blocks.length &&
      el.blocksRoot.children.length === state.blocks.length
    ) {
      replaceSingleBlockNode(prevIdx);
    } else {
      renderLiveBlocks();
    }
  }

  let lastPointerDown = null;

  function hasNonCollapsedSelection() {
    const sel = window.getSelection?.();
    return Boolean(sel && !sel.isCollapsed);
  }

  function isDragGesture(e) {
    if (!lastPointerDown) return false;
    const dx = e.clientX - lastPointerDown.x;
    const dy = e.clientY - lastPointerDown.y;
    return dx * dx + dy * dy > 16;
  }

  function buildBlockElement(block, idx, macros = null) {
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
        if (hasNonCollapsedSelection() || isDragGesture(e)) return;
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
        hint.textContent = t('codeLeaveHint');
        bar.append(langInput, hint);
      } else {
        const lbl = document.createElement('span');
        lbl.textContent = block.lang || 'code';
        bar.appendChild(lbl);
      }
      row.appendChild(bar);
    }

    if (block.type === 'math' && isActive) {
      const bar = document.createElement('div');
      bar.className = 'math-lang-bar';
      const tag = document.createElement('span');
      tag.className = 'math-lang-tag';
      tag.textContent = block.delim === '\\[' ? '\\[ \\] LaTeX' : '$$ LaTeX';
      const hint = document.createElement('span');
      hint.textContent = t('mathLeaveHint');
      bar.append(tag, hint);
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

      let mathPreviewEl = null;
      let baseMathMacros = null;
      const updateMathLivePreview = () => {
        if (!mathPreviewEl) return;
        const rawTex = block.text.trim();
        if (!rawTex) {
          mathPreviewEl.innerHTML = `<span class="block-placeholder">${escapeHtml(
            t('mathPreviewEmpty')
          )}</span>`;
          return;
        }
        const localMacros = { ...(baseMathMacros || createNoteMacros()) };
        mathPreviewEl.innerHTML = renderKatexHtml(rawTex, true, localMacros);
      };

      if (block.type === 'math') {
        baseMathMacros = macros ? { ...macros } : computeMacrosBeforeBlock(idx);
        mathPreviewEl = document.createElement('div');
        mathPreviewEl.className = 'math-live-preview';
        updateMathLivePreview();
      }

      let composing = false;
      ta.addEventListener('compositionstart', () => {
        composing = true;
      });
      ta.addEventListener('blur', () => {
        composing = false;
        closeLatexAc();
      });
      ta.addEventListener('click', () => {
        if (!composing) {
          updateLatexAcForTextarea(ta, block, () => {
            autoResizeTextarea(ta);
            updateMathLivePreview();
            if (state.selBox.active) renderSelectionOverlay();
            scheduleSave();
          });
        }
      });
      ta.addEventListener('compositionend', () => {
        composing = false;
        requestAnimationFrame(() => {
          if (!ta.isConnected) return;
          block.text = ta.value;
          tryNormalizeChineseMathInput(ta, block);
          if (block.type === 'math' && block.text.includes('\n')) {
            block.singleLine = false;
          }
          if (tryExtractAtAtTrigger(block, ta, idx)) return;
          if (tryExtractPipePipeTrigger(block, ta, idx, null)) {
            row.classList.toggle('is-empty', block.type === 'p' && !block.text);
            return;
          }
          const newCaret = tryLiveTransform(block, ta);
          if (newCaret !== null) {
            syncActiveBlockInPlace(row, block, idx, ta, newCaret);
            scheduleSave();
            return;
          }
          row.classList.toggle('is-empty', block.type === 'p' && !block.text);
          autoResizeTextarea(ta);
          updateMathLivePreview();
          updateLatexAcForTextarea(ta, block, () => {
            autoResizeTextarea(ta);
            updateMathLivePreview();
            if (state.selBox.active) renderSelectionOverlay();
            scheduleSave();
          });
          scheduleSave();
        });
      });

      ta.addEventListener('input', (e) => {
        if (applyingPipeTrigger) return;
        block.text = ta.value;
        if (!composing && !e.isComposing) {
          tryNormalizeChineseMathInput(ta, block);
        }
        if (MACRO_DEF_RE.test(block.text)) {
          state.activeBlockTouchedMacro = true;
        }
        if (block.type === 'math' && block.text.includes('\n')) {
          block.singleLine = false;
        }
        if (!composing && !e.isComposing) {
          if (tryExtractAtAtTrigger(block, ta, idx)) {
            closeLatexAc();
            return;
          }
          if (tryExtractPipePipeTrigger(block, ta, idx, e)) {
            closeLatexAc();
            row.classList.toggle('is-empty', block.type === 'p' && !block.text);
            return;
          }
          const newCaret = tryLiveTransform(block, ta);
          if (newCaret !== null) {
            closeLatexAc();
            syncActiveBlockInPlace(row, block, idx, ta, newCaret);
            scheduleSave();
            return;
          }
        }
        row.classList.toggle('is-empty', block.type === 'p' && !block.text);
        autoResizeTextarea(ta);
        updateMathLivePreview();
        if (!composing && !e.isComposing) {
          updateLatexAcForTextarea(ta, block, () => {
            autoResizeTextarea(ta);
            updateMathLivePreview();
            if (state.selBox.active) renderSelectionOverlay();
            scheduleSave();
          });
        }
        if (state.selBox.active) renderSelectionOverlay();
        scheduleSave();
      });

      ta.addEventListener('paste', (e) => {
        if (block.type === 'code' || block.type === 'table' || block.type === 'math') return;
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

        if (handleLatexAcKeydown(e, ta, block)) {
          return;
        }

        if (tryDeleteEmptyDollarPair(e, ta, block)) {
          row.classList.toggle('is-empty', block.type === 'p' && !block.text);
          autoResizeTextarea(ta);
          scheduleSave();
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
          e.preventDefault();
          applyFormat('bold');
          return;
        }

        if (e.key === 'Tab') {
          e.preventDefault();
          if (!e.shiftKey && tryMathBraceTabJump(ta, block)) {
            return;
          }
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

        if ((block.type === 'code' || block.type === 'table' || block.type === 'math') && e.key === 'Enter') {
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

          const mathFence = block.type === 'p' && val.match(/^\s*(\$\$|\\\[)\s*$/);
          if (mathFence) {
            block.type = 'math';
            block.delim = mathFence[1] === '\\[' ? '\\[' : '$$';
            block.singleLine = false;
            block.text = '';
            scheduleSave();
            activateBlock(idx, 0, true);
            return;
          }

          const oneLineMath =
            block.type === 'p' &&
            (val.match(/^\s*(\$\$)(.+?)\$\$\s*$/) || val.match(/^\s*(\\\[)(.+?)\\\]\s*$/));
          if (oneLineMath && !oneLineMath[2].includes(oneLineMath[1] === '\\[' ? '\\]' : '$$')) {
            block.type = 'math';
            block.delim = oneLineMath[1] === '\\[' ? '\\[' : '$$';
            block.singleLine = true;
            block.text = oneLineMath[2].trim();
            state.blocks.splice(idx + 1, 0, makeBlock('p'));
            scheduleSave();
            activateBlock(idx + 1, 0, true);
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
            nextBlock = makeBlock('ol', {
              indent: curIndent,
              num: (block.num || 1) + 1,
              text: after,
            });
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
          if ((block.type === 'code' || block.type === 'math') && block.text) return;
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
            const wasSpecial = block.type === 'code' || block.type === 'math';
            block.type = 'p';
            delete block.checked;
            delete block.num;
            delete block.lang;
            delete block.delim;
            delete block.singleLine;
            delete block.indent;
            renumberOrderedLists();
            scheduleSave();
            if (wasSpecial) {
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
            } else if (prev.type !== 'code' && prev.type !== 'table' && prev.type !== 'math') {
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

      ta.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
          updateLatexAcForTextarea(ta, block, () => {
            autoResizeTextarea(ta);
            updateMathLivePreview();
            if (state.selBox.active) renderSelectionOverlay();
            scheduleSave();
          });
        }
      });

      body.appendChild(ta);
      if (mathPreviewEl) {
        body.appendChild(mathPreviewEl);
      }
      requestAnimationFrame(() => {
        autoResizeTextarea(ta);
        if (state.selBox.active) renderSelectionOverlay();
      });
    } else {
      const view = document.createElement('div');
      view.className = 'block-view';
      const activeMacros = macros || computeMacrosBeforeBlock(idx);
      if (block.type === 'code') {
        view.textContent = block.text || ' ';
      } else if (block.type === 'math') {
        view.classList.add('math-block-view');
        if (block.text.trim()) {
          view.innerHTML = renderKatexHtml(block.text, true, activeMacros);
        } else {
          view.innerHTML = `<span class="block-placeholder">${escapeHtml(t('phMath'))}</span>`;
        }
      } else if (block.type === 'table') {
        view.innerHTML = renderTableHtml(block.text, activeMacros);
      } else if (block.text) {
        view.innerHTML = renderInline(block.text, activeMacros);
      } else {
        const ph = blockPlaceholder(block, idx);
        view.innerHTML = ph ? `<span class="block-placeholder">${escapeHtml(ph)}</span>` : '&nbsp;';
      }

      row.addEventListener('click', (e) => {
        if (e.target instanceof Element && e.target.closest('a')) return;
        if (hasNonCollapsedSelection() || isDragGesture(e)) return;
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
    const sharedMacros = createNoteMacros();
    for (let i = 0; i < state.blocks.length; i++) {
      frag.appendChild(buildBlockElement(state.blocks[i], i, sharedMacros));
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
        const fallback =
          kind === 'bold' ? t('boldFallback') : kind === 'italic' ? t('italicFallback') : 'code';
        const insert = `${wrap}${sel || fallback}${wrap}`;
        ta.value = val.slice(0, start) + insert + val.slice(end);
        ta.focus();
        const pos = sel ? start + insert.length : start + wrap.length;
        ta.setSelectionRange(pos, sel ? pos : start + insert.length - wrap.length);
      } else {
        const prefixMap = {
          h1: '# ',
          h2: '## ',
          quote: '> ',
          list: '- ',
          ol: '1. ',
          todo: '- [ ] ',
        };
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

    const toggleMap = {
      h1: 'h1',
      h2: 'h2',
      quote: 'quote',
      list: 'ul',
      ol: 'ol',
      todo: 'todo',
    };
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
    const fallback =
      kind === 'bold' ? t('boldFallback') : kind === 'italic' ? t('italicFallback') : 'code';
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
      return t('todayTime', `${pad(d.getHours())}:${pad(d.getMinutes())}`);
    }
    return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function updateStatusUI() {
    el.wordCount.textContent = t('wordCount', countChars(getCurrentMarkdown()));
    if (!state.currentName) {
      el.saveStatus.textContent = '';
      el.saveStatus.classList.remove('dirty');
      return;
    }
    if (state.saving) {
      el.saveStatus.textContent = t('statusSaving');
      el.saveStatus.classList.add('dirty');
    } else if (state.dirty) {
      el.saveStatus.textContent = t('statusUnsaved');
      el.saveStatus.classList.add('dirty');
    } else {
      el.saveStatus.textContent = t('statusSaved');
      el.saveStatus.classList.remove('dirty');
    }
  }

  function updateBadgesUI() {
    if (!state.storage) return;
    const r = state.storage.agentRead !== false;
    const w = state.storage.agentWrite !== false;
    if (!r) {
      el.btnLockBadge.textContent = t('badgeNoAccess');
      el.btnLockBadge.classList.add('locked');
    } else if (!w) {
      el.btnLockBadge.textContent = t('badgeReadOnly');
      el.btnLockBadge.classList.add('locked');
    } else {
      el.btnLockBadge.textContent = t('badgeReadWrite');
      el.btnLockBadge.classList.remove('locked');
    }

    const isModeB = state.storage.quoteMode === 'modeB';
    el.btnQuoteBadge.textContent = isModeB ? t('badgeModeB') : t('badgeModeA');
    el.btnQuoteBadge.classList.toggle('mode-b', isModeB);
  }

  function updateDirIndicators() {
    if (!state.storage) return;
    const tag = state.storage.effectiveMode === 'custom' ? t('tagCustom') : t('tagWorkspace');
    el.btnDirIndicator.textContent = `${tag}: ${state.storage.activeDir}`;
    el.btnDrawerSettings.textContent = `📁 ${state.storage.activeDir}`;
    el.emptyDir.textContent = t('emptyDirPrefix', state.storage.activeDir);
    updateBadgesUI();
  }

  function setSourceMode(toSource) {
    closeLatexAc();
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
      el.btnMode.textContent = t('modeBtnLive');
      el.btnMode.classList.add('active');
      el.sourceEditor.focus();
    } else {
      el.sourceEditor.classList.add('hidden');
      el.liveEditor.classList.remove('hidden');
      el.btnMode.textContent = t('modeBtnSource');
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
      showToast(t('toastSaveErr', err.message));
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
      ingestHostConvInfo(data.hostConv);
      const prevEffective = getEffectiveLang();
      if (data.lang) {
        state.langPref = data.lang;
        state.pendingLangPref = data.lang;
      }
      state.lastDirDigest = data.dirDigest || '';
      state.notes = Array.isArray(data.notes) ? data.notes : [];

      if (getEffectiveLang() !== prevEffective) {
        applyI18nToDom();
      }

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
        el.btnTitle.textContent = t('notebookTitleFallback');
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
      showToast(t('toastCreated', created.title));
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
      showToast(t('toastRenamed'));
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
      showToast(t('toastDeleted'));
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
    const ymd = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    el.inputNewName.value = t('defaultNewNoteName', ymd);
    el.newNoteBox.classList.remove('hidden');
    el.inputNewName.focus();
    el.inputNewName.select();
  }

  function hideNewNoteBox() {
    el.newNoteBox.classList.add('hidden');
  }

  function normalizePreviewText(preview) {
    if (!preview || preview === '空笔记' || preview === 'Empty note') {
      return t('emptyNotePreview');
    }
    return preview;
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
      el.noteList.innerHTML = `<div class="note-list-empty">${escapeHtml(
        q ? t('noSearchMatch') : t('emptyNoteList')
      )}</div>`;
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
        yes.textContent = t('btnConfirmDelete');
        yes.addEventListener('click', (e) => {
          e.stopPropagation();
          void deleteNoteByName(note.name);
        });
        const no = document.createElement('button');
        no.className = 'item-act-btn';
        no.textContent = t('btnCancel');
        no.addEventListener('click', (e) => {
          e.stopPropagation();
          state.confirmDeleteName = '';
          renderNoteList();
        });
        actions.append(yes, no);
      } else {
        const del = document.createElement('button');
        del.className = 'item-act-btn danger';
        del.textContent = t('btnDelete');
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
      preview.textContent = normalizePreviewText(note.preview);
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
      el.wsResolvedPreview.textContent = t('wsResolvedPath', joined);
    } else {
      el.wsResolvedPreview.textContent = t('wsFallbackPath', state.storage?.fallbackDir || '');
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
      state.langPref = cfg.lang || 'auto';
      state.pendingLangPref = state.langPref;
      syncLangSegmentUI(state.pendingLangPref);
      applyI18nToDom();

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

  function closeSettings(revertPreviewLang = false) {
    el.settingsBackdrop.classList.add('hidden');
    if (revertPreviewLang) {
      const savedLang = state.storage?.lang || 'auto';
      if (state.langPref !== savedLang) {
        state.langPref = savedLang;
        state.pendingLangPref = savedLang;
        applyI18nToDom();
      }
    }
  }

  async function loadFolderBrowser(targetPath) {
    try {
      const data = await apiGet('/api/fs/browse', { path: targetPath });
      state.browserPath = data.current || '';
      state.browserParent = data.parent || '';
      el.browserCurrent.textContent = state.browserPath || t('selectDrive');
      el.browserList.innerHTML = '';

      if (!data.dirs.length) {
        const empty = document.createElement('div');
        empty.className = 'note-list-empty';
        empty.textContent = t('noSubfolders');
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
    const lang = state.pendingLangPref || 'auto';

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
        lang,
        clientLocale: getEffectiveLang(lang),
      });
      state.storage = updated;
      state.langPref = updated.lang || lang;
      state.pendingLangPref = state.langPref;
      if (state.selBox.active && quoteMode !== prevQuoteMode) {
        state.selBox.consumed = false;
      }
      applyI18nToDom();
      closeSettings(false);
      if (updated.activeDir !== prevDir) {
        state.currentName = '';
        state.dirty = false;
        await loadNotesAndOpen();
      }
      showToast(t('toastSettingsSaved'));
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

  function tryMatchLocalNoteFromFileUri(fileUri) {
    if (!state.storage?.activeDir || !Array.isArray(state.notes) || !state.notes.length) {
      return null;
    }
    try {
      const cleanUri = String(fileUri || '').split('#')[0];
      const u = new URL(cleanUri);
      if (u.protocol !== 'file:') return null;
      let decoded = decodeURIComponent(u.pathname || '');
      if (/^\/[A-Za-z]:/.test(decoded)) decoded = decoded.slice(1);
      const normTarget = decoded.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
      const normActiveDir = String(state.storage.activeDir)
        .replace(/\\/g, '/')
        .replace(/\/+$/, '')
        .toLowerCase();
      if (!normTarget.startsWith(`${normActiveDir}/`)) return null;
      const rest = normTarget.slice(normActiveDir.length + 1);
      if (!rest || rest.includes('/')) return null;
      return state.notes.find((n) => n.name.toLowerCase() === rest) || null;
    } catch {
      return null;
    }
  }

  el.blocksRoot.addEventListener('click', (e) => {
    const anchor = e.target instanceof Element ? e.target.closest('a') : null;
    if (!anchor) return;

    if (hasNonCollapsedSelection() || isDragGesture(e)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const convId = anchor.dataset.convId;
    if (convId) {
      e.preventDefault();
      e.stopPropagation();
      if (window.sidecar?.ui?.toggleConversation) {
        Promise.resolve(window.sidecar.ui.toggleConversation(convId)).catch(() => {});
      } else {
        showToast(t('toastHostConvUnsupported'));
      }
      return;
    }

    const fileUri = anchor.dataset.fileUri;
    if (fileUri) {
      e.preventDefault();
      e.stopPropagation();
      const localNote = tryMatchLocalNoteFromFileUri(fileUri);
      if (localNote) {
        void openNote(localNote.name);
        return;
      }
      const cleanUri = fileUri.split('#')[0];
      if (window.sidecar?.ui?.toggleAuxPane) {
        Promise.resolve(
          window.sidecar.ui.toggleAuxPane({ tabType: 'fileView', uri: cleanUri })
        ).catch(() => {});
      } else {
        showToast(t('toastHostFileUnsupported'));
      }
    }
  });

  document.addEventListener(
    'pointerdown',
    (e) => {
      lastPointerDown =
        e.button === 0 ? { x: e.clientX, y: e.clientY, target: e.target } : null;
    },
    true
  );

  el.liveEditor.addEventListener('click', (e) => {
    if (e.target !== el.liveEditor && e.target !== el.blocksRoot) return;
    if (hasNonCollapsedSelection() || isDragGesture(e)) return;
    if (
      lastPointerDown &&
      lastPointerDown.target !== el.liveEditor &&
      lastPointerDown.target !== el.blocksRoot
    ) {
      return;
    }
    if (
      el.blocksRoot.lastElementChild &&
      e.clientY < el.blocksRoot.lastElementChild.getBoundingClientRect().bottom
    ) {
      return;
    }
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
    if (hasNonCollapsedSelection() || isDragGesture(e)) return;
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

  if (el.latexAc) {
    el.latexAc.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    el.latexAc.addEventListener('click', (e) => {
      const itemNode = e.target instanceof Element ? e.target.closest('.latex-ac-item') : null;
      if (!itemNode) return;
      e.preventDefault();
      e.stopPropagation();
      acceptLatexAcItem(Number(itemNode.dataset.idx) || 0);
    });
  }

  el.liveEditor.addEventListener('scroll', () => {
    if (acState.open) positionLatexAcPopup();
  });
  el.sourceEditor.addEventListener('scroll', () => {
    if (acState.open) positionLatexAcPopup();
  });
  window.addEventListener('resize', () => {
    if (acState.open) positionLatexAcPopup();
  });

  el.sourceEditor.addEventListener('compositionend', () => {
    requestAnimationFrame(() => {
      if (tryExtractPipePipeTrigger(null, el.sourceEditor, -1, null)) {
        closeLatexAc();
        return;
      }
      if (tryNormalizeChineseMathInput(el.sourceEditor, null)) {
        scheduleSave();
      }
      updateLatexAcForTextarea(el.sourceEditor, null, scheduleSave);
    });
  });
  el.sourceEditor.addEventListener('input', (e) => {
    if (applyingPipeTrigger) return;
    if (!e.isComposing) {
      if (tryExtractPipePipeTrigger(null, el.sourceEditor, -1, e)) {
        closeLatexAc();
        return;
      }
      tryNormalizeChineseMathInput(el.sourceEditor, null);
    }
    scheduleSave();
    if (!e.isComposing) {
      updateLatexAcForTextarea(el.sourceEditor, null, scheduleSave);
    }
  });
  el.sourceEditor.addEventListener('click', () => {
    updateLatexAcForTextarea(el.sourceEditor, null, scheduleSave);
  });
  el.sourceEditor.addEventListener('blur', () => {
    closeLatexAc();
    void flushSave();
  });
  el.sourceEditor.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') {
      updateLatexAcForTextarea(el.sourceEditor, null, scheduleSave);
    }
  });
  el.sourceEditor.addEventListener('keydown', (e) => {
    if (e.isComposing || e.keyCode === 229) return;
    if (handleLatexAcKeydown(e, el.sourceEditor, null)) {
      return;
    }
    if (tryDeleteEmptyDollarPair(e, el.sourceEditor, null)) {
      scheduleSave();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!e.shiftKey && tryMathBraceTabJump(el.sourceEditor, null)) {
        return;
      }
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

  el.langSeg.addEventListener('click', (e) => {
    const btn = e.target instanceof Element ? e.target.closest('.lang-seg-btn') : null;
    if (!btn) return;
    const nextPref = btn.dataset.lang || 'auto';
    state.pendingLangPref = nextPref;
    state.langPref = nextPref;
    syncLangSegmentUI(nextPref);
    applyI18nToDom();
  });

  el.btnSettings.addEventListener('click', () => void openSettings());
  el.btnLockBadge.addEventListener('click', () => void openSettings());
  el.btnQuoteBadge.addEventListener('click', () => void openSettings());
  el.btnDirIndicator.addEventListener('click', () => void openSettings());
  el.btnDrawerSettings.addEventListener('click', () => void openSettings());
  el.btnSettingsClose.addEventListener('click', () => closeSettings(true));
  el.btnSettingsCancel.addEventListener('click', () => closeSettings(true));
  el.settingsBackdrop.addEventListener('click', (e) => {
    if (e.target === el.settingsBackdrop) closeSettings(true);
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
      void flushSave().then(() => showToast(t('toastSaved')));
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
      if (acState.open) {
        closeLatexAc();
      } else if (!el.settingsBackdrop.classList.contains('hidden')) {
        closeSettings(true);
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
    applyI18nToDom();
    setupSelectionDragEvents();

    void ensureKatexLoaded().then((loaded) => {
      if (loaded && !state.sourceMode && state.currentName) {
        renderLiveBlocks();
      }
    });

    void refreshHostConversation(false);

    window.addEventListener('message', (event) => {
      const nextConvId = event.data?.payload?.conversationId;
      if (
        typeof nextConvId === 'string' &&
        nextConvId.trim() &&
        nextConvId.trim() !== state.hostConvId
      ) {
        state.hostConvId = nextConvId.trim();
        state.hostConv = {
          conversationId: state.hostConvId,
          title: t('defaultConvLabel', state.hostConvId.slice(0, 8)),
          hasRealTitle: false,
        };
        void refreshHostConversation(true);
      }
    });

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
