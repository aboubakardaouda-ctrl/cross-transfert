<?php
require_once __DIR__ . '/../api/config.php';
require_once __DIR__ . '/../api/auth-check.php';
require_admin();
?><!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Paramètres — ACTILC</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--cr:#8B1A1A;--gold:#C9A96E;--bg:#F8F3EC;--border:#E8D5B0}
body{background:var(--bg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#333;min-height:100vh;padding-bottom:68px}
nav{background:var(--cr);padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:100}
.nav-brand{color:#fff;font-size:15px;letter-spacing:3px;font-family:Georgia,serif;font-weight:300}
.nav-tabs{display:none}
.nav-tab{color:rgba(255,255,255,.7);text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;border-bottom:2px solid transparent;transition:.2s}
.nav-tab:hover,.nav-tab.active{color:#fff;border-bottom-color:var(--gold)}
.nav-logout{display:none;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.2);padding:6px 14px;border-radius:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;text-decoration:none}
.bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--border);z-index:100}
.btab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 4px 6px;text-decoration:none;color:#AAA;font-size:9px;letter-spacing:1px;text-transform:uppercase;border-top:2px solid transparent;transition:.2s;gap:3px}
.btab.active{color:var(--cr);border-top-color:var(--cr)}
.btab svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8}
.container{max-width:720px;margin:0 auto;padding:16px}
.card{background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px;margin-bottom:14px}
.card-title{font-size:10px;color:var(--gold);letter-spacing:3px;text-transform:uppercase;margin-bottom:18px;padding-bottom:10px;border-bottom:1px solid #F0E8D0}
label{display:block;font-size:11px;color:#888;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
input,textarea{width:100%;padding:10px 12px;border:1px solid #E0D5C0;border-radius:6px;font-size:14px;background:#FDFCF8;outline:none;transition:.2s;margin-bottom:14px}
input:focus,textarea:focus{border-color:var(--gold);background:#fff}
.grid2{display:grid;grid-template-columns:1fr;gap:0}
.btn-save{width:100%;padding:13px;background:var(--cr);color:#fff;border:none;border-radius:6px;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:.2s}
.btn-save:hover{background:#6B1313}
.btn-bulk{width:100%;padding:14px;background:linear-gradient(135deg,var(--gold),#B8914A);color:#fff;border:none;border-radius:6px;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:.2s;margin-top:4px}
.btn-bulk:hover{opacity:.9}
.msg{padding:10px 14px;border-radius:6px;font-size:12px;margin-top:10px;display:none}
.msg-ok{background:#D1FAE5;color:#065F46;border:1px solid #6EE7B7}
.msg-err{background:#FEE2E2;color:#B91C1C;border:1px solid #FCA5A5}
.info-box{background:#FDF8F0;border:1px solid var(--border);border-radius:6px;padding:14px;font-size:12px;color:#666;line-height:1.6;margin-bottom:14px}
@media(min-width:640px){
  body{padding-bottom:0}
  .bottom-nav{display:none}
  .nav-tabs{display:flex}
  .nav-logout{display:block}
  .grid2{grid-template-columns:1fr 1fr;gap:16px}
  .btn-save{width:auto}
}
</style>
</head>
<body>
<nav>
  <span class="nav-brand">ACTILC</span>
  <div class="nav-tabs">
    <a href="dashboard.php" class="nav-tab">Participants</a>
    <a href="settings.php" class="nav-tab active">Événement</a>
  </div>
  <a href="<?= SITE_URL ?>/../api/logout.php" class="nav-logout">Déconnexion</a>
</nav>

<div class="bottom-nav">
  <a href="dashboard.php" class="btab">
    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    Participants
  </a>
  <a href="settings.php" class="btab active">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    Événement
  </a>
  <a href="<?= SITE_URL ?>/../api/logout.php" class="btab">
    <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    Déconnexion
  </a>
</div>

<div class="container">

  <div class="card">
    <div class="card-title">Paramètres de l'événement</div>
    <form id="settingsForm">
      <label>Titre (Français)</label>
      <input type="text" name="title" id="f-title">
      <label>Titre (English)</label>
      <input type="text" name="title_en" id="f-title_en">
      <label>Titre (中文)</label>
      <input type="text" name="title_zh" id="f-title_zh">
      <div class="grid2">
        <div><label>Date</label><input type="text" name="event_date" id="f-event_date"></div>
        <div><label>Heure</label><input type="text" name="event_time" id="f-event_time"></div>
      </div>
      <label>Lieu</label>
      <input type="text" name="event_location" id="f-event_location">
      <div class="grid2">
        <div><label>Contribution requise (FCFA)</label><input type="number" name="total_required" id="f-total_required" min="1000" step="1000"></div>
        <div><label>Année</label><input type="number" name="year" id="f-year" min="2024" max="2030"></div>
      </div>
      <button type="submit" class="btn-save">Enregistrer</button>
      <div class="msg msg-ok" id="saveOk">Paramètres enregistrés.</div>
      <div class="msg msg-err" id="saveErr">Erreur lors de l'enregistrement.</div>
    </form>
  </div>

  <div class="card">
    <div class="card-title">Envoi groupé d'invitations</div>
    <div class="info-box">
      Envoie les invitations officielles à <strong>tous les participants validés</strong> (contribution complète) qui n'ont pas encore reçu leur invitation.
    </div>
    <button class="btn-bulk" id="btnBulk">Envoyer toutes les invitations en attente</button>
    <div class="msg msg-ok" id="bulkOk"></div>
    <div class="msg msg-err" id="bulkErr">Erreur lors de l'envoi groupé.</div>
  </div>

</div>
<script>
const BASE = '<?= SITE_URL ?>';

async function loadSettings() {
  const r = await fetch(`${BASE}/api/settings.php`, {credentials:'include'});
  const d = await r.json();
  ['title','title_en','title_zh','event_date','event_time','event_location','total_required','year'].forEach(k => {
    const el = document.getElementById('f-' + k);
    if (el) el.value = d[k] || '';
  });
}

document.getElementById('settingsForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const data = {};
  new FormData(this).forEach((v,k) => data[k] = v);
  const r = await fetch(`${BASE}/api/settings.php`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    credentials:'include',
    body: JSON.stringify(data)
  });
  const ok = document.getElementById('saveOk');
  const err = document.getElementById('saveErr');
  if (r.ok) { ok.style.display='block'; err.style.display='none'; setTimeout(()=>ok.style.display='none',2000); }
  else       { err.style.display='block'; ok.style.display='none'; }
});

document.getElementById('btnBulk').addEventListener('click', async function() {
  if (!confirm('Envoyer les invitations à tous les participants validés non encore invités ?')) return;
  this.textContent = 'Envoi en cours…';
  const r = await fetch(`${BASE}/api/bulk-send.php`, {method:'POST', credentials:'include'});
  const d = await r.json();
  const ok = document.getElementById('bulkOk');
  const err = document.getElementById('bulkErr');
  if (r.ok) {
    ok.textContent = `Envoi terminé : ${d.sent} invitation(s) envoyée(s)${d.failed ? ', ' + d.failed + ' échec(s)' : ''}.`;
    ok.style.display='block'; err.style.display='none';
  } else {
    err.style.display='block'; ok.style.display='none';
  }
  this.textContent = 'Envoyer toutes les invitations en attente';
});

loadSettings();
</script>
</body>
</html>
