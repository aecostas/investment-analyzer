var DynamicGAFunctions = {};

DynamicGAFunctions.getCookie = function (name) {
    try {
        if (document.cookie.length > 0) {
            var start = document.cookie.indexOf(name + "=");
            if (start != -1) {
                start = start + name.length + 1;
                var end = document.cookie.indexOf(";", start);
                if (end == -1) end = document.cookie.length;
                return decodeURIComponent(document.cookie.substring(start, end));
            }
        }
        return undefined;
    }catch(ex)
    {
        return undefined;
    }
};

DynamicGAFunctions.getAdProfile = function() {
    try {
        var oCookie = DynamicGAFunctions.getCookie('ad-profile');
        if (oCookie) {
            oCookie = eval("(" + oCookie + ")");
            return oCookie;
        } else {
            return undefined;
        }
    } catch(ex) {
        return undefined;
    }
};

DynamicGAFunctions.GetAudienceType = function() {
    
    function getAudienceType(o) {
        var enumAudienceType = {
            '-1': 'Unknow',
            '1': 'Private-Investor-with-advisor',
            '2': 'Private-Investor-without-advisor',
            '3': 'Advisor',
            '4': 'Asset-Manager',
            '5': 'Journalists',
            '6': 'Other-Financial-Professional'
        };
        if (o) {
            var ikey = o['AudienceType'];
            if (ikey) {
                return enumAudienceType[ikey];
            } else {
                return enumAudienceType['-1'];
            }
        } else {
            return enumAudienceType['-1'];
        }
    }

    try {
        var oCookie = DynamicGAFunctions.getAdProfile();
        return getAudienceType(oCookie);
    } catch(ex) {
        return 'Unknow';
    }
};

DynamicGAFunctions.getURL = function (site) {
    try {
        var url = document.location.href;
        url = url.substring(url.indexOf('/') + 1, url.length);
        url = url.substring(url.indexOf('/') + 1, url.length);
        url = url.substring(url.indexOf('/'), url.length);
        if (url == "/" + site + "/") {
            url = "/" + site + "/default.aspx";
        }
        return url;
    } catch(ex) {
        return document.loation.href;
    }
};

DynamicGAFunctions.TrackOBSR = function(site) {
    try {
        var oCookie = DynamicGAFunctions.getAdProfile();

        var url = DynamicGAFunctions.getURL(site);

        if (url.length > 124) {
            url = url.substring(0, 124);
        }

        //the combin name and value can not exceed 128 characters
        if (oCookie && oCookie["IsForObsr"] === true) {
            _gaq.push(['_setCustomVar', 5, 'OBSR', url]);
        }
    } catch(ex) {
        //do nothing
    }
};

DynamicGAFunctions.TrackPDFDownload = function (site, eventcategory) {
    try {
    	_gaq.push(['_trackEvent', eventcategory, 'Download', DynamicGAFunctions.getURL(site)]);
    } catch(ex) {
        //do nothing   
    }
};