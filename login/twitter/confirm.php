
<?php
include 'EpiCurl.php';
include 'EpiOAuth.php';
include 'EpiTwitter.php';
include 'secret.php';
include("db.php");


$Twitter = new EpiTwitter($consumerKey, $consumerSecret);

if(isset($_GET['oauth_token']) || (isset($_COOKIE['oauth_token']) && isset($_COOKIE['oauth_token_secret'])))
{
// user accepted access
	if( !isset($_COOKIE['oauth_token']) || !isset($_COOKIE['oauth_token_secret']) )
	{
		// user comes from twitter
	    $Twitter->setToken($_GET['oauth_token']);
		$token = $Twitter->getAccessToken();
		setcookie('oauth_token', $token->oauth_token);
		setcookie('oauth_token_secret', $token->oauth_token_secret);
		$Twitter->setToken($token->oauth_token, $token->oauth_token_secret);

	}
	else
	{
	 // user switched pages and came back or got here directly, stilled logged in
	 $Twitter->setToken($_COOKIE['oauth_token'],$_COOKIE['oauth_token_secret']);
	 $user= $Twitter->get_accountVerify_credentials();
	
	
	$oauth_token=$_COOKIE['oauth_token'];
	$oauth_token_secret=$_COOKIE['oauth_token_secret'];
	// Storing token keys
	//$sql=mysql_query("update {$prefix}users SET oauth_token='$oauth_token',oauth_token_secret='$oauth_token_secret' where username='$user_session'");
	
	header('Location: /'); //Redirecting Page
	}

    

}
elseif(isset($_GET['denied']))
{
 // user denied access
 echo 'You must sign in through twitter first';
}
else
{
// user not logged in
 echo 'You are not logged in';
}

?>

