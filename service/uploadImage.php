<?php

// IMAGE UPLOAD PROPERTIES
$max_file_size = 1024 * 1000; // 200kb
$valid_exts = array('jpeg', 'jpg', 'png', 'gif');
// END Properties

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && isset($_FILES['photo'])) {
    if ($_FILES['photo']['size'] < $max_file_size && !$_FILES['photo']['error']) {
        $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, $valid_exts)) {
            $new_file_name = strtolower($_FILES['photo']['name']);
            move_uploaded_file($_FILES['photo']['tmp_name'], 'uploads/' . $new_file_name) or die('FAILED');
            print json_encode(array(
                        "success" => 'SUCCESS',
                        "failure" => false,
                        "file_name" => $_FILES['photo']['name'],
                        "size" => $_FILES['photo']['size']
                    ));
        }
    }
} else if (!isset($_FILES['photo'])) {
    print json_encode(array(
                "success" => false,
                "failure" => $_FILES['photo']['error'],
            ));
}
?>