<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

if (is_null($_REQUEST['countryName'])) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
} else {
    $output = [
        'status' => [
            'code' => "200",
            'name' => "ok",
            'description' => "success",
            'returnedIn' => null
        ],
        'data' => null
    ];

    $countryNameEncoded = urlencode($_REQUEST['countryName']);
    $url = 'http://api.geonames.org/wikipediaSearchJSON?q=' . $countryNameEncoded . '&username=kl888';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);
    curl_close($ch);


    $decode = json_decode($result, true);
    $countryData = null;
    foreach ($decode['geonames'] as $entry) {
        if ($entry['title'] == $_REQUEST['countryName']) {
            $countryData = $entry;
            break;
        }
    }
    if ($countryData) {
        $output['data'] = [
            'summary' => $countryData['summary'],
            'wikipediaUrl' => $countryData['wikipediaUrl']
        ];
    } else {
        $output['status']['code'] = "404";
        $output['status']['name'] = "no country found";
        $output['status']['description'] = "No Wikipedia entry for the country was found";
    }
}

$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
