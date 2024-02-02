<?php

// Remove this line for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url = "https://openexchangerates.org/api/latest.json?app_id=c1f05ef39c8d4410a9fd37352b0b0b7b";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
$result = curl_exec($ch);
curl_close($ch);

$decoded = json_decode($result, true);

if ($decoded) {

    $output = [
        'status' => [
            'code' => 200,
            'name' => 'ok',
            'description' => 'success',
        ],
        'executionTime' => microtime(true) - $executionStartTime,
        'data' => $decoded
    ];
} else {
    echo json_encode(['error' => 'Unable to fetch data']);
}

header('Content-Type: application/json');
echo json_encode($output);
