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
body{background:#F8F3EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#333;min-height:100vh}
nav{background:#8B1A1A;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:100}
.nav-brand{color:#fff;font-size:16px;letter-spacing:3px;font-family:Georgia,serif;font-weight:300}
.nav-tabs{display:flex}
.nav-tab{color:rgba(255,255,255,0.7);text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;border-bottom:2px solid transparent;transition:.2s}
.nav-tab:hover,.nav-tab.active{color:#fff;border-bottom-color:#C9A96E}
.btn-logout{background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:6px 14px;border-radius:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;text-decoration:none}
.container{max-width:720px;margin:0 auto;padding:24px 16px}
.card{background:#fff;border:1px solid #E8D5B0;border-radius:4px;padding:24px;margin-bottom:16px}
.card-title{font-size:11px;color:#C9A96E;letter-spacing:3px;text-transform:uppercase;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid #F0E8D0}
label{display:block;font-size:11px;color:#888;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
input,textarea{width:100%;padding:9px 12px;border:1px solid #E0D5C0;border-radius:2px;font-size:13px;background:#FDFCF8;outline:none;transition:.2s;margin-bottom:14px}
input:focus,textarea:focus{border-color:#C9A96E;background:#fff}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.btn-save{padding:11px 28px;background:#8B1A1A;color:#fff;border:none;border-radius:2px;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:.2s}
.btn-save:hover{background:#6B1313}
.btn-bulk{width:100%;padding:13px;background:linear-gradient(135deg,#C9A96E,#B8914A);color:#fff;border:none;border-radius:2px;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:.2s;margin-top:4px}
.btn-bulk:hover{opacity:.9}
.msg{padding:10px 14px;border-radius:2px;font-size:12px;margin-top:10px;display:none}
.msg-ok{background:#D1FAE5;color:#065F46;border:1px solid #6EE7B7}
.msg-err{background:#FEE2E2;color:#B91C1C;border:1px solid #FCA5A5}
.info-box{background:#FDF8F0;border:1px solid #E8D5B0;border-radius:2px;padding:14px;font-size:12px;color:#666;line-height:1.6;margin-bottom:16px}
</style>
</head>
<body>
<nav>
  <span class="nav-brand">ACTILC</span>
  <div class="nav-tabs">
    <a href="dashboard.php" class="nav-tab">Participants</a>
    <a href="settings.php" class="nav-tab active">Événement</a>
  </div>
  <a href="<?= SITE_URL ?>/../api/logout.php" class="btn-logout">Déconnexion</a>
</nav>

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
