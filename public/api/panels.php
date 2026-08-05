<?php
require_once 'config.php';
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'verify') {
        $serial = $_GET['serial'] ?? '';
        $stmt = $db->prepare("SELECT * FROM panels WHERE serial_number = ?");
        $stmt->bind_param("s", $serial);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            sendJson([
                'serial' => $row['serial_number'],
                'model' => $row['model'],
                'wattage' => $row['wattage'],
                'technology' => $row['technology'] ?? '',
                'class' => $row['class'] ?? '',
                'country' => $row['country'] ?? '',
                'customerName' => $row['customer_name'],
                'warrantyYears' => $row['warranty_years'] ?? '',
                'status' => $row['status'] ?? 'active',
                'brand' => $row['brand'] ?? '',
                'registeredAt' => $row['registration_date']
            ]);
        }
        sendJson(["error" => "Not found"], 404);
    }

    $result = $db->query("SELECT * FROM panels ORDER BY registration_date DESC");
    $panels = [];
    while($row = $result->fetch_assoc()) {
        $panels[$row['serial_number']] = [
            'serial' => $row['serial_number'],
            'model' => $row['model'],
            'wattage' => $row['wattage'],
            'technology' => $row['technology'] ?? '',
            'class' => $row['class'] ?? '',
            'country' => $row['country'] ?? '',
            'customerName' => $row['customer_name'],
            'warrantyYears' => $row['warranty_years'] ?? '',
            'status' => $row['status'] ?? 'active',
            'brand' => $row['brand'] ?? '',
            'registrationDate' => $row['registration_date']
        ];
    }
    sendJson(array_values($panels));
}

if ($method === 'POST') {
    $serial = $requestBody['serial'] ?? $requestBody['serialNumber'] ?? '';
    $model = $requestBody['model'] ?? '';
    $wattage = $requestBody['wattage'] ?? '';
    $technology = $requestBody['technology'] ?? '';
    $class = $requestBody['class'] ?? 'A';
    $country = $requestBody['country'] ?? '';
    $customerName = $requestBody['customer'] ?? $requestBody['customerName'] ?? '';
    $warrantyYears = $requestBody['warrantyYears'] ?? '';
    $status = $requestBody['status'] ?? 'active';
    $brand = $requestBody['brand'] ?? '';
    
    if (!$serial || !$model) sendJson(["error" => "Missing data"], 400);
    
    $stmt = $db->prepare("INSERT INTO panels (serial_number, model, wattage, technology, class, country, customer_name, warranty_years, status, brand) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE model=?, wattage=?, technology=?, class=?, country=?, customer_name=?, warranty_years=?, status=?, brand=?");
    $stmt->bind_param("sssssssssssssssssss", $serial, $model, $wattage, $technology, $class, $country, $customerName, $warrantyYears, $status, $brand, $model, $wattage, $technology, $class, $country, $customerName, $warrantyYears, $status, $brand);
    if ($stmt->execute()) sendJson(["success" => true]);
    else sendJson(["error" => "Failed to save"], 500);
}

if ($method === 'DELETE') {
    $serial = $_GET['serial'] ?? '';
    if (!$serial) sendJson(["error" => "Missing serial"], 400);
    $stmt = $db->prepare("DELETE FROM panels WHERE serial_number = ?");
    $stmt->bind_param("s", $serial);
    if ($stmt->execute()) sendJson(["success" => true]);
    else sendJson(["error" => "Failed to delete"], 500);
}
?>
