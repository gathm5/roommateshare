<div id = "searchContainer" class = "searchContainer absolute z1">
    <div class = "relative">
        <div class = "floatleft fullwidth">
            <?php
            $cityname = "SFO";
            if (isset($session)) {
                $cityname = $session->getLocation();
            }
            ?>
            <form id="searchForm" action="" method="post">
                <div class="searchBox marginauto relative abs">
                    <div class="relative padding15 boxshadow-grey">
                        <div class="floatleft searchParent relative" style="width: 62.636%;">
                            <input type="text" id="SearchMyPlace" style="width: 84%;" autocomplete="off" class="search floatleft" value="" placeholder="Where are you moving?" />
                            <input type="hidden" value="<?php echo $cityname; ?>" id="SearchPlaceHidden" />
                            <script type="text/javascript">
                                if(navigator.geolocation){
                                    document.write('<div id="autoFinder" class="floatright autoFinder" style="width: 8%;"><div class="absolute hide" id="locate_me_msg">Locate me</div></div>');
                                }
                            </script>
                            <div class="clearboth"></div>
                            <div id="suggestionBox" class="hide suggestionBox absolute fullwidth">
                                <div class="padding10">
                                    <ul id="suggestionsUL">

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="SearchBtnHolder" class="blackBtn floatright" style="width: 34.303%; text-align: center;">
                            <span class="white">Find Roommates</span>
                        </div>
                        <button id="StartSearchBtn" class="blueBtn floatright hide" type="submit"></button>
                        <div class="clearboth"></div>
                        <div class="floatleft fullwidth">
                            <div class="relative paddingtop20 centertext">
                                <div class="w50p floatleft hide">
                                    <a href="javascript:void(0);" class="roommateLink">Find Roommates</a>
                                </div>
                                <div class="floatright postRentMsg" style=";">
                                    <a href="javascript:PostAd();" class="roommateLink">Post a Rental</a>
                                </div>
                                <div class="clearboth"></div>
                            </div>
                        </div>
                        <div class="clearboth"></div>
                    </div>
                </div>
            </form>
        </div>
        <div class="clear"></div>
    </div>
</div>