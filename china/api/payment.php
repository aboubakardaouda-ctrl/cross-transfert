<?php
require_once __DIR__ . '/auth-check.php';
require_once __DIR__ . '/db.php';
require_admin();

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { json_response(['error'=>'Method not allowed'],405); }

$body          = json_decode(file_get_contents('php://input'), true);
$participant_id = (int)($body['participant_id'] ?? 0);
$amount        = (int)($body['amount'] ?? 0);
$note          = trim($body['note'] ?? '');

if (!$participant_id || $amount <= 0) { json_response(['error' => 'Invalid data'], 422); }

$db   = get_db();
$stmt = $db->prepare("SELECT id, total_paid, status FROM participants WHERE id=?");
$stmt->execute([$participant_id]);
$p = $stmt->fetch();
if (!$p) { json_response(['error' => 'not_found'], 404); }

// Insert payment
$db->prepare("INSERT INTO payments (participant_id, amount, note) VALUES (?,?,?)")
   ->execute([$participant_id, $amount, $note]);

// Update total_paid
$new_total = (int)$p['total_paid'] + $amount;
$settings  = get_event_settings();
$new_status = $new_total >= (int)$settings['total_required'] ? 'validated' : 'pending';
// Don't downgrade invited status
if ($p['status'] === 'invited') $new_status = 'invited';

$db->prepare("UPDATE participants SET total_paid=?, status=?, updated_at=NOW() WHERE id=?")
   ->execute([$new_total, $new_status, $participant_id]);

json_response([
    'success'    => true,
    'total_paid' => $new_total,
    'status'     => $new_status,
]);
