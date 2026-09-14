<?php
declare(strict_types=1);

// Contact now uses mailto links. No messages are submitted through this endpoint.
$language = (($_POST['lang'] ?? $_GET['lang'] ?? '') === 'en') ? 'en' : 'mk';
$destination = ($language === 'en' ? 'en/' : '') . 'contacts.html#contact-email';
header('Cache-Control: no-store');
header('Location: ' . $destination, true, 303);
exit;
