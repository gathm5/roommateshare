<!doctype html>
<html>
    <head>
        <title>Roommate Share | finding the right place</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalabale=false'>
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='fragment' content='!' />
        <link href='https://fonts.googleapis.com/css?family=Expletus+Sans' rel='stylesheet' type='text/css'>
        <link href='css/siteprop.css' rel='stylesheet' type='text/css'>
        <link href='css/roommateshare.css' rel='stylesheet' type='text/css'>
        <script src='//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>
    </head>
    <body>
        <div id='RoommateShareBody' class='rel h100'>
            <div class='Top rel z1'>
                <?php include_once 'includes/header.php.inc'; ?>
            </div>
            <div class='Middle rel h100'>
                <div id='FindHolder' class='fl rel h100 transition3'>

                </div>
                <div id='MapHolder' class='fr rel h100 transition3'>
                    <div id='RoommateMap' class='w100 h100'>
                        
                    </div>
                    <div id='searchBoxContainer' class='abs z1 t0' style='left:50%;'>
                        <?php
                            include_once 'includes/searchPlace.php.inc';
                        ?>
                    </div>
                </div>
                <div class='clear'></div>
            </div>
            <div class='Bottom'></div>
            <div class='ScreenPopup hide translucent abs t0 l0 w100 h100'>
                <div class='rel'>

                </div>
            </div>
        </div>
        <script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBbW2hMLYX-YkJ4CqwObIuA1CynCoJ3tno&sensor=false' type='text/javascript'></script>
        <script src='/js/richmarker-compiled.js' type='text/javascript'></script>
        <script src='/js/mustache.js' type='text/javascript'></script>
        <script type='text/javascript' src='js/RoommateShare.js'></script>
        <script type='text/javascript'>
            RoommateShare.Init();
        </script>
    </body>
</html>