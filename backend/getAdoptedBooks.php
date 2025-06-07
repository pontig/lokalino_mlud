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

if (!isset($_GET['School_Id'])) {
    http_response_code(400);
    echo json_encode([
        'error' => 'Bad Request',
        'message' => 'School_Id is required'
    ]);
    exit;
}

$search_key = $_GET['School_Id'];
$adoptedBooks = getAdoptedBooksBySchool($search_key);
echo $adoptedBooks;