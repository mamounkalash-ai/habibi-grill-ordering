import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import configHandler from './api/config.js';
import checkoutHandler from './api/checkout.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/config', configHandler);
app.post('/api/checkout', checkoutHandler);
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    environment:
      process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Habibi Grill ordering server running at http://localhost:${port}`);
});
