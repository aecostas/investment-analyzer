var urlScheme = (("https:" == document.location.protocol) ? "https" : "http");

var adServerName;
if (urlScheme == 'https') {
    adServerName = "secserv";
}
else {
    adServerName = "adserver";
}

var mBaseUrl = window.location.href;
var mTitle = "Morningstar";

function AddToMyFavorites(myTitle) {
	if (document.all) window.external.AddFavorite(mBaseUrl, myTitle);
	else if (window.sidebar) window.sidebar.addPanel(myTitle, mBaseUrl, "")
}

function AddToFavorites()
{
	if (window.sidebar) // firefox
	window.sidebar.addPanel(mTitle, mBaseUrl, "");
	else if(window.opera && window.print){ // opera
	var elem = document.createElement('a');
	elem.setAttribute('href',mBaseUrl);
	elem.setAttribute('title',mTitle);
	elem.setAttribute('rel','sidebar');
	elem.click();
	}
	else if(document.all)// ie
	window.external.AddFavorite(mBaseUrl, mTitle);
	}
	function setHome()
	{
		if (document.all) {
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage(mBaseUrl);

		}
		else if (window.sidebar) {
			if (window.netscape) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				}
				catch (e) {
					alert("this action was aviod by your browser; if you want to enable please enter about:config in your address line,and change the value of signed.applets.codebase_principal_support to true");
				}
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage', mBaseUrl);
		}
}

function setHomepage()
{
	document.body.style.behavior = 'url(#default#homepage)';
	document.body.setHomePage(location.href);
}

function ClearSearchBox(id, value)
{
	var i = document.getElementById(id);
	if(i.value == value)
	{
		i.value = "";
	}
}

function sitesRedirect(globalSites)
{
	  if (globalSites.value != "")
	  {
		  window.open(globalSites.value);
	  }					  
}

function onSelectToolChange(globalSites)
{
	  if (globalSites.value != "")
	  {
		  window.location = globalSites.value;
	  }					  
}

function sniffIE()
{
    var sAgent = navigator.userAgent;

    var isIE = (sAgent.indexOf("MSIE") > -1);

	return isIE;
}

function getAbsolutePos(el) 
{
	var r = { x: 0, y: 0 };
	if (el.offsetParent) {
		do {
			r.x += el.offsetLeft;
			r.y += el.offsetTop;
		} while (el = el.offsetParent);
	}
	//if (el.offsetParent) 
	//{
	//    var tmp = getAbsolutePos(el.offsetParent);
	//    r.x += tmp.x;
	//    r.y += tmp.y;
	// }
	 return r;
}

function getClientBounds()
{
	var clientWidth;
	var clientHeight;
	
	if( sniffIE() )
	{
		clientWidth = document.documentElement.clientWidth;
		clientHeight = document.documentElement.clientHeight;
	}
	else
	{
		clientWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
		clientHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
	}
	
	var r = { width: clientWidth, height:clientHeight  };     
	return r;
}


function RtnValue(idName, valueName, idSecurityInfo, valueSecurityInfo)
{ 
	try {
		var tb_SecName = document.getElementById(idName);
		var hf_SecurityInfo = document.getElementById(idSecurityInfo);

		if (tb_SecName != null && hf_SecurityInfo != null)
		{
			tb_SecName.value = valueName;
			hf_SecurityInfo.value = valueSecurityInfo;
			
			onPopupValueReturnedRT();
		}   
	}
	catch(e)
	{}
}

function onPopupValueReturnedRT(){}


function showPopup(idImage, idName, idSecurityInfo, source) {
	try {
		var i = getAbsolutePos(document.getElementById(idImage));
		var popupframe = document.getElementById("popup");
		popupframe.style.left = i.x + 3 + "px";
		popupframe.style.top =  i.y + "px";


		var searchTerm;
		if (source == 'edittransaction') {
		    if (typeof hdnSerchterm != 'undefined') {
		        if (document.getElementById(hdnSerchterm) != null && document.getElementById(hdnSerchterm).value != "") {
		            searchTerm = document.getElementById(hdnSerchterm).value.split('~');
		        } 
		    }
		}


		var securitySearch = document.getElementById("securitySearch");

		if (searchTerm != null && searchTerm != "") {
			securitySearch.src = "../util/securitysearchpopup.aspx?source=" + source + "&idName=" + idName + "&idSecurityInfo=" + idSecurityInfo + "&searchedType=" + searchTerm[0] + "&search=" + searchTerm[1];
		}
		else {
			securitySearch.src = "../util/securitysearchpopup.aspx?source=" + source + "&idName=" + idName + "&idSecurityInfo=" + idSecurityInfo;
		}

		var win = document.getElementById("popup");

		win.style.display='';
	}
	catch(e)
	{}
}

function showModal(idImage, idName, idSecurityInfo, source) {
	var dialog = $('#popup')
		.jqm({
			onShow: function(h) {
				var $modal = $(h.w);
				var $modalContent = $("iframe", $modal);
				$modalContent.html('').attr('src', "../util/securitysearchpopup.aspx?source=" + source + "&idName=" + idName + "&idSecurityInfo=" + idSecurityInfo);
				if (height > 0) $modal.height("250");
				if (width > 0) $modal.width("100");
				h.w.show();
			}
		}).jqmShow();
}

function closeModal(postback) {
	$('#popup').jqmHide();
}

function trim(stringToTrim) 
{
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function compareOptionText(a,b) {
	/*

	  * return >0 if a>b

	  * 0 if a=b

	  * <0 if a<b

	  */

	// textual comparison

	return a.text!=b.text ? a.text<b.text ? -1 : 1 : 0;

	// numerical comparison

	// return a.text - b.text;

}

function UrlEncode4Flash( str )
{		
	str = escape(str);
	str = str.replace(/\//g, '%2F');
	return str;
}

function myequals(y, x) 
{
	for (p in y) {
		if (y[p]) {
			switch (typeof (y[p])) {
				case 'object':
					if (!y[p].myequals(x[p])) { return false }; break;
				case 'function':
					if (typeof (x[p]) == 'undefined' ||  y[p].toString() != x[p].toString()) { return false; }; break;
				default:
					if (y[p] != x[p]) { return false; }
			}
		}
		else {
			if (x[p]) {
				return false;
			}
		}
	}
	
	return true;
}

//for the ad 1694406
//Array.prototype.remove = function(obj) {
//    var a = [];
//    for (var i = 0; i < this.length; i++) {
//        if (!myequals(this[i], obj)) {
//            a.push(this[i]);
//        }
//    }
//    return a;
//};
function removeFromArray(arrayObj, item) {
	var a = [];
	for (var i = 0; i < arrayObj.length; i++) {
		if (!myequals(arrayObj[i], item)) {
			a.push(arrayObj[i]);
		}
	}
	return a;
}

function autoCompleteGetUrl(source) 
{
	var url = '/' + currentSite + '/util/SecuritySearch.ashx?source=' + source + "&moduleId=6";

	if (typeof (currentHoldings) != 'undefined') 
	{
		if (currentHoldings != '') 
		{
			url += '&preferedList=' + currentHoldings;
		}
	}
	
	return  url;
}

// HZ: onSelect event handler for the quote search result popup in navigation
function quoteSearchClick(obj)
{
	if (obj != undefined)
	{
		var id = obj.i;
		var typeid = obj.t;
		var pensionId = obj.p;

		var url;

		if (typeid == 3) {
			url = STOCK_QT_PREFIX + id;
		}
		else if (typeid == -1) {
		    url = ARTICLES + id + "/" + obj.n;
		}		
		else {
			url = QT_PREFIX + id;

			if (typeid == 9) {
				url += "&investmentType=SA";
			}
			else if (typeid == 41 && pensionId != '') {
				url += "&pensionId=" + pensionId;
			}
		}

		if (this.isInIframe) {
		    window.parent.location = url;
		}
		else {
		    window.location = url;
		}
	}
};

function EnableSearchButton() { }

function doSearch(type, url, securityType, defaultSearchText) {
	if ($("#quoteSearch").val() != "" && $("#quoteSearch").val() != defaultSearchText) {
		if (type == 'quoteSearch') {
			UniverseSearch(url, securityType);
		} else if (type == 'articleSearch') {
			ArticleSearch(url);
		}
	}
}

function UniverseSearch(siteUrl, securityType)
{
	var url = siteUrl + "/funds/SecuritySearchResults.aspx?search=" + $('#quoteSearch').val().replace('&','~') + "&type=" + securityType;
	
	$('#quoteForm').attr("action", "javascript:" + url);
	//pageTracker._trackEvent('Search', 'UniverseSearch', $('#quoteSearch').val());
	_gaq.push(['_trackEvent','Search', 'UniverseSearch', $('#quoteSearch').val()]);
    window.location = url;
}

function ArticleSearch(siteUrl)
{
    var url = siteUrl + "/news/archive.aspx?search=" + $('#contentSearch').val();
	$('#quoteForm').attr("action", "javascript:" + url);
	//pageTracker._trackEvent('Search', 'ArticleSearch', $('#contentSearch').val());
	_gaq.push(['_trackEvent','Search', 'ArticleSearch', $('#contentSearch').val()]);
	window.location = url;
}
 
// HZ: to sort the dropdown of links for international MS sites
function sortInternationalSites(list) {

	var numExcluded = 2;
	var items = list.options.length - numExcluded;

	// create array and make copies of options in list

	var tmpArray = new Array(items);

	for ( i=0; i<items; i++ )

	tmpArray[i] = new

	Option(list.options[i+numExcluded].text,list.options[i+numExcluded].value);

	// sort options using given function

	tmpArray.sort(compareOptionText);

	// make copies of sorted options back to list

	for ( i=0; i<items; i++ )

	list.options[i+numExcluded] = new Option(tmpArray[i].text,tmpArray[i].value);

}

function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
	var cookie_string = name + "=" + escape(value);

	if (exp_y) {
		var expires = new Date(exp_y, exp_m, exp_d);
		cookie_string += "; expires=" + expires.toGMTString();
	}

	if (path)
		cookie_string += "; path=" + escape(path);

	if (domain)
		cookie_string += "; domain=" + escape(domain);

	if (secure)
		cookie_string += "; secure";

	document.cookie = cookie_string;
}

function get_cookie(name) {
	var cookies = document.cookie;
	if (cookies.indexOf(name) != -1) {
		var startpos = cookies.indexOf(name) + name.length + 1;
		var endpos = cookies.indexOf(";", startpos);
		if (endpos == -2) endpos = cookies.length;
		return unescape(cookies.substring(startpos, endpos));
	}
	else {
		return false; // the cookie couldn't be found! it was never set before, or it expired.
	}
}

function getQuerystring(key, default_) 
{
	if (default_ == null) default_ = "";
	key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
	var qs = regex.exec(window.location.href);
	if (qs == null)
		return default_;
	else
		return qs[1];
} 

// language toggle
function LangTrigger(language) 
{
	if (language) 
	{
		var current_date = new Date;
		var cookie_year = current_date.getFullYear() + 1;
		var cookie_month = current_date.getMonth();
		var cookie_day = current_date.getDate();

		//currentSite is injected in BaseWebPage
		//also check SiteHelper.LangCookieName
		var LangCookieName = "RT_" + currentSite + "_LANG";

		var cookieOld = get_cookie(LangCookieName);

		set_cookie(LangCookieName, language, cookie_year, cookie_month, cookie_day, '/', cookieDomain);

		var urlGo = window.location.href;
		
		if (cookieOld != '') {
			var reg = new RegExp("lang=" + cookieOld);
			urlGo = urlGo.replace(reg, "lang=" + language);
		}

		urlGo = replaceURLParemeter(urlGo, "lang", language);
		//urlGo = replaceURLParemeter(urlGo, "r", Math.round(Math.random() * 1000));
	    
	    var LT_oldLang = getQuerystring("LanguageId"); // LT LanguageID
		if (LT_oldLang != '')
		{
			var reg = new RegExp("LanguageId=" + LT_oldLang);

			urlGo = urlGo.replace(reg, "LanguageId=" + language);
		}
		
		location.href = urlGo;
	}    
}
function getQueryStringRegExp(url,name) {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(url))
        return unescape(RegExp.$2.replace(/\+/g, " "));
    return "";
};
function getURLSearch(url) {
    if (url.indexOf("?") == -1) return "";
    return url.substring(url.indexOf("?") + 1);
}

function replaceURLParemeter(url,name, newValue) {
    var urlGo =url;
    var urlParemeter = getURLSearch(url);
    var oldValue = getQueryStringRegExp(url,name);
   
    if (oldValue != '') {
        var reg = new RegExp(name + "=" + oldValue);
        urlGo = urlGo.replace(reg, name + "=" + newValue);
    }
    else {
        if (urlParemeter != '') {
            urlGo = urlGo + "&" + name + "=" + newValue;
        }
        else {
            urlGo = urlGo + "?" + name + "=" + newValue;
        }
    }
    return urlGo;
    
}


function ExpandOrCollapse(Subpanelid, PanelId, CollapseClass, ExpandClass) {

	if (document.getElementById(Subpanelid).style.display == "none") {
		document.getElementById(Subpanelid).style.display = 'block';
		document.getElementById(PanelId).className = CollapseClass;
	}
	else {
		document.getElementById(Subpanelid).style.display = 'none';
		document.getElementById(PanelId).className = ExpandClass;
	}
}

// ultimate browser sniffer from netscape
// see http://www.mozilla.org/docs/web-developer/sniffer/browser_type.html for docs

// convert all characters to lowercase to simplify testing
var agt = navigator.userAgent.toLowerCase();
var is_ie = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));

function AddStyleFileForBrowser(iePath, otherPath) {
	if (is_ie) {
		document.write('<link rel="stylesheet" type="text/css" href="' + iePath + '"/>');
	}
	// everybody else
	else {
		document.write('<link rel="stylesheet" type="text/css" href="' + otherPath + '"/>');
	}
}


function getIndexGraph(index) 
{
	var indexImg = document.getElementById("indexGraph");
	
	indexImg.src = "/dynimg/markets/index_" + index + ".png";
}

function open_glossary( aURL, aWinName )
 {
	window.location = aURL;
 }
  
  
function MM_findObj(n, d) 
{ //v4.01
	var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
	  d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
	if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
	if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
	var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
	 if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
} 

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

/*
File: Dictionary.js
Version: 1.0
Last modified: 09.17.2002
Author: Alexandar Minkovsky (a_minkovsky#hotmail.com ; URL: http://www24.brinkster.com/alekz)
Copyright: Left
*/
function Dictionary() { this.count = 0; this.Obj = new Object(); this.exists = Dictionary_exists; this.add = Dictionary_add; this.remove = Dictionary_remove; this.removeAll = Dictionary_removeAll; this.values = Dictionary_values; this.keys = Dictionary_keys; this.items = Dictionary_items; this.getVal = Dictionary_getVal; this.setVal = Dictionary_setVal; this.setKey = Dictionary_setKey } function Dictionary_exists(a) { return (this.Obj[a]) ? true : false } function Dictionary_add(c, a) { var b = String(c); if (this.exists(b)) { return false } this.Obj[b] = a; this.count++; return true } function Dictionary_remove(b) { var a = String(b); if (!this.exists(a)) { return false } delete this.Obj[a]; this.count--; return true } function Dictionary_removeAll() { for (var a in this.Obj) { delete this.Obj[a] } this.count = 0 } function Dictionary_values() { var b = new Array(); for (var a in this.Obj) { b[b.length] = this.Obj[a] } return b } function Dictionary_keys() { var b = new Array(); for (var a in this.Obj) { b[b.length] = a } return b } function Dictionary_items() { var c = new Array(); for (var b in this.Obj) { var a = new Array(b, this.Obj[b]); c[c.length] = a } return c } function Dictionary_getVal(b) { var a = String(b); return this.Obj[a] } function Dictionary_setVal(c, a) { var b = String(c); if (this.exists(b)) { this.Obj[b] = a } else { this.add(b, a) } } function Dictionary_setKey(d, b) { var a = String(d); var c = String(b); if (this.exists(a)) { if (!this.exists(c)) { this.add(c, this.getVal(a)); this.remove(a) } } else { if (!this.exists(c)) { this.add(c, null) } } };


//from pageHeader.xsl

function ShowCourtesyLayer(IdCaller) {
	Caller = document.getElementById(IdCaller);
	var fullTop = getAbsoluteTop(Caller);
	document.getElementById("CourtesyLayer").style.left = getAbsoluteLeft(Caller) + 'px';
	document.getElementById("CourtesyLayer").style.top = getAbsoluteTop(Caller) + 'px';
	document.getElementById("CourtesyLayer").style.display = 'inline';
}
function HideCourtesyLayer() {
	document.getElementById("CourtesyLayer").style.display = 'none';
}
function getAbsoluteTop(thisOne) {
	while (thisOne.nodeName.toUpperCase() != "BODY") {
		var a = getAbsoluteTop(thisOne.parentNode) * 1;
		return thisOne.offsetTop * 1 + a;
	}
	return thisOne.offsetTop;
}
function getAbsoluteLeft(thisOne) {
	while (thisOne.nodeName.toUpperCase() != "BODY") {
		var a = getAbsoluteLeft(thisOne.parentNode) * 1;
		return thisOne.offsetLeft * 1 + a;
	}
	return thisOne.offsetLeft;
}

function hideLanguageToggle() {
	var lang_label = document.getElementById('Langtoggle');

	var url = window.location.href;

	if ((currentSite.indexOf("be") > -1)) {
		if ((url.indexOf("archive.aspx") > 0) || (url.indexOf("article.aspx") > 0)) {
			// clear the label - set translation link to null
			lang_label.innerHTML = "";
		}
	}
}

function convertCharStr2SelectiveCPs ( str, preserve, pad, before, after, base ) { 
	// converts a string of characters to code points or code point based escapes
	// str: string, the string to convert
	// preserve: string enum [ascii, latin1], a set of characters to not convert
	// pad: boolean, if true, hex numbers lower than 1000 are padded with zeros
	// before: string, any characters to include before a code point (eg. &#x for NCRs)
	// after: string, any characters to include after (eg. ; for NCRs)
	// base: string enum [hex, dec], hex or decimal output
	var haut = 0; 
	var n = 0; var cp;
	var CPstring = '';
	for (var i = 0; i < str.length; i++) {
		var b = str.charCodeAt(i); 
		if (b < 0 || b > 0xFFFF) {
			CPstring += 'Error in convertCharStr2SelectiveCPs: byte out of range ' + dec2hex(b) + '!';
			}
		if (haut != 0) {
			if (0xDC00 <= b && b <= 0xDFFF) {
				if (base == 'hex') {
					CPstring += before + dec2hex(0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00)) + after;
					}
				else { cp = 0x10000 + ((haut - 0xD800) << 10) + (b - 0xDC00);
					CPstring += before + cp + after; 
					}
				haut = 0;
				continue;
				}
			else {
				CPstring += 'Error in convertCharStr2SelectiveCPs: surrogate out of range ' + dec2hex(haut) + '!';
				haut = 0;
				}
			}
		if (0xD800 <= b && b <= 0xDBFF) {
			haut = b;
			}
		else {
			if (preserve == 'ascii'&& b <= 127) { //  && b != 0x3E && b != 0x3C &&  b != 0x26) {
				CPstring += str.charAt(i);
				}
			else if (b <= 255 && preserve == 'latin1') { // && b != 0x3E && b != 0x3C &&  b != 0x26) {
				CPstring += str.charAt(i);
				}
			else { 
				if (base == 'hex') {
					cp = dec2hex(b); 
					if (pad) { while (cp.length < 4) { cp = '0'+cp; } }
					}
				else { cp = b; }
				CPstring += before + cp + after; 
				}
			}
		}
	return CPstring;
}


// from pageFooter.xsl
function footeropenwin(windowName, width, height) {
	newWindow = window.open(windowName, 'newWindow', 'toolbar=no,location=no,menubar=no,width=' + width + ',height=' + height + ',scrollbars=yes,resizable=no');
}

function disclaimerOpen(pageName) {
	var width, height, url;
	if (pageName.toLowerCase() == 'copyright') {
		width = 330;
		height = 200;
		url = disclaimerPath + 'Copyright';
	}
	else if (pageName.toLowerCase() == 'termsofuse') {
		width = 330;
		height = 200;
		var str = disclaimerPath + "";
		if(disclaimerPath.substring(1,3)=="it"){    //added to change IT page for terms and conditions
			url = disclaimerPath + 'TermsofUse';
		}else{
			url = disclaimerPath + 'TermsofUse';
		}

	}
	else if (pageName.toLowerCase() == 'immterms') {
		width = 330;
		height = 200;
		url = disclaimerPath + 'IMMTerms';
    }
    else if (pageName.toLowerCase() == 'cookies') {
    width = 530;
    height = 400;
    url = disclaimerPath + 'Cookies';
     }
	else if (pageName.toLowerCase() == 'privacypolicy') {
		width = 530;
		height = 400;
		url = disclaimerPath + 'PrivacyPolicy';
	}
	else {
		return;
	}

	footeropenwin(url, width, height);
}
//to allow more flexibility in the size of the pop ups that open up from the footer. Used for FR
function disclaimerOpenSized(pageName, pageWidth, pageHeight) {
	var url;     
	if (pageName.toLowerCase() == 'copyright') {
		url = disclaimerPath + 'Copyright';
	}
	else if (pageName.toLowerCase() == 'termsofuse') {
		url = disclaimerPath + 'TermsofUse';
	}
	else if (pageName.toLowerCase() == 'privacypolicy') {
		url = disclaimerPath + 'PrivacyPolicy';
	}
	else {
		return;
	}

	footeropenwin(url, pageWidth, pageHeight);
}

var newWindow="";
function disclaimerOpenSized_v2(pageName, pageWidth, pageHeight, langId) {
	var url;
	 
	if (newWindow!="") {
	   newWindow.close();
	}
	if (!(langId)) {     
	   langId = '';
	}
	if (langId !='') {
		langId = '-' + langId;
	}
	if (pageName.toLowerCase() == 'copyright') {
		url = disclaimerPath + 'Copyright';
	}
	else if (pageName.toLowerCase() == 'termsofuse') {
	url = disclaimerPath + 'TermsofUse'; 
	}
	else if (pageName.toLowerCase() == 'privacypolicy') {
	url = disclaimerPath + 'PrivacyPolicy'; 
	}
	else {
		return;
	}

// Reopen, in case it is already open:
	newWindow = window.open(url, 'newWindow', 'toolbar=no,location=no,menubar=no,width=' + pageWidth + ',height=' + pageHeight + ',scrollbars=yes,resizable=no');
	newWindow.focus();
}
function googleEvent(eventTarget,action,eventArgument, aURL)
 {
	//pageTracker._trackEvent(eventTarget, action, eventArgument);
	_gaq.push(['_trackEvent',eventTarget, action, eventArgument]);    
	window.location = aURL;
 }

// change the postback event so that it creates a GA event for all postbacks.
	if (typeof(__doPostBack) == "function")
	{
		var __doPostBackOLD = __doPostBack;
		__doPostBack = function(eventTarget, eventArgument)
	   {
		
		 if(eventTarget.toString().indexOf('$') > 0) {
			var words = new Array();
			words = eventTarget.split('$');
			
			//pageTracker._trackEvent(words[words.length -1], 'Click', eventArgument);
			_gaq.push(['_trackEvent',words[words.length -1], 'Click', eventArgument]); 
		 }
		 
		 
		   __doPostBackOLD(eventTarget, eventArgument);
		}
	}
	
function ArticleFeedbackCall(articleName, writer) {
	var url = currentSiteUrl + "/funds/AnalystFeedback.aspx?articleName=" + escape(articleName) + "&writer=" + escape(writer);
	window.location = url;
}

function showColumnSelectionPopup(idControl, universeId, errorMsg, currPageIndex, pageSize, companyId, advisorId, aimcId, secId, assetTypeId, searchKey, categoryId, distStatus, isOpenInv, incYear, invType, mexClasf, currency, fundFamily, qualifiedInv, apv, ipfs, inswrcomp, catdiff, exid, sortby, sortorder) {
    try {
        if (selectAr.length == 0) {
            alert(errorMsg);
            return;
        }
        else {
            var i = getAbsolutePos(document.getElementById(idControl));
            var popupframe = document.getElementById("columnSelectionPopup");
            popupframe.style.left = i.x + 3 + "px";
            popupframe.style.top = i.y + "px";

            var columnSelectionBox = document.getElementById("columnSelectionBox");

            columnSelectionBox.src = "../util/columnselectionpopup.aspx?universeId=" + universeId + "&currPageIndex=" + currPageIndex + "&pageSize=" + pageSize + "&companyId=" + companyId + "&advisorId=" + advisorId + "&aimcId=" + aimcId + "&secId=" + secId + "&assetTypeId=" + assetTypeId + "&searchKey=" + searchKey + "&categoryId=" + categoryId + "&distStatus=" + distStatus + "&isOpenInv=" + isOpenInv + "&incYear=" + incYear + "&invType=" + invType + "&mexClasf=" + mexClasf + "&curr=" + currency + "&ff=" + fundFamily + "&qinv=" + qualifiedInv + "&apv=" + apv + "&ipfs=" + ipfs + "&inswrcomp=" + inswrcomp + "&catdiff=" + catdiff + "&exid=" + exid + "&sortby=" + sortby + "&sortorder=" + sortorder; 


            var win = document.getElementById("columnSelectionPopup");

            win.style.display = '';
        }
    }
    catch (e)
	{ }
}

function redirectToPremiumPromotional(promotionalPageUrl) {
    window.location = promotionalPageUrl;
}

function GetSearchTerm(id, hdnId) {
	$('#' + hdnId).val($('#' + id).val());
}