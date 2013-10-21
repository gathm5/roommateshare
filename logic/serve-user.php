<?php
ob_start();
session_start();
include_once 'site-properties.php';
include_once('../module/sessionObject.php');
if(!isset($session)){
    echo '0';
    exit;
}
if(isset($_REQUEST['set_location'])){
    $location = $_REQUEST['set_location'];
    $session->setPreferredLocation($location);
    echo '1';
}
?>
