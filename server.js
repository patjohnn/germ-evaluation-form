const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Clés Supabase — définies dans Vercel > Settings > Environment Variables
const SUPA_URL = process.env.SUPA_URL || '';
const SUPA_KEY = process.env.SUPA_KEY || '';

app.get('*', (req, res) => {
  try {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    // Injecter les clés pour tous les visiteurs (admin ET répondants)
    html = html.replace("'%%SUPA_URL%%'", "'" + SUPA_URL + "'");
    html = html.replace("'%%SUPA_KEY%%'", "'" + SUPA_KEY + "'");
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch(e) {
    res.status(500).send('Erreur serveur: ' + e.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('EvalPro sur port ' + PORT));
module.exports = app;
