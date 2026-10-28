<?php
// Обработчик заявок для российского хостинга с PHP (Beget, Timeweb, REG.RU и т. п.).
// Ничего не сохраняет на сервере: пересылает заявку на вашу почту.
// Почта должна быть на российском сервисе (Яндекс, Mail.ru): Gmail и другие зарубежные нарушают ч. 5 ст. 18 152-ФЗ.

$TO = '';   // куда приходят заявки, например danil@yandex.ru
$FROM = ''; // адрес на домене сайта, например no-reply@ваш-домен.ru

date_default_timezone_set('Asia/Yakutsk'); // время Благовещенска
header('Content-Type: application/json; charset=utf-8');

function reply($code, $ok) {
    http_response_code($code);
    echo json_encode(['ok' => $ok]);
    exit;
}

function field($key, $max) {
    $v = isset($_POST[$key]) ? (string)$_POST[$key] : '';
    $v = trim(preg_replace('/[\r\n\t]+/u', ' ', $v));
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, false);
if (!empty($_POST['website'])) reply(200, true); // ловушка для ботов

$name = field('name', 60);
$phone = field('phone', 20);
$channel = field('channel', 20);
$time = field('time', 20);
$version = field('consent_version', 40);
$page = field('page', 200);
$digits = preg_replace('/\D/', '', $phone);

// Без согласия заявку не принимаем: так требует ст. 9 152-ФЗ.
if (mb_strlen($name, 'UTF-8') < 2 || strlen($digits) < 10 || strlen($digits) > 15 || field('consent', 3) !== 'yes') reply(422, false);
if ($TO === '' || $FROM === '') reply(500, false);

$clinic = field('consent_clinic', 3) === 'yes' ? 'да' : 'нет';
$body = "Новая заявка с сайта\n\n"
    . "Имя: $name\n"
    . "Телефон: $phone\n"
    . "Как связаться: $channel\n"
    . "Когда удобно: $time\n\n"
    . "Согласие на обработку ПДн: да, редакция от $version\n"
    . "Согласие на передачу данных клинике в КНР: $clinic\n"
    . "Отправлено: " . date('d.m.Y H:i:s') . " (Благовещенск)\n"
    . "IP: " . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '') . "\n"
    . "Страница: $page\n\n"
    . "Удалите заявку через год после последнего общения или в течение 30 дней после отзыва согласия. Дату, время и IP можно хранить как подтверждение согласия не дольше 3 лет.\n";

$subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта: ' . $name) . '?=';
$headers = "From: $FROM\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit";

$sent = mail($TO, $subject, $body, $headers);
reply($sent ? 200 : 500, $sent);
