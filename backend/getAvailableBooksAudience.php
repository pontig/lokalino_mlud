<?php

// require_once "utils/session.php";
require_once "dao/bookDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

// if (isset($_GET['search_key'])) {
//     $search_key = $_GET['search_key'];
//     $books = getAvailableBooksBySearch($search_key);
//     echo $books;
// } else {
$books = getAllAvailableBooks();

// $books is a json_encode, transform it into an iterable of objects
$books = json_decode($books, true);


foreach ($books as $book) {
    // Remove each key that contains Provider in the key
    foreach ($book as $key => $value) {
        if (strpos($key, 'Provider') !== false) {
            unset($book[$key]);
        }
    }
}

echo json_encode($books);
// }

http_response_code(200);
