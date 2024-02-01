<?php

// Remove this line for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$countryCode = $_REQUEST['country'] ?? '';
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

$forecastData = array_slice($decode['data'], 0, 4); // Get only the first 4 days

$output = [
    'city' => $decode['city_name'],
    'forecast' => $forecastData
];

header('Content-Type: application/json');
echo json_encode($output);
