<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'u860758441_trisonmydb'); 
define('DB_PASS', 'Trison@786'); 
define('DB_NAME', 'u860758441_trison');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die(json_encode(["success" => false, "error" => "Database connection failed"]));
    }
    return $conn;
}

function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

$requestBody = json_decode(file_get_contents('php://input'), true);
?>
