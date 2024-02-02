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

$decoded = json_decode($result, true);
$recipes = array_slice($decoded, 0, 5);

// echo '<pre>';
// var_dump($decoded);
// echo '</pre>';

$imageDir = './assets/recipe-images';
$assignedImages = [
    'cooking.jpg',
    'lemon.jpg',
    'salad.jpg',
    'spice1.jpg',
    'spice2.jpg'
];

// // Check if there are enough assigned images for the recipes
// if (count($assignedImages) < count($recipes)) {
//     die("Not enough assigned images for the recipes.");
// }

// Add the image property to each recipe
foreach ($recipes as $key => $recipe) {
    $recipes[$key]['image'] = $imageDir . '/' . $assignedImages[$key];
}

$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'success',
    ],
    'executionTime' => microtime(true) - $executionStartTime,
    'data' => $recipes
];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
