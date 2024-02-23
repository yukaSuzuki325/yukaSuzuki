<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getDepartmentByID.php?id=<id>


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

// SQL statement accepts parameters and so is prepared to avoid SQL injection.
// $_REQUEST used for development / debugging. Remember to change to $_POST for production

$query = $conn->prepare('
    SELECT d.id, d.name, d.locationID, COUNT(p.id) AS personnelCount
    FROM department d
    LEFT JOIN personnel p ON d.id = p.departmentID
    WHERE d.id = ?
    GROUP BY d.id
');

$query->bind_param("i", $_REQUEST['id']);

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

$department = [];

while ($row = mysqli_fetch_assoc($result)) {

	array_push($department, $row);
}

// second query - does not accept parameters and so is not prepared

$query = 'SELECT id, name from location ORDER BY name';

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

$location = [];

while ($row = mysqli_fetch_assoc($result)) {

	array_push($location, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['department'] = $department;
$output['data']['location'] = $location;

mysqli_close($conn);

echo json_encode($output);
