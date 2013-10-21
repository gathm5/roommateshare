<?php
    session_start();
    if(!isset($_SESSION['Captcha'])){
        $_SESSION['Captcha'] = "gautham";
    }
?>
