(function() {
    var o = $({});
    $.subscribe = function() {
        o.on.apply(o, arguments);
    };
    $.unsubscribe = function() {
        o.off.apply(o, arguments);
    };
    $.publish = function() {
        o.trigger.apply(o, arguments);
    };
}());
var RoommateShare = ((function($) {
    var module = {},
    selectedCity = '',
    body = $('body'),
    siteWindow = $(window),
    container = $('.Middle'),
    leftContainer = $('#FindHolder'),
    rightContainer = $('#MapHolder'),
    page_properties = {
        static:{
            width:screen.width,
            height:screen.height,
            headerHeight:$('.Top').height()
        },
        floating:{
            width:screen.width,
            height:screen.height
        }
    },
    RoommateShareCache = {
        Rentals:[],
        AroundMe:[],
        cache: {
            SearchResult:[]
        },
        Markers: [],
        FB_friends: null,
        FB_groups:{
            city:null,
            state:null
        },
        map: null,
        city: null,
        myplace: {
            lat: null,
            lng: null,
            marker: null
        },
        user: {
            id: null,
            type: null
        }
    };
    module.Init = function(ip_location) {
        body.addClass('loaded');
        siteWindow.resize(function() {
            container.css({
                'height': (siteWindow.height() - page_properties.static.headerHeight) + 'px'
            });
            $('#ListHolder').css('width', (siteWindow.width() * 0.4) + 'px')
            page_properties.floating.width = siteWindow.width(),
            page_properties.floating.height = siteWindow.height();
        });
        siteWindow.trigger('resize');
        siteWindow.bind('hashchange',function() {
            $.publish('urlchanged', document.location.hash);
        });
        $.subscribe('urlchanged', function(e, hashval) {
            var mapLinks = {
                'login':module.Login,
                'register':module.Register,
                'post':module.PostRental,
                'find':module.FindRental
            };
            var hash = hashval.replace('#!','');
            if(mapLinks[hash])
                mapLinks[hash].call(this);            
        });
        $('#SearchMyPlace').focus(function(){
            $('.searchBox').addClass('searchBoxFocused');
        }).blur(function(){
            $('.searchBox').removeClass('searchBoxFocused');
        }).keyup(function(e){
            switch (e.keyCode) {
                case 37: //left
                case 39: //right
                //case 8:  //Backspace
                case 9: //Tab
                //case 46: //del
                case 190: //.
                case 110: //.
                    return false;
                case 38:
                case 40:
                    $('#suggestionsUL li a:first').focus();
                    return false;
            }
            var word = $.trim($(this).val());
            if(word.length > 3){
                SearchFromCache(word, ShowSuggestion);
            }
            else
                module.Clean();
        });
        body.bind('click', function(e){
            var current = $(e.target);
            if(current.attr('id') === 'SearchMyPlace' || current === $('#suggestionBox'))
                return;
            $('#suggestionBox:visible').hide();
        });
        $('#searchForm').submit(function(e){
            geocode($('#SearchMyPlace').val());
            $.getJSON('/service/getRentals.php', function(data){
                $.get('/templates/find.html', function(html){
                    var list_html = Mustache.to_html(html, data);
                    $('#ListHolder').html(list_html);
                    leftContainer.css({
                        'width':'40%',
                        'transform':'translateY(0%)'
                    });
                    rightContainer.css('width','60%');
                    container.addClass('afterAction'); 
                    setTimeout(function(){
                        google.maps.event.trigger(RoommateShareCache.map, "resize");
                        if(RoommateShareCache.myplace.marker)
                            RoommateShareCache.map.setCenter(new google.maps.LatLng(RoommateShareCache.myplace.lat, RoommateShareCache.myplace.lng));
                    }, 1000);
                });
            });
            return false;
        });
        $('#SearchBtnHolder').bind('click', function() {
            $('#searchForm').trigger('submit');
        });
        rs_map_load(ip_location);
    };
    module.FindRental = function() {
        console.log('Find Rentals')
    };
    module.Login = function() {
        $.get('/templates/login.html', function(html){
            $('#loginPopup').html(html);
            
        });
    };
    module.Register = function() {
        console.log('Registration');
    };
    module.PostRental = function() {
        console.log('Post Rentals')
    };
    module.Clean = function() {
        
    };
    module.Pins = {
        Open:function(elem, index, id){
            var curObj = null;
            for(var i=0; i<RoommateShareCache.AroundMe[index].length; i++){
                if(RoommateShareCache.AroundMe[index][i].id === id)
                    curObj = RoommateShareCache.AroundMe[index][i];
            }
            if(!curObj)
                return false;
            var category = (curObj.categories[0] !== 'undefined' && curObj.categories[0] ? curObj.categories[0].shortName : index);
            var address = "";
            if(curObj.location && curObj.location.address)
                address += curObj.location.address + ', ';
            address += curObj.location.city + " " + curObj.location.state;
        }
    };
    module.setCity = function(city) {
        selectedCity = city;
        cityPreferred(city);
    };
    module.PageProperties = function(){
        return page_properties;
    };
    var cityPreferred = function(city){
        $('#SearchMyPlace').val(city);
        module.Clean();
        findMyPlace();
        $('#searchForm').trigger('submit');
    };
    var ShowSuggestion = function(data){
        if(!data)
            return false;
        var sugg_arr = data;
        var $list = $('#suggestionBox ul');
        $list.html('');
        if(sugg_arr.length === 0){
            module.Clean();
            return false;
        }
        for(var i=0; i<sugg_arr.length; i++){
            var city = $.trim(sugg_arr[i].split(',')[0]).toLowerCase();
            //var template = '<li><a href="/cities/' + city + '.html">' + sugg_arr[i] + '...</a></li>';
            // Changed Logic
            var template = '<li><a data-city="' + city + '" href=\'javascript:RoommateShare.setCity("' + city + '")\'>' + sugg_arr[i] + '</a></li>';
            if(city.indexOf('|state|')>-1){
                var ignore = /\|state\|/gi;
                template = '<li><a href="/states/' + city.replace(ignore, '').replace(/\s/, "-") + '.html">' + sugg_arr[i].replace(ignore, '') + '...</a></li>';
            }
            $list.append(template);
        }
        $('#suggestionBox').show();
    };
    var SearchFromCache = function(match, callback){
        if(!match)
            return false;
        match = match.toLowerCase();
        var key = match.slice(0, 3);
        var shortlist = null;
        var findMatch = function(){
            var list = [];
            for(var i=0; i<shortlist.length; i++){
                if((shortlist[i].toLowerCase()).indexOf(match) >= 0)
                    list.push(shortlist[i]);
            }
            if(callback)
                callback(list);
        };
        for(var i=0; i<RoommateShareCache.cache.SearchResult.length; i++){
            if(key === RoommateShareCache.cache.SearchResult[i].key)
                shortlist = RoommateShareCache.cache.SearchResult[i].value;
        }
        if(shortlist != null){
            findMatch();
        }
        else{
            $.post('/logic/city_list.php', {
                findCity: true, 
                param: key
            }, function(data){
                data = $.parseJSON(data);
                RoommateShareCache.cache.SearchResult.push({
                    key: key,
                    value: data
                });
                shortlist = data;
                //StoreLocal(RoommateShareCache);
                findMatch();
            });
        }
    };
    var findMyPlace = function(){
        var cityDiv = document.getElementById('SearchMyPlace');
        var city = cityDiv.value;
        if($.trim(city) === "" || $.trim(city).length<=3){
            $('.searchParent').addClass('alertBox');
            $('#typoError').removeClass('hide').addClass('show');
            setTimeout(function(){
                $('#typoError').removeClass('show').addClass('hide');
            }, 2000);
            return false;
        }
        $('.searchParent').removeClass('alertBox');
        window.location = '#!find/'+city.replace(/\s/g, '+');
        module.Clean();
        cityDiv.blur();
        return false;
    };
    var geocode = function(location){
        var address = location || $.trim($('#SearchMyPlace').val());
        if(!address || address === "" || address.length === 0)
            return false;
        try{
            $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + address.replace(' ','+') + '&sensor=false', function(data){                   
                if(typeof data.results === 'undefined' || !data.results || data.results.length === 0){
                    return false;
                }
                var latlng = (data.results[0].geometry.location);
                RoommateShareCache.myplace.address = {
                    city: data.results[0].address_components[2],
                    address: data.results[0].formatted_address
                }
                RoommateShareCache.myplace.lat = latlng.lat;
                RoommateShareCache.myplace.lng = latlng.lng;
                RoommateShareCache.city = data.results[0].address_components[2];
                $.post('/logic/serve-user.php', {
                    'set_location':address
                });
                PlaceMe();
            });
        }catch(e){
        }
    };
    var PlaceMe = function(){
        var position = new google.maps.LatLng(RoommateShareCache.myplace.lat, RoommateShareCache.myplace.lng);
        var div = '<div class="mymarker"></div>';
        if(!PlaceMe.zoomLevel)
            PlaceMe.zoomLevel = 7;
        else
            PlaceMe.zoomLevel = 12;
        if(RoommateShareCache.myplace.marker)
            RoommateShareCache.myplace.marker.setMap(null);
        RoommateShareCache.map.panTo(position);
        RoommateShareCache.map.setZoom(PlaceMe.zoomLevel);
        var mkr = new RichMarker({
            map : RoommateShareCache.map,
            position : position,
            draggable : false,
            flat : true,
            anchor : RichMarkerPosition.BOTTOM,
            content : div
        });
        RoommateShareCache.myplace.marker = mkr;
        loadnearby();
    }
    var loadnearby = function(){
        $.getJSON('/logic/getPlacesApi.php', {
            get_places:true,
            latlng: RoommateShareCache.myplace.lat + ',' + RoommateShareCache.myplace.lng,
            lat: RoommateShareCache.myplace.lat, 
            lng: RoommateShareCache.myplace.lng
        }, function(data){
            if(data.length>0){
                RoommateShareCache.cache.AroundMe = data;
                for(var i=0; i<RoommateShareCache.Markers.length; i++){
                    if(RoommateShareCache.Markers[i].marker)
                        RoommateShareCache.Markers[i].marker.setMap(null);
                }
                RoommateShareCache.AroundMe.length = 0;
                RoommateShareCache.Markers.length = 0;
                var counter = 8;
                var pins = ['food', 'atm', 'movie', 'bar'];
                var checkcount = 0;
                for(var i=0;i<data.length;i++){
                    var results = data[i].response.venues;
                    RoommateShareCache.AroundMe[pins[i]] = results;
                    if(counter>results.length)
                        counter = results.length;
                    for(var j=0; j<counter; j++){
                        checkcount+=1;
                        var curObj = results[j];
                        var clickfunction = "RoommateShare.Pins.Open(this, '" + pins[i] + "', '" + curObj.id + "');";
                        var className = "pin_" + pins[i];
                        var aroundObject = {
                            id: curObj.id,
                            name: curObj.name,
                            latlng: {
                                lat: curObj.location.lat,
                                lng: curObj.location.lng
                            },
                            marker: new RichMarker({
                                position: new google.maps.LatLng(curObj.location.lat, curObj.location.lng),
                                map: RoommateShareCache.map,
                                draggable: false,
                                flat: true,
                                content: '<div class="around ' + className + '"onclick="' + clickfunction + '"></div>'
                            }),
                            instance: curObj
                        };
                        RoommateShareCache.Markers.push(aroundObject);
                    }
                }
            }
        });
    };
    var rs_map_load = function(ip_location) {
        var minZoom = 3;
        google.maps.visualRefresh = true;
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(37.09024, -95.71289),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl:true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT,
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            streetViewControl: true,
            streetViewControlOptions:{
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            styles: [ 
            {
                featureType: "poi",
                elementType: "labels",
                stylers:[{/*visibility: "off"*/}]
            }],
            minZoom: minZoom
        };
        RoommateShareCache.map = new google.maps.Map(document.getElementById('RoommateMap'), mapOptions);
        google.maps.event.addListener(RoommateShareCache.map, 'tilesloaded', function() {
            //loader.postload();
            });
        google.maps.event.addListener(RoommateShareCache.map, 'dragstart', function() {
            rightContainer.addClass('hideElements');
        });
        google.maps.event.addListener(RoommateShareCache.map, 'dragend', function() {
            rightContainer.removeClass('hideElements');
        });
        google.maps.event.addListener(RoommateShareCache.map, 'zoom_changed', function() {
            var zoomLevel = RoommateShareCache.map.getZoom();
        //console.log('Zoom: ' + zoomLevel);
        });
        var thePanorama = RoommateShareCache.map.getStreetView();

        google.maps.event.addListener(thePanorama, 'visible_changed', function() {
            if (thePanorama.getVisible()) {
                $('#rightHolder').addClass('streetView');
            } else {
                $('#rightHolder').removeClass('streetView');
            }

        });
        if(ip_location)
            geocode(ip_location);
    };
    return module;
})(jQuery));