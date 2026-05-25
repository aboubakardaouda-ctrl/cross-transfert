<?php
require_once __DIR__ . '/config.php';

function get_db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER, DB_PASS,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed']));
        }
    }
    return $pdo;
}

function json_response(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function get_event_settings(): array {
    $db = get_db();
    $row = $db->query("SELECT * FROM event_settings WHERE id='default'")->fetch();
    return $row ?: [
        'title'          => "2ème Assemblée Générale de l'ACTILC",
        'title_en'       => '2nd General Assembly of ACTILC',
        'title_zh'       => 'ACTILC第二届全体大会',
        'event_date'     => 'Dimanche 27 décembre 2026',
        'event_time'     => '9h00 précise',
        'event_location' => 'Franco Hôtel, Yaoundé',
        'total_required' => 25000,
        'year'           => 2026,
    ];
}
