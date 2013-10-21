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
    var module = {}, body = $('body');
    module.Init = function(){
        body.addClass('loaded');
    };
    module.FindRental = function() {
	
    };
    module.Login = function() {
	
    };
    module.Register = function() {
	
    };
    module.PostRental = function() {
	
    };
    return module;
})(jQuery));