<?php
// Assuming you have received 'country' and 'city' via GET parameters
$countryCode = $_GET['country'] ?? '';
$capitalCity = $_GET['city'] ?? '';
$apiKey = 'your_api_key'; // Replace with your actual API key

$url = "http://api.weatherbit.io/v2.0/forecast/daily?city={$capitalCity}&country={$countryCode}&key={$apiKey}";

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

if (!$response) {
    // Handle error; the API call was unsuccessful
    echo json_encode(['error' => 'Failed to retrieve weather data']);
    exit;
}

// Decode the response and extract the needed data
$responseData = json_decode($response, true);
$forecastData = array_slice($responseData['data'], 0, 4); // Get only the first 4 days

// Construct the output to send back to the client
$output = [
    'city' => $responseData['city_name'],
    'forecast' => $forecastData
];

// Send JSON response back to the client
header('Content-Type: application/json');
echo json_encode($output);
