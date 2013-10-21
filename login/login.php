<?php

session_start();
ob_flush();
include '../module/sessionObject.php';
include 'user.php';
if (isset($_POST['email']) && isset($_POST['password'])) {
    $password = sha1($_POST['password']);
    $user = new User($_POST['email'], $password);
    if ($user->getIsValid()) {
        $arr = json_decode($user->getJson());
        $newArr = objectToArray($arr);
        $session->setUser(serialize(json_encode($newArr)));
        echo 'SUCCESS';
        exit();
    }
    echo 'FAILURE';
}

function objectToArray($d) {
    if (is_object($d)) {
        // Gets the properties of the given object
        // with get_object_vars function
        $d = get_object_vars($d);
    }

    if (is_array($d)) {
        /*
         * Return array converted to object
         * Using __FUNCTION__ (Magic constant)
         * for recursive call
         */
        return array_map(__FUNCTION__, $d);
    } else {
        // Return array
        return $d;
    }
}
?>
