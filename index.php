<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
ob_start();
session_start();

include_once './logic/site-properties.php';
include_once('./module/sessionObject.php');
require './logic/facebook.php';
$userloggedin = NULL;
// Create our Application instance (replace this with your appId and secret).
$facebook = new Facebook(array(
            'appId' => '184444195055895',
            'secret' => 'a0a7e6a546b75522cfaa867faa97adfe',
        ));
// Get User ID
$fbuser = $facebook->getUser();
if ($fbuser) {
    $userloggedin = json_encode($facebook->api('/me?fields=first_name,last_name,username,email,location,id,gender,relationship_status,picture,birthday'));
} else if ($session->getUser() != "") {
    $user = unserialize($session->getUser());
    $userloggedin = $user;
}
?>
<!doctype html>
<html>
    <head>
        <title>Roommate Share | finding the right place</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalabale=false'>
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='fragment' content='!' />
        <link href='https://fonts.googleapis.com/css?family=Expletus+Sans' rel='stylesheet' type='text/css'>
        <link href='css/siteprop.css' rel='stylesheet' type='text/css'>
        <link href='css/roommateshare.css' rel='stylesheet' type='text/css'>
        <script src='//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>
    </head>
    <body>
        <div id='RoommateShareBody' class='rel h100'>
            <div class='Top rel z1'>
                <?php include_once 'includes/header.php.inc'; ?>
            </div>
            <div class='Middle rel h100'>
                <div id='FindHolder' class='fl rel h100 transition3'>
                    <div id='ListHolder' class='rel'>

                    </div>
                </div>
                <div id='MapHolder' class='fr rel h100 transition3'>
                    <div id='RoommateMap' class='w100 h100'></div>
                    <div id='searchBoxContainer' class='abs z1 t0 transition2' style='left:50%;'>
                        <?php
                        include_once 'includes/searchPlace.php.inc';
                        ?>
                    </div>
                </div>
                <div class='clear'></div>
            </div>
            <div class='Bottom'></div>
            <div id='ScreenPopup' class='ScreenPopup translucent abs t0 l0 w100 h100 z1'>
                <div class='rel'>
                    <div class="mauto popups" id="popups">
                        <div id="loginPopup"></div>
                    </div>
                </div>
            </div>
        </div>
        <script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBbW2hMLYX-YkJ4CqwObIuA1CynCoJ3tno&sensor=false' type='text/javascript'></script>
        <script src='/js/richmarker-compiled.js' type='text/javascript'></script>
        <script src='/js/mustache.js' type='text/javascript'></script>
        <script type='text/javascript' src='js/RoommateShare.js'></script>
        <script type='text/javascript'>
            RoommateShare.Init(<?php echo $session->getLocation() != '' ? '"' . $session->getLocation() . '"' : ''; ?>);
        </script>
    </body>
</html>