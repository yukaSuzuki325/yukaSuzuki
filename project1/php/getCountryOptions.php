<?php

//remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');
$executionStartTime = microtime(true);

$jsonFilePath = '../json/countryBorders.geo.json';

$jsonString = file_get_contents($jsonFilePath);

$countryData = json_decode($jsonString, true);

if (is_null($countryData)) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
} else {

    $countryList = [];
    if (isset($countryData['features'])) {
        foreach ($countryData['features'] as $feature) {
            $properties = $feature['properties'];
            $countryList[] = [
                'name' => $properties['name'],
                'iso_a2' => $properties['iso_a2'],
                'iso_a3' => $properties['iso_a3']
            ];
        }
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $countryList;
}

echo json_encode($output);
