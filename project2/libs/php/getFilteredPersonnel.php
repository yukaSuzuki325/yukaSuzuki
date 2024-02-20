<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$departmentSelect = $_POST['department'] ?? 'all';
$locationSelect = $_POST['location'] ?? 'all';

$query = "SELECT p.*, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON p.departmentID = d.id LEFT JOIN location l ON d.locationID = l.id";

// Add where conditions if needed
$whereClauses = [];
if ($departmentSelect != 'all') {
    $whereClauses[] = "d.id = '" . $conn->real_escape_string($departmentSelect) . "'";
}
if ($locationSelect != 'all') {
    $whereClauses[] = "l.id = '" . $conn->real_escape_string($locationSelect) . "'";
}
if (!empty($whereClauses)) {
    $query .= " WHERE " . implode(' AND ', $whereClauses);
}

$result = $conn->query($query);

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    array_push($data, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output);
