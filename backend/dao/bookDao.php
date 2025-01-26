<?php

require("db_connection.php");

function getBooksByISBN($isbn)
{

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT * FROM Book WHERE ISBN LIKE CONCAT('%', ?, '%')";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $isbn);
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    $conn->close();

    $books = json_encode($books);
    return $books;
}

/* Returns also informarion about the provider */
function getAvailableBooksBySearch($search)
{

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT Book.*, Provider.Name AS ProviderName, Provider.Surname AS ProviderSurname, Provider_Book.*
    FROM Book
    JOIN Provider_Book ON Book.ISBN = Provider_Book.ISBN
    JOIN Provider ON Provider_Book.Provider_Id = Provider.Provider_Id
    WHERE Title LIKE CONCAT('%', ?, '%') OR 
          Author LIKE CONCAT('%', ?, '%') OR 
          Book.ISBN LIKE CONCAT('%', ?, '%') OR
          Editor LIKE CONCAT('%', ?, '%') AND
          Sold_date IS NULL AND
          Consign_date IS NOT NULL";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $search, $search, $search, $search);
    $stmt->execute();
    $result = $stmt->get_result() or die($conn->error);
    $books = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    $conn->close();

    $books = json_encode($books);
    return $books;
}

function getAllAvailableBooks()
{

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT Book.*, Provider.Name AS ProviderName, Provider.Surname AS ProviderSurname, Provider_Book.*
    FROM Book
    JOIN Provider_Book ON Book.ISBN = Provider_Book.ISBN
    JOIN Provider ON Provider_Book.Provider_Id = Provider.Provider_Id
    WHERE Sold_date IS NULL AND Consign_date IS NOT NULL";

    $result = $conn->query($sql) or die($conn->error);
    $books = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();

    $books = json_encode($books);
    return $books;
}

function getBooksByProvider($providerId)
{

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT PB_Id, Book.ISBN, Title, Author, Editor, Price_new, Dec_conditions
    FROM Book
    JOIN Provider_Book ON Book.ISBN = Provider_Book.ISBN
    WHERE Provider_Id = ? ";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        die("Prepare failed: " . $conn->error);
    }
    $stmt->bind_param("i", $providerId);
    $stmt->execute();
    $result = $stmt->get_result();
    $books = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $sql = "SELECT Name, Surname FROM Provider WHERE Provider_Id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $providerId);
    $stmt->execute();
    $result = $stmt->get_result();
    $provider = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    $res = array("books" => $books, "provider" => $provider);
    $res = json_encode($res);

    $conn->close();

    return $res;

}
