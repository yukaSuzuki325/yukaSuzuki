<?php
// Remove this line for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Hardcoded response data for testing
$testData = [
    "city_name" => "London",
    "country_code" => "GB",
    "forecast" => [
        [
            "datetime" => "2024-02-14",
            "app_max_temp" => 10.9,
            "app_min_temp" => 2.8,
            "wind_spd" => 2.7,
            "weather" => [
                "icon" => "c03d",
                "description" => "Broken clouds",
                "code" => 803
            ],
        ],
        [
            "datetime" => "2024-02-15",
            "app_max_temp" => 12.4,
            "app_min_temp" => 3.7,
            "wind_spd" => 5.6,
            "weather" => [
                "icon" => "c03d",
                "description" => "Broken clouds",
                "code" => 803
            ],
        ],
        [
            "datetime" => "2024-02-16",
            "app_max_temp" => 12.6,
            "app_min_temp" => 9.6,
            "wind_spd" => 5.9,
            "weather" => [
                "icon" => "c03d",
                "description" => "Broken clouds",
                "code" => 803
            ],
        ],
        [
            "datetime" => "2024-02-17",
            "app_max_temp" => 12.5,
            "app_min_temp" => 9.4,
            "wind_spd" => 6.8,
            "weather" => [
                "icon" => "c04d",
                "description" => "Broken clouds",
                "code" => 803
            ],
        ]
    ],
];

$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'success',
    ],
    'data' => $testData
];


header('Content-Type: application/json');
echo json_encode($output);
