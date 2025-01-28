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
require_once "dao/personDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

/*
body parameters:
{
    "personalInfo": {
        "Name": String,
        "Surname": String,
        "School": String,
        "Email": String,
        "Phone_no": String
        "Mail_list": Boolean
    },
    "books": [
        {
            "ISBN": String,
            "Title": String,
            "Author": String,
            "Editor": String,
            "Price_new": Number,
            "Dec_conditions": String
        },
        ...
    ],
}
*/

// check if all required fields are present and have the correct type

$requiredFields = [
    'personalInfo' => 'array',
    'books' => 'array',
];

foreach ($requiredFields as $field => $type) {
    if (!isset($body[$field])) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => "Missing field: $field"
        ]);
        exit;
    }
    if (gettype($body[$field]) !== $type) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => "Invalid type for field: $field, expected $type"
        ]);
        exit;
    }
}

$personalInfoFields = [
    'Name' => 'string',
    'Surname' => 'string',
    'School' => 'string',
    'Email' => 'string',
    'Phone_no' => 'string',
    'Mail_list' => 'boolean',
];

foreach ($personalInfoFields as $field => $type) {
    if (!isset($body['personalInfo'][$field])) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => "Missing field in personalInfo: $field"
        ]);
        exit;
    }
    if (gettype($body['personalInfo'][$field]) !== $type) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => "Invalid type for field in personalInfo: $field, expected $type"
        ]);
        exit;
    }
}

var_dump($body);

$providerId = insertNewProvider(
    $body['personalInfo']['Name'],
    $body['personalInfo']['Surname'],
    $body['personalInfo']['School'],
    $body['personalInfo']['Email'],
    $body['personalInfo']['Phone_no'],
    $body['personalInfo']['Mail_list']
);

$result = addBooksToDelivery($providerId, $body['books'], false);

if ($result) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Books added to delivery'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error adding books to delivery'
    ]);
}

http_response_code(200);
