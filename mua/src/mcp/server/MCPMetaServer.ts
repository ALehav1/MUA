// MCPMetaServer.ts
// ---
// MCP Meta-Brain Server: Project plan, guidelines, audit, README, and directory structure for agent orchestration.
//
// Dependencies: express, ws, fs, path, chokidar (for directory watching), typescript
//
// Endpoints (REST):
//   GET /plan, POST /plan
//   GET /guidelines, POST /guidelines
//   GET /audit, POST /audit
//   GET /readme
//   GET /structure
// WebSocket: mirrors REST, plus push notifications (future)

import express from 'express';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

const DATA_DIR = path.resolve(__dirname, '../../../data');
const PLAN_PATH = path.join(DATA_DIR, 'plan.json');
const GUIDELINES_PATH = path.join(DATA_DIR, 'guidelines.json');
const AUDIT_PATH = path.join(DATA_DIR, 'audit.json');
const README_PATH = path.resolve(__dirname, '../../../README.md');

console.log(`[MCPMetaServer] AUDIT_PATH: ${AUDIT_PATH}`);
console.log(`[MCPMetaServer] process.cwd(): ${process.cwd()}`);

function safeReadJSON(file: string, fallback: any) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return fallback;
  }
}
function safeWriteJSON(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

function getDirectoryStructure(baseDir: string): any {
  function walk(dir: string): any {
    return fs.readdirSync(dir).map((name) => {
      const abs = path.join(dir, name);
      const stat = fs.statSync(abs);
      return stat.isDirectory()
        ? { type: 'directory', name, children: walk(abs) }
        : { type: 'file', name, size: stat.size };
    });
  }
  return walk(baseDir);
}

const app = express();
app.use(express.json());

// REST Endpoints
app.get('/plan', (_req, res) => {
  res.json(safeReadJSON(PLAN_PATH, { objectives: [], steps: [], lastUpdated: null }));
});
app.post('/plan', (req, res) => {
  const plan = req.body;
  plan.lastUpdated = new Date().toISOString();
  safeWriteJSON(PLAN_PATH, plan);
  logAudit({ action: 'SET_PLAN', details: plan });
  res.json({ success: true });
});

app.get('/guidelines', (_req, res) => {
  res.json(safeReadJSON(GUIDELINES_PATH, { rules: [], lastUpdated: null }));
});
app.post('/guidelines', (req, res) => {
  const guidelines = req.body;
  guidelines.lastUpdated = new Date().toISOString();
  safeWriteJSON(GUIDELINES_PATH, guidelines);
  logAudit({ action: 'SET_GUIDELINES', details: guidelines });
  res.json({ success: true });
});

app.get('/audit', (_req, res) => {
  res.json(safeReadJSON(AUDIT_PATH, []));
});
app.post('/audit', (req, res) => {
  const entry = req.body;
  entry.timestamp = new Date().toISOString();
  const audit = safeReadJSON(AUDIT_PATH, []);
  audit.push(entry);
  safeWriteJSON(AUDIT_PATH, audit);
  res.json({ success: true });
});

// --- Conversational Logging Endpoints ---
// Log a user prompt
app.post('/logPrompt', (req, res) => {
  const entry = {
    type: 'USER_PROMPT',
    actor: 'USER',
    content: req.body.content,
    timestamp: new Date().toISOString(),
    debug: true // DEBUG marker for this session
  };
  try {
    console.log('[logPrompt] Received:', entry);
    console.log('[logPrompt] Writing to:', AUDIT_PATH);
    const audit = safeReadJSON(AUDIT_PATH, []);
    audit.push(entry);
    safeWriteJSON(AUDIT_PATH, audit);
    res.json({ success: true });
  } catch (err) {
    console.error('[logPrompt] ERROR:', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});
// Log an assistant response
app.post('/logResponse', (req, res) => {
  const entry = {
    type: 'ASSISTANT_RESPONSE',
    actor: 'Cascade',
    content: req.body.content,
    timestamp: new Date().toISOString(),
    debug: true // DEBUG marker for this session
  };
  try {
    console.log('[logResponse] Received:', entry);
    console.log('[logResponse] Writing to:', AUDIT_PATH);
    const audit = safeReadJSON(AUDIT_PATH, []);
    audit.push(entry);
    safeWriteJSON(AUDIT_PATH, audit);
    res.json({ success: true });
  } catch (err) {
    console.error('[logResponse] ERROR:', err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get('/readme', (_req, res) => {
  try {
    res.type('text/markdown').send(fs.readFileSync(README_PATH, 'utf-8'));
  } catch (e) {
    res.status(404).send('# README not found');
  }
});

app.get('/structure', (_req, res) => {
  const structure = getDirectoryStructure(path.resolve(__dirname, '../../../'));
  res.json(structure);
});

// WebSocket (future: push notifications, agent sync)
const wss = new WebSocketServer({ port: 8090 });
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'MCPMetaServer WebSocket ready' }));
  // Future: handle real-time push, agent sync, etc.
});

// Audit log helper
function logAudit(entry: any) {
  const audit = safeReadJSON(AUDIT_PATH, []);
  audit.push({ ...entry, timestamp: new Date().toISOString() });
  safeWriteJSON(AUDIT_PATH, audit);
}

// Directory watcher (future: notify on file changes)
// Only watch src/, data/, and README.md, ignore node_modules, dist, .git, etc.
chokidar.watch([
  path.resolve(__dirname, '../../../src'),
  path.resolve(__dirname, '../../../data'),
  path.resolve(__dirname, '../../../README.md')
], {
  ignored: /node_modules|\\.git|dist/,
  ignoreInitial: true,
  persistent: true
}).on('all', (_event, _filePath) => {
  // Could push to WebSocket clients, log changes, etc.
  // For now, just log the event for audit/debug
  // console.log(`[Watcher] ${_event}: ${_filePath}`);
});

// Export the Express app for unified startup (index.js)
export default app;

// ---
// Annotated for audit, extensibility, and agent orchestration.
// See README for protocol and usage details.
