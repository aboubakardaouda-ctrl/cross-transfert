<?php
require_once __DIR__ . '/auth-check.php';
require_once __DIR__ . '/db.php';
require_admin();

header('Content-Type: application/json; charset=utf-8');
$id = (int)($_GET['id'] ?? 0);
if (!$id) { json_response(['error' => 'Missing id'], 400); }

$db   = get_db();
$stmt = $db->prepare("SELECT * FROM participants WHERE id=?");
$stmt->execute([$id]);
$p = $stmt->fetch();
if (!$p) { json_response(['error' => 'not_found'], 404); }

$pstmt = $db->prepare("SELECT * FROM payments WHERE participant_id=? ORDER BY created_at ASC");
$pstmt->execute([$id]);
$payments = $pstmt->fetchAll();

$settings = get_event_settings();
json_response([
    'participant'    => $p,
    'payments'       => $payments,
    'total_required' => (int)$settings['total_required'],
]);
