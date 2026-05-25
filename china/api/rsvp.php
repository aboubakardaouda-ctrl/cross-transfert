<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Status check
    $email = trim($_GET['email'] ?? '');
    $tid   = trim($_GET['translator_id'] ?? '');
    if (!$email && !$tid) { json_response(['error' => 'Missing parameter'], 400); }

    $db  = get_db();
    $sql = $email
        ? "SELECT * FROM participants WHERE email = ?"
        : "SELECT * FROM participants WHERE translator_id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([$email ?: $tid]);
    $p = $stmt->fetch();
    if (!$p) { json_response(['error' => 'not_found'], 404); }

    $settings = get_event_settings();
    json_response([
        'id'           => $p['id'],
        'full_name'    => $p['full_name'],
        'email'        => $p['email'],
        'translator_id'=> $p['translator_id'],
        'status'       => $p['status'],
        'total_paid'   => (int)$p['total_paid'],
        'total_required'=> (int)$settings['total_required'],
        'participates' => (bool)$p['participates'],
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) { json_response(['error' => 'Invalid JSON'], 400); }

$full_name     = trim($body['fullName'] ?? '');
$email         = strtolower(trim($body['email'] ?? ''));
$phone         = trim($body['phone'] ?? '');
$translator_id = trim($body['translatorId'] ?? '');
$city          = trim($body['city'] ?? '');
$participates  = isset($body['participates']) ? (bool)$body['participates'] : true;
$comment       = trim($body['comment'] ?? '');

// Validation
$errors = [];
if (!$full_name)                      $errors['fullName'] = 'required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'invalid';
if (!$translator_id)                  $errors['translatorId'] = 'required';
if ($errors) { json_response(['errors' => $errors], 422); }

$db = get_db();

// Duplicate check
$stmt = $db->prepare("SELECT id FROM participants WHERE email=? OR translator_id=?");
$stmt->execute([$email, $translator_id]);
if ($stmt->fetch()) {
    json_response(['error' => 'duplicate'], 409);
}

// Insert
$stmt = $db->prepare(
    "INSERT INTO participants (full_name,email,phone,translator_id,city,participates,comment)
     VALUES (?,?,?,?,?,?,?)"
);
$stmt->execute([$full_name,$email,$phone,$translator_id,$city,$participates?1:0,$comment]);
$id = $db->lastInsertId();

// Notify admin
send_admin_notification([
    'full_name'     => $full_name,
    'email'         => $email,
    'translator_id' => $translator_id,
    'city'          => $city,
    'participates'  => $participates,
    'comment'       => $comment,
]);

json_response(['success' => true, 'id' => $id], 201);

function send_admin_notification(array $p): void {
    $subject = "Nouveau RSVP — {$p['full_name']}";
    $msg = "Nouveau RSVP reçu sur la plateforme ACTILC.\n\n"
         . "Nom : {$p['full_name']}\n"
         . "Email : {$p['email']}\n"
         . "Matricule : {$p['translator_id']}\n"
         . "Ville : {$p['city']}\n"
         . "Participation : " . ($p['participates'] ? 'Oui' : 'Non') . "\n"
         . "Message : {$p['comment']}\n\n"
         . "Accéder au tableau de bord : " . SITE_URL . "/admin/dashboard.php";

    $headers = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n"
             . "Reply-To: " . FROM_EMAIL . "\r\n"
             . "Content-Type: text/plain; charset=UTF-8\r\n";
    @mail(ADMIN_EMAIL, $subject, $msg, $headers);
}
