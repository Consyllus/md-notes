/**
 * Minimalist Markdown Notebook Sidecar Entrypoint (`main.mjs`).
 *
 * Keeps `SidecarApp` persistent on its assigned loopback port while
 * dynamically hot-reloading `./handlers.mjs` whenever its `mtimeMs` changes,
 * so backend updates take effect instantaneously without restarting!
 */

import { readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Response, SidecarApp } from 'sidecar_sdk';
import { decodeFileUriToPath, handlers as staticHandlers, sanitizeNoteFilename } from './handlers.mjs';

export { decodeFileUriToPath, staticHandlers as handlers, sanitizeNoteFilename };

const __dirname = dirname(fileURLToPath(import.meta.url));
const HANDLERS_PATH = join(__dirname, 'handlers.mjs');
const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' };
const ASSET_CACHE = { 'Cache-Control': 'no-cache' };

let cachedMtime = 0;
let cachedHandlers = staticHandlers;

async function getLatestHandlers() {
  try {
    const mtime = statSync(HANDLERS_PATH).mtimeMs;
    if (mtime !== cachedMtime) {
      const modUrl = `${pathToFileURL(HANDLERS_PATH).href}?v=${mtime}`;
      const mod = await import(modUrl);
      cachedHandlers = mod.handlers;
      cachedMtime = mtime;
    }
  } catch {
    // Keep last good module if file is mid-write
  }
  return cachedHandlers;
}

function readAsset(filename, contentType, headers = NO_STORE) {
  try {
    return new Response(readFileSync(join(__dirname, filename), 'utf8'), {
      contentType,
      headers,
    });
  } catch (err) {
    return new Response(`Asset temporarily unavailable: ${err.message}`, {
      status: 503,
      contentType: 'text/plain; charset=utf-8',
      headers: NO_STORE,
    });
  }
}

function isMainModule() {
  try {
    return resolve(process.argv[1] || '') === resolve(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMainModule()) {
  const app = new SidecarApp();

  app.page('/', () => readAsset('index.html', 'text/html; charset=utf-8'));
  app.page('/styles.css', () => readAsset('styles.css', 'text/css; charset=utf-8'));
  app.page('/app.js', () => readAsset('app.js', 'application/javascript; charset=utf-8'));

  // Local bundled KaTeX + inlined woff2 fonts + mhchem + copy-tex + completions (offline, zero-CDN)
  app.page('/vendor/katex/katex.min.css', () =>
    readAsset('vendor/katex/katex.min.css', 'text/css; charset=utf-8', ASSET_CACHE)
  );
  app.page('/vendor/katex/katex.min.js', () =>
    readAsset('vendor/katex/katex.min.js', 'application/javascript; charset=utf-8', ASSET_CACHE)
  );
  app.page('/vendor/katex/mhchem.min.js', () =>
    readAsset('vendor/katex/mhchem.min.js', 'application/javascript; charset=utf-8', ASSET_CACHE)
  );
  app.page('/vendor/katex/copy-tex.min.js', () =>
    readAsset('vendor/katex/copy-tex.min.js', 'application/javascript; charset=utf-8', ASSET_CACHE)
  );
  app.page('/vendor/katex/completions.js', () =>
    readAsset('vendor/katex/completions.js', 'application/javascript; charset=utf-8', ASSET_CACHE)
  );

  app.api('/api/config', async (data) => (await getLatestHandlers()).getConfig(data), 'GET');
  app.api('/api/config', async (data) => (await getLatestHandlers()).updateConfig(data), 'POST');
  app.api('/api/lock-state', async (data) => (await getLatestHandlers()).updateLockState(data), 'POST');
  app.api('/api/selection', async () => (await getLatestHandlers()).getSelection(), 'GET');
  app.api('/api/selection', async (data) => (await getLatestHandlers()).updateSelection(data), 'POST');
  app.api('/api/poll', async (data) => (await getLatestHandlers()).poll(data), 'GET');
  app.api('/api/notes', async (data) => (await getLatestHandlers()).listNotes(data), 'GET');
  app.api('/api/note', async (data) => (await getLatestHandlers()).readNote(data), 'GET');
  app.api('/api/note/create', async (data) => (await getLatestHandlers()).createNote(data), 'POST');
  app.api('/api/note/save', async (data) => (await getLatestHandlers()).saveNote(data), 'POST');
  app.api('/api/note/rename', async (data) => (await getLatestHandlers()).renameNote(data), 'POST');
  app.api('/api/note/delete', async (data) => (await getLatestHandlers()).deleteNote(data), 'POST');
  app.api('/api/fs/browse', async (data) => (await getLatestHandlers()).browse(data), 'GET');

  app.run();

  const shutdown = () => {
    void app.close().finally(() => process.exit(0));
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}
