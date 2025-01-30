<?php

require_once("db_connection.php");

function getAllProviders()
{

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

function insertNewProvider($name, $surname, $school, $email, $phone, $mail_list)
{
    print("Starting insertNewProvider function...\n");

    $mail_list = $mail_list ? 1 : 0;

    // Debugging: Print function inputs
    print("Inputs - Name: $name, Surname: $surname, School: $school, Email: $email, Phone: $phone, Mail List: $mail_list\n");

    $conn = getConnection();
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    } else {
        print("Database connection established.\n");
    }

    // Check if the provider already exists using email
    print("Checking if provider exists with email: $email\n");
    $stmt = $conn->prepare("SELECT Provider_Id FROM Provider WHERE Email = ?");
    if (!$stmt) {
        die("Statement preparation failed: " . $conn->error . "\n");
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($provider_id);
        $stmt->fetch();
        $stmt->close();
        $conn->close();

        print("Provider already exists with ID: $provider_id\n");
        return $provider_id;
    }

    print("Provider does not exist, proceeding with insertion.\n");

    // Insert new provider
    $insertStmt = $conn->prepare("INSERT INTO Provider (Name, Surname, School, Email, Phone_no, Mail_list) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$insertStmt) {
        die("Insert statement preparation failed: " . $conn->error . "\n");
    }

    $insertStmt->bind_param("ssssss", $name, $surname, $school, $email, $phone, $mail_list);

    if (!$insertStmt->execute()) {
        print("Error executing insert statement: " . $insertStmt->error . "\n");
    } else {
        $provider_id = $insertStmt->insert_id;
        print("New provider inserted successfully with ID: $provider_id\n");
    }

    $insertStmt->close();
    $conn->close();
    print("Database connection closed.\n");

    return $provider_id;
}

function liquidateProvider($provider_id, $debug = false)
{
    if ($debug) {
        echo "Debug Mode: ON\n";
        echo "Provider ID to liquidate: $provider_id\n";
    }

    $conn = getConnection();
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    if ($debug) {
        echo "Database connection established.\n";
    }

    try {
        $sql = "UPDATE Provider_Book SET Liquidation_date = CURRENT_TIMESTAMP WHERE Provider_Id = ? AND Liquidation_date IS NULL";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . $conn->error);
        }

        $stmt->bind_param("i", $provider_id);

        if ($debug) {
            echo "SQL Query Prepared: $sql\n";
            echo "Parameter bound: Provider ID = $provider_id\n";
        }

        if (!$stmt->execute()) {
            throw new Exception("Query execution failed: " . $stmt->error);
        }

        if ($debug) {
            echo "Query executed successfully. Rows affected: " . $stmt->affected_rows . "\n";
        }
    } catch (Exception $e) {
        if ($debug) {
            echo "Error encountered: " . $e->getMessage() . "\n";
        }
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


function getMailingList()
{
    $conn = getConnection() or die("Connection failed: " . $conn->connect_error);

    $sql = "SELECT * FROM Provider WHERE Mail_list = 1;";

    $result = $conn->query($sql) or die($conn->error);

    $providers = $result->fetch_all(MYSQLI_ASSOC);

    $conn->close();

    $providers = json_encode($providers);
    return $providers;
}
