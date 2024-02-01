<?php

// remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

if (empty($_REQUEST['countryCode'])) {
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
$apiKey = 'pub_375074a321222bcbf4980cfee047283067ac8';
$url = "https://newsdata.io/api/1/news?apikey={$apiKey}&country={$countryCode}";

$defaultNewsImage = './assets/images/newspaper.jpg';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
curl_close($ch);

$decoded = json_decode($result, true);

$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'success',
    ],
    'executionTime' => microtime(true) - $executionStartTime,
    'data' => []
];

if ($decoded['status'] === 'success') {
    foreach ($decoded['results'] as $article) {
        $output['data'][] = [
            'title' => $article['title'],
            'image_url' => !empty($article['image_url']) ? $article['image_url'] : $defaultNewsImage,
            'description' => !empty($article['description']) ? $article['description'] : 'No description available.',
            'article_link' => $article['link']
        ];
    }
}

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
