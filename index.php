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
    $users = array("gautham" => "gstalin", "gpalande" => "palande123");
    if ($users[$u] == $p) {
        $_SESSION['owner'] = $u;
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
				<div class='mauto popups h100' id='popups'>
					<div id='loginPopup' class='mauto'></div>
					<div id='postViewPopup' class='mauto'></div>
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
		<?php include 'module/ga.php'; ?>
    </body>
</html>
<?php } else {
    ?>
    <!doctype html>
    <html>
        <head>
            <title>Roommate Share</title>
            <meta name="description" content="Roommate Share provides the best tool for students" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalabale=false" />
            <meta name="fragment" content="!" />
            <link href='http://fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
            <style>
                *{
                    color: #777777;
                    font-family: 'Lato', sans-serif;
                    outline: none;
                }
                html, body{
                    width: 100%;
                    padding: 0;
                    margin: 0;
                }
                *::-moz-focus-inner {
                    border: 0;
                }
                h2{
                    padding: 0;
                    margin: 0;
                    text-align: center;
                    font-weight: normal; 
                }
                div.login{
                    margin: 80px auto;
                    width: 500px;
                }
                div.login div{
                    text-align: left;
                    padding: 10px;
                    width: 503px;
                }
                input{
                    padding: 10px;
                    width: 481px;
                    font-size: 16px;
                    color: #000;
                    border-width: 1px;
                    border-style: solid;
                    border-color: #ccc;
                    -webkit-appearance: none;
                    -webkit-border-radius:0; 
                    border-radius:0;
                }
                input[type='submit']{
                    width: 503px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-radius: 0;
                    -webkit-border-radius: 0;
                    background: #eee;
                }
                input[type='submit']:focus, input[type='submit']:hover{
                    background: #bbb;
                    color: #fff;
                    box-shadow: 0 0 10px #999 inset;
                }
            </style>
        </head>
        <body>
            <div class='login'>
                <form action="" method="post" name="login">
                    <div>
                        <h2 style="float: left">RoommateShare.com</h2>
                        <h2 style="float: right">Administrators Login</h2>
                        <div style="clear: both; padding: 0; margin: 0; height: 0;"></div>
                    </div>
                    <div>
                        <input type="text" autofocus="true" autocapitalize="off" placeholder="username" name="username" />
                    </div>
                    <div>
                        <input type="password" placeholder="password" name="password" />
                    </div>
                    <div>
                        <input type="submit" value="Login" name="submit" />
                    </div>
                </form>
            </div>
            <?php include 'module/ga.php'; ?>
        </body>
    </html>
<?php }
?>