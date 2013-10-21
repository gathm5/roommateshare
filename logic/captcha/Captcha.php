<?php

session_start();
//Kip the font file together or write proper location.
if (isset($_SESSION["Captcha"]))
    makeImageF($_SESSION["Captcha"]);

if (isset($_POST["Recaptcha"])) {
    if (isset($_SESSION["Captcha"])) {
        $time = time();
        $captcha = substr(hash('sha1', $time), 3, 5);
        $_SESSION["Captcha"] = $captcha;
        makeImageF($_SESSION["Captcha"]);
    }
}

function makeImageF($text, $font = "ft34.ttf", $W = 150, $H = 70, $X = 20, $Y = 55, $fsize = 20, $bgcolor = array(0xFF, 0xFF, 0xFF)) {

    $captcha = array("Captcha1.jpg", "Captcha2.jpg", "Captcha3.jpg", "Captcha4.jpg");
    shuffle($captcha);
    $fonts = array("Duality.ttf", "Candice.ttf", "Heineken.ttf", "Jura.ttf", "Ding-DongDaddyO.ttf");
    shuffle($fonts);
    $font = $fonts[1];
    $im = imagecreatefromjpeg($captcha[2]);
    $r = array(14);
    $g = array(14);
    $b = array(14);
    $txtc = array(array(40, 40, 40),
        array(245, 245, 245),
        array(0, 0, 74)
    );

    shuffle($txtc);
    $color = $txtc[0];

    $angle = rand(2, 25);

    $background_color = imagecolorallocate($im, $bgcolor[0], $bgcolor[1], $bgcolor[2]);        //RGB color background.
    $text_color = imagecolorallocate($im, $color[0], $color[1], $color[2]);            //RGB color text.
    imagettftext($im, $fsize, $angle, $X, $Y, $text_color, $font, $text);

    header("Content-type: image/gif");
    return imagegif($im);
}

function random_color() {
    mt_srand((double) microtime() * 1000000);
    $c = '';
    while (strlen($c) < 6) {
        $c .= sprintf("%02X", mt_rand(0, 255));
    }
    return $c;
}

?>