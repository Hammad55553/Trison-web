<?php
require_once 'config.php';
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $db->query("SELECT * FROM inquiries ORDER BY date DESC");
    $inquiries = [];
    while($row = $result->fetch_assoc()) {
        $inquiries[] = [
            'id' => $row['id'],
            'firstName' => $row['first_name'],
            'lastName' => $row['last_name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'company' => $row['company'],
            'inquiryType' => $row['inquiry_type'],
            'region' => $row['region'],
            'volume' => $row['volume'],
            'message' => $row['message'],
            'status' => $row['status'],
            'date' => $row['date']
        ];
    }
    sendJson($inquiries);
}

if ($method === 'POST') {
    $id = uniqid('inq_');
    $first = $requestBody['name'] ?? $requestBody['firstName'] ?? '';
    $last = $requestBody['lastName'] ?? '';
    $email = $requestBody['email'] ?? '';
    $phone = $requestBody['phone'] ?? '';
    $comp = $requestBody['company'] ?? '';
    $type = $requestBody['subject'] ?? $requestBody['inquiryType'] ?? $requestBody['systemType'] ?? '';
    $reg = $requestBody['region'] ?? '';
    $vol = $requestBody['volume'] ?? '';
    $msg = $requestBody['message'] ?? '';
    
    // Check 8-hour rate limit
    if ($email) {
        $stmt = $db->prepare("SELECT date FROM inquiries WHERE email = ? ORDER BY date DESC LIMIT 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res->num_rows > 0) {
            $row = $res->fetch_assoc();
            $lastDate = strtotime($row['date']);
            $now = time();
            if (($now - $lastDate) < (8 * 3600)) {
                sendJson(["error" => "You have already sent an inquiry recently. Please wait 8 hours before sending another one."], 429);
            }
        }
    }
    
    $stmt = $db->prepare("INSERT INTO inquiries (id, first_name, last_name, email, phone, company, inquiry_type, region, volume, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssss", $id, $first, $last, $email, $phone, $comp, $type, $reg, $vol, $msg);
    if ($stmt->execute()) sendJson(["success" => true, "id" => $id]);
    else sendJson(["error" => "Failed to save"], 500);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? '';
    $status = $requestBody['status'] ?? '';
    if (!$id) sendJson(["error" => "Missing id"], 400);
    $stmt = $db->prepare("UPDATE inquiries SET status = ? WHERE id = ?");
    $stmt->bind_param("ss", $status, $id);
    if ($stmt->execute()) sendJson(["success" => true]);
    else sendJson(["error" => "Failed to update"], 500);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) sendJson(["error" => "Missing id"], 400);
    $stmt = $db->prepare("DELETE FROM inquiries WHERE id = ?");
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) sendJson(["success" => true]);
    else sendJson(["error" => "Failed to delete"], 500);
}
?>
