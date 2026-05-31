const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const SUPA_URL = process.env.SUPA_URL || '';
const SUPA_KEY = process.env.SUPA_KEY || '';

// Route de debug — allez sur /debug pour vérifier que les variables arrivent
app.get('/debug', (req, res) => {
  res.json({
    supa_url_present: !!SUPA_URL,
    supa_url_start: SUPA_URL ? SUPA_URL.substring(0, 30) + '...' : 'VIDE',
    supa_key_present: !!SUPA_KEY,
    supa_key_start: SUPA_KEY ? SUPA_KEY.substring(0, 20) + '...' : 'VIDE',
    node_env: process.env.NODE_ENV || 'non défini'
  });
});

app.get('*', (req, res) => {
  try {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    html = html.replace("'%%SUPA_URL%%'", "'" + SUPA_URL + "'");
    html = html.replace("'%%SUPA_KEY%%'", "'" + SUPA_KEY + "'");
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch(e) {
    res.status(500).send('Erreur: ' + e.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('EvalPro sur port ' + PORT));
module.exports = app;
