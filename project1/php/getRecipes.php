<?php

// remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

if (empty($_REQUEST['demonym'])) {
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

$demonym = $_REQUEST['demonym'];
$url = "https://api.api-ninjas.com/v1/recipe?query=" . $demonym;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-Api-Key: YoRwOB54rPW/hRX/7o3vnw==3WpcUqfRtQwuwwGG'
]);

$result = curl_exec($ch);
curl_close($ch);

if ($result) {
    $decoded = json_decode($result, true);
    // Pick 3 random recipe items from the decoded array
    $randomKeys = array_rand($decoded, 3);
    $randomRecipes = [];

    foreach ($randomKeys as $key) {
        $randomRecipes[] = $decoded[$key];
    }

    $output = [
        'status' => [
            'code' => 200,
            'name' => 'ok',
            'description' => 'success',
        ],
        'executionTime' => microtime(true) - $executionStartTime,
        'data' => $randomRecipes
    ];
} else {
    $output = [
        'status' => [
            'code' => 500,
            'name' => 'error',
            'description' => 'Unable to fetch data'
        ],
        'executionTime' => microtime(true) - $executionStartTime,
        'data' => []
    ];
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
