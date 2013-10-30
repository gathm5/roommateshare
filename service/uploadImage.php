<?php
ob_start();
session_start();

include_once '../logic/site-properties.php';
include_once('../module/sessionObject.php');

// IMAGE UPLOAD PROPERTIES
$max_file_size = 1024 * 1000; // 200kb
$valid_exts = array('jpeg', 'jpg', 'png', 'gif');
// END Properties
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['rental_image_upload'])) {
    if ($_FILES['rental_image_upload']['size'] < $max_file_size && !$_FILES['rental_image_upload']['error']) {
        $ext = strtolower(pathinfo($_FILES['rental_image_upload']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, $valid_exts)) {
            $date = new DateTime('NOW');
            $folder = 'user_rentals/';
            $new_file_name = $folder . strtolower($date->format('YmdHis') . '.' . $ext);
            move_uploaded_file($_FILES['rental_image_upload']['tmp_name'], $new_file_name) or die('FAILED');
            print json_encode(array(
                        "success" => true,
                        "failure" => false,
                        "file_name" => $new_file_name,
                        "size" => $_FILES['rental_image_upload']['size']
                    ));
        }
    }
} else if (!isset($_FILES['rental_image_upload'])) {
    print json_encode(array(
                "success" => false,
                "failure" => $_FILES['rental_image_upload']['error'],
            ));
}
?>