<?php

require("db_connection.php");

function getAllProviders() {

    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT Provider.Provider_Id, Name, Surname, 0 as 'State'
    FROM Provider
    JOIN Provider_Book ON Provider_Book.Provider_Id = Provider.Provider_Id
    WHERE Consign_date IS NULL
    UNION
    SELECT Provider.Provider_Id, Name, Surname, 1 as 'State'
    FROM Provider
    JOIN Provider_Book ON Provider_Book.Provider_Id = Provider.Provider_Id
    WHERE Consign_date IS NOT NULL AND Liquidation_date IS NULL
    UNION
    SELECT Provider.Provider_Id, Name, Surname, 2 as 'State'
    FROM Provider
    JOIN Provider_Book ON Provider_Book.Provider_Id = Provider.Provider_Id
    WHERE Liquidation_date IS NOT NULL;";
    
    $result = $conn->query($sql) or die($conn->error);
    $providers = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();

    $providers = json_encode($providers);
    return $providers;
}