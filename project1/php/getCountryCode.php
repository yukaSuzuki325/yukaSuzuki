<?php

//remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$jsonFilePath = '../json/countryBorders.geo.json';

$jsonString = file_get_contents($jsonFilePath);

$jsonObject = json_decode($jsonString, true);

$countryList = [];

if (isset($jsonObject['features'])) {
    foreach ($jsonObject['features'] as $feature) {
        $properties = $feature['properties'];
        $countryList[] = [
            'name' => $properties['name'],
            'iso_a2' => $properties['iso_a2'],
            'iso_a3' => $properties['iso_a3']
        ];
    }
}

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($countryList);
