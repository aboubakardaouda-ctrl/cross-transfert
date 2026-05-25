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
body{background:#F8F3EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#333;min-height:100vh}
nav{background:#8B1A1A;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:100}
.nav-brand{color:#fff;font-size:16px;letter-spacing:3px;font-family:Georgia,serif;font-weight:300}
.nav-tabs{display:flex}
.nav-tab{color:rgba(255,255,255,0.7);text-decoration:none;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:0 16px;height:52px;display:flex;align-items:center;border-bottom:2px solid transparent;transition:.2s}
.nav-tab:hover{color:#fff;border-bottom-color:#C9A96E}
.btn-sm{padding:6px 14px;border-radius:2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border:none;text-decoration:none;display:inline-block;transition:.2s}
.btn-back{background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.2)}
.btn-back:hover{background:rgba(255,255,255,0.2)}
.btn-logout{background:transparent;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.15);margin-left:8px}
.container{max-width:720px;margin:0 auto;padding:24px 16px}
.back-link{display:inline-flex;align-items:center;gap:6px;color:#8B1A1A;text-decoration:none;font-size:12px;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px}
.card{background:#fff;border:1px solid #E8D5B0;border-radius:4px;padding:24px;margin-bottom:16px}
.card-title{font-size:11px;color:#C9A96E;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #F0E8D0}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.info-item label{display:block;font-size:10px;color:#AAA;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px}
.info-item span{font-size:14px;color:#333}
.badge{display:inline-block;padding:4px 12px;border-radius:10px;font-size:11px;letter-spacing:1px;font-weight:500}
.badge-pending{background:#FEF3C7;color:#92400E}
.badge-validated{background:#D1FAE5;color:#065F46}
.badge-invited{background:#DBEAFE;color:#1E40AF}
.progress-wrap{margin:16px 0}
.progress-track{height:8px;background:#F0E8D0;border-radius:4px;overflow:hidden;margin-top:6px}
.progress-fill{height:100%;background:linear-gradient(90deg,#C9A96E,#8B1A1A);border-radius:4px;transition:.6s}
.progress-labels{display:flex;justify-content:space-between;font-size:11px;color:#AAA;margin-top:4px}
.payment-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F0E8D0}
.payment-row:last-child{border:none}
.payment-amount{font-size:15px;color:#065F46;font-weight:500}
.payment-note{font-size:12px;color:#888}
.payment-date{font-size:11px;color:#AAA}
.form-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
input[type=number],input[type=text],textarea{padding:9px 12px;border:1px solid #E0D5C0;border-radius:2px;font-size:13px;background:#FDFCF8;outline:none;transition:.2s}
input[type=number]:focus,input[type=text]:focus,textarea:focus{border-color:#C9A96E}
input[type=number]{width:140px}
input[type=text]{flex:1;min-width:160px}
.btn-add{padding:9px 20px;background:#8B1A1A;color:#fff;border:none;border-radius:2px;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:.2s}
.btn-add:hover{background:#6B1313}
.btn-invite{width:100%;padding:13px;background:linear-gradient(135deg,#8B1A1A,#6B1313);color:#fff;border:none;border-radius:2px;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;margin-top:4px;transition:.2s}
.btn-invite:hover{opacity:.9}
.btn-invite:disabled{opacity:.4;cursor:not-allowed}
.msg{padding:10px 14px;border-radius:2px;font-size:12px;margin-top:10px;display:none}
.msg-ok{background:#D1FAE5;color:#065F46;border:1px solid #6EE7B7}
.msg-err{background:#FEE2E2;color:#B91C1C;border:1px solid #FCA5A5}
.empty{color:#AAA;font-size:13px;padding:12px 0;text-align:center}
#participantData{display:none}
.loading-msg{text-align:center;padding:60px;color:#AAA}
</style>
</head>
<body>
<nav>
  <span class="nav-brand">ACTILC</span>
  <div class="nav-tabs">
    <a href="dashboard.php" class="nav-tab">Participants</a>
    <a href="settings.php" class="nav-tab">Événement</a>
  </div>
  <div style="display:flex;gap:8px;align-items:center">
    <a href="dashboard.php" class="btn-sm btn-back">← Retour</a>
    <a href="<?= SITE_URL ?>/../api/logout.php" class="btn-sm btn-logout">Déconnexion</a>
  </div>
</nav>

<div class="container">
  <div id="loadingMsg" class="loading-msg">Chargement…</div>
  <div id="participantData">

    <div class="card">
      <div class="card-title">Informations du participant</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px">
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
          <span id="pPaid" style="font-size:20px;color:#8B1A1A;font-family:Georgia,serif;font-weight:300"></span>
          <span id="pPct" style="font-size:12px;color:#AAA"></span>
        </div>
        <div class="progress-track"><div class="progress-fill" id="pBar" style="width:0%"></div></div>
        <div class="progress-labels"><span>0 FCFA</span><span id="pTotal"></span></div>
      </div>

      <div id="paymentList"></div>

      <div style="border-top:1px solid #F0E8D0;margin-top:16px;padding-top:16px">
        <p style="font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px">Ajouter un versement</p>
        <div class="form-row">
          <input type="number" id="payAmount" placeholder="Montant (FCFA)" min="1000" step="1000">
          <input type="text" id="payNote" placeholder="Note (facultatif)">
          <button class="btn-add" id="btnAddPay">Enregistrer</button>
        </div>
        <div class="msg msg-ok" id="payOk">Versement enregistré.</div>
        <div class="msg msg-err" id="payErr">Erreur lors de l'enregistrement.</div>
      </div>
    </div>

    <div class="card" id="inviteCard">
      <div class="card-title">Invitation officielle</div>
      <p id="inviteInfo" style="font-size:13px;color:#888;margin-bottom:12px"></p>
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

  document.getElementById('pName').textContent      = p.full_name;
  document.getElementById('pEmail').textContent     = p.email;
  document.getElementById('pTid').textContent       = p.translator_id;
  document.getElementById('pPhone').textContent     = p.phone || '—';
  document.getElementById('pCity').textContent      = p.city || '—';
  document.getElementById('pParticipates').textContent = p.participates == 1 ? 'Oui' : 'Non';
  document.getElementById('pComment').textContent   = p.comment || '—';

  const [label, cls] = BADGES[p.status] || ['—',''];
  const badge = document.getElementById('pBadge');
  badge.textContent = label;
  badge.className   = 'badge ' + cls;

  updateContribution(parseInt(p.total_paid), d.payments, p.status);

  const btnInvite = document.getElementById('btnInvite');
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
  this.textContent = 'Enregistrer';

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
