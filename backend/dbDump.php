<?php

require_once "utils/session.php";
require_once "dao/bookDao.php";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    http_response_code(403);
    echo json_encode([
        'error' => 'Forbidden',
        'message' => 'Request not allowed'
    ]);
    exit;
}

$conn = getConnection() or die("Connection failed: " . $conn->connect_error);

$dump = "# ----------- Database Dump -----------\n\n";
$dump .= "# Datetime: " . date('Y-m-d H:i:s') . "\n\n";

$tables = $conn->query("SHOW TABLES");

while ($table = $tables->fetch_array()) {
    $tableName = $table[0];
    $dump .= "-- Table structure for table `$tableName`\n";
    
    // Get CREATE TABLE statement
    $createTable = $conn->query("SHOW CREATE TABLE `$tableName`");
    $createTableRow = $createTable->fetch_array();
    $dump .= $createTableRow[1] . ";\n\n";
    
    // Get table data
    $data = $conn->query("SELECT * FROM `$tableName`");
    if ($data->num_rows > 0) {
        $dump .= "-- Dumping data for table `$tableName`\n";
        while ($row = $data->fetch_assoc()) {
            $values = array();
            foreach ($row as $value) {
                if ($value === null) {
                    $values[] = "NULL";
                } else {
                    $values[] = "'" . $conn->real_escape_string($value) . "'";
                }
            }
            $dump .= "INSERT INTO `$tableName` VALUES (" . implode(", ", $values) . ");\n";
        }
        $dump .= "\n";
    }
}

header('Content-Type: text/plain');
echo $dump;