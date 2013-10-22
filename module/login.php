<div id="logins" class="absolute zindex1">
    <div class="relative">
        <div class="loginDiv" id="loginDiv" onclick="login();">
            LOGIN
        </div>
    </div>
</div>
<div id="loginPopup" class="login absolute zindex1 fullwidth hide fullheight">
    <div class="relative">
        <div id="loginBg">
            <div class="marginauto whitebg" id="loginContents">
                <div class="relative">
                    <div class="loginHeader padding10">
                        Login to Roommate Share
                    </div>
                    <div class="loginBody padding20">
                        <?php
                        if (!$fbuser) {
                            ?>
                            <a href = "/login/facebook.php">
                                <div class = "fblogin">
                                    <img src = "/images/fblogin.png" alt = "Login" />
                                </div>
                                <div class="clearboth clear"></div>
                            </a>
                            <?php
                        }
                        ?>
                    </div>
                    <div class="closePopup absolute" onclick="close_popups();"></div>
                    <div class="clearboth clear"></div>
                </div>
            </div>
        </div>
    </div>
</div>