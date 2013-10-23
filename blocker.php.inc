<!doctype html>
<html>
    <head>
        <title>Roommate Share</title>
        <meta name="description" content="Roommate Share provides the best tool for students" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalabale=false" />
        <meta name="fragment" content="!" />
        <link href='http://fonts.googleapis.com/css?family=Lato:100' rel='stylesheet' type='text/css'>
        <style>
            *{
                color: #777777;
                font-family: 'Lato', sans-serif;
                outline: none;
            }
            html, body{
                width: 100%;
                padding: 0;
                margin: 0;
            }
            *::-moz-focus-inner {
                border: 0;
            }
            h2{
                padding: 0;
                margin: 0;
                text-align: center;
                font-weight: normal; 
            }
            div.login{
                margin: 80px auto;
                width: 500px;
            }
            div.login div{
                text-align: left;
                padding: 10px;
                width: 503px;
            }
            input{
                padding: 10px;
                width: 481px;
                font-size: 16px;
                color: #000;
                border-width: 1px;
                border-style: solid;
                border-color: #ccc;
                -webkit-appearance: none;
                -webkit-border-radius:0; 
                border-radius:0;
            }
            input[type='submit']{
                width: 503px;
                cursor: pointer;
                transition: all 0.2s;
                border-radius: 0;
                -webkit-border-radius: 0;
                background: #eee;
            }
            input[type='submit']:focus, input[type='submit']:hover{
                background: #bbb;
                color: #fff;
                box-shadow: 0 0 10px #999 inset;
            }
        </style>
    </head>
    <body>
        <div class='login'>
            <form action="" method="post" name="login">
                <div>
                    <h2 style="float: left">RoommateShare.com</h2>
                    <h2 style="float: right">Administrators Login</h2>
                    <div style="clear: both; padding: 0; margin: 0; height: 0;"></div>
                </div>
                <div>
                    <input type="text" autofocus="true" autocapitalize="off" placeholder="username" name="username" />
                </div>
                <div>
                    <input type="password" placeholder="password" name="password" />
                </div>
                <div>
                    <input type="submit" value="Login" name="submit" />
                </div>
            </form>
        </div>
        <?php include 'module/ga.php'; ?>
    </body>
</html>