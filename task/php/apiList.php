<?php

//remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = '';
$username = "kl888"; // Replace with your actual username

// Validate inputs and build URL
if (!empty($_REQUEST['oceanLat']) && !empty($_REQUEST['oceanLng'])) {
    $url = "http://api.geonames.org/oceanJSON?lat={$_REQUEST['oceanLat']}&lng={$_REQUEST['oceanLng']}&username={$username}";
} elseif (!empty($_REQUEST['neighbourLat']) && !empty($_REQUEST['neighbourLng'])) {
    $url = "http://api.geonames.org/neighbourhoodJSON?lat={$_REQUEST['neighbourLat']}&lng={$_REQUEST['neighbourLng']}&username={$username}";
} elseif (!empty($_REQUEST['populatedLat']) && !empty($_REQUEST['populatedLng'])) {
    $url = "http://api.geonames.org/findNearbyPlaceNameJSON?lat={$_REQUEST['populatedLat']}&lng={$_REQUEST['populatedLng']}&username={$username}";
} else {
    http_response_code(400);
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'error',
            'description' => 'Missing required parameters.'
        ],
        'executionTime' => microtime(true) - $executionStartTime
    ]);
    exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (isset(($decode['status'])) && $decode['status']['value'] == 14) {
    http_response_code(400);
    echo json_encode([
        'status' => [
            'code' => 400,
            'name' => 'error',
            'description' => 'Invalid latitude or longitude.'
        ],
        'executionTime' => microtime(true) - $executionStartTime
    ]);
    exit;
}

$output = [];

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
foreach ($decode as $key => $value) {
    $output['data'] = $value;
}

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
