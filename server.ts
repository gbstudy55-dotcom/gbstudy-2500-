import express, { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { defaultPlatforms, defaultSettings } from './src/data/defaultPlatforms.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

app.use(express.json({ limit: '15mb' }));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory clients for real-time SSE (Server-Sent Events)
const sseClients = new Set<Response>();

function broadcast(eventType: string, data: any) {
  const payload = JSON.stringify({ eventType, data, timestamp: Date.now() });
  for (const client of sseClients) {
    try {
      client.write(`event: ${eventType}\ndata: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Helpers to read/write persistent data
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.platforms) && parsed.platforms.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  // Fallback to default platforms and settings
  const initial = {
    platforms: defaultPlatforms,
    settings: defaultSettings,
    updatedAt: new Date().toISOString(),
  };
  writeData(initial);
  return initial;
}

function writeData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data file:', err);
  }
}

// Pre-initialize data on startup
readData();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all shared platforms and settings (Accessible to all users instantly)
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// SSE Real-Time Stream: Every user connects here to get instant updates whenever Admin edits anything
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders?.();

  // Send current state immediately on connect
  const current = readData();
  res.write(`event: init\ndata: ${JSON.stringify({ eventType: 'init', data: current, timestamp: Date.now() })}\n\n`);

  sseClients.add(res);

  // Heartbeat ping every 25 seconds to keep connection alive across network proxies
  const keepAliveInterval = setInterval(() => {
    res.write(': ping\n\n');
  }, 25000);

  req.on('close', () => {
    clearInterval(keepAliveInterval);
    sseClients.delete(res);
  });
});

// Admin updates platforms: saved to server & broadcast to ALL connected users instantly
app.post('/api/platforms', (req, res) => {
  const { platforms } = req.body;
  if (!Array.isArray(platforms)) {
    return res.status(400).json({ error: 'platforms must be an array' });
  }
  const orderedPlatforms = platforms.map((p, idx) => ({
    ...p,
    order: idx + 1,
  }));
  const current = readData() || {};
  current.platforms = orderedPlatforms;
  current.updatedAt = new Date().toISOString();
  writeData(current);

  // Instant Real-time broadcast to all students
  broadcast('platforms', orderedPlatforms);

  res.json({ success: true, count: orderedPlatforms.length });
});

// Admin updates settings: saved to server & broadcast to ALL connected users instantly
app.post('/api/settings', (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ error: 'Invalid settings object' });
  }
  const current = readData() || {};
  current.settings = settings;
  current.updatedAt = new Date().toISOString();
  writeData(current);

  // Instant Real-time broadcast to all students
  broadcast('settings', settings);

  res.json({ success: true });
});

// Admin resets to defaults
app.post('/api/reset', (req, res) => {
  const initial = {
    platforms: defaultPlatforms,
    settings: defaultSettings,
    updatedAt: new Date().toISOString(),
  };
  writeData(initial);
  broadcast('reset', initial);
  res.json({ success: true, message: 'Reset completed' });
});

// Setup Vite or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GB STUDY Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
