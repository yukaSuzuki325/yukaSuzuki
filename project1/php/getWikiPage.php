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

    // Check if the result is not false
    if ($result !== false) {
        $decode = json_decode($result, true);

        // Initialize an empty array to hold the country data
        $countryData = null;

        // Iterate over each 'geonames' entry to find the country's data
        foreach ($decode['geonames'] as $entry) {
            // Check if 'title' matches the country name or if 'feature' indicates a country
            if (
                strcasecmp($entry['title'], $_REQUEST['countryName']) == 0 ||
                (isset($entry['feature']) && $entry['feature'] === 'country')
            ) {
                $countryData = $entry;
                break;
            }
        }

        // If a country entry was found, populate the 'data' array
        if ($countryData) {
            $output['data'] = [
                'summary' => $countryData['summary'],
                'wikipediaUrl' => $countryData['wikipediaUrl']
            ];
        } else {
            // No relevant country entry found, return a different status code and message
            $output['status']['code'] = "404";
            $output['status']['name'] = "no country found";
            $output['status']['description'] = "No Wikipedia entry for the country was found";
        }
    } else {
        $output['status']['code'] = "500";
        $output['status']['name'] = "error";
        $output['status']['description'] = "Failed to fetch data";
    }
}
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
