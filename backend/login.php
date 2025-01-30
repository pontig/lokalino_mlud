<?php

session_start();

require_once("utils/secret.php");

$debug = true; // Set to true for debugging

if ($debug) {
    echo "Debug Mode: ON\n";
    echo "Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $data = json_decode(file_get_contents('php://input'), true);

    if ($debug) {
        echo "Received Data: ";
        var_dump($data);
    }

    if (isset($data['submit'])) {
        $password = $data['password'];

        if ($debug) {
            echo "Received Password: $password\n";
            echo "Hashed received password: " . hash('sha256', $password) . "\n";
            echo "Original Password: $original_password\n";
        }

        // Secure password comparison
        // if (password_verify($password, $original_password)) { // use if password is not hashed
        if ($original_password == hash('sha256', $password)) {
            $_SESSION['passwordCheck'] = true;
            $_SESSION['expire'] = time() + 30 * 60;
            http_response_code(200);

            if ($debug) {
                echo "Password verified. Session set.\n";
                var_dump($_SESSION);
            }
        } else {
            http_response_code(401);

            if ($debug) {
                echo "Password verification failed.\n";
            }
        }
    } else {
        http_response_code(400);

        if ($debug) {
            echo "Invalid request: 'submit' not set.\n";
        }
    }
} else {
    http_response_code(405);

    if ($debug) {
        echo "Invalid request method.\n";
    }
}
