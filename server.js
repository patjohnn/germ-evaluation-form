const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const SUPA_URL = process.env.SUPA_URL || '';
const SUPA_KEY = process.env.SUPA_KEY || '';

app.get('/debug', (req, res) => {
  res.json({
    supa_url_present: !!SUPA_URL,
    supa_url_start: SUPA_URL ? SUPA_URL.substring(0, 30) + '...' : 'VIDE',
    supa_key_present: !!SUPA_KEY,
    supa_key_start: SUPA_KEY ? SUPA_KEY.substring(0, 20) + '...' : 'VIDE',
    node_env: process.env.NODE_ENV || 'non défini'
  });
});

// Route pour vérifier ce qui est injecté dans le HTML
app.get('/check-injection', (req, res) => {
  try {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    const beforeURL = html.includes("'%%SUPA_URL%%'");
    const beforeKEY = html.includes("'%%SUPA_KEY%%'");
    html = html.replace("'%%SUPA_URL%%'", "'" + SUPA_URL + "'");
    html = html.replace("'%%SUPA_KEY%%'", "'" + SUPA_KEY + "'");
    const afterURL = html.includes("'%%SUPA_URL%%'");
    const afterKEY = html.includes("'%%SUPA_KEY%%'");
    const injectedURLOK = html.includes(SUPA_URL);
    const injectedKEYOK = html.includes(SUPA_KEY.substring(0, 20));
    res.json({
      marqueur_URL_avant: beforeURL,
      marqueur_KEY_avant: beforeKEY,
      marqueur_URL_apres: afterURL,
      marqueur_KEY_apres: afterKEY,
      URL_bien_injectee: injectedURLOK,
      KEY_bien_injectee: injectedKEYOK,
      extrait_injection: html.substring(html.indexOf('SUPA_URL_INJECT') - 5, html.indexOf('SUPA_URL_INJECT') + 80)
    });
  } catch(e) {
    res.status(500).json({ erreur: e.message });
  }
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
