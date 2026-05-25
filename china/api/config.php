<?php
// ============================================================
// ACTILC RSVP — Configuration
// Fill in your LWS MySQL credentials (from cPanel > Bases de données MySQL)
// ============================================================

define('DB_HOST', 'localhost');
define('DB_NAME', 'your_db_name');    // e.g. lws12345_actilc
define('DB_USER', 'your_db_user');    // e.g. lws12345_admin
define('DB_PASS', 'your_db_password');

// Admin password — run: php -r "echo password_hash('YourPassword', PASSWORD_DEFAULT);"
// then paste the result below
define('ADMIN_PASS_HASH', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); // default: password

// Email — who receives RSVP notifications
define('ADMIN_EMAIL', 'admin@billetinvitation.site');
// Sender address (must be verified on your domain)
define('FROM_EMAIL', 'noreply@billetinvitation.site');
define('FROM_NAME', 'ACTILC');

// Site URL (no trailing slash)
define('SITE_URL', 'https://billetinvitation.site/china');

// Session
define('SESSION_LIFETIME', 3600 * 8); // 8 hours

ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) ? 1 : 0);
session_name('actilc_admin');
