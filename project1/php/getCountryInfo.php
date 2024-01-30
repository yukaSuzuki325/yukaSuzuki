<?php

// remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = '';

if (!empty($_REQUEST['countryCode'])) {
    $url = 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country=' . $_REQUEST['countryCode'] . '&username=kl888';
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
