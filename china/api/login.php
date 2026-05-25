<?php
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

// Fetch from DB
require_once __DIR__ . '/db.php';
$db = get_db();
$stmt = $db->prepare("SELECT password FROM admins WHERE username = ? LIMIT 1");
$stmt->execute([$username]);
$row = $stmt->fetch();

if (!$row || !password_verify($password, $row['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

if (session_status() === PHP_SESSION_NONE) session_start();
session_regenerate_id(true);
$_SESSION['admin_logged_in'] = true;
$_SESSION['admin_username']  = $username;
$_SESSION['last_activity']   = time();

echo json_encode(['success' => true]);
