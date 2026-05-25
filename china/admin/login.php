<?php
require_once __DIR__ . '/../api/config.php';
require_once __DIR__ . '/../api/auth-check.php';
if (is_admin_logged_in()) {
    header('Location: ' . SITE_URL . '/admin/dashboard.php'); exit;
}
?><!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Administration — ACTILC</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#FDFCF8 0%,#F2EAE0 100%);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
.card{background:#fff;border:1px solid #E8D5B0;border-radius:4px;padding:40px 36px;width:100%;max-width:380px;box-shadow:0 8px 32px rgba(139,26,26,0.08)}
.logo{text-align:center;margin-bottom:28px}
.logo-icon{width:52px;height:52px;background:#8B1A1A;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:20px;color:#C9A96E;margin-bottom:12px}
h1{font-size:18px;font-weight:300;color:#1A1A1A;letter-spacing:2px;font-family:Georgia,serif}
.sub{font-size:11px;color:#AAA;letter-spacing:1px;margin-top:4px}
label{display:block;font-size:11px;color:#888;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;margin-top:16px}
input{width:100%;padding:10px 14px;border:1px solid #E0D5C0;border-radius:2px;font-size:14px;color:#333;background:#FDFCF8;outline:none;transition:.2s}
input:focus{border-color:#C9A96E;background:#fff}
button{width:100%;margin-top:24px;padding:13px;background:#8B1A1A;color:#fff;border:none;border-radius:2px;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:.2s}
button:hover{background:#6B1313}
.error{margin-top:16px;padding:10px 14px;background:#FEF2F2;border:1px solid #FCA5A5;border-radius:2px;font-size:12px;color:#B91C1C;display:none}
</style>
</head>
<body>
<div class="card">
  <div class="logo">
    <div class="logo-icon">中</div>
    <h1>ACTILC</h1>
    <p class="sub">Administration</p>
  </div>
  <form id="loginForm">
    <label>Identifiant</label>
    <input type="text" id="username" name="username" required autocomplete="username">
    <label>Mot de passe</label>
    <input type="password" id="password" name="password" required autocomplete="current-password">
    <div class="error" id="errMsg">Identifiants incorrects.</div>
    <button type="submit" id="btn">Se connecter</button>
  </form>
</div>
<script>
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('btn');
  const err = document.getElementById('errMsg');
  btn.textContent = '…';
  err.style.display = 'none';
  const r = await fetch('<?= SITE_URL ?>/api/login.php', {
    method:'POST', headers:{'Content-Type':'application/json'},
    credentials:'include',
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
  });
  if (r.ok) {
    location.href = '<?= SITE_URL ?>/admin/dashboard.php';
  } else {
    err.style.display = 'block';
    btn.textContent = 'Se connecter';
  }
});
</script>
</body>
</html>
