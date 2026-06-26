import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable body parsing with a high limit to accommodate base64 compressed images
  app.use(express.json({ limit: '100mb' }));

  // API Route: Proxy OnerTravel API calls to bypass domain restrictions
  app.use('/api/onertravel/api', async (req, res) => {
    try {
      const targetPath = req.url; // Contains the sub-path and query parameters (e.g. "/institutionWidgetConfiguration")
      const targetUrl = `https://api.onertravel.com/api${targetPath}`;
      const method = req.method;
      
      // Determine the best Origin and Referer to bypass domain restrictions
      const incomingOrigin = req.headers.origin as string || '';
      const incomingReferer = req.headers.referer as string || '';
      const incomingHost = req.headers.host || '';

      let targetOrigin = 'https://arcadaneviagens.com.br';
      let targetReferer = 'https://arcadaneviagens.com.br/';

      // If the incoming request has any reference to arcadaneviagens.com.br, forward it exactly
      if (
        incomingOrigin.includes('arcadaneviagens.com.br') || 
        incomingReferer.includes('arcadaneviagens.com.br') || 
        incomingHost.includes('arcadaneviagens.com.br')
      ) {
        if (incomingOrigin) {
          targetOrigin = incomingOrigin;
        } else if (incomingReferer) {
          try {
            targetOrigin = new URL(incomingReferer).origin;
          } catch (_) {
            targetOrigin = incomingReferer.includes('www.') ? 'https://www.arcadaneviagens.com.br' : 'https://arcadaneviagens.com.br';
          }
        } else {
          targetOrigin = incomingHost.includes('www.') ? 'https://www.arcadaneviagens.com.br' : 'https://arcadaneviagens.com.br';
        }

        if (incomingReferer) {
          targetReferer = incomingReferer;
        } else {
          targetReferer = targetOrigin.endsWith('/') ? targetOrigin : `${targetOrigin}/`;
        }
      } else {
        // Development/preview fallback: default to the official non-www domain
        targetOrigin = 'https://arcadaneviagens.com.br';
        targetReferer = 'https://arcadaneviagens.com.br/';
      }

      const headers: Record<string, string> = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Origin': targetOrigin,
        'Referer': targetReferer,
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0'
      };

      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, fetchOptions);
      
      res.status(response.status);
      res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
      
      const responseText = await response.text();
      res.send(responseText);
    } catch (error: any) {
      console.error('[OnerTravel Proxy Error]:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API Route: Get current CMS state
  app.get('/api/get-cms-state', (req, res) => {
    try {
      const filePath = path.join(process.cwd(), 'src', 'utils', 'cmsStoreFallback.json');
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
      } else {
        res.status(404).json({ success: false, error: 'Fallback file not found on disk' });
      }
    } catch (error: any) {
      console.error('Failed to read fallback JSON from disk:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API Route: Save CMS state
  app.post('/api/save-cms-state', (req, res) => {
    try {
      const data = req.body || {};
      // Inject updated timestamp to invalidate browser caches and trigger sync
      data.updatedAt = new Date().toISOString();
      const filePath = path.join(process.cwd(), 'src', 'utils', 'cmsStoreFallback.json');
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('CMS state saved successfully to workspace file with new updatedAt:', data.updatedAt);
      res.json({ success: true, message: 'Configurações e imagens persistidas no código com sucesso!' });
    } catch (error: any) {
      console.error('Failed to write fallback JSON to disk:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the Vite build output directory (dist)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Fallback all requests to index.html for SPA client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
