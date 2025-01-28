<?php

// require_once "utils/session.php";

header('Access-Control-Max-Age: 86400'); // 24 hours cache for preflight

require_once "dao/personDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

if (!isset($_POST['Provider_Id'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Bad Request',
        'message' => 'Provider_Id is required'
    ]);
    exit;
}

$provider_id = $_POST['Provider_Id'];
liquidateProvider($provider_id);

echo json_encode([
    'message' => 'Provider liquidated'
]);
http_response_code(200);