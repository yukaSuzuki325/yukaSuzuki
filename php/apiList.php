<?php

//remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$url = 'http://api.geonames.org/oceanJSON?lat=' . $_REQUEST['oceanLat'] . '&lng=' . $_REQUEST['oceanLng'] . '&username=kl888';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);
$output = [];

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
foreach ($decode as $key => $value) {
    $output['data'] = $value;
}

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);


// if ($_REQUEST['oceanLat'] && $_REQUEST['oceanLng']) {
//     $url = 'http://api.geonames.org/oceanJSON?lat=' . $_REQUEST['oceanLat'] . '&lng=' . $_REQUEST['oceanLng'] . '&username=kl888';
// } elseif ($_REQUEST['oceanLat'] && $_REQUEST['oceanLng']) {
// }