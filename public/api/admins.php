<?php
require_once 'config.php';
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $db->query("SELECT id, username, status, created_at FROM admins ORDER BY created_at DESC");
    $admins = [];
    while($row = $result->fetch_assoc()) {
        $admins[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'status' => $row['status'],
            'role' => $row['username'] === 'admin' ? 'master' : 'admin',
            'createdAt' => $row['created_at']
        ];
    }
    sendJson($admins);
}

if ($method === 'POST') {
    $username = $requestBody['username'] ?? '';
    $password = $requestBody['password'] ?? '';
    $status = $requestBody['status'] ?? 'active';
    if (!$username || !$password) sendJson(["error" => "Missing credentials"], 400);
    
    $stmt = $db->prepare("INSERT INTO admins (username, password, status) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password=?, status=?");
    $stmt->bind_param("sssss", $username, $password, $status, $password, $status);
    if ($stmt->execute()) sendJson(["success" => true]);
    else sendJson(["error" => "Failed to save admin"], 500);
}

if ($method === 'DELETE') {
    $username = $_GET['username'] ?? '';
    if (!$username || $username === 'admin') sendJson(["error" => "Cannot delete master admin or missing username"], 400);
    $stmt = $db->prepare("DELETE FROM admins WHERE username = ?");
    $stmt->bind_param("s", $username);
    if ($stmt->execute()) sendJson(["success" => true]);
    else sendJson(["error" => "Failed to delete"], 500);
}
?>
