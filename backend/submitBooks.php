<?php

// require_once "utils/session.php";

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
        "Nome": String,
        "Cognome": String,
        "Istituto": String,
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
    'Nome' => 'string',
    'Cognome' => 'string',
    'Istituto' => 'string',
    'Email' => 'string',
    'N_telefono' => 'string',
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
    $body['personalInfo']['Nome'],
    $body['personalInfo']['Cognome'],
    $body['personalInfo']['Istituto'],
    $body['personalInfo']['Email'],
    $body['personalInfo']['N_telefono'],
    $body['personalInfo']['Mail_list'],
    $body['personalInfo']['Periodo'] 
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
