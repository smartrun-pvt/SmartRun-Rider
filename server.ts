import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint for Google Cloud Run
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'eatfit-delivery-partner', timestamp: new Date().toISOString() });
});

// Serve static assets from built Vite app
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`EatFit Delivery Partner server listening on port ${PORT}`);
});
