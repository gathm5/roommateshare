<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
ob_start();
session_start();

//CHECK FOR ADMINISTRATOR
function logout() {
    unset($_SESSION['owner']);
}

function checkUser($u, $p) {
    $users = array("gautham" => "gstalin", "gpalande" => "palande123", "spencer" => "spencer123", "olivia", "demo123", "eunhee" => "demo123");
    if ($users[$u] == $p) {
        $_SESSION['owner'] = $u;
        if ($u != 'gautham') {
            $myFile = "login.log";
            $fh = fopen($myFile, 'a');
            $stringData = $u . ' Logged in at ' . date('m/d/Y H:i:s') . "\n";
            fwrite($fh, $stringData);
            fclose($fh);
        }
    }
}

if (isset($_POST['submit'])) {
    $user = $_POST['username'];
    $pass = $_POST['password'];
    if ($user != "" && $pass != "") {
        checkUser($user, $pass);
    }
}
if (isset($_GET['logout'])) {
    logout();
}
if (isset($_SESSION['owner'])) {
//CHECK FOR ADMINISTRATOR
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
            <link rel="shortcut icon" type="image/x-icon" href="/favicon.png">
            <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
            <script src='//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>
        </head>
        <body>
            <div id='RoommateShareBody' class='rel h100'>
                <div class='Top rel z2'>
                    <?php include_once 'includes/header.php.inc'; ?>
                </div>
                <div class='Middle rel h100 z1'>
                    <div id='FindHolder' class='abs l0 t0 rel h100 transition3 z1'>
                        <div class='listHeader rel abs w100 z2' id='listHeader'>
                            <div class='p10'>
                                <div class='rel'>
                                    <div class='resultLink fl w49 blue listSelected transition1'>
                                        Rentals
                                    </div>
                                    <div id='ViewFavorites' class='resultLink fr w49 red transition1'>
                                        Favorites
                                    </div>
                                    <div class='clear'></div>
                                </div>
                            </div>
                        </div>
                        <div class='tempHide bluebg white'><span class='toggleHide'>Show</span><span class='toggleShow'>Hide</span> Box</div>
                        <div id='ListHolder' class='rel'>

                        </div>
                        <div id='rental_detailed_view' class='abs w100 h100 t0 l0 z1 transition2'>
                            <div class='rel whitebg'>
                                <div class='p10'>
                                    <div id='show_rental_details' class='mtb10'></div>
                                </div>
                                <div class='close_detailed_btn abs close_btn t0 r0 small'>
                                    <div class='rel'>
                                        <div class='closeIcon fl'></div>
                                        <div class='closeMsg fl small white'>CLOSE</div>
                                        <div class='clear'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='MapHolder' class='fr rel h100 transition3'>
                        <div id='RoommateMap' class='w100 h100'></div>
                        <div id='searchBoxContainer' class='abs z2 t0 transition3 abs_left_p50'>
                            <?php
                            include_once 'includes/searchPlace2.php.inc';
                            ?>
                        </div>
                        <div id='neighborHoodTabs' class='abs z1 t0 r0 w60'>
                            <?php
                            include_once 'includes/neighborhood.php.inc';
                            ?>
                        </div>
                    </div>
                    <div class='clear'></div>
                </div>
                <div class='Bottom'></div>
                <div id='ScreenPopup' class='ScreenPopup translucent abs t0 l0 w100 h100 z2'>
                    <div class='mauto popups h100' id='popups'>
                        <div id='loginPopup' class='mauto'></div>
                        <div id='postViewPopup' class='mauto'></div>
                    </div>
                </div>
            </div>
            <script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBbW2hMLYX-YkJ4CqwObIuA1CynCoJ3tno&sensor=false&libraries=places' type='text/javascript'></script>
            <script src='/js/richmarker-compiled.js' type='text/javascript'></script>
            <script src='/js/mustache.js' type='text/javascript'></script>
            <script src="/js/jquery-ui-date-picker.js"></script>
            <script type='text/javascript' src='js/RoommateShare.js'></script>
            <script type='text/javascript'>
                RoommateShare.Init(<?php echo $session->getLocation() != '' ? '"' . $session->getLocation() . '"' : ''; ?>);
    <?php
    $userObject = '{';
    $userExists = false;
    if ($fbuser) {
        $userObject .= '"getFbFriends":true';
    } else {
        $userObject .= '"getFbFriends":false';
    }
    if (isset($userloggedin) && $userloggedin && $userloggedin != "") {
        $userExists = true;
        $userObject .= ',"user":' . $userloggedin;
    }
    $userObject .= '}';
    if ($userExists)
        echo 'RoommateShare.UserAction(' . $userObject . ')';
    ?>
            </script>
            <?php include 'module/ga.php'; ?>
        </body>
    </html>
    <?php
} else {
    include_once 'blocker.php.inc';
}
?>