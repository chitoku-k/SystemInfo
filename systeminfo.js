/* 
 * SystemInfo.js 1.55 - JavaScript library
 * http://chitoku.symphonic-net.com/
 * Copyright 2014 Chitoku
 * Released under the MIT license
 */

String.prototype.contains = function (s) {
    "use strict";
    return this.indexOf(s) !== -1;
};

var Browser = function (name, version, code) {
    "use strict";
    this.name = name;
    this.version = version;
    this.code = code;
};

var OS = function (name, version) {
    "use strict";
    this.name = name;
    this.version = version;
};

var Device = function (name) {
    "use strict";
    this.name = name;
};

var SystemInfo = function (verify, ua) {
    "use strict";
    this.userAgent.value = ua !== undefined && ua !== null ? ua : navigator.userAgent;
    this.browser = this.getBrowser();
    this.os = this.getOS();
    this.os.platform = this.getPlatform();
    this.device = this.getDevice();
    if (ua === undefined || ua === null || verify) {
        this.verify();
    }
};

SystemInfo.prototype = {
    userAgent: {
        isFake: false,
        value: navigator.userAgent
    },
    getSafariVersion: function () {
        "use strict";
        var match;
        var ua = this.userAgent.value;
        if (match = ua.match(/Version\/([\.\d]+)/)) {
            return match[1];
        }
        var build = ua.match(/AppleWebKit\/(\d+)/)[1];
        switch (true) {
        case build < 85:
            return "0";
        case build < 412:
            return "1";
        case build < 522:
            return "2";
        case build < 528:
            return "3";
        case build < 533:
            return "4";
        case build < 536:
            return "5";
        }
    },
    getIEVersion: function (version) {
        "use strict";
        switch (version) {
        case 3.0:
            return "4.0";
        case 5.0:
            return "5.0";
        case 5.5:
            return "5.5";
        case 5.6:
            return "6.0";
        case 5.7:
            return window.XMLHttpRequest ? "7.0" : "6.0";
        case 5.8:
            return "8.0";
        case 9:
            return "9.0";
        case 10:
            return "10.0";
        default:
            return version;
        }
    },
    getBrowser: function () {
        "use strict";
        var match;
        var version;
        var ua = this.userAgent.value;
        if (match = ua.match(/(Opera)(?:\/| )([\.\d]+)/)) {
            version = window.opera ? window.opera.version() : match[2];
            return new Browser(match[1], version, "Presto");
        }
        if (match = ua.match(/OPR\/([\.\d]+)/)) {
            return new Browser("Opera", match[1], "Blink");
        }
        if (match = ua.match(/(?:MSIE |Trident.+rv:)([\.\d]+)/)) {
            return new Browser("Internet Explorer", match[1], "Trident");
        }
        if (match = ua.match(/Navigator\/(9[\.\d]+)/)) {
            return new Browser("Netscape Navigator", match[1], "Gecko");
        }
        if (match = ua.match(/Netscape\/(8[\.\d]+)/)) {
            return new Browser("Netscape Browser", match[1], "Gecko");
        }
        if (match = ua.match(/(Netscape|Firefox)6?\/([\.\d]+)/)) {
            return new Browser(match[1], match[2], "Gecko");
        }
        if (match = ua.match(/(?:Chrome|CriOS)\/([\.\d]+)/)) {
            version = match[1].slice(0, match[1].indexOf(".")) < 28 ? "WebKit" : "Blink";
            return new Browser("Google Chrome", match[1], version);
        }
        if (ua.contains("Safari")) {
            return new Browser("Safari", this.getSafariVersion(), "WebKit");
        }
        if (match = ua.match(/(NetFront)\/([\.\d]+)/)) {
            return new Browser(match[1], match[2]);
        }
        if (ua.contains("PSP")) {
            if (window.pspext) {
                var pspobj = window.pspext.sysGetEnv('x-psp-browser');
                if (pspobj) {
                    return new Browser("NetFront (" + ((pspobj.match(/\((..);/)[1] === "LX") ? "XMB" : "Application") + ")");
                }
            }
            return new Browser("NetFront");
        }
        if (match = ua.match(/Mozilla\/([34][\.\d]+)/)) {
            return new Browser("Netscape " + { "3": "Communicatior", "4": "Navigator" }[match[1].charAt(0)], match[1]);
        }
        if (ua.contains("Mozilla")) {
            return new Browser("Mozilla");
        }
        return { };
    },
    verify: function () {
        "use strict";
        var version;
        var ua = this.userAgent.value;
        var empty = this.browser.name === undefined;
        if (window.opera && (empty || this.browser.name !== "Opera")) {
            this.userAgent.isFake = true;
            this.browser = new Browser("Opera", window.opera.version(), "Presto");
        }
        if (window.Components && (empty || !/(Firefox|Netscape)/.test(ua))) {
            this.userAgent.isFake = true;
            this.browser = new Browser("Firefox", undefined, "Gecko");
        }
        if (window.chrome && this.browser.name != "Safari" && (empty || !/(Chrome|Opera)/.test(ua))) {
            this.userAgent.isFake = true;
            this.browser = new Browser("Google Chrome", undefined, "WebKit");
        }
        if (document.defaultView && document.defaultView.getComputedStyle && !window.Components && !window.opera && !window.chrome && !document.documentMode && (empty || !/Safari|CriOS|Chrome|Opera/.test(ua))) {
            this.userAgent.isFake = true;
            this.browser = new Browser("Safari", undefined, "WebKit");
        }
        if (document.documentMode !== undefined && (empty || this.browser.name !== "Internet Explorer")) {
            this.userAgent.isFake = true;
            this.browser = new Browser("Internet Explorer");
        }
        /*@cc_on
        // Internet Explorer 11 no longer supports conditional comments.
        var ie = this.getIEVersion(@_jscript_version);
        if (empty || this.browser.name !== "Internet Explorer") {
            this.userAgent.isFake = true;
            this.browser = new Browser("Internet Explorer", ie);
        } else if (this.browser.version !== ie) {
            if (match = ua.match(/MSIE ([\d]+)/) && this.browser.version >= 7) {
                if (match[1] === "7" && ua.contains("Trident")) {
                    this.browser.version = ie + " (IE 7 Compatibility View)";
                } else {
                    this.browser.version = ie + " (IE " + match[1] + " Mode)";
                }
            } else {
                this.browser.version = ie;
            }
        }
        @*/
    },
    getPlatform: function () {
        "use strict";
        return this.userAgent.value.contains("WOW64") ? "WOW64" : navigator.platform;
    },
    getWindowsNTVersion: function (version) {
        "use strict";
        switch (version) {
        case "NT 5.0":
        case "2000":
            return new OS("Windows 2000", "NT 5.0");
        case "NT 5.1":
        case "NT 5.2":
        case "XP":
            return new OS("Windows XP", "NT 5.1");
        case "NT 6.0":
            return new OS("Windows Vista", version);
        case "NT 6.1":
            return new OS("Windows 7", version);
        case "NT 6.2":
            return new OS("Windows 8", version);
        case "NT 6.3":
            return new OS("Windows 8.1", version);
        default:
            return new OS("Windows", version);
        }
    },
    getOS: function () {
        "use strict";
        var match;
        var version;
        var ua = this.userAgent.value;
        if (match = ua.match(/(Windows Phone(?: OS)?) ([\.\d]+)/)) {
            return new OS(match[1], match[2]);
        }
        if (match = ua.match(/Win(?:dows )?(NT [\.\d]+|XP|2000)/)) {
            return this.getWindowsNTVersion(match[1]);
        }
        if (/Win(dows )? (9x 4\.90|ME|Me)/.test(ua)) {
            return new OS("Windows Me", "4.9");
        }
        if (match = ua.match(/Win(?:dows )?(95|98)/)) {
            return new OS("Windows " + match[1], { "95": "4.0", "98": "4.1" }[match[1]]);
        }
        if (match = ua.match(/(Mac OS X) ([_\.\d]+)/)) {
            return new OS(match[1], match[2].replace(/_/g, "."));
        }
        if (match = ua.match(/(iPhone|iPod|iPad)/)) {
            if (match = ua.match(/OS ([_\d]+)/)) {
                return new OS("iOS", match[1].replace(/_/g, "."));
            }
            return new OS("iOS", undefined);
        }
        if (match = ua.match(/(Mac OS( X)?)/)) {
            return new OS(match[1], undefined);
        }
        if (match = ua.match(/(Android) ([\.\d]+)/)) {
            return new OS(match[1], match[2]);
        }
        if (/(Kindle Fire|KFOT|KFTT|KFJW)/.test(ua)) {
            return new OS("Android", undefined);
        }
        if (match = ua.match(/(Ubuntu|Linux|(Free|Net|Open)BSD)/)) {
            return new OS(match[1], undefined);
        }
        if (ua.contains("SunOS")) {
            return new OS("Solaris", undefined);
        }
        if (ua.contains("PSP")) {
            if (window.pspext) {
                var pspobj = window.pspext.sysGetEnv('x-psp-browser');
                if (pspobj && (match = pspobj.match(/system=([\.\d]+)/))) {
                    return new OS("PSP", match[1]);
                }
            }
            return new OS("PSP", undefined);
        }
        if (match = ua.match(/PlayStation Vita ([\.\d]+)/)) {
            return new OS("PS Vita", match[1]);
        }
        return { };
    },
    devices: {
        "Kindle Fire": "Kindle Fire (1st gen.)",
        "KFOT": "Kindle Fire (2nd gen.)",
        "KFTT": "Kindle Fire HD",
        "KFJW": "Kindle Fire HD 8.9",
        "Nitro": "Nintendo DS",
        "PSP": "PlayStation Portable",
        "PLAYSTATION 3": "PlayStation 3",
        "PS2": "PlayStation 2"
    },
    getDevice: function () {
        "use strict";
        var match;
        var ua = this.userAgent.value;
        if (match = ua.match(/(iPhone|iPod|iPad|PlayStation Vita|(Nintendo (Wii|DSi|3DS))|Xbox|BlackBerry ?\d+)/) ||
                    ua.match(/Android [0-9A-Za-z\.\;\-\_\s]+; ([0-9A-Za-z\-\_ \/]+) Build/)) {
            return new Device(match[1]);
        }
        for (var key in this.devices) {
            if (ua.contains(key)) {
                return new Device(this.devices[key]);
            }
        }
        return { };
    }
};