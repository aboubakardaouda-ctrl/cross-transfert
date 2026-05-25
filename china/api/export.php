<?php
require_once __DIR__ . '/auth-check.php';
require_once __DIR__ . '/db.php';
require_admin();

$db   = get_db();
$rows = $db->query("SELECT full_name,email,phone,translator_id,city,participates,total_paid,status,created_at FROM participants ORDER BY created_at DESC")->fetchAll();

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="actilc-participants-' . date('Y-m-d') . '.csv"');

$out = fopen('php://output', 'w');
// UTF-8 BOM for Excel
fwrite($out, "\xEF\xBB\xBF");

fputcsv($out, ['Nom complet','Email','Téléphone','Matricule ACTILC','Ville','Participe','Total payé (FCFA)','Statut','Date inscription'], ';');

foreach ($rows as $r) {
    fputcsv($out, [
        $r['full_name'],
        $r['email'],
        $r['phone'],
        $r['translator_id'],
        $r['city'],
        $r['participates'] ? 'Oui' : 'Non',
        $r['total_paid'],
        $r['status'],
        $r['created_at'],
    ], ';');
}
fclose($out);
