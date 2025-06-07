<?php

// require_once "utils/session.php";
require_once "dao/schoolDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$schools = getAllSchools();
echo $schools;

http_response_code(200);