<?php
require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/db.php';

$newPassword = 'Admin2026!';
$hash = password_hash($newPassword, PASSWORD_DEFAULT);

try {
    $db = get_db();

    // Check if admin exists
    $stmt = $db->prepare("SELECT id, username FROM admins WHERE username = 'admin'");
    $stmt->execute();
    $existing = $stmt->fetch();

    if ($existing) {
        $stmt = $db->prepare("UPDATE admins SET password = ? WHERE username = 'admin'");
        $stmt->execute([$hash]);
        echo "<p style='color:green;font-size:18px;font-family:sans-serif;'>✅ Mot de passe réinitialisé.<br><br>Identifiant : <strong>admin</strong><br>Mot de passe : <strong>" . htmlspecialchars($newPassword) . "</strong></p>";
    } else {
        $stmt = $db->prepare("INSERT INTO admins (username, password) VALUES ('admin', ?)");
        $stmt->execute([$hash]);
        echo "<p style='color:green;font-size:18px;font-family:sans-serif;'>✅ Compte admin créé.<br><br>Identifiant : <strong>admin</strong><br>Mot de passe : <strong>" . htmlspecialchars($newPassword) . "</strong></p>";
    }

    echo "<p style='font-family:sans-serif;color:red;margin-top:20px;'>⚠️ Supprime ce fichier immédiatement après connexion !</p>";

} catch (Exception $e) {
    echo "<p style='color:red;font-family:sans-serif;'>❌ Erreur DB : " . htmlspecialchars($e->getMessage()) . "</p>";
}
