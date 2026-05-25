<?php
require_once __DIR__ . '/../api/config.php';
require_once __DIR__ . '/../api/auth-check.php';
require_admin();
?><!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tableau de bord — ACTILC</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--cr:#8B1A1A;--gold:#C9A96E;--bg:#F8F3EC;--border:#E8D5B0}
body{background:var(--bg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#333;min-height:100vh;padding-bottom:68px}
/* NAV */
nav{background:var(--cr);padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:100}
.nav-brand{color:#fff;font-size:15px;letter-spacing:3px;font-family:Georgia,serif;font-weight:300}
.nav-tabs{display:none}
.nav-tab{color:rgba(255,255,255,.7);text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;border-bottom:2px solid transparent;transition:.2s}
.nav-tab:hover,.nav-tab.active{color:#fff;border-bottom-color:var(--gold)}
.nav-logout{display:none;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.2);padding:6px 14px;border-radius:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;text-decoration:none}
/* BOTTOM NAV */
.bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--border);z-index:100}
.btab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 4px 6px;text-decoration:none;color:#AAA;font-size:9px;letter-spacing:1px;text-transform:uppercase;border-top:2px solid transparent;transition:.2s;gap:3px}
.btab.active{color:var(--cr);border-top-color:var(--cr)}
.btab svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8}
/* CONTAINER */
.container{max-width:960px;margin:0 auto;padding:16px}
/* STATS */
.stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px}
.stat{background:#fff;border:1px solid var(--border);border-radius:6px;padding:14px;text-align:center}
.stat-num{font-size:26px;font-weight:300;color:var(--cr);font-family:Georgia,serif}
.stat-label{font-size:10px;color:#AAA;letter-spacing:2px;text-transform:uppercase;margin-top:3px}
/* TOOLBAR */
.toolbar{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
.search-box{width:100%;padding:10px 14px;border:1px solid #E0D5C0;border-radius:6px;font-size:14px;background:#fff;outline:none}
.search-box:focus{border-color:var(--gold)}
.toolbar-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.filter-pills{display:flex;gap:6px;flex-wrap:wrap;flex:1}
.pill{padding:6px 14px;border-radius:20px;font-size:11px;letter-spacing:1px;cursor:pointer;border:1px solid #E0D5C0;background:#fff;color:#666;transition:.2s;white-space:nowrap}
.pill.active{background:var(--cr);color:#fff;border-color:var(--cr)}
.btn-export{padding:8px 14px;background:#1A1A1A;color:#fff;border:none;border-radius:6px;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;text-decoration:none;white-space:nowrap}
/* CARDS (mobile) */
.card-list{display:flex;flex-direction:column;gap:10px}
.pcard{background:#fff;border:1px solid var(--border);border-radius:8px;padding:14px;text-decoration:none;color:inherit;display:block;transition:.15s}
.pcard:active{background:#FDF8F0}
.pcard-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px}
.pcard-name{font-size:15px;color:#1A1A1A;font-weight:500}
.pcard-email{font-size:12px;color:#AAA;margin-top:2px}
.pcard-bottom{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.pcard-tid{font-size:11px;color:#888;letter-spacing:1px}
.pcard-city{font-size:11px;color:#888}
.progress-wrap{display:flex;align-items:center;gap:8px;flex:1;min-width:120px}
.progress-bar{flex:1;height:4px;background:#F0E8D0;border-radius:2px;overflow:hidden}
.progress-fill{height:100%;background:var(--gold);border-radius:2px}
.progress-txt{font-size:11px;color:#888;white-space:nowrap}
.badge{display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;letter-spacing:1px;font-weight:500;white-space:nowrap}
.badge-pending{background:#FEF3C7;color:#92400E}
.badge-validated{background:#D1FAE5;color:#065F46}
.badge-invited{background:#DBEAFE;color:#1E40AF}
/* EMPTY/LOADING */
.state-msg{text-align:center;padding:40px 20px;color:#AAA;font-size:14px}
/* PAGINATION */
.pagination{display:flex;justify-content:center;gap:8px;margin-top:16px}
.page-btn{width:36px;height:36px;border:1px solid #E0D5C0;background:#fff;border-radius:6px;cursor:pointer;font-size:13px;color:#666}
.page-btn.active{background:var(--cr);color:#fff;border-color:var(--cr)}
/* DESKTOP */
@media(min-width:640px){
  body{padding-bottom:0}
  .bottom-nav{display:none}
  .nav-tabs{display:flex}
  .nav-logout{display:block}
  .stats-grid{grid-template-columns:repeat(4,1fr)}
  .toolbar{flex-direction:row;align-items:center}
  .search-box{flex:1;min-width:200px;border-radius:2px}
  .toolbar-row{flex:initial}
}
</style>
</head>
<body>
<nav>
  <span class="nav-brand">ACTILC</span>
  <div class="nav-tabs">
    <a href="dashboard.php" class="nav-tab active">Participants</a>
    <a href="settings.php" class="nav-tab">Événement</a>
  </div>
  <a href="<?= SITE_URL ?>/../api/logout.php" class="nav-logout">Déconnexion</a>
</nav>

<div class="bottom-nav">
  <a href="dashboard.php" class="btab active">
    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    Participants
  </a>
  <a href="settings.php" class="btab">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    Événement
  </a>
  <a href="<?= SITE_URL ?>/../api/logout.php" class="btab">
    <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    Déconnexion
  </a>
</div>

<div class="container">
  <div class="stats-grid" id="stats">
    <div class="stat"><div class="stat-num" id="s-total">—</div><div class="stat-label">Total</div></div>
    <div class="stat"><div class="stat-num" id="s-pending">—</div><div class="stat-label">En attente</div></div>
    <div class="stat"><div class="stat-num" id="s-validated">—</div><div class="stat-label">Validés</div></div>
    <div class="stat"><div class="stat-num" id="s-invited">—</div><div class="stat-label">Invités</div></div>
  </div>

  <div class="toolbar">
    <input class="search-box" type="text" id="search" placeholder="Rechercher nom, email, matricule…">
    <div class="toolbar-row">
      <div class="filter-pills">
        <span class="pill active" data-status="">Tous</span>
        <span class="pill" data-status="pending">En attente</span>
        <span class="pill" data-status="validated">Validés</span>
        <span class="pill" data-status="invited">Invités</span>
      </div>
      <a class="btn-export" href="<?= SITE_URL ?>/api/export.php">Export CSV</a>
    </div>
  </div>

  <div class="card-list" id="cardList"><div class="state-msg">Chargement…</div></div>
  <div class="pagination" id="pagination"></div>
</div>

<script>
const BASE = '<?= SITE_URL ?>';
let currentPage = 1, currentStatus = '', currentSearch = '';

function statusBadge(s) {
  const m = {pending:['En attente','badge-pending'],validated:['Validé','badge-validated'],invited:['Invité','badge-invited']};
  const [l,c] = m[s]||['—',''];
  return `<span class="badge ${c}">${l}</span>`;
}

function progressBar(paid, total) {
  const pct = Math.min(100, Math.round(paid / total * 100));
  return `<div class="progress-wrap"><div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><span class="progress-txt">${paid.toLocaleString()} FCFA</span></div>`;
}

async function load() {
  const params = new URLSearchParams({search:currentSearch, status:currentStatus, page:currentPage});
  try {
    const r = await fetch(`${BASE}/api/participants.php?${params}`, {credentials:'include'});
    if (!r.ok) {
      document.getElementById('cardList').innerHTML = '<div class="state-msg">Erreur de chargement. Veuillez rafraîchir.</div>';
      return;
    }
    const d = await r.json();

    document.getElementById('s-total').textContent     = d.stats.total;
    document.getElementById('s-pending').textContent   = d.stats.pending;
    document.getElementById('s-validated').textContent = d.stats.validated;
    document.getElementById('s-invited').textContent   = d.stats.invited;

    const list = document.getElementById('cardList');
    if (!d.participants.length) {
      list.innerHTML = '<div class="state-msg">Aucun participant trouvé.</div>';
    } else {
      list.innerHTML = d.participants.map(p => `
        <a class="pcard" href="participant.php?id=${p.id}">
          <div class="pcard-top">
            <div>
              <div class="pcard-name">${p.full_name}</div>
              <div class="pcard-email">${p.email}</div>
            </div>
            ${statusBadge(p.status)}
          </div>
          <div class="pcard-bottom">
            <span class="pcard-tid">${p.translator_id}</span>
            ${p.city ? `<span class="pcard-city">· ${p.city}</span>` : ''}
            ${progressBar(p.total_paid, 25000)}
          </div>
        </a>`).join('');
    }

    const pag = document.getElementById('pagination');
    pag.innerHTML = '';
    for (let i = 1; i <= d.pages; i++) {
      const b = document.createElement('button');
      b.className = 'page-btn' + (i === currentPage ? ' active' : '');
      b.textContent = i;
      b.onclick = () => { currentPage = i; load(); };
      pag.appendChild(b);
    }
  } catch(e) {
    document.getElementById('cardList').innerHTML = '<div class="state-msg">Erreur réseau. Veuillez rafraîchir.</div>';
  }
}

document.querySelectorAll('.pill').forEach(p => p.addEventListener('click', function() {
  document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
  this.classList.add('active');
  currentStatus = this.dataset.status;
  currentPage = 1;
  load();
}));

let searchTimer;
document.getElementById('search').addEventListener('input', function() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { currentSearch = this.value; currentPage = 1; load(); }, 350);
});

load();
</script>
</body>
</html>
