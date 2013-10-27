<div id='search_box' class='rel p10 abs_left_n50'>
    <div class='searchHolder'>
        <form id='searchForm' method='post' action='#!find'>
            <div class='searchParent up rel'>
                <input type='hidden' value='SFO' id='SearchPlaceHidden' />
                <script type='text/javascript'>
                    if (document.createElement('input').webkitSpeech !== undefined) {
                        document.write("<input type='text' x-webkit-speech id='SearchMyPlace' style='width: 86%;' autocomplete='off' class='search floatleft' value='' placeholder='Where are you moving?' />");
                    }
                    else{
                        document.write("<input type='text' id='SearchMyPlace' style='width: 86%;' autocomplete='off' class='search floatleft' value='' placeholder='Where are you moving?' />");
                    }
                    if(navigator.geolocation){
                        document.write("<div id='autoFinder' class='fr autoFinder'><div class='absolute hide' id='locate_me_msg'>Locate me</div></div>");
                    }
                </script>
                <div class='clearboth'></div>
                <div id='suggestionBox' class='hide suggestionBox abs fullwidth'>
                    <div class='p10'>
                        <ul id='suggestionsUL'>

                        </ul>
                    </div>
                </div>
            </div>
            <div class='down rel'>
                <div id='SearchBtnHolder' class='blackBtn fl centertext w49' onclick='window.location="#!find"'>
                    <span class='white'>Find Roommates</span>
                </div>
                <?php
                if (!isset($userloggedin) || !$userloggedin || $userloggedin == '')
                    $onclick = 'window.location="#!login"';
                else
                    $onclick = 'window.location="#!post"';
                ?>
                <div id='startPostHolder' class='orangeBtn fr centertext w49' style='' onclick='<?php echo $onclick; ?>'>
                    <span class='white'>Post an Ad</span>
                </div>
                <div class='clear'></div>
                <button id='StartSearchBtn' class='blueBtn floatright hide' type='submit'></button>
            </div>
            <div class='clear'></div>
        </form>
    </div>
    <div class='abs hide t0 z1' id='typoError'>
        <div class='rel'>
            <div class='whitebg typoError'>
                Please enter city name, area name or zip code
            </div>
            <div class='abs btmBigArr'></div>
        </div>
    </div>
</div>