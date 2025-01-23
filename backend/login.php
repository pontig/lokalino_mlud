<?php

session_start();

require_once("utils/secret.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['submit'])) {
        $password = hash('sha256', $_POST['password']); // TODO: the password should be hashed BEFORE sending the request
        if ($password == $original_password) {
            $_SESSION['checkPassword'] = true;
            $_SESSION['expire'] = time() + 30*60;
            header("Location: /");
        }
    }
}