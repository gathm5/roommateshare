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
        cache:{
            SearchResult:[]
        }
    };
    module.Init = function() {
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
                });
            });
            return false;
        });
        $('#SearchBtnHolder').bind('click', function() {
            $('#searchForm').trigger('submit');
        });
        rs_map_load();
    };
    module.FindRental = function() {
	
    };
    module.Login = function() {
	
    };
    module.Register = function() {
	
    };
    module.PostRental = function() {
	
    };
    module.Clean = function() {
        
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
    var rs_map_load = function() {
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
    }
    return module;
})(jQuery));