<?php

session_start();

if ($_SESSION['expire']  - time() < 0 || $_SESSION['passwordCheck'] == false) {
    session_unset();
    session_destroy();
} else {
    //console log time remaining
    $_SESSION['expire'] = time() + 30 * 60; // numero di secondi
    //echo '<!--' . ($_SESSION['expire'] - time()) . 's left before the end of the session-->';
}
if (!isset($_SESSION['passwordCheck'])) {
    header('Location: /');
    exit();
}