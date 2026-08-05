<?php
require_once 'config.php';
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($action === 'login' && $method === 'POST') {
    $username = $requestBody['username'] ?? '';
    $password = $requestBody['password'] ?? '';
    
    $stmt = $db->prepare("SELECT id, username, password, status FROM admins WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $admin = $result->fetch_assoc();
        if ($admin['status'] !== 'active') {
            sendJson(["error" => "Account disabled"], 403);
        }
        if ($password === $admin['password']) {
            $token = bin2hex(random_bytes(16));
            $ip = $_SERVER['REMOTE_ADDR'];
            $device = $_SERVER['HTTP_USER_AGENT'];
            
            $logStmt = $db->prepare("INSERT INTO admin_history (username, action, ip, device) VALUES (?, 'LOGIN_SUCCESS', ?, ?)");
            $logStmt->bind_param("sss", $username, $ip, $device);
            $logStmt->execute();
            
            sendJson([
                "success" => true,
                "token" => $token,
                "admin" => ["username" => $username]
            ]);
        }
    }
    sendJson(["error" => "Invalid credentials"], 401);
}

if ($action === 'history' && $method === 'GET') {
    $result = $db->query("SELECT * FROM admin_history ORDER BY timestamp DESC LIMIT 50");
    $history = [];
    while($row = $result->fetch_assoc()) {
        $history[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'action' => $row['action'],
            'ip' => $row['ip'],
            'device' => $row['device'],
            'timestamp' => $row['timestamp']
        ];
    }
    sendJson($history);
}

sendJson(["error" => "Invalid action"], 400);
?>
