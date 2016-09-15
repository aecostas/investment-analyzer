/*****************************
*  functions used to check/create cookie info for IntroPage
******************************/

//do the redirection operation and set the cookie
var showOverlay = false;
var Hemscott_referrer = "hemscott.com";
var redirectQString = "redirect=true";

function DoADRedirection(expire_mins) {    
    var backUrl;
    backUrl = checkAddReferrer(location.href);

    var siteId = getSiteID();

    var CookieName = "HPTopAd_" + siteId;
    var path = "/";
    if (expire_mins < 0) expire_mins = "";  //in mins

    var alwaysShow = alwaysShowInterstitial();

    if (Get_Cookie(CookieName) == null || alwaysShow) {
        Set_Cookie(CookieName, "no", expire_mins, path, '', '');
        window.location.href = "/IntroPage.aspx?site=" + siteId + "&backurl=" + encodeURIComponent(backUrl);
    }
}

function alwaysShowInterstitial() {
    var field = 'ShowInterstitialAd';
    var url = window.location.href;
    if (url.indexOf('?' + field + '=') != -1)
        return true;
    else if (url.indexOf('&' + field + '=') != -1)
        return true;
    return false
}

function checkAddReferrer(url) {
    backUrl = url;
    var currentPath = location.href;
    var containsRedQString = false;
    if(currentPath.indexOf(redirectQString) > -1){
        containsRedQString = true;
    }
    if ((document.referrer != null) || containsRedQString) {
        if ((document.referrer.indexOf(Hemscott_referrer) > -1) || containsRedQString) {
            if (backUrl.indexOf("?") > -1)
                backUrl = backUrl + "&";
            else
                backUrl = backUrl + "?";

            backUrl = backUrl + "HemscottSource=HS";
        }
    }
    return backUrl;
    
 }

function DoOverlayShow() {
    var backUrl;
    backUrl = checkAddReferrer(location.href);
    
    var str = backUrl.split("?");
    if (str.length > 1) {
        var strQueryStrings = str[1];
        arrQueryStrings = strQueryStrings.split("&");
        var sourceString = getQueryString("HemscottSource");
        if (sourceString == "HS") {
            var CookieName = "SMOverlay";

            if (Get_Cookie(CookieName) == null) {
                showOverlay = true;
            }
        }

    }
}
   

//generate cookie for IntroPage
function Set_Cookie( name, value, expires, path, domain, secure )
{
// set time, it's in milliseconds
var today = new Date();
today.setTime( today.getTime() );

/*
if the expires variable is set, make the correct
expires time, the current script below will set
it for x number of days, to make it for hours,
delete * 24, for minutes, delete * 60 * 24
*/
if ( expires )
{
expires = expires * 1000 * 60; // * 60 * 24;
}
var expires_date = new Date( today.getTime() + (expires) );

document.cookie = name + "=" +escape( value ) +
( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
( ( path ) ? ";path=" + path : "" ) +
( ( domain ) ? ";domain=" + domain : "" ) +
( ( secure ) ? ";secure" : "" );
}


//get coookie
function Get_Cookie( check_name ) {
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f

	for ( i = 0; i < a_all_cookies.length; i++ )
	{
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );


		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

		// if the extracted name matches passed check_name
		if ( cookie_name == check_name )
		{
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )
			{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value;
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( !b_cookie_found )
	{
		return null;
	}
}


//get Site ID from location.href
function getSiteID(){

    var tempLocation = location.href;    
   
    var elem = tempLocation.split('/');
    
    if(elem != null){
        return elem[3];
    }else{
        return ""
    }

}

function getQueryString(strQuery) {
    for (i = 0; i < arrQueryStrings.length; i++) {
        arrQueryStringData = arrQueryStrings[i].split("=");
        if (arrQueryStringData[0] == strQuery) {
            return arrQueryStringData[1];
        }
    }
}

function showDialog() {
    $('#dialogWelcome').fadeIn('slow', function () { $(this).show(0); });
    $('#dialog-mask-welcome').fadeIn('slow', function () { $(this).show(0); });
}

function hideDialog() {
    $('#dialogWelcome').fadeOut('slow', function () { $(this).hide(0); });
    $('#dialog-mask-welcome').fadeOut('normal', function () { $(this).hide(0); });
}

function showMore() {
    $('#readMore').hide();
    $('#details').slideToggle(500); $('#ul').css('border-bottom', 'none');
}

function CheckClick() {
    var CookieName = "SMOverlay";
    if (document.getElementById("check01") != null)
        document.getElementById("check01").checked = true;
    expire_mins = 14 * 1000 * 60 * 60 * 24;
    Set_Cookie(CookieName, "no", expire_mins, '/', '', ''); 
    hideDialog();
}	