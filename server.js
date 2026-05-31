const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// ─── Clés Supabase — à remplir une seule fois ───────────
const SUPA_URL = process.env.SUPA_URL || '';
const SUPA_KEY = process.env.SUPA_KEY || '';
// ────────────────────────────────────────────────────────

app.get('*', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  // Injecter les clés dans la page pour tous les visiteurs
  html = html.replace('__SUPA_URL__', SUPA_URL);
  html = html.replace('__SUPA_KEY__', SUPA_KEY);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EvalPro on port ${PORT}`));
module.exports = app;
