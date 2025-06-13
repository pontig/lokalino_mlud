<?php

require_once("db_connection.php");

function getAllSchools()
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT * FROM School";

    $result = $conn->query($sql) or die($conn->error);
    $schools = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();

    $schools = json_encode($schools);
    return $schools;
}

function getAllBooksAdopted()
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT * FROM Book";

    $result = $conn->query($sql) or die($conn->error);
    $adoptedBooks = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();

    $adoptedBooks = json_encode($adoptedBooks);
    return $adoptedBooks;
}
