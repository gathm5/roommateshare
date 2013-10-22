<?php
/**
 * If it show "Fatal error: Call to undefined function: imagecreate()" then 
 * you have to install GD. To know detail about GD 
 * see that documentation : http://jp.php.net/imagecreate
 * 
 */

ob_start();
ini_set("display_errors",1);

require_once('./captcha/TextToImage.class.php');

$_im = new TextToImage();
$_im->makeImageF("captcha");

$_im->showAsJpg();

//$_im->showAsPng(); 
//$_im->saveAsPng("Image1");



?>