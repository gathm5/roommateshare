<?php

include_once('ip2locationlite.class.php');
include_once('assets.php');
//Set geolocation cookie
if (!isset($_COOKIE["geolocation"])) {
    $ipLite = new ip2location_lite;
    $ipLite->setKey($ip_api_key);

    $visitorGeolocation = $ipLite->getCity($_SERVER['REMOTE_ADDR']);
    if ($visitorGeolocation['statusCode'] == 'OK') {
        $data = base64_encode(serialize(array(
            'city'=>$visitorGeolocation['cityName'],
            'country'=>$visitorGeolocation['countryCode']
        )));
        setcookie("geolocation", $data, time() + 3600 * 24 * 7); //set cookie for 1 week
        $_COOKIE["geolocation"] = $data;
    }
} else {
    $visitorGeolocation = unserialize(base64_decode($_COOKIE["geolocation"]));
}
?>