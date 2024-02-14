<?php

// remove for production
// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

$executionStartTime = microtime(true);

if (is_null($_REQUEST['countryCode'])) {
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

$countryCode = $_REQUEST['countryCode'];
$username = 'kl888';
$maxRows = 50;

$url = "http://api.geonames.org/searchJSON?formatted=true&q=museum&country={$countryCode}&maxRows={$maxRows}&lang=en&username={$username}&style=full";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);


$response = curl_exec($ch);

curl_close($ch);

$data = json_decode($response, true);

$museums = [];


foreach ($data['geonames'] as $geoname) {
    $museums[] = [
        'name' => $geoname['toponymName'],
        'lat' => $geoname['lat'],
        'lng' => $geoname['lng']
    ];
}

$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'success',
    ],
    'executionTime' => intval((microtime(true) - $executionStartTime) * 1000) . " ms",
    'data' => $museums
];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
