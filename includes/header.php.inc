<div id='header'>
    <header>
        <div class='rel'>
            <div class='fl'>
                <img id='siteLogo' src='/images/RoommateShare.png' alt='Roommate Share Logo' />
            </div>
            <div class="fr">
                <div class="rel">
                    <?php
                    if (!isset($userloggedin) || !$userloggedin || $userloggedin == "") {
                        ?>
                        <div class="loginBox whitebg">
                            <div class="fl red" style="padding: 0px 10px; margin-top: 9px;">
                                <a href="#!login">Sign up</a> / <a href="#!login">Login</a>
                            </div>
                            <div class="fl loginImgContainer">
                                <div class="loginImg" style="">

                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <?php
                    } else {
                        $logout = "";
                        if ($fbuser) {
                            $logout = "/login/fblogout.php";
                        } else {
                            $logout = "/login/logout.php";
                        }
                        ?>
                        <div class="loginBox m10 whitebg afterLogin rel">
                            <div class="rel">
                                <div class="fl white" style="padding: 0px 10px; margin-top: 9px;">
                                    Hi <span class="username"></span>
                                </div>
                                <div class="fl loginImgContainer">
                                    <div id="loginImg" class="loginImg"></div>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="clear"></div>
                            <div class="profileOptions abs r0">
                                <div class="innerBox rel p10" style="border: 2px solid #fff;">
                                    <ul>
                                        <li>
                                            <a href="javascript:void(0);">
                                                <div class="optionBlock">
                                                    <span class="fl profile profile_settings"></span>
                                                    <span class="fr">Profile</span>
                                                    <div class="clear"></div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);">
                                                <div class="optionBlock">
                                                    <span class="fl settings profile_settings"></span>
                                                    <span class="fr">Preferences</span>
                                                    <div class="clear"></div>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="<?php echo $logout; ?>">
                                                <div class="optionBlock">
                                                    <span class="fl logout profile_settings"></span>
                                                    <span class="fr">Logout</span>
                                                    <div class="clear"></div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                    <div class="arrow_top abs">
                                        <div class="arrow_white_top"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <?php
                    }
                    ?>
                </div>
            </div>
            <div class='clear'></div>
        </div>
    </header>
</div>