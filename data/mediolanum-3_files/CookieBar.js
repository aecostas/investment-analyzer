function CookieBar(mySettings) {
    var settings = { CurrentSite: "", SessionID: "",ImplicitCookie:true };
    $.extend(true, settings, mySettings);
    
    var setAcceptCookie = function (key, value) {
        $.cookie(key, value, { expires: 36500, path: '/', domain: location.host });
    };

    var checkAcceptCookie = function () {
        var cookieName = "AcceptCookie-" + settings.CurrentSite;
        var cookieValue = $.cookie(cookieName);
        if (cookieValue !== "1") {
            $("#CookieBar").show();
            if (settings.ImplicitCookie) setAcceptCookie(cookieName, "1");
        }
        
        $("#btnAcceptCookie").click(function (event) {
            setAcceptCookie(cookieName, "1");
            $("#CookieBar").hide();
            event.preventDefault();
        });
    };

    var init = function () {
        $(window).scroll(function () {
            if (0 < $(document).scrollTop()) {
                $("#CookieBar").addClass("floatTop");
            } else {
                $("#CookieBar").removeClass("floatTop");
            }
        });
        checkAcceptCookie();
    };

    return {
        Init: function () {
            return init();
        }
    };
}