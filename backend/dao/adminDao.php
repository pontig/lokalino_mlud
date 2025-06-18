<?php

require_once("db_connection.php");
function processBookData($inputString)
{

    echo "Processing book data...\n";
    echo "Lines of input string: " . substr_count($inputString, "\n") . "\n";
    $conn = getConnection();
    if (!$conn) {
        die("Connection failed: " . $conn->connect_error);
    } else {
        echo "Connected successfully\n";
    }

    $lines = explode("\n", trim($inputString));

    var_dump($lines);

    foreach ($lines as $lineNo => $line) {
        $line = trim($line);
        if ($line === '') continue;

        if (preg_match('/\("([^"]*)","([^"]*)","([^"]*)","([^"]*)","([\d]+\.[\d]{2})","([^"]*)",\s*([01])\)/', $line, $matches)) {
            list(, $isbn, $title, $author, $editor, $price, $schoolName, $isHighSchool) = $matches;

            $isbn         = $conn->real_escape_string(trim($isbn));
            $title        = $conn->real_escape_string(trim($title));
            $author       = $conn->real_escape_string(trim($author));
            $editor       = $conn->real_escape_string(trim($editor));
            $price        = floatval($price);
            $schoolName   = $conn->real_escape_string(trim($schoolName));
            $isHighSchool = intval($isHighSchool);

            $conn->begin_transaction();

            try {
                // SCHOOL
                // $stmt = $conn->prepare("SELECT School_Id FROM School WHERE Name = ?");
                // $stmt->bind_param("s", $schoolName);
                // $stmt->execute();
                // $result = $stmt->get_result();
                // $school = $result->fetch_assoc();
                // $stmt->close();

                // if (!$school) {
                //     $stmt = $conn->prepare("INSERT INTO School (Name, Is_HighSchool) VALUES (?, ?)");
                //     $stmt->bind_param("si", $schoolName, $isHighSchool);
                //     $stmt->execute();
                //     $schoolId = $stmt->insert_id;
                //     echo ("Line $lineNo: Inserted new school '$schoolName'\n");
                //     $stmt->close();
                // } else {
                //     $schoolId = $school['School_Id'];
                // }

                // BOOK
                $stmt = $conn->prepare("SELECT ISBN FROM Book WHERE ISBN = ?");
                $stmt->bind_param("s", $isbn);
                $stmt->execute();
                $result = $stmt->get_result();
                $book = $result->fetch_assoc();
                $stmt->close();

                if (!$book) {
                    $stmt = $conn->prepare("INSERT INTO Book (ISBN, Title, Author, Editor, Price_new) VALUES (?, ?, ?, ?, ?)");
                    $stmt->bind_param("ssssd", $isbn, $title, $author, $editor, $price);
                    $stmt->execute();
                    echo ("Line $lineNo: Inserted book '$title'\n");
                    $stmt->close();
                } else {
                    echo ("Line $lineNo: Book '$title' already exists, skipping insert.\n");
                }

                // ADOPTATION
                $schoolId = $schoolName;
                $stmt = $conn->prepare("SELECT A_Id FROM Adoptation WHERE ISBN = ? AND School_Id = ?");
                $stmt->bind_param("ss", $isbn, $schoolId);
                $stmt->execute();
                $result = $stmt->get_result();
                $adoptation = $result->fetch_assoc();
                $stmt->close();

                if (!$adoptation) {
                    $stmt = $conn->prepare("INSERT INTO Adoptation (ISBN, School_Id) VALUES (?, ?)");
                    $stmt->bind_param("ss", $isbn, $schoolId);
                    $stmt->execute();
                    echo ("Line $lineNo: Linked book '$isbn' to school '$schoolName'\n");
                    $stmt->close();
                } else {
                    echo ("Line $lineNo: Book '$isbn' already linked to school '$schoolName', skipping link.\n");
                }

                $conn->commit();
            } catch (Exception $e) {
                $conn->rollback();
                echo ("Line $lineNo: ERROR: " . $e->getMessage() . " | Line: $line\n");
            }
        } else {
            echo ("Line $lineNo: Skipped invalid format: $line\n");
        }
    }

    $conn->close();
}
