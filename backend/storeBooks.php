<?php

// require_once "utils/session.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
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
var_dump($body);

/* 
Structure of the body:
{
    "Provider_Id": Number,
    "Books_to_edit": [
        {
            "PB_Id": Number,
            "Dec_conditions": String,
            "Comments"?: String
        },
        ...
    ],
    "Books_to_add": [
        {
            "ISBN": String,
            "Title": String,
            "Author": String,
            "Editor": String,
            "Price_new": Number,
            "Dec_conditions": String,
            "Comments"?: String
        },
        ...
    ],
    "Books_to_remove": [
        { "PB_Id": Number },
        ...
    ]
}
*/

$providerId = $body['Provider_Id'];
$booksToEdit = $body['Books_to_edit'];
$booksToAdd = $body['Books_to_add'];
$booksToRemove = $body['Books_to_remove'];

try {
    $result = recordDelivery($booksToEdit);
    if ($result['status'] === 'error') {
        throw new Exception($result['message']);
    }
    $result = addBooksToDelivery($providerId, $booksToAdd);
    if ($result['status'] === 'error') {
        throw new Exception($result['message']);
    }
    $result = removeBooksFromDelivery($booksToRemove);
    if ($result['status'] === 'error') {
        throw new Exception($result['message']);
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
