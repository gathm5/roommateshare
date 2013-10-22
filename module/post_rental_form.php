<form action="" method="post" novalidate>
    <div class="relative padding20">
        <div class="relative">
            <div class="leftSide floatleft w49p relative">
                <div class="relative padLR5">
                    <div class="formBlock">
                        <label class="floatleft" for="address">Address</label>
                        <div class="clearboth"></div>
                        <input class="floatleft largeBox" type="text" name="address" id="address" />
                        <div class="clearboth"></div>
                    </div>
                    <div class="clearboth"></div>
                    <div class="formBlock">
                        <div class="floatleft">
                            <label class="floatleft" for="cityName">City</label>
                            <div class="clearboth"></div>
                            <input class="floatleft largeBox" style="width: 150px;" type="text" name="cityName" id="cityName" />
                            <div class="clearboth"></div>
                        </div>
                        <div class="floatleft" style="margin-left: 10px;">
                            <label class="floatleft" for="stateName">State</label>
                            <div class="clearboth"></div>
                            <input class="floatleft largeBox" style="width: 177px;" type="text" name="stateName" id="stateName" />
                            <div class="clearboth"></div>
                        </div>
                        <div class="clearboth"></div>
                    </div>
                    <div class="clearboth"></div>
                    <div class="formBlock">
                        <label class="floatleft" for="zipcode">Zipcode</label>
                        <div class="clearboth"></div>
                        <input class="floatleft smallBox" type="text" name="zipcode" id="zipcode" />
                        <div class="clearboth"></div>
                    </div>
                    <div class="clearboth"></div>
                    <div class="formBlock">
                        <div class="floatleft">
                            <input class="floatleft rentType" checked="checked" type="radio" name="rentType" id="typeHouse" />
                            <label class="floatleft" for="typeHouse">House</label>
                            <div class="clearboth"></div>
                        </div>
                        <div class="floatleft" style="margin-left: 20px;">
                            <input class="floatleft rentType" type="radio" name="rentType" id="typeApartment" />
                            <label class="floatleft" for="typeApartment">Apartment</label>
                            <div class="clearboth"></div>
                        </div>
                        <div class="floatleft" style="margin-left: 20px;">
                            <input class="floatleft rentType" type="radio" name="rentType" id="typeBusiness" />
                            <label class="floatleft" for="typeBusiness">Business</label>
                            <div class="clearboth"></div>
                        </div>
                        <div class="clearboth"></div>
                    </div>
                    <div class="clearboth"></div>
                </div>
            </div>
            <div class="sleakDivider"></div>
            <div class="rightSide floatleft w49p relative">
                <div class="relative padLR5" style="padding-left: 20px;">
                    <div class="formBlock">
                        <div class="relative floatleft" style="width: 200px; height:85px;">
                            <label class="floatleft" for="rentLowerVal">Rent price</label>
                            <input class="floatright smallBox" onkeypress="return numbersOnly(event)" type="text" name="rentLowerVal" id="rentLowerVal" />
                            <div class="clearboth"></div>
                            <div class="showIfFlexible hide">
                                <div class="floatright" 
                                     style="padding: 5px 0; margin-right: 40px; width: 14px; height: 20px; background: url('/images/toPrice.png') no-repeat scroll 0 5px transparent;"></div>
                                <div class="clearboth"></div>
                                <input class="floatright smallBox" type="text" name="rentHigherVal" id="rentHigherVal" />
                                <div class="clearboth"></div>
                            </div>
                        </div>
                        <div class="clearboth"></div>
                    </div>
                    <div class="formBlock">
                        <label class="floatleft" for="availDate">Available date</label>
                        <input class="floatleft smallBox" style="margin-left: 10px;" type="text" name="availDate" id="availDate" />
                        <div class="clearboth"></div>
                    </div>
                    <div class="clearboth"></div>
                </div>
            </div>
            <div class="clearboth"></div>
        </div>
        <!-- Contact Block -->
        <?php
        include 'post_contact.php';
        ?>
        <div class="absolute hide" id="post_autocompleter"></div>
    </div>
</form>