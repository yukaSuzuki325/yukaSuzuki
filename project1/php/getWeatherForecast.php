<?php

// Remove this line for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

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

$countryCode = $_REQUEST['countryCode'] ?? '';
$capitalCity = urlencode($_REQUEST['city']) ?? '';
$apiKey = 'cbff9a6a10d344cba33f0d82a83274a1';

$url = "http://api.weatherbit.io/v2.0/forecast/daily?city={$capitalCity}&country={$countryCode}&key={$apiKey}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

if (!$result) {
    echo json_encode(['error' => 'Failed to retrieve weather data']);
    exit;
}

$decode = json_decode($result, true);

$forecast = array_slice($decode['data'], 0, 4); // Get only the first 4 days

$forecastData = [
    'city' => $decode['city_name'],
    'forecast' => $forecast
];

$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'success',
    ],
    'executionTime' => intval((microtime(true) - $executionStartTime) * 1000) . " ms",
    'data' => $forecastData
];

header('Content-Type: application/json');
echo json_encode($output);
