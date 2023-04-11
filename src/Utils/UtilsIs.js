function browser() {
    if (window._browser) return window._browser;
    // Opera 8.0+
    var isOpera =
        (!!window.opr && !!window.opr.addons) ||
        !!window.opera ||
        navigator.userAgent.indexOf(" OPR/") >= 0;
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== "undefined";
    // Safari 3.0+ "[object HTMLElementConstructor]"
    var isSafari =
        /constructor/i.test(window.HTMLElement) ||
        (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window["safari"] || window.safari.pushNotification);
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1+
    var isChrome = !!window.chrome || !!window.cordova;
    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    // console.log(394, isChrome);

    return (window._browser = isOpera
        ? "Opera"
        : isFirefox
        ? "Firefox"
        : isSafari
        ? "Safari"
        : isChrome
        ? "Chrome"
        : isIE
        ? "IE"
        : isEdge
        ? "Edge"
        : isBlink
        ? "Blink"
        : "Don't know");
}

function device() {
    if (navigator.userAgent.includes("Android")) {
        return "android";
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return "IOS";
    } else {
        return "desktop";
    }
}

function isAndroid() {
    return device() == "android";
}

function isIOS() {
    return device() == "ios";
}

function isDesktop() {
    return device() == "desktop";
}

function isOpera() {
    return browser() == "Opera";
}

function isFirefox() {
    return browser() == "Firefox";
}

function isSafari() {
    return browser() == "Safari";
}

function isChrome() {
    return browser() == "Chrome";
}

function isIE() {
    return browser() == "IE";
}

function isEdge() {
    return browser() == "Edge";
}

function isBlink() {
    return browser() == "Blink";
}

function typeOf(ctx) {
    if (!ctx) {
        return "";
    }
    switch (true) {
        case typeof ctx == "string":
            return "string";
        case typeof ctx == "number":
            return "number";
        case ctx instanceof Array:
            return "array";
        case ctx instanceof Function:
            return "function";
        case ctx instanceof HTMLCollection:
            return "htmlcollection";
        case ctx instanceof NodeList:
            return "htmlnodelist";
        case ctx instanceof Element:
            return "domlement";
        case ctx instanceof Object:
            return "object";
    }
}

function isArray(ctx) {
    return typeOf(ctx) == "array";
}
function isObject(ctx) {
    return typeOf(ctx) == "object";
}
function isNumber(ctx) {
    return typeOf(ctx) == "number";
}
function isString(ctx) {
    return typeOf(ctx) == "string";
}
function isHTMLCollection(ctx) {
    return typeOf(ctx) == "htmlcollection";
}
function isNodeList(ctx) {
    return typeOf(ctx) == "htmlnodelist";
}
function isElement(ctx) {
    return typeOf(ctx) == "domlement";
}
function isFunction(ctx) {
    return typeOf(ctx) == "function";
}

function isBoolean(ctx) {
    return typeof ctx == "boolean";
}

export {
    browser,
    device,
    isAndroid,
    isIOS,
    isDesktop,
    isOpera,
    isFirefox,
    isSafari,
    isChrome,
    isIE,
    isEdge,
    isBlink,
    typeOf,
    isArray,
    isObject,
    isNumber,
    isString,
    isHTMLCollection,
    isNodeList,
    isElement,
    isFunction,
    isBoolean,
};
