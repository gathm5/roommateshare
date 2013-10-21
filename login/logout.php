<?php
session_start();
include_once '../logic/site-properties.php';
include_once('../module/sessionObject.php');
$session->destroyUserSession();
header('Location:/');
?>