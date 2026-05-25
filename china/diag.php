<?php
$db_name = 'bille2778506';
$db_user = 'bille2778506';
$db_pass = 'Achetetapart1@';

$hosts = ['localhost', '127.0.0.1', 'sql.hebergeur-discount.com', 'mysql.billetinvitation.site'];

echo "<style>body{font-family:sans-serif;padding:20px;} .ok{color:green} .err{color:red}</style>";
echo "<h2>Diagnostic connexion MySQL</h2>";

foreach ($hosts as $host) {
    try {
        $pdo = new PDO(
            "mysql:host=$host;dbname=$db_name;charset=utf8mb4",
            $db_user, $db_pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 3]
        );
        echo "<p class='ok'>✅ Connexion OK avec host : <strong>$host</strong></p>";

        // Check admins table
        $rows = $pdo->query("SELECT id, username FROM admins")->fetchAll();
        if ($rows) {
            echo "<p class='ok'>Table admins trouvée : " . count($rows) . " utilisateur(s)</p>";
            foreach ($rows as $r) echo "<p>→ id={$r['id']} username={$r['username']}</p>";

            // Reset password
            $hash = password_hash('Admin2026!', PASSWORD_DEFAULT);
            $pdo->prepare("UPDATE admins SET password=? WHERE username='admin'")->execute([$hash]);
            echo "<p class='ok'><strong>✅ Mot de passe réinitialisé !</strong><br>Login : admin<br>Password : Admin2026!</p>";
        } else {
            // Insert admin
            $hash = password_hash('Admin2026!', PASSWORD_DEFAULT);
            $pdo->prepare("INSERT INTO admins (username,password) VALUES ('admin',?)")->execute([$hash]);
            echo "<p class='ok'>✅ Compte admin créé ! Login : admin / Admin2026!</p>";
        }
        break;

    } catch (PDOException $e) {
        echo "<p class='err'>❌ Host <strong>$host</strong> : " . htmlspecialchars($e->getMessage()) . "</p>";
    }
}

echo "<p style='color:red;margin-top:30px;font-weight:bold;'>⚠️ Supprime ce fichier immédiatement après !</p>";
