<?php
require_once 'config.php';
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $db->query("SELECT * FROM blogs ORDER BY date DESC");
    $blogs = [];
    while($row = $result->fetch_assoc()) {
        $blogs[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'excerpt' => $row['excerpt'],
            'category' => $row['category'],
            'author' => $row['author'],
            'image' => $row['image'],
            'source' => $row['source'],
            'featured' => (bool)$row['featured'],
            'date' => $row['date']
        ];
    }
    sendJson($blogs);
}

if ($method === 'POST') {
    $id = uniqid('blog_');
    $title = $requestBody['title'] ?? '';
    $excerpt = $requestBody['excerpt'] ?? '';
    $category = $requestBody['category'] ?? '';
    $author = $requestBody['author'] ?? '';
    $image = $requestBody['image'] ?? '';
    
    $stmt = $db->prepare("INSERT INTO blogs (id, title, excerpt, category, author, image, source) VALUES (?, ?, ?, ?, ?, ?, 'custom')");
    $stmt->bind_param("ssssss", $id, $title, $excerpt, $category, $author, $image);
    if ($stmt->execute()) sendJson(["success" => true, "id" => $id]);
    else sendJson(["error" => "Failed to save"], 500);
}

if ($method === 'PUT') {
    $id = $_GET['id'] ?? '';
    if (!$id) sendJson(["error" => "ID required"], 400);
    
    $title = $requestBody['title'] ?? '';
    $excerpt = $requestBody['excerpt'] ?? '';
    $category = $requestBody['category'] ?? '';
    $author = $requestBody['author'] ?? '';
    $image = $requestBody['image'] ?? '';
    
    $stmt = $db->prepare("UPDATE blogs SET title = ?, excerpt = ?, category = ?, author = ?, image = ? WHERE id = ?");
    $stmt->bind_param("ssssss", $title, $excerpt, $category, $author, $image, $id);
    if ($stmt->execute()) sendJson(["success" => true]);
    else sendJson(["error" => "Failed to update"], 500);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) sendJson(["error" => "ID required"], 400);
    $stmt = $db->prepare("DELETE FROM blogs WHERE id = ?");
    $stmt->bind_param("s", $id);
    if ($stmt->execute()) sendJson(["success" => true]);
    else sendJson(["error" => "Failed to delete"], 500);
}
?>
