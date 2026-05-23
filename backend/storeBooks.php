<?php

require_once "utils/session.php";
require_once "dao/bookDao.php";
require_once "dao/personDao.php";
require_once "utils/email_body.php";
require_once "utils/sendEmail.php";

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);

if (
    !isset($body['Provider_Id']) || !is_numeric($body['Provider_Id']) ||
    !isset($body['Books_to_edit']) || !is_array($body['Books_to_edit']) ||
    !isset($body['Books_to_add']) || !is_array($body['Books_to_add']) ||
    !isset($body['Books_to_remove']) || !is_array($body['Books_to_remove'])
) {
    http_response_code(403);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid input data'
    ]);
    exit;
}

foreach ($body['Books_to_edit'] as $book) {
    if (
        !isset($book['PB_Id']) || !is_numeric($book['PB_Id']) ||
        !isset($book['Dec_conditions']) || !is_string($book['Dec_conditions']) ||
        (isset($book['Comment']) && !is_string($book['Comment']))
    ) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid input data in Books_to_edit'
        ]);
        exit;
    }
}

foreach ($body['Books_to_add'] as $book) {
    if (
        !isset($book['ISBN']) || !is_string($book['ISBN']) ||
        !isset($book['Title']) || !is_string($book['Title']) ||
        !isset($book['Author']) || !is_string($book['Author']) ||
        !isset($book['Editor']) || !is_string($book['Editor']) ||
        !isset($book['Price_new']) || !is_numeric($book['Price_new']) ||
        !isset($book['Dec_conditions']) || !is_string($book['Dec_conditions']) ||
        (isset($book['Comment']) && !is_string($book['Comment']))
    ) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid input data in Books_to_add'
        ]);
        exit;
    }
}

foreach ($body['Books_to_remove'] as $book) {
    if (!isset($book['PB_Id']) || !is_numeric($book['PB_Id'])) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid input data in Books_to_remove'
        ]);
        exit;
    }
}

$providerId = $body['Provider_Id'];
$booksToEdit = $body['Books_to_edit'];
$booksToAdd = $body['Books_to_add'];
$booksToRemove = $body['Books_to_remove'];

function decodeDaoResult($result)
{
    if (is_string($result)) {
        $decoded = json_decode($result, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
    }

    if (is_array($result)) {
        return $result;
    }

    return [
        'status' => 'error',
        'message' => 'Unexpected DAO response format'
    ];
}

try {
    if (!empty($booksToEdit)) {
        $result = decodeDaoResult(recordDelivery($booksToEdit));
        if (($result['status'] ?? 'error') === 'error') {
            throw new Exception($result['message'] ?? 'Error while updating delivered books');
        }
    }

    if (!empty($booksToAdd)) {
        $result = decodeDaoResult(addBooksToDelivery($providerId, $booksToAdd, true));
        if (($result['status'] ?? 'error') === 'error') {
            throw new Exception($result['message'] ?? 'Error while adding books to delivery');
        }
    }

    if (!empty($booksToRemove)) {
        $result = decodeDaoResult(removeBooksFromDelivery($booksToRemove));
        if (($result['status'] ?? 'error') === 'error') {
            throw new Exception($result['message'] ?? 'Error while removing books from delivery');
        }
    }

    echo json_encode(['status' => 'success']);
    http_response_code(200);

    // Send confirmation of the books being caught
    $final_books_list = decodeDaoResult(getBooksByProvider($providerId));

    $book_table = generateBooksEmailTable($final_books_list);
    $full_provider_info = decodeDaoResult(getProviderById($providerId));

    if (is_array($full_provider_info) && isset($full_provider_info['Name']) && isset($full_provider_info['Email'])) {
        $email_body = "
            <h1>Ciao " . $full_provider_info['Name'] . "</h1>
            <p>Grazie per aver consegnato i tuoi libri al Merkatino Libri usati.</p>
            <p>Di seguito trovi la lista dei libri consegnati:</p>
            " . $book_table . "
            <p>Ti ricordiamo i prossimi appuntamenti:</p>
            <ul>
                <li>Vendita libri</li>
                <li>Ritiro liquidazione e libri invenduti</li>
            </ul>
            <p>A presto!</p>
            <br />
            <p>Team Lokalino</p>
            ";

        sendEmail(
            $full_provider_info['Email'],
            $full_provider_info['Name'] . " " . $full_provider_info['Surname'],
            "Conferma della consegna dei libri - Merkatino Libri Usati",
            $email_body
        );
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
    exit;
}
