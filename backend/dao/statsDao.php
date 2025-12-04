<?php

require_once("db_connection.php");

// // Set CORS headers
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");

function getHighSchoolRatio()
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT s.Is_HighSchool, COUNT(s.Is_HighSchool) as persons_cnt FROM Provider p 
        JOIN School s
        ON p.School = s.School_Id
        GROUP BY s.Is_HighSchool";

    $result = $conn->query($sql) or die($conn->error);
    $highSchoolRatio = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();
    $highSchoolRatio = json_encode($highSchoolRatio);
    return $highSchoolRatio;
}

function getTotalMoneyMovement()
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT SUM(Price_new) FROM `Provider_Book` WHERE Sold_date IS NOT null;";

    $result = $conn->query($sql) or die($conn->error);
    $totalMoneyMovement = $result->fetch_row()[0] ?? 0;

    $conn->close();
    return $totalMoneyMovement;
}

function getNumNewMailSubscribers()
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT SUM(Mail_list) AS new_mails FROM Provider;";

    $result = $conn->query($sql) or die($conn->error);
    $numNewMailSubscribers = $result->fetch_row()[0] ?? 0;

    $conn->close();
    return $numNewMailSubscribers;
}

function getBooksPerSchool()
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT s.Name, COUNT(*) AS books_cnt FROM Provider p 
            JOIN School s ON p.School = s.School_Id 
            JOIN Provider_Book pb ON p.Provider_Id = pb.Provider_Id
            WHERE pb.Consign_date IS NOT NULL
            GROUP BY s.School_Id";

    $result = $conn->query($sql) or die($conn->error);
    $booksPerSchool = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();
    $booksPerSchool = json_encode($booksPerSchool);
    return $booksPerSchool;
}

function getNumberOfSalesByDay()
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT Sold_date AS date_sale, SUM(Price_new) AS day_money, COUNT(*) AS num_buyers FROM `Provider_Book` WHERE Sold_date IS NOT null GROUP BY DAY(Sold_date);";
    $result = $conn->query($sql) or die($conn->error);
    $salesByDay = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();
    $salesByDay = json_encode($salesByDay);
    return $salesByDay;
}
