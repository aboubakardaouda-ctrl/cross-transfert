<?php
require_once __DIR__ . '/auth-check.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/send-invitation.php'; // reuse send function
require_admin();

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { json_response(['error'=>'Method not allowed'],405); }

$db       = get_db();
$settings = get_event_settings();

$stmt = $db->query("SELECT * FROM participants WHERE status='validated'");
$list = $stmt->fetchAll();

$sent = 0; $failed = 0;
foreach ($list as $p) {
    if (send_invitation_email($p, $settings)) {
        $db->prepare("UPDATE participants SET status='invited', updated_at=NOW() WHERE id=?")
           ->execute([$p['id']]);
        $sent++;
    } else {
        $failed++;
    }
}

json_response(['success' => true, 'sent' => $sent, 'failed' => $failed]);
