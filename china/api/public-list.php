<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed'], 405);
}

$db = get_db();
$rows = $db->query(
    "SELECT full_name, city, status FROM participants
     WHERE participates = 1
     ORDER BY created_at ASC"
)->fetchAll();

$total = $db->query("SELECT COUNT(*) FROM participants WHERE participates = 1")->fetchColumn();

json_response([
    'participants' => $rows,
    'total'        => (int)$total,
]);
