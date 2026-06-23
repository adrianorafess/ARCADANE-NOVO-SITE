import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable body parsing with a high limit to accommodate base64 compressed images
app.use(express.json({ limit: '100mb' }));

app.get('/api/get-cms-state', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'src', 'utils', 'cmsStoreFallback.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    } else {
      res.status(404).json({ success: false, error: 'Fallback file not found on disk' });
    }
  } catch (error) {
    console.error('Failed to read fallback JSON from disk:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/save-cms-state', (req, res) => {
  try {
    const data = req.body;
    const filePath = path.join(__dirname, 'src', 'utils', 'cmsStoreFallback.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('CMS state saved successfully to workspace file.');
    res.json({ success: true, message: 'Configurações e imagens persistidas no código com sucesso!' });
  } catch (error) {
    console.error('Failed to write fallback JSON to disk:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files from the Vite build output directory (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all requests to index.html for SPA client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server running on port ${PORT}`);
});
