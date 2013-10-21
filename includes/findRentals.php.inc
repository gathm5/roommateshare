<div class="rel fullheight">
    <div id="list-view" class="rel fullheight whitebg shadow z1">
        <div>
            <div class="listHeader rel" id="listHeader">
                <div class="p10">
                    <div class="rel">
                        <div class="resultLink fl w49 blue listSelected transition2">
                            Rentals
                        </div>
                        <div class="resultLink fr w49 red transition2">
                            Favorites
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
            <div class="rent_lists rel">
                <div class="p10">
                    <div class="findBG">
                        <div class="texture p10">
                            <ul>
                                {{#rentals}}
                                <li class="rentDivLi">
                                    <div class="rentDiv p5 transition5">
                                        <div class="rel">
                                            <div>
                                                <div class="fl"><span class="small blue">Location:</span> <span class="red">{{name}}</span></div>
                                                <div class="fr"><span class="blue">{{price}}</span></div>
                                                <div class="clear"></div>
                                            </div>
                                            <div>
                                                <div class="fl small justify">{{desc}}</div>
                                                <div class="fr">
                                                    <div class="rental_img">
                                                        <img src="{{img_link}}" alt="" width="50" height="50" />
                                                    </div>
                                                </div>
                                                <div class="clear"></div>
                                                <div class="fl addToFav"></div>
                                                <div onclick="expandeMe(event);" class="fl">View Post</div>
                                                <div class="clear"></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                {{/rentals}}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div id="listFooter" class="hide">
                <div class="rel">
                    <div class="list_footer p10">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>