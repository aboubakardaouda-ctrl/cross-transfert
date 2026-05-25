<?php
require_once __DIR__ . '/auth-check.php';
require_once __DIR__ . '/db.php';
require_admin();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_response(get_event_settings());
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) { json_response(['error' => 'Invalid JSON'], 400); }

    $db = get_db();
    $db->prepare("INSERT INTO event_settings (id,title,title_en,title_zh,event_date,event_time,event_location,total_required,year)
        VALUES ('default',?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title), title_en=VALUES(title_en), title_zh=VALUES(title_zh),
          event_date=VALUES(event_date), event_time=VALUES(event_time),
          event_location=VALUES(event_location), total_required=VALUES(total_required), year=VALUES(year)")
    ->execute([
        $body['title']          ?? "2ème Assemblée Générale de l'ACTILC",
        $body['title_en']       ?? '2nd General Assembly of ACTILC',
        $body['title_zh']       ?? 'ACTILC第二届全体大会',
        $body['event_date']     ?? 'Dimanche 27 décembre 2026',
        $body['event_time']     ?? '9h00 précise',
        $body['event_location'] ?? 'Franco Hôtel, Yaoundé',
        (int)($body['total_required'] ?? 25000),
        (int)($body['year']           ?? 2026),
    ]);

    json_response(get_event_settings());
}

json_response(['error' => 'Method not allowed'], 405);
