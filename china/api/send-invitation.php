<?php
require_once __DIR__ . '/auth-check.php';
require_once __DIR__ . '/db.php';
require_admin();

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { json_response(['error'=>'Method not allowed'],405); }

$body = json_decode(file_get_contents('php://input'), true);
$id   = (int)($body['participant_id'] ?? 0);
if (!$id) { json_response(['error' => 'Missing participant_id'], 400); }

$db   = get_db();
$stmt = $db->prepare("SELECT * FROM participants WHERE id=?");
$stmt->execute([$id]);
$p = $stmt->fetch();

if (!$p)                     { json_response(['error' => 'not_found'], 404); }
if ((int)$p['participates'] === 0) { json_response(['error' => 'not_attending'], 400); }

$settings = get_event_settings();
$total_required = (int)$settings['total_required'];
if ((int)$p['total_paid'] < $total_required) {
    json_response(['error' => 'contribution_incomplete'], 400);
}

$sent = send_invitation_email($p, $settings);
if ($sent) {
    $db->prepare("UPDATE participants SET status='invited', updated_at=NOW() WHERE id=?")
       ->execute([$id]);
    json_response(['success' => true]);
} else {
    json_response(['error' => 'email_failed'], 500);
}

function send_invitation_email(array $p, array $s): bool {
    $name      = htmlspecialchars($p['full_name']);
    $tid       = htmlspecialchars($p['translator_id']);
    $date      = htmlspecialchars($s['event_date'] . ' — ' . $s['event_time']);
    $location  = htmlspecialchars($s['event_location']);
    $title     = htmlspecialchars($s['title']);

    $subject = "Votre invitation officielle — {$s['title']}";
    $html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Invitation ACTILC</title></head>
<body style="margin:0;padding:0;background:#F8F3EC;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F3EC;padding:30px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#FDFCF8;border:1px solid #E8D5B0;border-radius:4px;overflow:hidden;">
      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#8B1A1A 0%,#6B1313 100%);padding:40px 40px 30px;text-align:center;">
        <div style="border:1px solid rgba(201,169,110,0.4);display:inline-block;padding:10px 16px;margin-bottom:16px;">
          <span style="font-size:24px;color:#C9A96E;">中</span>
        </div>
        <p style="color:#E8D5B0;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">INVITATION OFFICIELLE</p>
        <h1 style="color:#fff;font-size:22px;font-weight:300;letter-spacing:3px;margin:0;">ACTILC</h1>
        <p style="color:#C9A96E;font-size:11px;margin:6px 0 0;letter-spacing:1px;">Association Camerounaise des Traducteurs et Interprètes de Langue Chinoise</p>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:36px 40px;">
        <p style="font-size:13px;color:#888;text-align:center;letter-spacing:2px;text-transform:uppercase;margin:0 0 20px;">Cette invitation est délivrée à</p>
        <h2 style="font-size:26px;font-weight:300;color:#8B1A1A;text-align:center;margin:0 0 4px;">{$name}</h2>
        <p style="text-align:center;color:#C9A96E;font-size:12px;letter-spacing:2px;margin:0 0 28px;">Matricule : {$tid}</p>
        <div style="border-top:1px solid #E8D5B0;border-bottom:1px solid #E8D5B0;padding:20px 0;margin:0 0 28px;text-align:center;">
          <p style="color:#888;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Vous êtes invité(e) à</p>
          <p style="color:#1A1A1A;font-size:16px;font-weight:normal;margin:0 0 16px;">{$title}</p>
          <table width="100%" cellpadding="8">
            <tr>
              <td style="text-align:center;border-right:1px solid #E8D5B0;">
                <p style="color:#C9A96E;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Date &amp; Heure</p>
                <p style="color:#333;font-size:12px;font-weight:bold;margin:0;">{$date}</p>
              </td>
              <td style="text-align:center;">
                <p style="color:#C9A96E;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px;">Lieu</p>
                <p style="color:#333;font-size:12px;font-weight:bold;margin:0;">{$location}</p>
              </td>
            </tr>
          </table>
        </div>
        <p style="font-size:11px;color:#AAA;text-align:center;line-height:1.7;margin:0;">
          Cette invitation est strictement personnelle et non cessible.<br>
          Veuillez la présenter à l'entrée le jour de l'événement.<br>
          <strong style="color:#8B1A1A;">Contribution réglée — Participation confirmée</strong>
        </p>
      </td></tr>
      <!-- Footer -->
      <tr><td style="background:#F2EAE0;padding:16px 40px;text-align:center;border-top:1px solid #E8D5B0;">
        <p style="color:#999;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0;">ACTILC · billetinvitation.site</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
HTML;

    $boundary = md5(time());
    $headers  = "MIME-Version: 1.0\r\n"
              . "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n"
              . "Reply-To: " . FROM_EMAIL . "\r\n"
              . "Content-Type: text/html; charset=UTF-8\r\n";

    return @mail($p['email'], $subject, $html, $headers);
}
