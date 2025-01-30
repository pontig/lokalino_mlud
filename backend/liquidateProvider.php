<?php

require_once "utils/session.php";
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

if (!isset($body['Provider_Id'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Bad Request',
        'message' => 'Provider_Id is required'
    ]);
    exit;
}

$provider_id = $body['Provider_Id']['Provider_Id'];
liquidateProvider($provider_id);

echo json_encode([
    'message' => 'Provider liquidated'
]);
http_response_code(200);
