<?php

require_once ("db_connection.php");

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

function getAdoptedBooksBySchool($school_id)
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT Book.* FROM Book
            JOIN Adoptation ON Book.ISBN = Adoptation.ISBN
            WHERE Adoptation.School_Id = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Statement preparation failed: " . $conn->error . "\n");
    }

    $stmt->bind_param("i", $school_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $adoptedBooks = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    $conn->close();

    $adoptedBooks = json_encode($adoptedBooks);
    return $adoptedBooks;
}