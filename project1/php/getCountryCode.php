<?php

// Remove this line for production
// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

$output = [
    'status' => [
        'code' => 400,
        'name' => 'error',
        'description' => 'Invalid latitude or longitude.'
    ],
    'data' => null
];

if (isset($_REQUEST['lat']) && isset($_REQUEST['lng'])) {
    $lat = $_REQUEST['lat'];
    $lng = $_REQUEST['lng'];
    $username = 'kl888';

    $url = "http://api.geonames.org/countryCodeJSON?lat=$lat&lng=$lng&username=$username";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);
    curl_close($ch);

    if ($result) {
        $decode = json_decode($result, true);

        if (isset($decode['countryCode']) && isset($decode['countryName'])) {
            $output['status'] = [
                'code' => 200,
                'name' => 'ok',
                'description' => 'Country code and name fetched successfully'
            ];
            $output['data'] = [
                'countryCode' => $decode['countryCode'],
                'countryName' => $decode['countryName']
            ];
        } else {
            $output['status']['description'] = 'Data not found for the given coordinates';
        }
    } else {
        $output['status']['description'] = 'Failed to connect to the Geonames API';
    }
} else {
    $output['status']['description'] = 'Missing required parameters: lat and lng';
}

header('Content-Type: application/json');
echo json_encode($output);
exit;
