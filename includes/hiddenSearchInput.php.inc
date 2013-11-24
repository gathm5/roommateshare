<div id='ShowAfterSearch' class='searchParent up rel'>
    <script type='text/javascript'>
        if (document.createElement('input').webkitSpeech !== undefined) {
            document.write("<input type='text' x-webkit-speech id='SearchMyPlaceV2' style='width: 80%;' autocomplete='off' class='search floatleft' value='' placeholder='Where are you moving?' />");
        }
        else{
            document.write("<input type='text' id='SearchMyPlaceV2' style='width: 80%;' autocomplete='off' class='search floatleft' value='' placeholder='Where are you moving?' />");
        }
        if(navigator.geolocation){
            document.write("<div id='autoFinderV2' class='fr autoFinder'><div class='locate_me_msg absolute hide'>Locate me</div></div>");
        }
    </script>
    <div class='clearboth'></div>
</div>