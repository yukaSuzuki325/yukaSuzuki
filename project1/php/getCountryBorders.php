<?php

//remove for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$country_code = $_REQUEST['countryCode'];

$features_collection_string = file_get_contents('../json/countryBorders.geo.json', true);

$features_collection_object = json_decode($features_collection_string);

$features_array = $features_collection_object->features;

$country_feature = null;
foreach ($features_array as $feature) {
    if ($feature->properties->iso_a2 === $country_code) {
        $country_feature = $feature;
        break;
    };
};

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($country_feature);
