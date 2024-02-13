<?php

// remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

if (is_null($_REQUEST['countryCode'])) {
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
$url = "https://restcountries.com/v3.1/alpha/" . $countryCode;

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
    'executionTime' => intval((microtime(true) - $executionStartTime) * 1000) . " ms",
    'data' => []
];

if (isset($decoded) && !empty($decoded)) {
    foreach ($decoded as $country) {
        $languages = array_values((array) $country['languages']);
        $currencies = array_keys((array) $country['currencies']);
        $currencyName = $country['currencies'][$currencies[0]]['name'] ?? '';
        $currencySymbol = $country['currencies'][$currencies[0]]['symbol'] ?? '';

        $output['data'][] = [
            'commonName' => $country['name']['common'] ?? '',
            'officialName' => $country['name']['official'] ?? '',
            'capital' => $country['capital'][0] ?? '',
            'region' => $country['region'] ?? '',
            'languages' => $languages,
            'latlng' => $country['latlng'] ?? [],
            'demonyms' => $country['demonyms'] ?? [],
            'flags' => $country['flags'] ?? [],
            'population' => $country['population'] ?? '',
            'timezones' => $country['timezones'] ?? [],
            'continents' => $country['continents'] ?? [],
            'capitalInfo' => $country['capitalInfo'] ?? [],
            'area' => $country['area'] ?? '',
            'currencyCode' => $currencies[0] ?? '',
            'currencyName' => $currencyName,
            'currencySymbol' => $currencySymbol,
        ];
    }
}
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
