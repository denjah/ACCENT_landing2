<?php
/**
 * send-bom.php — обработчик BOM-формы лендинга ООО «Акцент»
 * 
 * Принимает POST с полями:
 *   name, company, phone, email, bom_file (file), consent_personal, consent_marketing
 *
 * Отправляет письмо на info@accentcomponent.ru с вложением BOM-файла.
 */

header('Content-Type: application/json; charset=utf-8');

// ── Настройки ──────────────────────────────────────────────
$to       = 'info@accentcomponent.ru';
$subject  = 'Новая заявка BOM с сайта';
$maxSize  = 10 * 1024 * 1024; // 10 MB
$allowExt = ['xls', 'xlsx', 'csv', 'pdf'];

// ── Валидация ──────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$name    = trim($_POST['name'] ?? '');
$company = trim($_POST['company'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$email   = trim($_POST['email'] ?? '');
$consent = !empty($_POST['consent_personal']);
$marketing = !empty($_POST['consent_marketing']);

if ($name === '' || $phone === '' || $email === '') {
    echo json_encode(['status' => 'error', 'message' => 'Заполните обязательные поля: имя, телефон, email']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Некорректный email']);
    exit;
}

if (!$consent) {
    echo json_encode(['status' => 'error', 'message' => 'Необходимо согласие на обработку данных']);
    exit;
}

// ── Подготовка письма ──────────────────────────────────────
$boundary = md5(uniqid(time()));
$eol      = "\r\n";

$headers  = "From: noreply@accentcomponent.ru" . $eol;
$headers .= "Reply-To: $email" . $eol;
$headers .= "MIME-Version: 1.0" . $eol;
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"" . $eol;

// Тело письма (текстовая часть)
$body  = "--$boundary" . $eol;
$body .= "Content-Type: text/html; charset=utf-8" . $eol;
$body .= "Content-Transfer-Encoding: 8bit" . $eol . $eol;

$body .= "<h2>Новая заявка BOM</h2>";
$body .= "<table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;'>";
$body .= "<tr><td><strong>Имя</strong></td><td>" . htmlspecialchars($name) . "</td></tr>";
$body .= "<tr><td><strong>Компания</strong></td><td>" . htmlspecialchars($company) . "</td></tr>";
$body .= "<tr><td><strong>Телефон</strong></td><td>" . htmlspecialchars($phone) . "</td></tr>";
$body .= "<tr><td><strong>Email</strong></td><td>" . htmlspecialchars($email) . "</td></tr>";
$body .= "<tr><td><strong>Согласие на рассылку</strong></td><td>" . ($marketing ? 'Да' : 'Нет') . "</td></tr>";
$body .= "</table>";
$body .= $eol . $eol;

// Вложение (если файл приложен)
if (!empty($_FILES['bom_file']) && $_FILES['bom_file']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['bom_file']['tmp_name'];
    $fileName    = $_FILES['bom_file']['name'];
    $fileSize    = $_FILES['bom_file']['size'];
    $fileExt     = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if ($fileSize > $maxSize) {
        echo json_encode(['status' => 'error', 'message' => 'Файл превышает 10 МБ']);
        exit;
    }

    if (!in_array($fileExt, $allowExt)) {
        echo json_encode(['status' => 'error', 'message' => 'Допустимые форматы: ' . implode(', ', $allowExt)]);
        exit;
    }

    $fileContent = file_get_contents($fileTmpPath);
    $fileEncoded = chunk_split(base64_encode($fileContent));

    $body .= "--$boundary" . $eol;
    $body .= "Content-Type: application/octet-stream; name=\"" . $fileName . "\"" . $eol;
    $body .= "Content-Transfer-Encoding: base64" . $eol;
    $body .= "Content-Disposition: attachment; filename=\"" . $fileName . "\"" . $eol . $eol;
    $body .= $fileEncoded . $eol;
}

$body .= "--$boundary--" . $eol;

// ── Отправка ───────────────────────────────────────────────
$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['status' => 'success', 'message' => 'Заявка отправлена']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка отправки письма']);
}