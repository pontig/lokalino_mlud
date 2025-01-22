<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400'); // 24 hours cache for preflight

require_once "dao/bookDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

if (isset($_GET['ISBN'])) {
    $search_key = $_GET['ISBN'];
    $books = getBooksByISBN($search_key);
    echo $books;
}

http_response_code(200);