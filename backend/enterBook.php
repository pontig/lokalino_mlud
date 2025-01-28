<?php

// require_once "utils/session.php";
require_once "dao/bookDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$body = file_get_contents('php://input');
$data = json_decode($body, true);

$missingFields = [];
if (!isset($data['book']['ISBN'])) $missingFields[] = 'ISBN';
if (!isset($data['book']['Title'])) $missingFields[] = 'Title';
if (!isset($data['book']['Author'])) $missingFields[] = 'Author';
if (!isset($data['book']['Editor'])) $missingFields[] = 'Editor';
if (!isset($data['book']['Price_new'])) $missingFields[] = 'Price_new';

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Bad Request',
        'message' => 'Missing data: ' . implode(', ', $missingFields)
    ]);
    exit;
}

insertNewBooksInDatabase($data);

http_response_code(200);