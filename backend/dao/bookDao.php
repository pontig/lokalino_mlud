<?php

require_once("db_connection.php");

function getBooksByISBN($isbn, $debug = false)
{
    if ($debug) {
        echo "Debug Mode: ON\n";
        echo "Searching for ISBN: $isbn\n";
    }

    $conn = getConnection();
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    if ($debug) {
        echo "Database connection established.\n";
    }

    $stmt = null;

    try {
        $sql = "SELECT * FROM Book WHERE ISBN LIKE CONCAT('%', ?, '%')";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        if ($debug) {
            echo "SQL Query Prepared: $sql\n";
        }

        $stmt->bind_param("s", $isbn);

        if ($debug) {
            echo "Parameter bound: ISBN = $isbn\n";
        }

        if (!$stmt->execute()) {
            throw new Exception("Failed to execute query: " . $stmt->error);
        }

        if ($debug) {
            echo "Query executed successfully.\n";
        }

        $result = $stmt->get_result();
        $books = $result->fetch_all(MYSQLI_ASSOC);

        if ($debug) {
            echo "Query results:\n";
            var_dump($books);
        }

        return json_encode($books);
    } catch (Exception $e) {
        if ($debug) {
            echo "Error encountered: " . $e->getMessage() . "\n";
        }
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        if ($stmt) {
            $stmt->close();
            if ($debug) {
                echo "Statement closed.\n";
            }
        }
        if ($conn) {
            $conn->close();
            if ($debug) {
                echo "Database connection closed.\n";
            }
        }
    }
}


function getAvailableBooksBySearch($search)
{
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

function getAllAvailableBooks()
{
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

function getBooksByProvider($providerId)
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);
    $stmt = null;

    try {
        $sql = "SELECT PB_Id, Book.ISBN, Title, Author, Editor, Price_new, Dec_conditions, Sold_date
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

function insertNewBooksInDatabase($books, $debug = false)
{
    if ($debug) {
        echo "Debug Mode: ON\n";
        echo "Books received:\n";
        var_dump($books);
    }

    $conn = getConnection();
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    if ($debug) {
        echo "Database connection established.\n";
    }

    $conn->begin_transaction();
    try {
        $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM Book WHERE ISBN = ?");
        if (!$stmtCheck) {
            die("Statement preparation failed (stmtCheck): " . $conn->error . "\n");
        }

        $stmtInsert = $conn->prepare("INSERT INTO Book (ISBN, Title, Author, Editor, Price_new) VALUES (?, ?, ?, ?, ?)");
        if (!$stmtInsert) {
            die("Statement preparation failed (stmtInsert): " . $conn->error . "\n");
        }

        foreach ($books as $book) {
            if ($debug) {
                echo "Processing book: ";
                var_dump($book);
            }

            $stmtCheck->bind_param("s", $book["ISBN"]);
            $stmtCheck->execute();
            $stmtCheck->store_result();
            $stmtCheck->bind_result($count);
            $stmtCheck->fetch();

            if ($debug) {
                echo "Existing book count for ISBN {$book["ISBN"]}: $count\n";
            }

            if ($count == 0) {
                $stmtInsert->bind_param("ssssd", $book["ISBN"], $book["Title"], $book["Author"], $book["Editor"], $book["Price_new"]);
                $stmtInsert->execute();

                if ($debug) {
                    echo "Inserted book: " . json_encode($book) . "\n";
                }
            }
            $stmtCheck->free_result();
        }

        $conn->commit();
        if ($debug) {
            echo "Transaction committed successfully.\n";
        }
        return json_encode(array("status" => "success"));
    } catch (Exception $e) {
        $conn->rollback();
        if ($debug) {
            echo "Transaction rolled back due to error: " . $e->getMessage() . "\n";
        }
        return json_encode(array("status" => "error", "message" => $e->getMessage()));
    } finally {
        $stmtCheck->close();
        $stmtInsert->close();
        $conn->close();
        if ($debug) {
            echo "Database connection closed.\n";
        }
    }
}



function recordDelivery($bookstoedit)
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);
    $conn->begin_transaction();

    try {

        foreach ($bookstoedit as $book) {
            if (isset($book["Comment"]) && !empty($book["Comment"])) {
                $stmt = $conn->prepare("UPDATE Provider_Book SET
                Dec_conditions = ?, 
                Consign_date = ?, 
                Comment = ?
                WHERE PB_Id = ?");
                $stmt->bind_param("sssi", $book["Dec_conditions"], date("Y-m-d H:i:s"), $book["Comment"], $book["PB_Id"]);
            } else {
                $stmt = $conn->prepare("UPDATE Provider_Book SET
                Dec_conditions = ?, 
                Consign_date = ? 
                WHERE PB_Id = ?");
                if (!$stmt) echo $conn->error;
                $stmt->bind_param("ssi", $book["Dec_conditions"], date("Y-m-d H:i:s"), $book["PB_Id"]);
            }

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

function addBooksToDelivery($providerId, $books, $doneByOperator)
{

    insertNewBooksInDatabase($books);

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);
    $conn->begin_transaction();

    try {

        foreach ($books as $book) {

            if (!$doneByOperator) {
                $stmt = $conn->prepare("INSERT INTO Provider_Book (Provider_Id, ISBN, Dec_conditions) VALUES (?, ?, ?)");
                if (!$stmt) echo $conn->error;
                $stmt->bind_param("iss", $providerId, $book["ISBN"], $book["Dec_conditions"]);
                $stmt->execute();
            } else if (isset($book["Comment"]) && !empty($book["Comment"])) {

                $stmt = $conn->prepare("INSERT INTO Provider_Book (Provider_Id, ISBN, Dec_conditions, Consign_date, Comment) VALUES (?, ?, ?, ?, ?)");

                $stmt->bind_param("issss", $providerId, $book["ISBN"], $book["Dec_conditions"], date("Y-m-d H:i:s"), $book["Comment"]);
                $stmt->execute();
            } else {

                $stmt = $conn->prepare("INSERT INTO Provider_Book (Provider_Id, ISBN, Dec_conditions, Consign_date) VALUES (?, ?, ?, ?)");

                $stmt->bind_param("isss", $providerId, $book["ISBN"], $book["Dec_conditions"], date("Y-m-d H:i:s"));
                $stmt->execute();
            }
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

function doCheckout($pb_ids)
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);
    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("UPDATE Provider_Book SET Sold_date = ? WHERE PB_Id = ?");
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        foreach ($pb_ids as $pb_id) {
            $stmt->bind_param("si", date("Y-m-d H:i:s"), $pb_id);
            if (!$stmt->execute()) {
                throw new Exception("Failed to execute query: " . $stmt->error);
            }
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
