<?php
require_once __DIR__ . '/../api/config.php';
require_once __DIR__ . '/../api/auth-check.php';
require_admin();
$id = (int)($_GET['id'] ?? 0);
if (!$id) { header('Location: dashboard.php'); exit; }
?><!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Participant — ACTILC</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--cr:#8B1A1A;--gold:#C9A96E;--bg:#F8F3EC;--border:#E8D5B0}
body{background:var(--bg);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#333;min-height:100vh;padding-bottom:68px}
nav{background:var(--cr);padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:100}
.nav-brand{color:#fff;font-size:15px;letter-spacing:3px;font-family:Georgia,serif;font-weight:300}
.nav-tabs{display:none}
.nav-tab{color:rgba(255,255,255,.7);text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;border-bottom:2px solid transparent;transition:.2s}
.nav-tab:hover{color:#fff;border-bottom-color:var(--gold)}
.nav-actions{display:flex;gap:8px;align-items:center}
.btn-sm{padding:6px 12px;border-radius:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border:none;text-decoration:none;display:inline-block;transition:.2s}
.btn-back{background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.2)}
.btn-logout{display:none;background:transparent;color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.15)}
.bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid var(--border);z-index:100}
.btab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 4px 6px;text-decoration:none;color:#AAA;font-size:9px;letter-spacing:1px;text-transform:uppercase;border-top:2px solid transparent;transition:.2s;gap:3px}
.btab.active{color:var(--cr);border-top-color:var(--cr)}
.btab svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8}
.container{max-width:720px;margin:0 auto;padding:16px}
.card{background:#fff;border:1px solid var(--border);border-radius:8px;padding:18px;margin-bottom:14px}
.card-title{font-size:10px;color:var(--gold);letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #F0E8D0}
.info-grid{display:grid;grid-template-columns:1fr;gap:10px}
.info-item label{display:block;font-size:10px;color:#AAA;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px}
.info-item span{font-size:14px;color:#333}
.badge{display:inline-block;padding:4px 12px;border-radius:10px;font-size:11px;letter-spacing:1px;font-weight:500}
.badge-pending{background:#FEF3C7;color:#92400E}
.badge-validated{background:#D1FAE5;color:#065F46}
.badge-invited{background:#DBEAFE;color:#1E40AF}
.progress-wrap{margin:14px 0}
.progress-track{height:8px;background:#F0E8D0;border-radius:4px;overflow:hidden;margin-top:6px}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--cr));border-radius:4px;transition:.6s}
.progress-labels{display:flex;justify-content:space-between;font-size:11px;color:#AAA;margin-top:4px}
.payment-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0E8D0}
.payment-row:last-child{border:none}
.payment-amount{font-size:15px;color:#065F46;font-weight:500}
.payment-note{font-size:12px;color:#888}
.payment-date{font-size:11px;color:#AAA}
.pay-form{margin-top:14px;border-top:1px solid #F0E8D0;padding-top:14px}
.pay-form p{font-size:10px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px}
.pay-form input{width:100%;padding:10px 12px;border:1px solid #E0D5C0;border-radius:6px;font-size:14px;background:#FDFCF8;outline:none;margin-bottom:8px}
.pay-form input:focus{border-color:var(--gold)}
.btn-add{width:100%;padding:12px;background:var(--cr);color:#fff;border:none;border-radius:6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:.2s}
.btn-add:hover{background:#6B1313}
.btn-invite{width:100%;padding:14px;background:linear-gradient(135deg,var(--cr),#6B1313);color:#fff;border:none;border-radius:6px;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;margin-top:4px;transition:.2s}
.btn-invite:hover{opacity:.9}
.btn-invite:disabled{opacity:.4;cursor:not-allowed}
.msg{padding:10px 14px;border-radius:6px;font-size:12px;margin-top:10px;display:none}
.msg-ok{background:#D1FAE5;color:#065F46;border:1px solid #6EE7B7}
.msg-err{background:#FEE2E2;color:#B91C1C;border:1px solid #FCA5A5}
.empty{color:#AAA;font-size:13px;padding:12px 0;text-align:center}
#participantData{display:none}
.loading-msg{text-align:center;padding:60px;color:#AAA}
@media(min-width:640px){
  body{padding-bottom:0}
  .bottom-nav{display:none}
  .nav-tabs{display:flex}
  .btn-logout{display:inline-block}
  .info-grid{grid-template-columns:1fr 1fr}
  .pay-form input{width:auto}
  .pay-form .pay-row{display:flex;gap:8px}
  .pay-form .pay-row input{flex:1}
  .btn-add{width:auto;padding:10px 20px}
}
</style>
</head>
<body>
<nav>
  <span class="nav-brand">ACTILC</span>
  <div class="nav-tabs">
    <a href="dashboard.php" class="nav-tab">Participants</a>
    <a href="settings.php" class="nav-tab">Événement</a>
  </div>
  <div class="nav-actions">
    <a href="dashboard.php" class="btn-sm btn-back">← Retour</a>
    <a href="<?= SITE_URL ?>/../api/logout.php" class="btn-sm btn-logout">Déconnexion</a>
  </div>
</nav>

<div class="bottom-nav">
  <a href="dashboard.php" class="btab">
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
  <div id="loadingMsg" class="loading-msg">Chargement…</div>
  <div id="participantData">

    <div class="card">
      <div class="card-title">Informations du participant</div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:14px;flex-wrap:wrap">
        <div>
          <h2 id="pName" style="font-size:20px;font-weight:300;color:#1A1A1A;font-family:Georgia,serif"></h2>
          <p id="pEmail" style="font-size:13px;color:#888;margin-top:2px"></p>
        </div>
        <span id="pBadge" class="badge"></span>
      </div>
      <div class="info-grid">
        <div class="info-item"><label>Matricule ACTILC</label><span id="pTid"></span></div>
        <div class="info-item"><label>Téléphone</label><span id="pPhone"></span></div>
        <div class="info-item"><label>Ville</label><span id="pCity"></span></div>
        <div class="info-item"><label>Participation</label><span id="pParticipates"></span></div>
        <div class="info-item" style="grid-column:1/-1"><label>Commentaire</label><span id="pComment"></span></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Contribution</div>
      <div class="progress-wrap">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span id="pPaid" style="font-size:22px;color:var(--cr);font-family:Georgia,serif;font-weight:300"></span>
          <span id="pPct" style="font-size:12px;color:#AAA"></span>
        </div>
        <div class="progress-track"><div class="progress-fill" id="pBar" style="width:0%"></div></div>
        <div class="progress-labels"><span>0 FCFA</span><span id="pTotal"></span></div>
      </div>

      <div id="paymentList"></div>

      <div class="pay-form">
        <p>Ajouter un versement</p>
        <div class="pay-row">
          <input type="number" id="payAmount" placeholder="Montant (FCFA)" min="1000" step="1000">
          <input type="text" id="payNote" placeholder="Note (facultatif)">
        </div>
        <button class="btn-add" id="btnAddPay">Enregistrer le versement</button>
        <div class="msg msg-ok" id="payOk">Versement enregistré.</div>
        <div class="msg msg-err" id="payErr">Erreur lors de l'enregistrement.</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Invitation officielle</div>
      <p id="inviteInfo" style="font-size:13px;color:#888;margin-bottom:14px"></p>
      <button class="btn-invite" id="btnInvite" disabled>Envoyer l'invitation par e-mail</button>
      <div class="msg msg-ok" id="inviteOk">Invitation envoyée avec succès !</div>
      <div class="msg msg-err" id="inviteErr">Erreur lors de l'envoi de l'invitation.</div>
    </div>

  </div>
</div>

<script>
const BASE = '<?= SITE_URL ?>';
const PID  = <?= $id ?>;
let totalRequired = 25000;

const BADGES = {
  pending:   ['En attente','badge-pending'],
  validated: ['Validé','badge-validated'],
  invited:   ['Invitation envoyée','badge-invited'],
};

async function loadParticipant() {
  const r = await fetch(`${BASE}/api/participant.php?id=${PID}`, {credentials:'include'});
  if (!r.ok) { document.getElementById('loadingMsg').textContent = 'Participant introuvable.'; return; }
  const d = await r.json();
  totalRequired = d.total_required;

  const p = d.participant;
  document.getElementById('loadingMsg').style.display = 'none';
  document.getElementById('participantData').style.display = 'block';

  document.getElementById('pName').textContent         = p.full_name;
  document.getElementById('pEmail').textContent        = p.email;
  document.getElementById('pTid').textContent          = p.translator_id;
  document.getElementById('pPhone').textContent        = p.phone || '—';
  document.getElementById('pCity').textContent         = p.city || '—';
  document.getElementById('pParticipates').textContent = p.participates == 1 ? 'Oui' : 'Non';
  document.getElementById('pComment').textContent      = p.comment || '—';

  const [label, cls] = BADGES[p.status] || ['—',''];
  const badge = document.getElementById('pBadge');
  badge.textContent = label;
  badge.className   = 'badge ' + cls;

  updateContribution(parseInt(p.total_paid), d.payments, p.status);

  const btnInvite  = document.getElementById('btnInvite');
  const inviteInfo = document.getElementById('inviteInfo');
  if (p.status === 'invited') {
    inviteInfo.textContent = 'L\'invitation a déjà été envoyée à ' + p.email + '.';
    btnInvite.textContent  = 'Invitation déjà envoyée';
    btnInvite.disabled     = true;
  } else if (parseInt(p.total_paid) >= totalRequired) {
    inviteInfo.textContent = 'La contribution est complète. Vous pouvez envoyer l\'invitation officielle.';
    btnInvite.disabled     = false;
  } else {
    inviteInfo.textContent = `Contribution incomplète (${parseInt(p.total_paid).toLocaleString()} / ${totalRequired.toLocaleString()} FCFA). L'invitation sera disponible après validation.`;
    btnInvite.disabled     = true;
  }
}

function updateContribution(paid, payments, status) {
  const pct = Math.min(100, Math.round(paid / totalRequired * 100));
  document.getElementById('pPaid').textContent  = paid.toLocaleString() + ' FCFA';
  document.getElementById('pPct').textContent   = pct + '%';
  document.getElementById('pBar').style.width   = pct + '%';
  document.getElementById('pTotal').textContent = totalRequired.toLocaleString() + ' FCFA';

  const list = document.getElementById('paymentList');
  if (!payments.length) {
    list.innerHTML = '<p class="empty">Aucun versement enregistré</p>';
    return;
  }
  list.innerHTML = payments.map(p => `
    <div class="payment-row">
      <div>
        <span class="payment-amount">+${parseInt(p.amount).toLocaleString()} FCFA</span>
        ${p.note ? `<span class="payment-note"> — ${p.note}</span>` : ''}
      </div>
      <span class="payment-date">${p.created_at.slice(0,10)}</span>
    </div>`).join('');
}

document.getElementById('btnAddPay').addEventListener('click', async function() {
  const amount = parseInt(document.getElementById('payAmount').value);
  const note   = document.getElementById('payNote').value;
  if (!amount || amount < 1) return;
  this.textContent = '…';
  const r = await fetch(`${BASE}/api/payment.php`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    credentials:'include',
    body: JSON.stringify({participant_id: PID, amount, note})
  });
  this.textContent = 'Enregistrer le versement';
  const ok = document.getElementById('payOk');
  const err = document.getElementById('payErr');
  if (r.ok) {
    ok.style.display = 'block'; err.style.display = 'none';
    document.getElementById('payAmount').value = '';
    document.getElementById('payNote').value   = '';
    setTimeout(() => { ok.style.display='none'; loadParticipant(); }, 1500);
  } else {
    err.style.display = 'block'; ok.style.display = 'none';
  }
});

document.getElementById('btnInvite').addEventListener('click', async function() {
  if (!confirm('Envoyer l\'invitation officielle par e-mail ?')) return;
  this.textContent = 'Envoi…';
  const r = await fetch(`${BASE}/api/send-invitation.php`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    credentials:'include',
    body: JSON.stringify({participant_id: PID})
  });
  const ok = document.getElementById('inviteOk');
  const err = document.getElementById('inviteErr');
  if (r.ok) {
    ok.style.display = 'block'; err.style.display = 'none';
    this.textContent = 'Invitation envoyée';
    this.disabled    = true;
    setTimeout(() => loadParticipant(), 2000);
  } else {
    const d = await r.json();
    err.textContent = d.error === 'contribution_incomplete' ? 'Contribution incomplète.' : 'Erreur lors de l\'envoi.';
    err.style.display = 'block'; ok.style.display = 'none';
    this.textContent = 'Envoyer l\'invitation par e-mail';
  }
});

loadParticipant();
</script>
</body>
</html>
