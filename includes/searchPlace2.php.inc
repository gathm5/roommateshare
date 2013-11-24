<div id='search_box' class='rel p10 abs_left_n50'>
    <div class='searchHolder'>
        <form id='searchForm' method='post'>
            <div class='searchParent up rel'>
                <input type='hidden' value='SFO' id='SearchPlaceHidden' />
                <input type='text' x-webkit-speech id='SearchMyPlace' autocomplete='off' class='search floatleft' value='' placeholder='Where are you moving?' />
                <div id='autoFinder' class='fr autoFinder'><div class='locate_me_msg absolute hide'>Locate me</div></div>
                <div class='clearboth'></div>
            </div>
            <div class='down rel'>
                <table id='buttonTriggers' class='w100'>
                    <tr>
                        <td style='padding-right: 3.5px;'>
                            <div id='RentListTrigger' class='searchTrigger blackBtn centertext'>
                                <span class='white'>Listings</span>
                            </div>
                            <div class='abs explainBtn'>
                                <div class='abs arrow_up_black'></div>
                                <div class='rel'>
                                    Find rooms, roommates
                                </div>
                            </div>
                        </td>
                        <td style='padding: 0px 3.5px;'>
                            <div id='ExploreTrigger' class='searchTrigger orangeBtn centertext'>
                                <span class='white'>Explore</span>
                            </div>
                            <div class='abs explainBtn'>
                                <div class='abs arrow_up_black'></div>
                                <div class='rel'>
                                    Explore the neighborhood
                                </div>
                            </div>
                        </td>
                        <td style='padding-left: 3.5px;'>
                            <div id='SocialTrigger' class='searchTrigger blueBtn centertext'>
                                <span class='white'>Connect</span>
                            </div>
                            <div class='abs explainBtn'>
                                <div class='abs arrow_up_black'></div>
                                <div class='rel'>
                                    Social connection using facebook
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
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