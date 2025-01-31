<?php

require_once 'utils/session.php';
require_once 'dao/bookDao.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'error' => 'Method not allowed',
        'message' => 'This endpoint only accepts POST requests'
    ]);
    exit;
}

$rawData = file_get_contents('php://input');
$jsonData = json_decode($rawData, true);
// check it's an array of integers
if (!is_array($jsonData) || !array_filter($jsonData, 'is_int')) {
    http_response_code(400);
    echo json_encode([
            'error' => 'Invalid data',
            'message' => 'The request data must be an array of integers, got: ' . gettype($rawData)
        ]);
    exit;
}

doCheckout($jsonData);


