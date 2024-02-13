<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$output = [
    'status' => [
        'code' => "200",
        'name' => "ok",
        'description' => "success",
        'returnedIn' => null
    ],
    'data' => null
];

if (!empty($_REQUEST['countryName'])) {
    $countryNameEncoded = urlencode($_REQUEST['countryName']);
    $url = 'http://api.geonames.org/wikipediaSearchJSON?q=' . $countryNameEncoded . '&username=kl888';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);
    curl_close($ch);

    if ($result !== false) {
        $decode = json_decode($result, true);

        $firstResult = $decode['geonames'][0];

        $output['data'] = [
            'summary' => $firstResult['summary'],
            'wikipediaUrl' => $firstResult['wikipediaUrl']
        ];
    } else {
        $output['status']['code'] = "500";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Failed to fetch data";
    }
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Missing required parameters";
}

$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);

exit;
