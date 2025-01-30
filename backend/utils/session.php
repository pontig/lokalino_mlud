<?php

session_start();

echo "Diobono";

var_dump($_GET);

if (isset($_GET['logout']) || !isset($_SESSION['expire']) || $_SESSION['expire'] - time() < 0 || !isset($_SESSION['passwordCheck']) || $_SESSION['passwordCheck'] == false) {
    session_unset();
    session_destroy();
    http_response_code(401);
    exit();
} else {
    //console log time remaining
    $_SESSION['expire'] = time() + 30 * 60; // numero di secondi
    //echo '<!--' . ($_SESSION['expire'] - time()) . 's left before the end of the session-->';
}
if (!isset($_SESSION['passwordCheck'])) {
    http_response_code(401);
    exit();
}

if (isset($_GET['remainingTime'])) {
    header('Content-Type: application/json');
    http_response_code(200);
    echo ($_SESSION['expire'] - time());
}