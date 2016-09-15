/*****************************
*  functions used to check/create cookie info for IntroModule
******************************/

//do the redirection operation and set the cookie


function ShowIntroDropdown() {
    var CookieName = "ShowIntro_" + "NL";
    var CookieNames = "ShowPanel_" + "NL";
    if (Get_Cookie(CookieNames)!= null) {
        $('#open').show();
        $("div#expandedMenu").css('padding-bottom', '10px');
    }
    if (Get_Cookie(CookieName) == null ) {
        $('#expandedMenu').show();
       
        
    }
}

function CreateIntrocookie(expire_mins) {
    var CookieName = "ShowIntro_" + "NL";
    var path = "/";
    if (expire_mins < 0) expire_mins = ""; 
    Set_Cookie(CookieName, "no", expire_mins, path, '', '');
    $('#expandedMenu').hide();

}

function ShowPanel(expire_mins) {

    var CookieName = "ShowPanel_" + "NL";
    var path = "/";
    if (expire_mins < 0) expire_mins = "";  //in mins
    if (Get_Cookie(CookieName) == null) {
        Set_Cookie(CookieName, "no", expire_mins, path, '', '');
        $('#panel').show();
        $('#close').show();


    }
}


//generate cookie for IntroPage
function Set_Cookie(name, value, expires, path, domain, secure) {
    // set time, it's in milliseconds
    var today = new Date();
    today.setTime(today.getTime());

    /*
    if the expires variable is set, make the correct
    expires time, the current script below will set
    it for x number of days, to make it for hours,
    delete * 24, for minutes, delete * 60 * 24
    */
    if (expires) {
        expires = expires * 1000 * 60; // * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));

    document.cookie = name + "=" + escape(value) +
((expires) ? ";expires=" + expires_date.toGMTString() : "") +
((path) ? ";path=" + path : "") +
((domain) ? ";domain=" + domain : "") +
((secure) ? ";secure" : "");
}


//get coookie
function Get_Cookie(check_name) {
    // first we'll split this cookie up into name/value pairs
    // note: document.cookie only returns name=value, not the other components
    var a_all_cookies = document.cookie.split(';');
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = false; // set boolean t/f default f

    for (i = 0; i < a_all_cookies.length; i++) {
        // now we'll split apart each name=value pair
        a_temp_cookie = a_all_cookies[i].split('=');


        // and trim left/right whitespace while we're at it
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

        // if the extracted name matches passed check_name
        if (cookie_name == check_name) {
            b_cookie_found = true;
            // we need to handle case where cookie has no value but exists (no = sign, that is):
            if (a_temp_cookie.length > 1) {
                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
            }
            // note that in cases where cookie is initialized but no value, null is returned
            return cookie_value;
            break;
        }
        a_temp_cookie = null;
        cookie_name = '';
    }
    if (!b_cookie_found) {
        return null;
    }
}
