<?php
/**
 * rsvp.php — Wedding RSVP Handler
 * Compatible with LWS shared hosting (PHP 7.4+)
 * No framework · No database required · Saves to JSON file
 *
 * =============================================
 * CONFIGURATION — Edit these values
 * =============================================
 */
define('ADMIN_EMAIL',    'contact@votre-domaine.com');  // Your notification email
define('FROM_EMAIL',     'noreply@votre-domaine.com');  // Sender address
define('STORAGE_FILE',   __DIR__ . '/rsvp_responses.json');
define('RSVP_DEADLINE',  '2026-06-01');
// =============================================

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// Only POST requests accepted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

/* ==========================================
   Helper: sanitize a string field
   ========================================== */
function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

/* ==========================================
   Collect & sanitize input
   ========================================== */
$name      = clean($_POST['name']      ?? '');
$whatsapp  = clean($_POST['whatsapp']  ?? '');
$attending = clean($_POST['attending'] ?? '');
$guests    = max(0, min(10, (int)($_POST['guests'] ?? 0)));
$message   = clean($_POST['message']   ?? '');

/* ==========================================
   Validation
   ========================================== */
$errors = [];

if ($name === '') {
    $errors[] = 'Le nom est requis.';
}

if ($whatsapp === '') {
    $errors[] = 'Le numéro WhatsApp est requis.';
}

if (!in_array($attending, ['oui', 'non'], true)) {
    $errors[] = 'Veuillez indiquer votre présence.';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

/* ==========================================
   Build response entry
   ========================================== */
$entry = [
    'id'        => uniqid('rsvp_', true),
    'timestamp' => date('Y-m-d H:i:s'),
    'name'      => $name,
    'whatsapp'  => $whatsapp,
    'attending' => $attending,
    'guests'    => $guests,
    'message'   => $message,
];

/* ==========================================
   Persist to JSON file
   ========================================== */
$responses = [];

if (file_exists(STORAGE_FILE)) {
    $raw = file_get_contents(STORAGE_FILE);
    if ($raw !== false) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $responses = $decoded;
        }
    }
}

$responses[] = $entry;

$written = file_put_contents(
    STORAGE_FILE,
    json_encode($responses, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    LOCK_EX
);

if ($written === false) {
    // File write failed — still try to notify by email
    sendNotification($entry, null);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement. Veuillez réessayer.']);
    exit;
}

// Email notification (non-blocking — failure doesn't affect the response)
sendNotification($entry, $responses);

/* ==========================================
   Success response
   ========================================== */
echo json_encode([
    'success' => true,
    'message' => 'Votre réponse a bien été enregistrée. Merci !',
    'data'    => [
        'name'      => $name,
        'attending' => $attending,
    ],
]);

/* ==========================================
   sendNotification — email the couple/admin
   ========================================== */
function sendNotification(array $entry, ?array $allResponses): void
{
    $adminEmail = ADMIN_EMAIL;
    if (empty($adminEmail) || strpos($adminEmail, 'votre-domaine') !== false) {
        return; // Not configured — skip
    }

    $presenceLabel = $entry['attending'] === 'oui' ? '✅ OUI' : '❌ NON';

    $subject = '💌 Nouvelle réponse RSVP — Mariage A&H';

    $body  = "Nouvelle réponse RSVP reçue :\n\n";
    $body .= "Nom          : {$entry['name']}\n";
    $body .= "WhatsApp     : {$entry['whatsapp']}\n";
    $body .= "Présence     : {$presenceLabel}\n";
    $body .= "Accompagnants: {$entry['guests']}\n";
    $body .= "Message      : " . (!empty($entry['message']) ? $entry['message'] : '(aucun)') . "\n";
    $body .= "\nDate : {$entry['timestamp']}\n";

    if (is_array($allResponses)) {
        $total     = count($allResponses);
        $attending = count(array_filter($allResponses, static fn($r) => $r['attending'] === 'oui'));
        $notComing = $total - $attending;
        $body .= "\n---\n";
        $body .= "Récapitulatif : {$total} réponse(s) — {$attending} présent(s) / {$notComing} absent(s)\n";
    }

    $headers  = "From: RSVP Mariage A&H <" . FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . FROM_EMAIL . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";

    @mail($adminEmail, $subject, $body, $headers);
}
