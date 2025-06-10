<?php

require_once "utils/session.php";
require_once "dao/adminDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$bookDataString = $input['books'] ?? '';

if (!empty($bookDataString)) {
    processBookData($bookDataString); // call the function we wrote earlier
    echo "Books imported successfully.";
} else {
    echo "No data received.";
}


http_response_code(200);