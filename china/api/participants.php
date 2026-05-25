<?php
require_once __DIR__ . '/auth-check.php';
require_once __DIR__ . '/db.php';
require_admin();

header('Content-Type: application/json; charset=utf-8');

$db     = get_db();
$search = trim($_GET['search'] ?? '');
$status = $_GET['status'] ?? '';
$page   = max(1, (int)($_GET['page'] ?? 1));
$limit  = 20;
$offset = ($page - 1) * $limit;

$where  = [];
$params = [];

if ($search) {
    $where[]  = "(full_name LIKE ? OR email LIKE ? OR translator_id LIKE ? OR city LIKE ?)";
    $like     = "%$search%";
    $params   = array_merge($params, [$like, $like, $like, $like]);
}
if ($status && in_array($status, ['pending','validated','invited'])) {
    $where[]  = "status = ?";
    $params[] = $status;
}

$whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$total = $db->prepare("SELECT COUNT(*) FROM participants $whereClause");
$total->execute($params);
$totalCount = (int)$total->fetchColumn();

$stmt = $db->prepare("SELECT * FROM participants $whereClause ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
$stmt->execute($params);
$rows = $stmt->fetchAll();

// Stats
$stats = $db->query("SELECT
    COUNT(*) as total,
    SUM(status='pending') as pending,
    SUM(status='validated') as validated,
    SUM(status='invited') as invited
  FROM participants")->fetch();

json_response([
    'participants' => $rows,
    'total'        => $totalCount,
    'page'         => $page,
    'pages'        => (int)ceil($totalCount / $limit),
    'stats'        => $stats,
]);
