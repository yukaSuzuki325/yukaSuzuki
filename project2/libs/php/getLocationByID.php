<?php
// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

$query = $conn->prepare('
    SELECT l.id, l.name, COUNT(d.id) AS departmentCount
    FROM location l
    LEFT JOIN department d ON l.id = d.locationID
    WHERE l.id = ?
    GROUP BY l.id
');

$query->bind_param("i", $_POST['id']);
$query->execute();


if (false === $query) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    echo json_encode($output);

    mysqli_close($conn);
    exit;
}

$result = $query->get_result();

$location = [];

while ($row = mysqli_fetch_assoc($result)) {

    array_push($location, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['location'] = $location;

mysqli_close($conn);

echo json_encode($output);
