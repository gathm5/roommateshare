<?php
session_start();
ob_start();
if (isset($_POST['getFriends'])) {
    require 'facebook.php';
// Create our Application instance (replace this with your appId and secret).
    $facebook = new Facebook(array(
                'appId' => '184444195055895',
                'secret' => 'a0a7e6a546b75522cfaa867faa97adfe',
            ));

    $user = $facebook->getUser();
    if ($user) {
        try {
// Proceed knowing you have a logged in user who's authenticated.
            $access_token = $facebook->getAccessToken();
// run fql query
            $q = 'SELECT+uid,+name,+pic_square,+current_location+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me()+LIMIT+150)+AND+current_location+>+0+and+current_location.country+=+"United+States"';
            //$q = 'SELECT+uid,+name,+pic_square,+current_location+FROM+user+WHERE+uid+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me()+LIMIT+150)';
            $fql_query_url = 'https://graph.facebook.com/'
                    . 'fql?q=' . $q
                    . '&access_token=' . $access_token;
            $fql_query_result = file_get_contents($fql_query_url);

// display results of fql query
        } catch (FacebookApiException $e) {
            error_log($e);
            $user = null;
        }
    }
    ?>
    <?php

    if ($user) {
        echo json_encode(json_decode($fql_query_result));
    } else {
        
    }
    ?>
    <?php
}
ob_flush();
?>