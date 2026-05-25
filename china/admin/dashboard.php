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
body{background:#F8F3EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#333;min-height:100vh}
nav{background:#8B1A1A;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:100}
.nav-brand{color:#fff;font-size:16px;letter-spacing:3px;font-family:Georgia,serif;font-weight:300}
.nav-tabs{display:flex;gap:0}
.nav-tab{color:rgba(255,255,255,0.7);text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;border-bottom:2px solid transparent;transition:.2s}
.nav-tab:hover,.nav-tab.active{color:#fff;border-bottom-color:#C9A96E}
.nav-right{display:flex;gap:12px;align-items:center}
.btn-logout{background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:6px 14px;border-radius:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;text-decoration:none;transition:.2s}
.btn-logout:hover{background:rgba(255,255,255,0.2)}
.container{max-width:960px;margin:0 auto;padding:24px 16px}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
.stat{background:#fff;border:1px solid #E8D5B0;border-radius:4px;padding:16px;text-align:center}
.stat-num{font-size:28px;font-weight:300;color:#8B1A1A;font-family:Georgia,serif}
.stat-label{font-size:10px;color:#AAA;letter-spacing:2px;text-transform:uppercase;margin-top:4px}
.toolbar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap}
.search-box{flex:1;min-width:200px;padding:9px 14px;border:1px solid #E0D5C0;border-radius:2px;font-size:13px;background:#fff;outline:none}
.search-box:focus{border-color:#C9A96E}
.filter-pills{display:flex;gap:6px;flex-wrap:wrap}
.pill{padding:6px 14px;border-radius:20px;font-size:11px;letter-spacing:1px;cursor:pointer;border:1px solid #E0D5C0;background:#fff;color:#666;transition:.2s}
.pill.active{background:#8B1A1A;color:#fff;border-color:#8B1A1A}
.btn-export{padding:8px 16px;background:#1A1A1A;color:#fff;border:none;border-radius:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;text-decoration:none;transition:.2s}
.btn-export:hover{background:#333}
table{width:100%;background:#fff;border:1px solid #E8D5B0;border-radius:4px;border-collapse:collapse;overflow:hidden}
th{background:#F8F3EC;padding:10px 14px;font-size:10px;color:#888;letter-spacing:2px;text-transform:uppercase;text-align:left;border-bottom:1px solid #E8D5B0}
td{padding:12px 14px;font-size:13px;border-bottom:1px solid #F0E8D0}
tr:last-child td{border-bottom:none}
tr:hover td{background:#FDF8F0}
.badge{display:inline-block;padding:3px 10px;border-radius:10px;font-size:10px;letter-spacing:1px;font-weight:500}
.badge-pending{background:#FEF3C7;color:#92400E}
.badge-validated{background:#D1FAE5;color:#065F46}
.badge-invited{background:#DBEAFE;color:#1E40AF}
.link{color:#8B1A1A;text-decoration:none;font-weight:500}
.link:hover{text-decoration:underline}
.progress-bar{height:4px;background:#F0E8D0;border-radius:2px;overflow:hidden;width:80px;display:inline-block;vertical-align:middle}
.progress-fill{height:100%;background:#C9A96E;border-radius:2px}
.pagination{display:flex;justify-content:center;gap:8px;margin-top:20px}
.page-btn{width:32px;height:32px;border:1px solid #E0D5C0;background:#fff;border-radius:2px;cursor:pointer;font-size:12px;color:#666}
.page-btn.active{background:#8B1A1A;color:#fff;border-color:#8B1A1A}
.loading{text-align:center;padding:40px;color:#AAA;font-size:13px}
@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr)}.nav-tabs{display:none}}
</style>
</head>
<body>
<nav>
  <span class="nav-brand">ACTILC</span>
  <div class="nav-tabs">
    <a href="dashboard.php" class="nav-tab active">Participants</a>
    <a href="settings.php" class="nav-tab">Événement</a>
  </div>
  <div class="nav-right">
    <a href="<?= SITE_URL ?>/../api/logout.php" class="btn-logout">Déconnexion</a>
  </div>
</nav>

<div class="container">
  <div class="stats-grid" id="stats">
    <div class="stat"><div class="stat-num" id="s-total">—</div><div class="stat-label">Total</div></div>
    <div class="stat"><div class="stat-num" id="s-pending">—</div><div class="stat-label">En attente</div></div>
    <div class="stat"><div class="stat-num" id="s-validated">—</div><div class="stat-label">Validés</div></div>
    <div class="stat"><div class="stat-num" id="s-invited">—</div><div class="stat-label">Invités</div></div>
  </div>

  <div class="toolbar">
    <input class="search-box" type="text" id="search" placeholder="Rechercher par nom, email, matricule…">
    <div class="filter-pills">
      <span class="pill active" data-status="">Tous</span>
      <span class="pill" data-status="pending">En attente</span>
      <span class="pill" data-status="validated">Validés</span>
      <span class="pill" data-status="invited">Invités</span>
    </div>
    <a class="btn-export" href="<?= SITE_URL ?>/api/export.php">Exporter CSV</a>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nom</th>
        <th>Matricule</th>
        <th>Ville</th>
        <th>Contribution</th>
        <th>Statut</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody id="tbody"><tr><td colspan="6" class="loading">Chargement…</td></tr></tbody>
  </table>
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
  const pct = Math.min(100, Math.round(paid/total*100));
  return `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div> ${paid.toLocaleString()} FCFA`;
}

async function load() {
  const params = new URLSearchParams({search:currentSearch,status:currentStatus,page:currentPage});
  const r = await fetch(`${BASE}/api/participants.php?${params}`, {credentials:'include'});
  const d = await r.json();

  document.getElementById('s-total').textContent    = d.stats.total;
  document.getElementById('s-pending').textContent  = d.stats.pending;
  document.getElementById('s-validated').textContent= d.stats.validated;
  document.getElementById('s-invited').textContent  = d.stats.invited;

  const tbody = document.getElementById('tbody');
  if (!d.participants.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Aucun participant trouvé</td></tr>';
    return;
  }
  tbody.innerHTML = d.participants.map(p => `
    <tr>
      <td><a class="link" href="participant.php?id=${p.id}">${p.full_name}</a><br>
          <span style="font-size:11px;color:#AAA">${p.email}</span></td>
      <td style="font-size:12px;color:#666">${p.translator_id}</td>
      <td style="font-size:12px;color:#666">${p.city||'—'}</td>
      <td>${progressBar(p.total_paid, 25000)}</td>
      <td>${statusBadge(p.status)}</td>
      <td style="font-size:11px;color:#AAA">${p.created_at.slice(0,10)}</td>
    </tr>`).join('');

  // Pagination
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';
  for (let i = 1; i <= d.pages; i++) {
    const b = document.createElement('button');
    b.className = 'page-btn' + (i===currentPage?' active':'');
    b.textContent = i;
    b.onclick = () => { currentPage = i; load(); };
    pag.appendChild(b);
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
