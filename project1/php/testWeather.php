<?php
// Remove this line for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Assume we are in testing mode
$testing = true;

// Hardcoded response data for testing
$testData = [
    "city_name" => "London",
    "country_code" => "GB",
    "forecast" => [
        // Include only the first 4 days of data for testing
        [
            "datetime" => "2024-02-01",
            "app_max_temp" => 10.9,
            "app_min_temp" => 2.8,
            "wind_spd" => 2.7,
            "weather" => [
                "icon" => "c03d",
                "description" => "Broken clouds",
                "code" => 803
            ],
            // ... Add other necessary fields
        ],
        [
            "datetime" => "2024-02-02",
            "app_max_temp" => 12.4,
            "app_min_temp" => 3.7,
            "wind_spd" => 5.6,
            "weather" => [
                "icon" => "c03d",
                "description" => "Broken clouds",
                "code" => 803
            ],
            // ... Add other necessary fields
        ],
        [
            "datetime" => "2024-02-03",
            "app_max_temp" => 12.6,
            "app_min_temp" => 9.6,
            "wind_spd" => 5.9,
            "weather" => [
                "icon" => "c03d",
                "description" => "Broken clouds",
                "code" => 803
            ],
            // ... Add other necessary fields
        ],
        [
            "datetime" => "2024-02-04",
            "app_max_temp" => 12.5,
            "app_min_temp" => 9.4,
            "wind_spd" => 6.8,
            "weather" => [
                "icon" => "c04d",
                "description" => "Broken clouds",
                "code" => 803
            ],
            // ... Add other necessary fields
        ]
        // Add more entries if needed
    ],
    // ... Include other necessary top-level fields
];

if ($testing) {
    // Return the test data as JSON
    header('Content-Type: application/json');
    echo json_encode($testData);
    exit;
}

// The rest of your existing code for live API calls...
// ...

?>


$countryCode = $_REQUEST['country'] ?? '';
$capitalCity = urlencode($_REQUEST['city']) ?? '';
$apiKey = 'cbff9a6a10d344cba33f0d82a83274a1';

$url = "http://api.weatherbit.io/v2.0/forecast/daily?city={$capitalCity}&country={$countryCode}&key={$apiKey}";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

if (!$result) {
echo json_encode(['error' => 'Failed to retrieve weather data']);
exit;
}

$decode = json_decode($result, true);

$forecastData = array_slice($decode['data'], 0, 4); // Get only the first 4 days

$output = [
'city' => $decode['city_name'],
'forecast' => $forecastData
];

header('Content-Type: application/json');
echo json_encode($output);