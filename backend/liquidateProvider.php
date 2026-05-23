<?php

require_once "utils/session.php";
require_once "dao/personDao.php";
require_once "dao/bookDao.php";
require_once "utils/email_body.php";
require_once "utils/sendEmail.php";

function decodeDaoResult($result)
{
    if (is_string($result)) {
        $decoded = json_decode($result, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
    }

    if (is_array($result)) {
        return $result;
    }

    return [
        'status' => 'error',
        'message' => 'Unexpected DAO response format'
    ];
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

if (!isset($body['Provider_Id'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Bad Request',
        'message' => 'Provider_Id is required'
    ]);
    exit;
}

$provider_id = $body['Provider_Id']['Provider_Id'];
$provider_books_result = decodeDaoResult(getBooksByProvider($provider_id));
$provider_books = $provider_books_result['books'] ?? [];
$full_provider_info = decodeDaoResult(getProviderById($provider_id));

liquidateProvider($provider_id);

$not_sold_books = array_filter($provider_books, function ($book) {
    return $book['Sold_date'] === null;
});
$sold_books = array_filter($provider_books, function ($book) {
    return $book['Sold_date'] !== null;
});

$sold_books_money = array_sum(array_column($sold_books, 'Price_new'));
$sold_books_money_halved = $sold_books_money / 2;

$not_sold_table = generateBooksEmailTable($not_sold_books);
$sold_table = generateBooksEmailTable($sold_books);

$email_body = "
            <h1>Ciao " . $full_provider_info['Name'] . "</h1>
            <p>Ecco il resoconto dei tuoi libri al Merkatino Libri Usati.</p>
            <p>Di seguito trovi la lista dei libri che hai venduto:</p>
            " . $sold_table . "
            <p>Questi libri hanno generato un ricavo totale di " . $sold_books_money_halved . " euro.</p>
            <p>I seguenti libri non sono stati venduti:</p>
            " . $not_sold_table . "
            <p>Speriamo di rivederti presto!</p>
            <br />
            <p>Team Lokalino</p>
            ";

sendEmail(
    $full_provider_info['Email'],
    $full_provider_info['Name'] . " " . $full_provider_info['Surname'],
    "Resoconto Liquidazione - Merkatino Libri Usati",
    $email_body
);

echo json_encode([
    'message' => 'Provider liquidated'
]);
http_response_code(200);
