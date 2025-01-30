<?php

require_once "utils/session.php";
require_once "dao/personDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$pr = getAllProviders();
echo $pr;

http_response_code(200);