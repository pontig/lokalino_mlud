<?php

require("db_connection.php");

function getBooksByISBN($isbn) {
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);
    $stmt = null;
    
    try {
        $sql = "SELECT * FROM Book WHERE ISBN LIKE CONCAT('%', ?, '%')";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }
        
        $stmt->bind_param("s", $isbn);
        if (!$stmt->execute()) {
            throw new Exception("Failed to execute query: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        $books = $result->fetch_all(MYSQLI_ASSOC);
        return json_encode($books);
        
    } catch (Exception $e) {
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        if ($stmt) {
            $stmt->close();
        }
        if ($conn) {
            $conn->close();
        }
    }
}

function getAvailableBooksBySearch($search) {
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);
    $stmt = null;
    
    try {
        $sql = "SELECT Book.*, Provider.Name AS ProviderName, Provider.Surname AS ProviderSurname, Provider_Book.*
                FROM Book
                JOIN Provider_Book ON Book.ISBN = Provider_Book.ISBN
                JOIN Provider ON Provider_Book.Provider_Id = Provider.Provider_Id
                WHERE (Title LIKE CONCAT('%', ?, '%') OR 
                      Author LIKE CONCAT('%', ?, '%') OR 
                      Book.ISBN LIKE CONCAT('%', ?, '%') OR
                      Editor LIKE CONCAT('%', ?, '%')) AND
                      Sold_date IS NULL AND
                      Consign_date IS NOT NULL";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }
        
        $stmt->bind_param("ssss", $search, $search, $search, $search);
        if (!$stmt->execute()) {
            throw new Exception("Failed to execute query: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        $books = $result->fetch_all(MYSQLI_ASSOC);
        return json_encode($books);
        
    } catch (Exception $e) {
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        if ($stmt) {
            $stmt->close();
        }
        if ($conn) {
            $conn->close();
        }
    }
}

function getAllAvailableBooks() {
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);
    
    try {
        $sql = "SELECT Book.*, Provider.Name AS ProviderName, Provider.Surname AS ProviderSurname, Provider_Book.*
                FROM Book
                JOIN Provider_Book ON Book.ISBN = Provider_Book.ISBN
                JOIN Provider ON Provider_Book.Provider_Id = Provider.Provider_Id
                WHERE Sold_date IS NULL AND Consign_date IS NOT NULL";

        $result = $conn->query($sql);
        if (!$result) {
            throw new Exception("Failed to execute query: " . $conn->error);
        }
        
        $books = $result->fetch_all(MYSQLI_ASSOC);
        return json_encode($books);
        
    } catch (Exception $e) {
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        if ($conn) {
            $conn->close();
        }
    }
}

function getBooksByProvider($providerId) {
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);
    $stmt = null;
    
    try {
        $sql = "SELECT PB_Id, Book.ISBN, Title, Author, Editor, Price_new, Dec_conditions
                FROM Book
                JOIN Provider_Book ON Book.ISBN = Provider_Book.ISBN
                WHERE Provider_Id = ?";

        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }
        
        $stmt->bind_param("i", $providerId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to execute query: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        $books = $result->fetch_all(MYSQLI_ASSOC);
        
        // Get provider details
        $stmt->close();
        $stmt = $conn->prepare("SELECT Name, Surname FROM Provider WHERE Provider_Id = ?");
        if (!$stmt) {
            throw new Exception("Failed to prepare provider statement: " . $conn->error);
        }
        
        $stmt->bind_param("i", $providerId);
        if (!$stmt->execute()) {
            throw new Exception("Failed to execute provider query: " . $stmt->error);
        }
        
        $result = $stmt->get_result();
        $provider = $result->fetch_all(MYSQLI_ASSOC);
        
        return json_encode(array("books" => $books, "provider" => $provider));
        
    } catch (Exception $e) {
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        if ($stmt) {
            $stmt->close();
        }
        if ($conn) {
            $conn->close();
        }
    }
}

function insertNewBooksInDatabase($books)
{

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $conn->begin_transaction();

    try {
        $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM Book WHERE ISBN = ?");
        $stmtInsert = $conn->prepare("INSERT INTO Book (ISBN, Title, Author, Editor, Price_new) VALUES (?, ?, ?, ?, ?)");

        foreach ($books as $book) {
            $stmtCheck->bind_param("s", $book["ISBN"]);
            $stmtCheck->execute();
            $stmtCheck->bind_result($count);
            $stmtCheck->fetch();

            if ($count == 0) {
                $stmtInsert->bind_param("ssssd", $book["ISBN"], $book["Title"], $book["Author"], $book["Editor"], $book["Price_new"]);
                $stmtInsert->execute();
            }
        }

        $conn->commit();
        $stmtCheck->close();
        $stmtInsert->close();

        return json_encode(array("status" => "success"));
    } catch (Exception $e) {
        $conn->rollback();
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        $conn->close();
    }
}

function recordDelivery($bookstoedit)
{

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("UPDATE Provider_Book SET
         Dec_conditions = ?, 
         Consign_date = ?, 
         Comments = ?
         WHERE PB_Id = ?");

        foreach ($bookstoedit as $book) {

            if (isset($book["Comments"]))
                $stmt->bind_param("sssi", $book["Dec_conditions"], date("Y-m-d H:i:s"), $book["Comments"], $book["PB_Id"]);
            else
                $stmt->bind_param("ssi", $book["Dec_conditions"], date("Y-m-d H:i:s"), $book["PB_Id"]);

            $stmt->execute();
        }

        $conn->commit();
        $stmt->close();

        return json_encode(array("status" => "success"));
    } catch (Exception $e) {
        $conn->rollback();
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        $conn->close();
    }
}

function removeBooksFromDelivery($bookstoremove)
{

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("DELETE FROM Provider_Book WHERE PB_Id = ?");

        foreach ($bookstoremove as $book) {

            $stmt->bind_param("i", $book["PB_Id"]);
            $stmt->execute();
        }

        $conn->commit();
        $stmt->close();

        return json_encode(array("status" => "success"));
    } catch (Exception $e) {
        $conn->rollback();
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        $conn->close();
    }
}

function addBooksToDelivery($providerId, $books) {

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $conn->begin_transaction();

    try {
        
        insertNewBooksInDatabase($books);

        $stmt = $conn->prepare("INSERT INTO Provider_Book (Provider_Id, ISBN, Dec_conditions, Consign_date, Comments) VALUES (?, ?, ?, ?, ?)");

        foreach ($books as $book) {
            if (isset($book["Comments"]))
                $stmt->bind_param("issss", $providerId, $book["ISBN"], $book["Dec_conditions"], date("Y-m-d H:i:s"), $book["Comments"]);
            else
                $stmt->bind_param("isss", $providerId, $book["ISBN"], $book["Dec_conditions"], date("Y-m-d H:i:s"));
        }

        $conn->commit();
        $stmt->close();

        return json_encode(array("status" => "success"));
    } catch (Exception $e) {
        $conn->rollback();
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        $conn->close();
    }

}
