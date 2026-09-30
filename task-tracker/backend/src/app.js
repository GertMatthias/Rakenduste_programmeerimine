import express from 'express';

export const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
