<?php

$mtime = microtime();
$mtime = explode(" ", $mtime);
$mtime = $mtime[1] + $mtime[0];
$starttime = $mtime;

include 'connection.php';
$getURL = "https://api.foursquare.com/v2/venues/search?ll=19.0759837,72.877655&client_id=34GRDWXOITJMDJPTZLTB0BHZ4SUY3CSDPUS2TUUHNO0GS0JI&client_secret=PVSJC4BMVX5GGH2TPHJAIZIOF1EUEUS5MQBTIYWX0HLKXAVO&v=20130613&query=food";
$url_prefix = "https://api.foursquare.com/v2/venues/search?";
$ll = "ll=19.0759837,72.877655";
$latlng = $_REQUEST['latlng'];
$ll = "ll=" . $latlng;
$searchlist = Array('food', 'atm', 'theater', 'bar');
$query = "query=food";
// Radius in Meters
$radius = "radius=800";
$filename = "test";
if (isset($_REQUEST['lat']) && isset($_REQUEST['lng']))
    $filename = 'lat' . $_REQUEST['lat'] . '_lng' . $_REQUEST['lng'];
$dirName = 'cache';
$date = "v=20130613";
$client_id = "client_id=" . $FS_client_id;
$secret_id = "client_secret=" . $FS_secret_id;
$a = array();
$resJson = "";
if (isset($_REQUEST['get_places'])) {
    if (file_exists($dirName . '/' . $filename)) {
        $resJson = file_get_contents($dirName . '/' . $filename);
        print $resJson;
        exit();
    }
    for ($i = 0; $i < count($searchlist); $i++) {
        $query = "query=" . $searchlist[$i];
        $getURL = $url_prefix . $client_id . '&' . $secret_id . '&' . $ll . '&' . $date . '&' . $query;
        array_push($a, json_decode(file_get_contents($getURL), true));
    }
    $res = array_merge_recursive($a);
    $resJson = json_encode($res);
    print $resJson;
} else if (isset($_REQUEST['get_places_1'])) {
    $query = "query=" . $_REQUEST['get_places_1'];
    $getURL = $url_prefix . $client_id . '&' . $secret_id . '&' . $ll . '&' . $date . '&' . $query;
    array_push($a, json_decode(file_get_contents($getURL), true));
    $res = array_merge_recursive($a);
    $resJson = json_encode($res);
    print $resJson;
}

if (isset($_REQUEST['latlng'])) {
    try {
        if (file_exists($dirName) && is_dir($dirName)) {
            $fp = fopen($dirName . '/' . $filename, 'w');
            fwrite($fp, $resJson);
            fclose($fp);
        }
    } catch (Exception $e) {
        
    }
}
$mtime = microtime();
$mtime = explode(" ", $mtime);
$mtime = $mtime[1] + $mtime[0];
$endtime = $mtime;
$totaltime = ($endtime - $starttime);
$totaltime = number_format($totaltime, 6, '.', '');
?>