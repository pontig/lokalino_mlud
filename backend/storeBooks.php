<?php

// require_once "utils/session.php";

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS, GET');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400'); // Cache for 24 hours
    http_response_code(200);
    exit();
}


header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400'); // 24 hours cache for preflight

require_once "dao/bookDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

if (!isset($body['Provider_Id']) || !is_numeric($body['Provider_Id']) ||
    !isset($body['Books_to_edit']) || !is_array($body['Books_to_edit']) ||
    !isset($body['Books_to_add']) || !is_array($body['Books_to_add']) ||
    !isset($body['Books_to_remove']) || !is_array($body['Books_to_remove'])) {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid input data'
    ]);
    exit;
}

foreach ($body['Books_to_edit'] as $book) {
    if (!isset($book['PB_Id']) || !is_numeric($book['PB_Id']) ||
        !isset($book['Dec_conditions']) || !is_string($book['Dec_conditions']) ||
        (isset($book['Comment']) && !is_string($book['Comment']))) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid input data in Books_to_edit'
        ]);
        exit;
    }
}

foreach ($body['Books_to_add'] as $book) {
    if (!isset($book['ISBN']) || !is_string($book['ISBN']) ||
        !isset($book['Title']) || !is_string($book['Title']) ||
        !isset($book['Author']) || !is_string($book['Author']) ||
        !isset($book['Editor']) || !is_string($book['Editor']) ||
        !isset($book['Price_new']) || !is_numeric($book['Price_new']) ||
        !isset($book['Dec_conditions']) || !is_string($book['Dec_conditions']) ||
        (isset($book['Comment']) && !is_string($book['Comment']))) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid input data in Books_to_add'
        ]);
        exit;
    }
}

foreach ($body['Books_to_remove'] as $book) {
    if (!isset($book['PB_Id']) || !is_numeric($book['PB_Id'])) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid input data in Books_to_remove'
        ]);
        exit;
    }
}

$providerId = $body['Provider_Id'];
$booksToEdit = $body['Books_to_edit'];
$booksToAdd = $body['Books_to_add'];
$booksToRemove = $body['Books_to_remove'];

try {
    if (!empty($booksToEdit)) {
        $result = recordDelivery($booksToEdit);
        if ($result['status'] === 'error') {
            throw new Exception($result['message']);
        }
    }
    if (!empty($booksToAdd)) {
        $result = addBooksToDelivery($providerId, $booksToAdd, true);
        if ($result['status'] === 'error') {
            print_r($result['message']);
            throw new Exception($result['message']);
        }
    }
    if (!empty($booksToRemove)) {
        $result = removeBooksFromDelivery($booksToRemove);
        if ($result['status'] === 'error') {
            throw new Exception($result['message']);
        }
    }
    http_response_code(200);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
    exit;
}

// http_response_code(200);