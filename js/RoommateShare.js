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
    body = $('body'),
    siteWindow = $(window),
    container = $('.Middle'),
    leftContainer = $('#FindHolder'),
    rightContainer = $('#MapHolder'),
    page_properties = {
        static:{
            width:screen.width,
            height:screen.height
        },
        floating:{
            width:screen.width,
            height:screen.height
        }
    },
    RoommateShareCache = {};
    module.Init = function() {
        body.addClass('loaded');
        siteWindow.resize(function() {
            container.css({
                'height': (siteWindow.height() - 91) + 'px'
            });
            page_properties.floating.width = siteWindow.width(),
            page_properties.floating.height = siteWindow.height();
        });
        siteWindow.trigger('resize');
        $('#SearchBtnHolder').bind('click', function() {
            leftContainer.css('width','40%');
            rightContainer.css('width','60%');
            container.addClass('afterAction');
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
    module.PageProperties = function(){
        return page_properties;
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
            //hide_elements();
            });
        google.maps.event.addListener(RoommateShareCache.map, 'dragend', function() {
            //show_elements();
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