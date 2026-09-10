<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

$language = (($_POST['lang'] ?? '') === 'en') ? 'en' : 'mk';

$isJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(int $status, bool $ok, string $message, bool $json): never
{
    global $language;
    $translations = [
        'Дозволено е само испраќање преку контакт формата.' => 'Please submit your message using the contact form.',
        'Пораката е преголема.' => 'Your message is too large.',
        'Почекајте кратко пред повторно испраќање.' => 'Please wait a moment before sending another message.',
        'Ви благодариме. Пораката е примена.' => 'Thank you. Your message has been received.',
        'Внесете валидно име, e-mail адреса и порака.' => 'Please enter a valid name, email address and message.',
        'Внесените податоци не се валидни.' => 'The submitted information is invalid.',
        'Пораката треба да содржи најмалку 10 знаци.' => 'Your message must contain at least 10 characters.',
        'Пораката не можеше да се испрати. Контактирајте нè на +389 (034) 211-944.' => 'Your message could not be sent. Please call +389 (034) 211-944.',
        'Ви благодариме. Пораката е успешно испратена.' => 'Thank you. Your message was sent successfully.',
    ];
    if ($language === 'en') $message = $translations[$message] ?? $message;
    http_response_code($status);
    if ($json) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        header('Content-Type: text/html; charset=UTF-8');
        $safe = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        echo '<!doctype html><html lang="' . $language . '"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
        echo '<title>EUROING — Contact</title><style>body{font-family:system-ui,sans-serif;background:#f4f0eb;color:#171127;display:grid;place-items:center;min-height:100vh;margin:0;padding:24px}.card{max-width:620px;background:#fff;padding:40px;border-radius:20px;box-shadow:0 24px 70px rgba(58,47,112,.12)}a{color:#3a2f70;font-weight:700}</style>';
        echo '<main class="card"><h1>' . ($language === 'en' ? ($ok ? 'Message sent' : 'Message not sent') : ($ok ? 'Пораката е испратена' : 'Пораката не е испратена')) . '</h1><p>' . $safe . '</p><p><a href="' . ($language === 'en' ? 'en/' : '') . 'contacts.html">' . ($language === 'en' ? 'Back to contact' : 'Назад кон контакт') . '</a></p></main></html>';
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, false, 'Дозволено е само испраќање преку контакт формата.', $isJson);
}

$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 65536) {
    respond(413, false, 'Пораката е преголема.', $isJson);
}

session_start();
$now = time();
$lastSubmission = (int)($_SESSION['contact_last_submission'] ?? 0);
if ($lastSubmission > 0 && ($now - $lastSubmission) < 45) {
    respond(429, false, 'Почекајте кратко пред повторно испраќање.', $isJson);
}

// Honeypot: bots commonly complete this hidden field.
if (trim((string)($_POST['website'] ?? '')) !== '') {
    respond(200, true, 'Ви благодариме. Пораката е примена.', $isJson);
}

function clean_field(string $key, int $maxLength): string
{
    $value = trim((string)($_POST[$key] ?? ''));
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }
    return substr($value, 0, $maxLength);
}

$name = clean_field('name', 120);
$company = clean_field('company', 160);
$phone = clean_field('phone', 60);
$email = clean_field('email', 254);
$message = clean_field('message', 5000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Внесете валидно име, e-mail адреса и порака.', $isJson);
}
if (preg_match('/[\r\n]/', $email) || preg_match('/[\r\n]/', $name)) {
    respond(422, false, 'Внесените податоци не се валидни.', $isJson);
}
if (function_exists('mb_strlen') ? mb_strlen($message, 'UTF-8') < 10 : strlen($message) < 10) {
    respond(422, false, 'Пораката треба да содржи најмалку 10 знаци.', $isJson);
}

$recipient = 'contact@euroing.com.mk';
$subjectText = 'Нова порака од веб-страницата — ' . $name;
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';
$body = "Нова порака преку euroing.com.mk\n\n";
$body .= "Име и презиме: {$name}\n";
$body .= "Компанија: " . ($company !== '' ? $company : '—') . "\n";
$body .= "Телефон: " . ($phone !== '' ? $phone : '—') . "\n";
$body .= "E-mail: {$email}\n\n";
$body .= "Порака:\n{$message}\n";
$body .= "\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

$host = 'euroing.com.mk';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: EUROING Website <no-reply@' . $host . '>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = @mail($recipient, $subject, $body, implode("\r\n", $headers));
if (!$sent) {
    respond(500, false, 'Пораката не можеше да се испрати. Контактирајте нè на +389 (034) 211-944.', $isJson);
}

$_SESSION['contact_last_submission'] = $now;
respond(200, true, 'Ви благодариме. Пораката е успешно испратена.', $isJson);
