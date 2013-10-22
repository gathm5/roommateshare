<?php

/*
 * Connection Properties
 */
$dbhost = "findeasyrentals.db.9229429.hostedresource.com";

$dbname = "findeasyrentals";                         // MySQL DB Name
$dbuser = "findeasyrentals";                          // MySQL DB User
$dbpass = "Renteasy!1";                      // MySQL DB Password

$baseURL = $_SERVER['SERVER_NAME'] . dirname($_SERVER['REQUEST_URI']);  // Base URL of the site
static $site = array(
    'Asia'=>'RoommateShare.com',
    'America'=>'RoommateShare.com'
);
?>
