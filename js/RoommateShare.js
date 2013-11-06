/*
 *	Author & Co-Founder: Gautham Stalin
 */
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
    $.fn.serializeObject = function(){
        var o = {}, a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
}());
var RoommateShare = ((function($) {
    var module = {},
    geocoder,
    selectedCity = '',
    body = $('body'),
    siteWindow = $(window),
    container = $('.Middle'),
    leftContainer = $('#FindHolder'),
    rightContainer = $('#MapHolder'),
    ScreenPopup = $('#ScreenPopup'),
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
        Rentals:{
            pins:[]
        },
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
            type: null,
            isActive: false
        }
    };
    module.Init = function(ip_location) {
        setTimeout(function(){
            body.addClass('loaded');
        }, 2000);
        siteWindow.resize(function() {
            container.css({
                'height': (siteWindow.height() - page_properties.static.headerHeight) + 'px'
            });
            leftContainer.css({
                'height': (siteWindow.height() - page_properties.static.headerHeight - 55 - 51) + 'px'
            });
            $('#ListHolder, #rental_detailed_view').css({'width': (siteWindow.width() * 0.4) + 'px', 'margin-top': 51 + 'px'});
            page_properties.floating.width = siteWindow.width(),
            page_properties.floating.height = siteWindow.height();
        });
        siteWindow.trigger('resize');
        
        siteWindow.bind('hashchange',function () {
            $.publish('URLCHANGED', document.location.hash);
        });
        
        body.on('click', 'a.no_link', function (e) {
            e.preventDefault();
        });
		
        body.on('click', 'a.open_desc, div.priceTag', function (e) {
            var current = $(this).attr('data-adid'), itr = 0, rentals, captured;
			
            // CHANGE THIS TO AN AJAX CALL LATER
            if( RoommateShareCache.Rentals.Rentals && RoommateShareCache.Rentals.Rentals.length>0 ) {
                rentals = RoommateShareCache.Rentals.Rentals;
                for( itr = 0; itr < rentals.length; itr += 1 ) {
                    if( rentals[itr].data.adid === current) {
                        captured = rentals[itr].data;
                        break;
                    }
                }
                if( captured ) {
                    console.log(captured);
                    if( captured.imgArr && captured.imgArr.length > 1 ) {
                        captured.imgArr.splice(1);
                    }
                    module.ViewDetails(captured);
                }				
            }
            // END CHANGE THIS TO AN AJAX CALL LATER
			
            e.preventDefault();
        });
        /*
        window.onpopstate = function(event) {
            if(event.state) console.log(event.state);
            $.publish('URLCHANGED', document.location.hash);
        };
        */
        $.subscribe('URLCHANGED', function(e, hashval) {
            var mapLinks = {
                'login':module.Login,
                'register':module.Register,
                'post':module.PostRental,
                'find':module.FindRental
            };
            var hash = hashval.replace('#!','');
            module.Clean();
            if(mapLinks[hash])
                mapLinks[hash].call(this);            
        });
        $.subscribe('NEWRENTALS', function(e){
            var pins = RoommateShareCache.Rentals.pins, mkr, geo, position, template = '<div class="rental_house_pin"><div class="pinHighRent">{{PRICE}}</div></div>';
            for(var i=0; i<pins.length; i++) {
                pins[i].pinObj.setMap(null);
            }
            $('.mapThisRental').each(function(i,v){
                geo = $(this).val().split(','), position = new google.maps.LatLng(geo[0],geo[1]);
                mkr = new RichMarker({
                    map : RoommateShareCache.map,
                    position : position,
                    draggable : false,
                    flat : true,
                    anchor : RichMarkerPosition.BOTTOM,
                    content : template.replace('{{PRICE}}', $.trim($(this).siblings('.priceTag').html()))
                });
                RoommateShareCache.Rentals.pins.push({
                    pinObj:mkr
                });
            });
            $('#RoommateMap').addClass('RentPriority');
        });
        $('#SearchMyPlace').focus(function(){
            $('.searchBox').addClass('searchBoxFocused');
            $(this).select();
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
            if(current.attr('id') === 'ScreenPopup' || current.attr('id') === 'popups'){
                module.Clean();
                module.utils.pushState();
                return;
            }
            $('#suggestionBox:visible').hide();
        });
        $('#searchForm').submit(function(e){
            module.Clean();
            module.FindRental();
            $('#SearchMyPlace').trigger('blur');
            return false;
        });
        $('#SearchBtnHolder').bind('click', function() {
            $('#searchForm').trigger('submit');
        });
        $('#autoFinder').bind('click', function() {
            module.utils.GeoLocate();
        });
        siteWindow.trigger('hashchange');
        rs_map_load(ip_location);
    };
    module.FindRental = function(location) {
        var city = location || $.trim($('#SearchMyPlace').val()), regex = new RegExp('^\\d{5}(-\\d{4})?$');
        if(city === '')
            return false;
        if(regex.test(city)){
            geocoder.geocode({
                'address':city.replace(' ','+')
            }, function(data){
                data = data[0];
                module.FindRental(data.formatted_address.split(',')[0]);
            });
            return false;
        }
        geocode(city);
        $.getJSON('/service/getRealRentals.php', {
            city_name : city
        }, function(data) {
            var jsonRentals = {
                rentals:[]
            };
            for(var i=0; data.rentals && i<data.rentals.length; i++) {
                try{
                    var addedDate = new Date(Date.parse(data.rentals[i].post_added)),
                    adid = data.rentals[i].id,
                    json = $.parseJSON(data.rentals[i].json), imgArr = [];
                    addedDate = 'posted ' + module.utils.compareDates(addedDate, new Date());
                    if(!json)
                        continue;
                    json.image_list_array && json.image_list_array !== '' && (imgArr = json.image_list_array.split('||').map(function(single_arr){
                        return {
                            image: '/service/' + single_arr
                        };
                    }));
                    json.adid = adid,
                    json.imgArr = imgArr,
                    json.addedDate = addedDate;
                    jsonRentals.rentals.push({
                        data:json
                    });
                // THE LINE BELOW COULD BE REMOVED AFTER AJAX LOGIC
                } catch(e){}
            };
            RoommateShareCache.Rentals.Rentals = jsonRentals.rentals;
            $.get('/templates/find.html', function(html) {
                var list_html = Mustache.to_html(html, jsonRentals);
                $('#ListHolder').html(list_html);
                //$('#searchBoxContainer').removeClass('transition2');
                container.addClass('afterAction');
                $('.close_detailed_btn').bind('click', function (e) {
                    $('#rental_detailed_view').removeClass('active');
                    //$('#show_rental_details').html('');
                });
                if( !RoommateShareCache.user.isActive ) {
                    $('#ViewFavorites').bind('click', function(){
                        window.location = '#!login';
                    });
                }
                else{
                    $('#ViewFavorites').bind('click', function(){
                        module.Favorites();
                    });
                }
                //$('#searchBoxContainer').addClass('transition2');
                $.publish('NEWRENTALS');
            });
        });
    };
    module.Login = function(submit) {
        if(submit){
            var login_email = $('#login_email').val(),
            login_password = $('#login_password').val(),
            email = $.trim(login_email),
            password = $.trim(login_password);
            $('.loginError').addClass('hide');
            if(module.utils.validations.checkEmpty([email, password])){
                $('.loginError').removeClass('hide');
                return false;
            }
            $.post('/login/login.php',{
                email: login_email, 
                password: login_password
            }, function(data){
                if(data === 'SUCCESS')
                    window.location.href='/';
                else
                    $('.loginError').removeClass('hide');
            });
            return false;
        }
        var url = '/templates/login.html';
        module.Login.cache = module.Login.cache || null;
        module.Login.handleHTML = module.Login.handleHTML || function(html){
            module.Login.cache = html;
            $('#loginPopup').html(html);
            ScreenPopup.addClass('active');
        };
        module.Login.cache ? module.Login.handleHTML(module.Login.cache) : $.get(url, module.Login.handleHTML);
        $('#loginContents').removeClass('modeRegister modeForgot').addClass('modeLogin');
    };
    module.ViewDetails = function (data) {
        var url = '/templates/rental_details.html';
        module.ViewDetails.cache = module.ViewDetails.cache || null;
        module.ViewDetails.handleHTML = module.ViewDetails.handleHTML || function(html, data){
            module.ViewDetails.cache = html;
            $('#show_rental_details').html(Mustache.to_html(html, data));
            $('#rental_detailed_view').addClass('active');
        };
        module.ViewDetails.cache ? module.ViewDetails.handleHTML(module.ViewDetails.cache, data) : $.get(url, function(result){
            module.ViewDetails.handleHTML(result, data);
        });
    };
    module.Register = function(submit) {
        if(submit){
            var email = $.trim($('#register_email').val()),
            name = $.trim($('#friendly_name').val()),
            password = $.trim($('#register_password').val()),
            repassword = $.trim($('#register_repassword').val());
            if(module.utils.validations.checkEmpty([email, name, password, repassword]))
                return false;
            console.log('Registration');
            return false;
        }
        $('#loginContents').removeClass('modeLogin modeForgot').addClass('modeRegister');
    };
    module.ForgotPassword = function(submit) {
        if(submit){
            console.log('Resetting');
            return false;
        }
        $('#loginContents').removeClass('modeLogin modeRegister').addClass('modeForgot');
    };
    module.PostRental = function(submit) {
        if(submit){
            var $required = $('#PostAdForm').find('[required]');
            for(var i=0; i<$required.length; i++){
                if($required[i].value.length === 0)
                    return false;
            }
            var submit_object = $('#PostAdForm').serializeObject(),
            city = $.trim($('#post_city').val()),
            pass_param = JSON.stringify(submit_object);
            $.get('/logic/class/PostClass.php', {
                id: RoommateShareCache.user.id,
                type: RoommateShareCache.user.type,
                city: city,
                inputJson: pass_param
            }, function(data){
                if(data === "1"){
                    module.Clean();
                    module.utils.pushState();
                }
            });
            return false;
        }
        var url = '/templates/post.html';
        module.PostRental.cache = module.PostRental.cache || null;
        module.PostRental.handleHTML = module.PostRental.handleHTML || function(html){
            module.PostRental.cache = html;
            $('#postViewPopup').html(html);
            $('#post_avail_date').datepicker({
                inline: true,
                showOtherMonths: true,
                dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            });
            $('#add_images_btn').bind('click', function(){
                $('#rental_image_upload').trigger('click');
            });
            var image_upload_form = document.getElementById('image_upload_form');
            image_upload_form.onsubmit = function () {
                image_upload_form.target = 'rental_upload_target';
                document.getElementById('rental_upload_target').onload = function(){
                    var image_status = frames['rental_upload_target'].document.getElementsByTagName('body')[0].innerHTML,
                    status_json = $.parseJSON(image_status),
                    image_list_array = $('#image_list_array'),
                    image_url = null, itr = 0, displayImages = null,
                    template = '<div><img style="height:30px;" class="fl" src="{{SRC}}" onerror="this.style.display=\'none\'" /><div class="closePopup remove_uploaded_image abs z1"></div></div>', html = '';
                    if(status_json.success){
                        image_url = status_json.file_name;
                        image_list_array.val((image_list_array.val()===''? '':image_list_array.val() + '||') + image_url);
                    }
                    displayImages = image_list_array.val().split('||');
                    for(itr = 0; itr<displayImages.length; itr++){
                        html += template.replace('{{SRC}}', '/service/' + displayImages[itr]);
                    }
                    $('#displayUploadedImage').html(html);
                    // Binded After (Later replace with ON event)
                    $('.remove_uploaded_image').bind('click', function(){
                        var current = $(this), parent = current.parent(), index = $('#displayUploadedImage > div').index(parent), removeImgList = image_list_array.val().split('||').splice(index, 1);
                        image_list_array.val(removeImgList.join('||'));
                        parent.remove();
                    });
                };
            };
            $('#user_who_upload').val(RoommateShareCache.user.id);
            $('#rental_image_upload').bind('change', function(){
                $('#image_upload_submit').trigger('click');
                return false;
            });
            ScreenPopup.addClass('active');
        };
        module.PostRental.cache ? module.PostRental.handleHTML(module.PostRental.cache) : $.getJSON('/service/getStateList.php', {
            country:'US'
        }, function(data){
            $.get(url, function(html){
                var html = Mustache.to_html(html, {
                    states:data
                });
                module.PostRental.handleHTML(html);
            });
        });
        $('#loginContents').removeClass('modeRegister modeForgot').addClass('modeLogin');
    };
    module.Favorites = function () {
        
    };
    module.Clean = function () {
        ScreenPopup.removeClass('active');
        $('#loginPopup, #postViewPopup').html('');
        $('#suggestionBox:visible').hide();
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
        },
        fb_show_friends:function(city){
            var all_friends = RoommateShareCache.FB_groups.city[city],
            json = {
                city: city,
                friends: all_friends.person
            },
            html = Mustache.to_html($('#fb_friend_template').html(), json);
            $('#fb_show_div').html(html);
            $('#fbcityname').html(json.city);
            $('#blocker, #fb_friends_show').show();
        }
    };
    module.setCity = function(city) {
        selectedCity = city;
        cityPreferred(city);
    };
    module.UserAction = function(user){
        if(user && user.getFbFriends){
            RoommateShareCache.user.id = user.user.id;
            RoommateShareCache.user.type = 'fb';
            RoommateShareCache.user.isActive = true;
            $('.username').text(user.user.first_name);
            $('#loginImg').css({
                'background':'url("' + user.user.picture.data.url + '") no-repeat 0 0 transparent',
                'background-size': 'cover'
            });
            RoommateShareCache.user.fbaccount = user;
            getFbFriendsList();
        }
        else if(user){
            $('.username').text(user.user[0].username);
            RoommateShareCache.user.id = 1;
            RoommateShareCache.user.type = 'site';
            RoommateShareCache.user.isActive = true;
        }
    };
    module.utils = {
        GeoLocate: function(callback) {
            if (navigator.geolocation) {
                var latitude = null, longitude = null;
                navigator.geolocation.getCurrentPosition(function (position) {
                    latitude = parseFloat(position.coords.latitude).toFixed(6);
                    RoommateShareCache.myplace.lat = latitude;
                    longitude = parseFloat(position.coords.longitude).toFixed(6);
                    RoommateShareCache.myplace.lng =  longitude;
                    geocode(latitude + ", " + longitude, true);
                }, function (error) {
                    if(error.code === 1){}
                }, {
                    enableHighAccuracy: true
                });
            }
        },
        geopostal: function(){
            var geofield = $('#post_rental_geo'), latlng, address = '';
            if(geofield.hasClass('notyet')){
                address = $('#post_address').val() + ',' + $('#post_city').val() + ',' + $('#post_state').val() + ',' + $('#post_zip').val();
                geocoder.geocode({
                    'address':address.replace(' ','+')
                }, function(data){
                    data = data[0];
                    data.geometry && (latlng = data.geometry.location);
                    geofield.val(latlng.lat() + ',' + latlng.lng());
                    geofield.removeClass('notyet');
                });
                return false;
            }
        },
        pushState: function(link){
            window.history.pushState && window.history.pushState(null, document.title, link || '/');
        },
        SelectChanged: function(elem){
            var current = $(elem);
            current.siblings('.customOption').find('.customValue').html(current.children(':selected').text());
        },
        Loader: function(mode){
            var BIG = 3, MEDIUM = 2, SMALL = 1, loaderMode = mode || BIG;
            switch(loaderMode) {
                case BIG:
                    break;
                case BIG:
                    break;
                case BIG:
                    break;
            };
        },
        SubmitPostForm: function(elem){
            var $required = $('#PostAdForm').find('[required]');
            for(var i=0; i<$required.length; i++){
                if($required[i].value.length === 0)
                    return false;
            }
            var submit_object = $('#PostAdForm').serializeObject();
            var city = $.trim($('#post_city').val());
            var pass_param = JSON.stringify(submit_object);
            $.get('/logic/class/PostClass.php', {
                id: RoommateShareCache.user.id,
                type: RoommateShareCache.user.type,
                city: city,
                inputJson: pass_param
            }, function(data){
                if(data === "1")
                    $('#postViewPopup .borderPost').html('Rent is added');
            });
        },
        addToFavorites: function () {
            
        },
        compareDates: function (date1, date2) {
            var ONE_DAY = 1000 * 60 * 60 * 24,
            ONE_HOUR = 1000 * 60 * 60,
            ONE_MIN = 1000 * 60,
            difference_ms = Math.abs(date2 - date1),
            added_ago;
            if(difference_ms>ONE_DAY){
                added_ago = (Math.round(difference_ms/ONE_DAY)) + (Math.round(difference_ms/ONE_DAY)===1?' day':' days') + ' ago';
            }
            else if(difference_ms>ONE_HOUR && difference_ms<ONE_DAY){
                added_ago = (Math.round(difference_ms/ONE_HOUR)) + (Math.round(difference_ms/ONE_HOUR)===1?' hour':' hours') + ' ago';
            }
            else if(difference_ms>ONE_MIN && difference_ms<ONE_HOUR){
                added_ago = (Math.round(difference_ms/ONE_MIN)) + (Math.round(difference_ms/ONE_MIN)===1?' min':' mins') + ' ago';
            }
            else{
                added_ago = '1 min ago';
            }
            return added_ago;
        },
        validations: {
            checkEmpty:function(arr){
                if(!arr) return false;
                if(arr.constructor === String){
                    if($.trim(arr).length === 0)
                        return true;
                    return false;
                }
                else if(arr.constructor === Array){
                    for(var i=0;i<arr.length; i++)
                        if($.trim(arr[i]).length === 0)
                            return true;
                    return false;
                }
                return false;
            }
        },
        popupClose: function(){
            module.Clean();
            this.pushState();
        }
    };
    var cityPreferred = function(city){
        $('#SearchMyPlace').val(city);
        findMyPlace();
        $('#searchForm').trigger('submit');
    },
    ShowSuggestion = function(data){
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
    },
    SearchFromCache = function(match, callback){
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
    },
    findMyPlace = function(){
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
    },
    geocode = function(location, isLatLng){
        var address = location || $.trim($('#SearchMyPlace').val()),
        senderType = 'address',
        senderObject = {};
        if(!address || address === "" || address.length === 0)
            return false;
        senderObject[senderType] = address.replace(' ','+');
        if(isLatLng){ 
            senderType = 'latlng';
            senderObject[senderType] = new google.maps.LatLng(address.split(',')[0], address.split(',')[1]);
        }
        try{
            geocoder.geocode(senderObject, function(data){
                data = data[0];
                var latlng = (data.geometry.location);
                RoommateShareCache.myplace.address = {
                    city: data.formatted_address.split(',')[0],
                    address: data.formatted_address,
                    address_component: data.address_components[1]
                }
                RoommateShareCache.myplace.lat = latlng.lat();
                RoommateShareCache.myplace.lng = latlng.lng();
                RoommateShareCache.city = data.formatted_address;
                if(isLatLng){
                    address = data.formatted_address.split(',')[0];
                    $('#SearchMyPlace').val(address)
                    $('#searchForm').trigger('submit');
                }
                $.post('/logic/serve-user.php', {
                    'set_location':address
                });
                PlaceMe();
            });
            return false;
        }catch(e){
        }
    },
    PlaceMe = function(){
        var position = new google.maps.LatLng(RoommateShareCache.myplace.lat, RoommateShareCache.myplace.lng);
        var div = '<div class="mymarker"></div>';
        if(!PlaceMe.zoomLevel)
            PlaceMe.zoomLevel = 12;
        else
            PlaceMe.zoomLevel = 12;
        if(RoommateShareCache.myplace.marker)
            RoommateShareCache.myplace.marker.setMap(null);
        RoommateShareCache.map.panTo(new google.maps.LatLng((parseFloat(RoommateShareCache.myplace.lat)),RoommateShareCache.myplace.lng - 0.05));
        RoommateShareCache.map.setZoom(PlaceMe.zoomLevel);
        var mkr = new RichMarker({
            map : RoommateShareCache.map,
            position : position,
            draggable : false,
            flat : true,
            zIndex: 1,
            anchor : RichMarkerPosition.BOTTOM,
            content : div
        });
        RoommateShareCache.myplace.marker = mkr;
        loadnearby();
    },
    loadnearby = function(){
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
    },
    getFbFriendsList = function(){
        var url = '/logic/getFbFriends.php';
        $.post(url, {
            getFriends: true
        }, function(data){
            var temp = $.parseJSON($.trim(data));
            var FB_friends = (temp);
            var tempdata = (FB_friends);
            var friends = tempdata.data;
            RoommateShareCache.FB_friends = [];
            RoommateShareCache.FB_groups.city = {};
            var counter = 150;
            if(friends.length<counter) counter = friends.length;
            var GroupCity = [], GroupState = [];
            for(var i=0; i<counter; i++){
                if(!friends[i].current_location)
                    continue;
                var name = friends[i].name;
                var pic = friends[i].pic_square;
                var profile_link = friends[i].uid;
                if(GroupCity.length>0){
                    var placeExists = false, placeIndex = -1;
                    for(var k=0; k<GroupCity.length; k++){
                        if(friends[i].current_location.name === GroupCity[k].place){
                            placeExists = true;
                            placeIndex = k;
                            break;
                        }
                    }
                    if(placeExists && placeIndex > -1){
                        GroupCity[placeIndex].person.push({
                            'name': name,
                            'latlng': {
                                lat: friends[i].current_location.latitude,
                                lng: friends[i].current_location.longitude
                            },
                            'picture': pic,
                            'link': profile_link
                        });
                    }
                    else{
                        GroupCity.push({
                            'place': friends[i].current_location.name,
                            'person':[{
                                'name': name,
                                'latlng': {
                                    lat: friends[i].current_location.latitude,
                                    lng: friends[i].current_location.longitude
                                },
                                'picture': pic,
                                'link': profile_link
                            }]
                        });
                    }
                }
                else{
                    GroupCity.push({
                        'place': friends[i].current_location.name,
                        'person':[{
                            'name': name,
                            'latlng': {
                                lat: friends[i].current_location.latitude,
                                lng: friends[i].current_location.longitude
                            },
                            'picture': pic
                        }]
                    });
                }
            }
            for(var i=0; i<GroupCity.length; i++){
                var picContainer = "", picWidth = 30, width = 0;
                var friendObject = {
                    'place': GroupCity[i].place,
                    'person': [],
                    'latitude': null,
                    'longitude': null
                };
                RoommateShareCache.FB_groups.city[GroupCity[i].place] = GroupCity[i];
                var randomrotate=Math.floor(Math.random() * (5 - (-5) + 1)) + (-5);
                var picContainerTop = "<div class='myFriends' onclick='RoommateShare.Pins.fb_show_friends(\"" + GroupCity[i].place + "\")' style='transform: rotate(" + randomrotate + "deg); -webkit-transform: rotate(" + randomrotate + "deg); width: ";
                var picContainerMiddle = "";
                for(var j=0; j<GroupCity[i].person.length; j++){
                    friendObject.person.push(GroupCity[i].person[j]);
                    if(j<3){
                        picContainerMiddle += "<div class='friendPic'><img width='" + picWidth + "' src='" + GroupCity[i].person[j].picture +  "' alt='' /></div>";
                        width = picWidth*(j+1);
                    }
                    else if(j==3){
                        picContainerMiddle += "<div class='friendPic'><div class='tooManyFriends'><span>" + (GroupCity[i].person.length-3) + " more</span></div></div>";
                        width = picWidth*(j+1);
                    }
                    friendObject.latitude = GroupCity[i].person[j].latlng.lat;
                    friendObject.longitude = GroupCity[i].person[j].latlng.lng;
                }
                var picContainerBtm = "<div class='clear'></div><div class='rel'><div class='btmArr'></div></div></div>";
                picContainerTop += width + "px'>";
                picContainer = picContainerTop + picContainerMiddle + picContainerBtm;
                friendObject.marker = new RichMarker({
                    position: new google.maps.LatLng(friendObject.latitude, friendObject.longitude),
                    map: RoommateShareCache.map,
                    draggable: false,
                    flat: true,
                    content: picContainer
                });
                RoommateShareCache.FB_friends.push(friendObject);
            }
        });
    },
    mapStyles = [{
        featureType: "poi",
        elementType: "labels",
        stylers:[{/*visibility: "off"*/}]
    },
    {
        featureType: "water",
        stylers: [
        {
            color: "#cee0fb"
        }
        ]
    },{
        featureType: "landscape.man_made",
        stylers: [
        {
            color: "#E9E5DC"
        }
        ]
    },{
        featureType: "landscape.natural",
        stylers: [
        {
            color: "#e4e2d3"
        }
        ]
    },{
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
        {
            color: "#ECC654"
        },
        {
            weight: 1
        }
        ]
    },{
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [
        {
            color: "#bfbaa6"
        },
        {
            weight: 0.6
        }
        ]
    },{
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
        {
            color: "#f8b956"
        },
        {
            weight: 2.3
        }
        ]
    },{
        featureType: "road.highway.controlled_access",
        elementType: "labels.icon",
        stylers: [
        {
            visibility: "off"
        }
        ]
    },{
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [
        {
            visibility: "off"
        }
        ]
    }],
    rs_map_load = function(ip_location) {
        var minZoom = 3;
        google.maps.visualRefresh = true;
        geocoder = new google.maps.Geocoder();
        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(37.09024, -95.71289),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl:true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT,
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            streetViewControl: true,
            streetViewControlOptions:{
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            styles: [{
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
            leftContainer.addClass('hideElements');
            rightContainer.addClass('hideElements');
        });
        google.maps.event.addListener(RoommateShareCache.map, 'dragend', function() {
            leftContainer.removeClass('hideElements');
            rightContainer.removeClass('hideElements');
        });
        google.maps.event.addListener(RoommateShareCache.map, 'zoom_changed', function() {
            if(RoommateShareCache.map.getZoom()<11)
                $('#RoommateMap').addClass('zoomout');
            else
                $('#RoommateMap').removeClass('zoomout');
        });
        var thePanorama = RoommateShareCache.map.getStreetView();

        google.maps.event.addListener(thePanorama, 'visible_changed', function() {
            if (thePanorama.getVisible()) {
                container.addClass('streetView');
            } else {
                container.removeClass('streetView');
            }

        });
        if(ip_location)
            geocode(ip_location);
    };
    return module;
})(jQuery));