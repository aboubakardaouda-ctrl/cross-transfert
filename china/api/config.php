<?php
// ============================================================
// ACTILC RSVP — Configuration
// ============================================================
// Si le fichier config.local.php existe sur le serveur,
// il est chargé en priorité pour les credentials DB.
// Créez ce fichier UNE SEULE FOIS sur le serveur — il ne sera
// jamais écrasé par un upload de ZIP.
// ============================================================

if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
} else {
    define('DB_HOST', '127.0.0.1');
    define('DB_NAME', 'your_db_name');    // e.g. bille2778506
    define('DB_USER', 'your_db_user');    // e.g. bille2778506
    define('DB_PASS', 'your_db_password');
}

define('ADMIN_PASS_HASH', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

// Email — who receives RSVP notifications
define('ADMIN_EMAIL', 'aboubakar.daouda@speedappro.com');
define('FROM_EMAIL', 'daoudaoumarouaboubakar@gmail.com');
define('FROM_NAME', 'ACTILC');

// Site URL (no trailing slash)
define('SITE_URL', 'https://billetinvitation.site/china');

// Session
define('SESSION_LIFETIME', 3600 * 8);

ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) ? 1 : 0);
session_name('actilc_admin');
