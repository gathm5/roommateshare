<?php

ob_start();
require 'login_facebook.php';
// Create our Application instance (replace this with your appId and secret).
$facebook = new Facebook(array(
            'appId' => '184444195055895',
            'secret' => 'a0a7e6a546b75522cfaa867faa97adfe',
        ));
// Get User ID
$user = $facebook->getUser();

if ($user) {
    try {
        header('Location: http://www.roommateshare.com/');
    } catch (FacebookApiException $e) {
        error_log($e);
        $user = null;
    }
}
// Login or logout url will be needed depending on current user state.
if ($user) {
    $logoutUrl = $facebook->getLogoutUrl();
} else {
    $loginUrl = $facebook->getLoginUrl(array(
        'redirect_uri' => $_SERVER['SCRIPT_URI'],
        'scope' => 'friends_location'));
    header('Location: ' . $loginUrl);
}
ob_flush();
?>