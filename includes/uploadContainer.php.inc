<html>
    <head>
        <script>
            function init() {
                document.getElementById("file_upload_form").onsubmit=function() {
                    document.getElementById("file_upload_form").target = "upload_target";
                    document.getElementById("upload_target").onload = uploadDone; //This function should be called when the iframe has compleated loading
                    // That will happen when the file is completely uploaded and the server has returned the data we need.
                }
            }

            function uploadDone() { //Function will be called when iframe is loaded
                var ret = frames['upload_target'].document.getElementsByTagName("body")[0].innerHTML;
                var data = eval("("+ret+")"); //Parse JSON // Read the below explanations before passing judgment on me
	
                if(data.success) { //This part happens when the image gets uploaded.
                    document.getElementById("image_details").innerHTML = "<img src='image_uploads/" + data.file_name + "' /><br />Size: " + data.size + " KB";
                }
                else if(data.failure) { //Upload failed - show user the reason.
                    alert("Upload Failed: " + data.failure);
                }	
            }    
        </script> 
    </head>
    <body>
        <form id="file_upload_form" method="post" enctype="multipart/form-data" action="upload.php">
            <input name="file" id="file" size="27" type="file" /><br />
            <input type="submit" name="action" value="Upload Image" /><br />
            <iframe id="upload_target" name="upload_target" src="" style="width:100px;height:100px;border:1px solid #ccc;"></iframe>
        </form>
        <div id="image_details"></div>
    </body>
</html>