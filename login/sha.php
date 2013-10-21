<?php
if(isset($_POST['sha']))
    $sha = sha1($_POST['sha']);
?>
<!DOCTYPE html>
<html>
    <head>
        
    </head>
    <body>
        <form method="post" action="">
            <input type="text" name="sha" />
            <br /><?php echo $sha; ?>
        </form>
    </body>
</html>