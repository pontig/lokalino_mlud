<? 
$servername = "localhost";
$username = "root";
$password = "";
$db_name = "my_lokalinomlud";

function getConnection() {
    global $servername, $username, $password, $db_name;
    $connection = new mysqli($servername, $username, $password, $db_name);
    return $connection;
}
