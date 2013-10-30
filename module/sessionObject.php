<?php

class Session {

    private $id;
    private $location;
    private $preferred_location;
    private $user;
    private $browser;
    private $loadTime = Array();
    private $referrer;
    private $landTime;
    private $referral;
    private $searches = Array();

    function __construct() {
        $time = time();
        $this->id = $time;
        $this->location();
        $this->browserDetection();
        $this->landTime = new DateTime();
        $this->writeToDB();
    }

    public function getId() {
        return $this->id;
    }

    public function reloadSession($time) {
        //$this->loadTimeFn($time);
        $this->checkForReferral();
        $this->writeToDB();
        $this->updateSession();
    }

    public function SaveSearch($searchId, $searchStr) {
        array_push($this->searches, array(
            'id' => $searchId,
            'search' => $searchStr
        ));
        $this->updateSession();
    }

    public function getLocation() {
        try {
            if ($this->getPreferredLocation() != "" && isset($this->preferred_location))
                return $this->preferred_location;
            if (isset($this->location['city']))
                return $this->location['city'];
        } catch (Exception $e) {
            
        }
    }

    public function setPreferredLocation($location) {
        $this->preferred_location = $location;
        setcookie('preferred_location', $location, time() + 3600 * 24 * 7, '/');
        echo time() + 3600 * 24 * 7;
        $this->updateSession();
    }

    public function getPreferredLocation() {
        if (isset($this->preferred_location) || (isset($_COOKIE['preferred_location']) && $_COOKIE['preferred_location'] != '' ? $this->preferred_location = $_COOKIE['preferred_location'] : false))
            return $this->preferred_location;
        return "";
    }

    public function setUser($user, $social = NULL) {
        if (isset($user) && !isset($social)) {
            $this->user = unserialize($user);
            $this->updateSession();
        }
        else if(isset($user) && isset($social)){
            $this->user = unserialize($user);
            $this->updateSession();
        }
    }

    public function getUser() {
        if (isset($this->user))
            return serialize($this->user);
        return "";
    }

    public function destroyUserSession() {
        if (isset($this->user))
            unset($this->user);
        $this->updateSession();
    }

    private function loadTimeFn($time) {
        array_push($this->loadTime, $time);
    }

    private function location() {
        try {
            include_once('ip2locationlite.class.php');
            include_once('assets.php');
            $ipLite = new ip2location_lite;
            $ipLite->setKey($ip_api_key);
            $visitorGeolocation = $ipLite->getCity($_SERVER['REMOTE_ADDR']);
            if ($visitorGeolocation['statusCode'] == 'OK') {
                $this->location = array(
                    'city' => $visitorGeolocation['cityName'],
                    'country' => $visitorGeolocation['countryCode'],
                    'ip' => $_SERVER['REMOTE_ADDR'],
                    'pageName' => substr($_SERVER["SCRIPT_NAME"], strrpos($_SERVER["SCRIPT_NAME"], "/") + 1)
                );
            }
        } catch (Exception $e) {
            
        }
    }

    private function browserDetection() {
        try {
            $browser = $_SERVER['HTTP_USER_AGENT'];
            $this->browser = $browser;
            $this->referrer = $_SERVER['HTTP_REFERER'];
        } catch (Exception $e) {
            
        }
    }

    private function checkForReferral() {
        if (isset($_REQUEST['ref']) && $_REQUEST['ref'] != "")
            $this->referral = $_REQUEST['ref'];
    }

    private function updateSession() {
        $_SESSION['siteuser'] = serialize($this);
    }

    private function writeToDB() {
        $sessionEncoded = base64_encode(serialize($this));
    }

}

$mtime = microtime();
$mtime = explode(" ", $mtime);
$mtime = $mtime[1] + $mtime[0];
$starttime = $mtime;
if (!isset($_SESSION['siteuser'])) {
    $session = new Session();
    $_SESSION['siteuser'] = serialize($session);
} else {
    $session = unserialize($_SESSION['siteuser']);

    /*
    include ('/logic/facebook.php');
    // Create our Application instance (replace this with your appId and secret).
    $facebook = new Facebook(array(
                'appId' => '184444195055895',
                'secret' => 'a0a7e6a546b75522cfaa867faa97adfe',
            ));
// Get User ID
    $fbuser = $facebook->getUser();
    if($fbuser){
        $session->setUser($fbuser, $social = 'FB');
    }
     * */
}
$mtime = microtime();
$mtime = explode(" ", $mtime);
$mtime = $mtime[1] + $mtime[0];
$endtime = $mtime;
$totaltime = ($endtime - $starttime);
$totaltime = number_format($totaltime, 6, '.', '');
$session->reloadSession($totaltime);
?>