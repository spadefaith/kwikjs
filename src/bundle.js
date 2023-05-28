var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/Utils/UtilsFunction.js
var UtilsFunction_exports = {};
__export(UtilsFunction_exports, {
  recurse: () => recurse
});

// src/Utils/UtilsIs.js
var UtilsIs_exports = {};
__export(UtilsIs_exports, {
  browser: () => browser,
  device: () => device,
  isAndroid: () => isAndroid,
  isArray: () => isArray,
  isBlink: () => isBlink,
  isBoolean: () => isBoolean,
  isChrome: () => isChrome,
  isDesktop: () => isDesktop,
  isEdge: () => isEdge,
  isElement: () => isElement,
  isFalsy: () => isFalsy,
  isFirefox: () => isFirefox,
  isFunction: () => isFunction,
  isHTMLCollection: () => isHTMLCollection,
  isIE: () => isIE,
  isIOS: () => isIOS,
  isNodeList: () => isNodeList,
  isNull: () => isNull,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isOpera: () => isOpera,
  isSafari: () => isSafari,
  isString: () => isString,
  isTruthy: () => isTruthy,
  isURL: () => isURL,
  isUndefined: () => isUndefined,
  typeOf: () => typeOf
});
function browser() {
  if (window._browser)
    return window._browser;
  var isOpera2 = !!window.opr && !!window.opr.addons || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
  var isFirefox2 = typeof InstallTrigger !== "undefined";
  var isSafari2 = /constructor/i.test(window.HTMLElement) || function(p) {
    return p.toString() === "[object SafariRemoteNotification]";
  }(!window["safari"] || window.safari.pushNotification);
  var isIE2 = !!document.documentMode;
  var isEdge2 = !isIE2 && !!window.StyleMedia;
  var isChrome2 = !!window.chrome || !!window.cordova;
  var isBlink2 = (isChrome2 || isOpera2) && !!window.CSS;
  return window._browser = isOpera2 ? "Opera" : isFirefox2 ? "Firefox" : isSafari2 ? "Safari" : isChrome2 ? "Chrome" : isIE2 ? "IE" : isEdge2 ? "Edge" : isBlink2 ? "Blink" : "Don't know";
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
function isUndefined(ctx) {
  return ctx == void 0;
}
function isNull(ctx) {
  return ctx == void 0;
}
function isFalsy(ctx) {
  return !ctx;
}
function isTruthy(ctx) {
  return !!ctx;
}
function isURL(str) {
  try {
    let url = new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

// src/Utils/UtilsFunction.js
function recurse(array, callback) {
  let l = array.length;
  let index = 0;
  let cache = [];
  return new Promise((res, rej) => {
    try {
      const _recurse = (callback2) => {
        if (index < l) {
          let item = array[index];
          const called = callback2(item, index);
          if (isUndefined(called)) {
            res(cache);
          } else if (called.then) {
            called.then((result) => {
              index += 1;
              cache.push(result);
              _recurse(callback2);
            });
          } else {
            index += 1;
            cache.push(called);
            _recurse(callback2);
          }
        } else {
          res(cache);
        }
      };
      _recurse(callback);
    } catch (err) {
      rej(err);
    }
  });
}

// src/MemCache/Object.js
var storage = {};
function Object_default(name) {
  if (!storage[name]) {
    storage[name] = {};
  }
  return {
    set(key, value) {
      storage[name][key] = value;
      return true;
    },
    push(key, value) {
      if (!storage[name][key]) {
        storage[name][key] = [];
      }
      storage[name][key].push(value);
    },
    get(key) {
      if (key) {
        return storage[name][key];
      } else {
        return storage[name];
      }
    },
    getAll() {
      return storage[name];
    },
    destroy(key) {
      if (key) {
        delete storage[name][key];
      } else {
        storage[name] = {};
      }
      return true;
    }
  };
}

// src/MemCache/Element.js
var Element_default = class {
  constructor(el) {
    this.el = el;
    if (!this.el) {
      this.el = document.createElement("div");
      el.dataset.cache = true;
      document.head.append(el);
    }
    if (!this.el.__storage) {
      this.el.__storage = {};
    }
  }
  set(key, value) {
    this.el.__storage[key] = value;
  }
  get(key) {
    return key == void 0 ? this.el.__storage : this.el.__storage[key];
  }
  remove(key) {
    if (key == void 0) {
      this.el.__storage = {};
    } else {
      delete this.el.__storage[key];
    }
  }
};

// src/MemCache/index.js
var MemCache_default = {
  object: Object_default,
  element: Element_default
};

// src/Observer/Observer.js
var Observer = class {
  constructor() {
    this.store = MemCache_default.object("__observer");
  }
  async broadcast(event, payload) {
    let subscribers = this.store.get(event);
    if (subscribers && subscribers.length) {
      return recurse(subscribers, (handler, index) => {
        return handler(payload);
      });
    }
  }
  register(event, handler) {
    if (!this.store.get(event)) {
      this.store.set(event, []);
    }
    let subscribers = this.store.get(event);
    subscribers.push(handler);
    this.store.set(event, subscribers);
  }
};

// src/Utils/UtilsElement.js
var UtilsElement_exports = {};
__export(UtilsElement_exports, {
  addEventListener: () => addEventListener,
  classNameTogglerByDataName: () => classNameTogglerByDataName,
  querySelectorAllIncluded: () => querySelectorAllIncluded,
  querySelectorIncluded: () => querySelectorIncluded,
  replaceDataSrc: () => replaceDataSrc,
  toArray: () => toArray,
  toElement: () => toElement,
  unRequired: () => unRequired
});

// src/Utils/UtilsArray.js
var UtilsArray_exports = {};
__export(UtilsArray_exports, {
  each: () => each,
  filter: () => filter,
  map: () => map,
  reduce: () => reduce
});
function _each(ctx, fn, type, reversed = false) {
  if (type == "object") {
    let i = 0;
    for (let key in ctx) {
      if (Object.prototype.hasOwnProperty.call(ctx, key)) {
        fn({ key, value: ctx[key] }, i);
        i = i + 1;
      }
    }
  } else {
    if (reversed) {
      for (let a = ctx.length; a > ctx.length; a--) {
        let res = fn(ctx[a], a);
        if (res == "break") {
          break;
        } else if (res == "continue") {
          continue;
        }
      }
    } else {
      for (let a = 0; a < ctx.length; a++) {
        let res = fn(ctx[a], a);
        if (res == "break") {
          break;
        } else if (res == "continue") {
          continue;
        }
      }
    }
  }
}
function each(ctx, fn, reversed) {
  var type = isArray(ctx) || ctx.length ? "array" : "object";
  _each(
    ctx,
    function(obj, index) {
      fn(obj, index);
    },
    type,
    reversed
  );
}
function map(ctx, fn, reversed) {
  let type = isArray(ctx) || ctx.length ? "array" : "object";
  let st = type == "array" ? [] : {};
  _each(
    ctx,
    function(obj, index) {
      let r = fn(obj, index);
      if (type == "object") {
        st[r.key] = r.value;
      } else {
        st.push(r);
      }
    },
    type,
    reversed
  );
  return st;
}
function reduce(ctx, accu, fn, reversed) {
  let type = isArray(ctx) || ctx.length ? "array" : "object";
  _each(
    ctx,
    function(obj, index) {
      accu = fn(obj, accu, index);
    },
    type,
    reversed
  );
  return accu;
}
function filter(ctx, fn, reversed) {
  let type = isArray(ctx) || ctx.length ? "array" : "object";
  var st = type == "array" ? [] : {};
  _each(
    ctx,
    function(obj, index) {
      var r = fn(obj, index);
      if (r) {
        if (type == "object") {
          st[obj.key] = obj.value;
        } else {
          st.push(obj.value);
        }
      }
    },
    type,
    reversed
  );
  return st;
}

// src/Utils/UtilsElement.js
function toArray(elements, reversed = false) {
  if (isArray(elements)) {
    return elements;
  }
  if (elements.length != void 0 && elements.tagName != "FORM") {
    let b = [];
    let length = elements.length;
    if (reversed) {
      let index = length;
      while (--index > -1) {
        b.push(elements[index]);
      }
    } else {
      for (let a = 0; a < length; a++) {
        b.push(elements[a]);
      }
    }
    return b;
  } else if (!isArray(elements)) {
    return [elements];
  }
}
function querySelectorIncluded(element, selector, attr, val) {
  let query = document.querySelector(selector);
  if (query) {
    return query;
  }
  if (!attr && !val) {
    let qu = element.closest(selector);
    return qu || null;
  } else if (!!attr && !!val) {
    return element.getAttribute(attr) == val ? element : null;
  } else if (!!attr && !val) {
    return element.getAttribute(attr) ? element : null;
  }
}
function querySelectorAllIncluded(element, selector, attr, val, isLog) {
  let q = null;
  try {
    q = element.querySelectorAll(selector);
    q && (q = toArray(q));
  } catch (err) {
    q = [];
  }
  if (isLog) {
  }
  if (selector) {
    q = toArray(element.querySelectorAll(selector));
    let s = element.closest(selector);
    s && q.unshift(s);
  } else if (attr && val) {
    q = toArray(element.querySelectorAll(`[${attr}=${val}]`));
    if (element.dataset[attr] == val) {
      q.push(element);
    }
  } else if (attr && !val) {
    q = toArray(element.querySelectorAll(`[${attr}]`));
    if (element.dataset[attr]) {
      q.push(element);
    }
  } else if (!attr && !val) {
    let qu = element.closest(selector);
    qu == element && q.push(qu);
  }
  return q;
}
function classNameTogglerByDataName(elements, dataName, activeClass) {
  for (let t = 0; t < elements.length; t++) {
    let node = elements[t];
    let name = node.dataset.name;
    if (name == dataName) {
      node.classList.toggle(activeClass);
    } else {
      if (node.classList.contains(activeClass)) {
        node.classList.toggle(activeClass);
      }
    }
  }
}
function replaceDataSrc(root) {
  if (!root) {
    throw new Error("data-src is not found");
  }
  let srcs = querySelectorAllIncluded(root, "data-src", null);
  for (let s = 0; s < srcs.length; s++) {
    let el = srcs[s];
    if (el && el.dataset.src) {
      el.setAttribute("src", el.dataset.src);
      el.removeAttribute("data-src");
    }
  }
}
function unRequired(root) {
  let srcs = root.querySelectorAll("[required]");
  for (let i = 0; i < srcs.length; i++) {
    let el = srcs[i];
    if (el) {
      el.removeAttribute("required");
    }
  }
}
function addEventListener(el, event, handler, options) {
  return el.addEventListener(event, handler, options);
}
function toElement(template) {
  let fr = document.createElement("template");
  fr.innerHTML = template;
  return fr.content.children;
}

// src/Utils/UtilsString.js
var UtilsString_exports = {};
__export(UtilsString_exports, {
  escapeRegExp: () => escapeRegExp,
  removeSpace: () => removeSpace,
  sanitize: () => sanitize,
  splitBySpace: () => splitBySpace,
  toCamelCase: () => toCamelCase,
  toHyphen: () => toHyphen,
  toLogical: () => toLogical,
  toProper: () => toProper,
  uuid: () => uuid
});
function toHyphen(string) {
  const name = `to-hyphen_${string}`;
  const containerName = "toHyphen";
  const cached = MemCache_default.object(containerName).get(name);
  if (cached) {
    return cached;
  }
  const splitted = string.split("");
  let ss = "", i = -1;
  while (++i < splitted.length) {
    let s = splitted[i];
    switch (i) {
      case 0:
        {
          ss += s.toLowerCase();
        }
        break;
      default: {
        s.charCodeAt() < 91 && (ss += "-");
        ss += s.toLowerCase();
      }
    }
  }
  MemCache_default.object(containerName).set(name, ss);
  return ss;
}
function toProper(string) {
  const name = `to-proper_${string}`;
  const containerName = "toProper";
  const cached = MemCache_default.object(containerName).get(name);
  if (cached) {
    return cached;
  }
  let first = string.substring(0, 1);
  let rest = string.slice(1).toLowerCase();
  let proper = `${first.toUpperCase()}${rest}`;
  MemCache_default.object(containerName).set(name, proper);
  return proper;
}
function removeSpace(string) {
  return string.replaceAll(" ", "");
}
function toCamelCase(string) {
  const name = `to-proper_${string}`;
  const containerName = "toCamelCase";
  const cached = MemCache_default.object(containerName).get(name);
  if (cached) {
    return cached;
  }
  string = string.toLowerCase();
  if (string.length == 1) {
    return string;
  }
  let split = string.split("-");
  let join = "";
  let i = -1;
  let length = split.length;
  while (++i < length) {
    let string2 = split[i];
    switch (i) {
      case 0:
        {
          join += string2;
        }
        break;
      default:
        {
          let first = string2.substring(0, 1).toUpperCase();
          let second = string2.substring(1);
          join += first + second;
        }
        break;
    }
  }
  MemCache_default.object(containerName).set(name, join);
  return join;
}
function sanitize(data) {
  const map2 = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#x27;",
    "/": "&#x2F;"
  };
  const reg = /[&<>"'/]/gi;
  if (typeof data == "string") {
    return data.replace(reg, (match) => map2[match] || "");
  } else {
    return data;
  }
}
function uuid() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return `ck-${uint32.toString(16)}`;
}
function toLogical(a, ops, b) {
  try {
    a = JSON.parse(a);
  } catch (err) {
  }
  try {
    b = JSON.parse(b);
  } catch (err) {
  }
  switch (ops) {
    case "==": {
      return a == b;
    }
    case "!=": {
      return a != b;
    }
    case "<": {
      return a < b;
    }
    case ">": {
      return a > b;
    }
    case ">=": {
      return a >= b;
    }
    case "<=": {
      return a <= b;
    }
  }
}
function splitBySpace(string, fn) {
  if (string) {
    string = string.split(" ");
    for (let i = 0; i < string.length; i++) {
      fn(string[i]);
    }
  }
}
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// src/Utils/UtilsTemplate.js
var UtilsTemplate_exports = {};
__export(UtilsTemplate_exports, {
  getContent: () => getContent
});
function _collectContent(template) {
  let cf = null;
  let temp = template.cloneNode(true);
  let fr = document.createDocumentFragment();
  let styles = temp.content.querySelector("style");
  if (styles) {
    fr.appendChild(styles);
  }
  let others = [];
  for (let o = 0; o < temp.content.children.length; o++) {
    let el = temp.content.children[0];
    others.push(el);
  }
  cf = { style: fr.children[0], others };
  return cf;
}
function _parseStyle(style) {
  if (!style)
    return false;
  var styles = style.textContent.trim();
  if (!styles.length) {
    return;
  }
  let regexp = "((\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
  let regexp1 = "([\\s\\S]*?){([\\s\\S]*?)}";
  let parsed = styles.matchAll(regexp);
  let props = {
    __x__other: {},
    __x__append: ""
  };
  for (let i of parsed) {
    let [a, b, c, d, e, f] = i;
    if (a.includes("@keyframes")) {
      props.__x__append += a;
    } else if (a.includes("@media")) {
      props.__x__append += `${a} }`;
    } else {
      let _parsed = a.matchAll(regexp1);
      for (let i2 of _parsed) {
        let [a2, b2, c2] = i2;
        b2 = b2.trim();
        let cTrim = c2.replace(/\n/g, "").trim();
        if (!props[b2]) {
          props[b2] = cTrim;
        } else {
          props[b2] += cTrim;
        }
        if (b2.slice(1).includes(".")) {
          if (!props.__x__other[b2]) {
            props.__x__other[b2] = "";
          }
          props.__x__other[b2] += a2;
        }
      }
    }
  }
  return props;
}
function _parseHTML(others) {
  if (others) {
    var parent = document.createElement("HTML");
    for (let o = 0; o < others.length; o++) {
      let other = others[o];
      parent.append(other);
    }
  }
  return parent || false;
}
function getContent(template, isConvert) {
  let _collectedContent = _collectContent(template);
  let style = _collectedContent.style;
  let others = _collectedContent.others;
  let styles = _parseStyle(style);
  let element = _parseHTML(others);
  let sOther = styles.__x__other || {};
  delete styles.__x__other;
  let s = "";
  for (let selector in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, selector)) {
      let css = styles[selector];
      let query = element.querySelectorAll(selector);
      if (query.length) {
        for (let q = 0; q < query.length; q++) {
          let item = query[q];
          item.setAttribute("style", css);
        }
      } else {
        if (selector == "__x__append") {
          s += css;
        } else {
          s += sOther[selector];
        }
      }
    }
  }
  appendStyle(s);
  element = isConvert ? toArray(element.children) : element.innerHTML;
  return element.length == 1 ? element[0] : element;
}
function appendStyle(str) {
  if (!str) {
    return;
  }
  let style = document.createElement("style");
  style.innerHTML = str;
  document.head.appendChild(style);
}

// src/Utils/UtilsForm.js
var UtilsForm_exports = {};
__export(UtilsForm_exports, {
  plot: () => plot,
  sanitize: () => sanitize2,
  toFormData: () => toFormData,
  toUrlSearchParams: () => toUrlSearchParams
});
function toUrlSearchParams(obj, istrim = true) {
  let searchParams = "";
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let val = obj[key];
      if (val.toString().includes("Object")) {
        val = JSON.stringify(val);
      }
      if (istrim && val) {
        searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
      } else {
        searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
      }
    }
  }
  return searchParams.slice(0, searchParams.length - 1);
}
function sanitize2(string, exclude = []) {
  if (typeof string != "string") {
    return string;
  }
  return decodeURIComponent(string.replace(/<.*>/, ""));
}
function toFormData(form, options = {}) {
  const controls = [];
  const textareas = form.querySelectorAll("TEXTAREA");
  const inputs = form.querySelectorAll("INPUT");
  const selects = form.querySelectorAll("SELECT");
  function loop2(arr, cont, sort) {
    let files = [];
    for (let i = 0; i < arr.length; i++) {
      let test = true;
      try {
        test = arr[i].closest(".cake-template");
      } catch (err) {
      }
      try {
        if (!test) {
          test = arr[i].classList.includes("cake-template");
        }
      } catch (err) {
      }
      if (test) {
      } else {
        if (arr[i].getAttribute("type") == "file") {
          files.push(arr[i]);
        } else {
          cont.push(arr[i]);
        }
      }
    }
    if (files.length) {
      files.forEach((item) => {
        cont.push(item);
      });
      files = [];
    }
  }
  loop2(textareas, controls);
  loop2(selects, controls);
  loop2(inputs, controls, true);
  let o = {};
  for (let i = 0; i < controls.length; i++) {
    let control = controls[i];
    let key = control.name || control.id;
    if (key && ["{{", "((", "[[", "<<", "%%", "&&"].includes(key)) {
    } else {
      let type;
      let element = form[key];
      if (element) {
        if (element.nodeType) {
        } else if (element.length) {
          for (let i2 = 0; i2 < element.length; i2++) {
            let el = element[i2];
            if (el.nodeType == 1) {
              let test = el.closest(".cake-template");
              if (test) {
              } else {
                element = el;
                break;
              }
            }
          }
        }
        const tag = element.tagName;
        let value = "";
        if (tag == "SELECT") {
          value = element.value;
        } else if (tag == "INPUT" && element.getAttribute("type") == "checkbox") {
          value = element.checked;
        } else if (tag == "INPUT" && element.getAttribute("type") == "file") {
          value = element.files;
        } else {
          if (options.sanitize == false) {
            value = element.value;
          } else {
            value = this.sanitize(
              element.value,
              options.skipsanitize
            );
          }
        }
        if (options.json) {
          if (options.trim) {
            if (value != "") {
              o[key] = value;
            }
          } else {
            o[key] = value;
          }
        } else {
          o[key] = value;
        }
      }
    }
  }
  if (options.json) {
    return o;
  } else {
    let fd = new FormData();
    for (let key in o) {
      if (Object.prototype.hasOwnProperty.call(o, key)) {
        let value = o[key];
        if (value.constructor.name == "FileList") {
          each(value, function(item, index) {
            fd.append(key, item, item.name);
          });
        } else {
          fd.append(key, value);
        }
      }
    }
    return fd;
  }
}
function plot(config) {
  let data = config.data;
  let container = config.container;
  if (!data && !container) {
    return;
  }
  const query = (root, selector, callback) => {
    if (!root) {
      console.info("root is not provided!");
      return;
    }
    const els = root.querySelectorAll(`${selector}`);
    const len = els.length;
    if (!len) {
      callback(null, data);
      return;
    }
    for (let e = 0; e < len; e++) {
      let el = els[e];
      let name = el.name;
      let value = data[name];
      let r = callback(el, value, e);
      if (r == "break") {
        break;
      }
      if (r == "continue") {
        continue;
      }
    }
  };
  query(container, "INPUT.input", function(el, value) {
    if (!el) {
      return;
    }
    if (value != void 0) {
      if (el.type == "date") {
        value = new Date(value) == "Invalid Date" ? "" : new Date(value).toJSON().split("T")[0];
        el.value = value;
      } else {
        el.value = value;
      }
    }
  });
  query(container, "TEXTAREA.input", function(el, value) {
    if (!el) {
      return;
    }
    if (value != void 0) {
      el.value = value;
    }
  });
  setTimeout(() => {
    query(
      container,
      "SELECT.input:not(.cake-template)",
      function(select, value) {
        if (!select) {
          return;
        }
        query(
          select,
          "OPTION:not(.cake-template)",
          function(option, _value, index) {
            if (option) {
              if (option.value == value) {
                select.selectedIndex = index;
                return "break";
              }
            } else {
              console.log(option, _value, "provide schema");
            }
          }
        );
      }
    );
  }, 100);
  return Promise.resolve();
}

// src/Utils/index.js
var Utils_default = {
  is: UtilsIs_exports,
  element: UtilsElement_exports,
  string: UtilsString_exports,
  array: UtilsArray_exports,
  function: UtilsFunction_exports,
  template: UtilsTemplate_exports,
  form: UtilsForm_exports
};

// src/Observer/index.js
var Observer2 = class {
  constructor(name) {
    this.name = name;
    this.handlers = {};
    this.subscribe = [];
    this.observer = new Observer();
  }
  // _handlers(callback = {}, ctx) {
  //     console.log("here");
  //     if (!Object.keys(callback).length) {
  //         return;
  //     }
  //     if (!ctx.handlers) {
  //         ctx.handlers = {};
  //     }
  //     for (let key in callback) {
  //         if (Object.prototype.hasOwnProperty.call(callback, key)) {
  //             let fn = callback[key].bind(ctx);
  //             let listeners = function () {
  //                 console.log("here");
  //                 return this.subscribe.filter((item) => {
  //                     return item.from == ctx.name;
  //                 });
  //             }.bind(this);
  //             this.handlers[key] = async function () {
  //                 let _listeners = listeners();
  //                 let payload = await fn();
  //                 await Promise.all(
  //                     _listeners.map((fn) => {
  //                         return fn.handler(payload);
  //                     })
  //                 );
  //                 return payload;
  //             }.bind(ctx);
  //             ctx.handlers[key] = async function () {
  //                 let _listeners = listeners();
  //                 let payload = await fn();
  //                 console.log(49,_listeners);
  //                 await recurse(_listeners,async (fn, index)=>{
  //                     console.log(50,fn);
  //                     return fn.handler(payload);
  //                 });
  //                 // await Promise.all(
  //                 //     _listeners.map((fn) => {
  //                 //         return fn.handler(payload);
  //                 //     })
  //                 // );
  //                 return payload;
  //             }.bind(ctx);
  //         }
  //     }
  //     // console.log(40, this.handlers);
  // }
  _subscriber(_components = {}, ctx) {
    if (!Object.keys(_components).length) {
      return;
    }
    for (let _c in _components) {
      if (Object.prototype.hasOwnProperty.call(_components, _c)) {
        let events = _components[_c];
        for (let eventName in events) {
          if (Object.prototype.hasOwnProperty.call(events, eventName)) {
            let event = events[eventName];
            let bindEvent = event.bind(ctx);
            this.observer.register(`${_c}-${eventName}`, bindEvent);
          }
        }
      }
    }
  }
  async broadcast(component, event, payload) {
    const key = `${component}-${event}`;
    let subscriber = this.observer.store.get(key);
    if (subscriber && Utils_default.is.isArray(subscriber)) {
      return await recurse(subscriber, (callback, index) => {
        return callback(payload);
      });
    }
  }
  _setComponents(components) {
    this.components = components;
  }
};

// src/Piece.js
function remove(element) {
  let fg = document.createDocumentFragment();
  element && fg.appendChild(element);
  fg = null;
  return true;
}
function getElementsByDataset() {
  let o = {};
  let element = arguments[0];
  let args = arguments[1];
  let isLog = arguments[2];
  Utils_default.array.each(args, function(arg, index) {
    if (!o[arg]) {
      o[arg] = [];
    }
    let els = Utils_default.element.querySelectorAllIncluded(
      element,
      arg,
      null,
      null,
      isLog
    );
    Utils_default.array.each(els, function(el, index2) {
      o[arg].push(el);
    });
  });
  return o;
}
function applyCss(element, styles) {
  Utils_default.array.each(styles, function(css, index) {
    let { key, value } = css;
    if (Utils_default.is.isObject(value)) {
      let selector = key;
      let elCss = value;
      Utils_default.array.each(elCss, function(css2, index2) {
        let { key: key2, value: value2 } = css2;
        let target = Utils_default.element.querySelectorIncluded(
          element,
          selector
        );
        if (target) {
          target.style[key2] = value2;
        }
      });
    } else {
      element.style[key] = value;
    }
  });
}
function appendTo(root, element, cleaned, callback) {
  if (!root && !root.attributes) {
    throw new TypeError(`the ${root} is not an instance of Element`);
  }
  cleaned && (root.innerHTML = "");
  root.appendChild(element);
  callback && callback(element, root);
}
var Piece = class {
  constructor(el) {
    this.el = el;
  }
  toArray() {
    return Utils_default.element.toArray(this._el);
  }
  loop(callback) {
    return callback(this.el);
  }
  get getElements() {
    return this.el;
  }
  getElement() {
    return this.el;
  }
  remove() {
    return remove(this.el.el || this.el);
  }
  unRequired() {
    Utils_default.element.unRequired(this.el);
  }
  replaceDataSrc() {
    Utils_default.element.replaceDataSrc(this.el);
  }
  cloneNode() {
    return new Piece(this.el.cloneNode(true));
  }
  dataset(data) {
    return this.el.dataset[data] || null;
  }
  getContainers() {
    let container = this.getElementsByDataset("container").container;
    return container;
  }
  getAllElements() {
    return Utils_default.element.toArray(this.el.getElementsByTagName("*"));
  }
  css(obj) {
    return applyCss(this.el, obj);
  }
  appendTo(roots, cleaned, callback) {
    return appendTo(roots, this.el, cleaned, callback);
  }
  getElementsByTagName(tag) {
    return Utils_default.element.toArray(this.el.getElementsByTagName(tag));
  }
  getElementById(selector) {
    return Utils_default.element.toArray(this.el.getElementById(selector));
  }
  querySelectorAll(selector) {
    return Utils_default.element.toArray(this.el.querySelectorAll(selector));
  }
  querySelector(selector) {
    return Utils_default.element.toArray(this.el.querySelector(selector));
  }
  querySelectorIncluded(selector, attr, val) {
    return Utils_default.element.querySelectorIncluded(
      this.el,
      selector,
      attr,
      val
    );
  }
  querySelectorAllIncluded(selector, attr, val) {
    return Utils_default.element.querySelectorAllIncluded(
      this.el,
      selector,
      attr,
      val
    );
  }
  contains(el) {
    return this.el.contains(el);
  }
  getElementsByDataset() {
    return getElementsByDataset(this.el, arguments);
  }
};

// src/Attrib/Utils.js
function _static(component, qs, isStatic) {
  let els = [];
  for (let t = 0; t < qs.length; t++) {
    let el = qs[t];
    if (isStatic) {
      let dComponent = el.closest("[data-component]");
      dComponent = dComponent && dComponent.dataset.component;
      if (dComponent == component) {
        els.push(el);
      }
    } else {
      els.push(el);
    }
  }
  return els;
}
function loop(attr, els, component, isStatic, cb) {
  if (!els.length) {
    return false;
  }
  els = _static(component, els, isStatic);
  if (!els.length) {
    return false;
  }
  for (let i = 0; i < els.length; i++) {
    let el = els[i];
    let id = Utils_default.string.uuid();
    let target, gr;
    if (attr.includes(",")) {
      let attrs = attr.split(",");
      target = {}, gr = {};
      for (let a = 0; a < attrs.length; a++) {
        let attr2 = attrs[a];
        target[attr2] = el.dataset[attr2];
        gr[attr2] = target.split(",");
      }
    } else {
      target = el.dataset[attr];
      gr = target.split(",");
    }
    cb(el, id, target, gr, i);
  }
  return true;
}

// src/Attrib/compile/CompileAttr.js
async function compileAttr(elModels, component, isStatic, html, storage2) {
  let regex = new RegExp("<|>|===|==|!==|!=");
  let compileName = "attr";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      let hasRegularLog, hasNegate, bindVal, ops, testVal;
      let _sp2 = target.split("&&");
      let test = _sp2[0];
      let attrPair = _sp2[1];
      attrPair = attrPair.trim();
      let _sp1 = attrPair.split("=");
      let attrkey = _sp1[0];
      let attrvalue = _sp1[1];
      let bind = "";
      test = test.trim();
      hasRegularLog = test.match(regex);
      hasNegate = test[0] == "!";
      if (hasRegularLog) {
        let splitted = test.split(regex);
        bind = splitted[0];
        testVal = splitted[1];
        ops = hasRegularLog[0];
      } else {
        bind = test;
      }
      if (hasNegate) {
        hasNegate && (bind = bind.slice(1));
      }
      const conf = {
        _component: component,
        _type: compileName,
        hasNegate,
        bind,
        testVal,
        attrkey,
        attrvalue,
        ops,
        sel: id,
        orig: target
      };
      storage2.push(compileName, conf);
      storage2.set(id, conf);
      el.dataset[compileName] = id;
    }
  );
}
var CompileAttr_default = compileAttr;

// src/Attrib/compile/CompileBind.js
async function compileBind(elModels, component, isStatic, html, storage2) {
  let compileName = "bind";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      for (let g = 0; g < gr.length; g++) {
        let val = gr[g].split(" ").join("");
        let bind, attr;
        if (val.includes(":")) {
          const _sp1 = val.split(":");
          attr = _sp1[0];
          bind = _sp1[1];
        } else {
          bind = val;
          attr = el.value != void 0 && el.tagName != "BUTTON" ? "value" : "textContent";
        }
        const conf = {
          _component: component,
          _type: compileName,
          attr,
          bind,
          sel: id
        };
        storage2.push(compileName, conf);
        storage2.set(id, conf);
      }
      el.dataset[compileName] = id;
    }
  );
}
var CompileBind_default = compileBind;

// src/Attrib/compile/CompileClass.js
async function compileClass(elModels, component, isStatic, html, storage2) {
  let regex = new RegExp("<|>|===|==|!==|!=");
  let compileName = "class";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      let hasRegularLog, hasNegate, bindVal, ops, testVal, hasNegateCount;
      let cls = gr;
      for (let c = 0; c < cls.length; c++) {
        let clItem = cls[c];
        let _sp1 = clItem.split("&&");
        let test = _sp1[0];
        let className = _sp1[1];
        test = test.trim();
        className = className.trim();
        hasRegularLog = test.match(regex);
        if (test.substring(0, 2).includes("!")) {
          hasNegate = true;
          hasNegateCount = test.substring(0, 2) == "!!" ? 2 : test.substring(0, 1) == "!" ? 1 : 0;
        } else {
          hasNegate = false;
          hasNegateCount = 0;
        }
        if (hasRegularLog) {
          let splitted = test.split(regex);
          bindVal = splitted[0].trim();
          testVal = splitted[1].trim();
          ops = hasRegularLog[0].trim();
        } else {
          !hasNegate && (bindVal = test);
          if (hasNegate) {
            bindVal = test.substring(hasNegateCount);
            testVal = hasNegateCount == 2;
          }
        }
        const conf = {
          _component: component,
          _type: compileName,
          hasNegate,
          bind: bindVal,
          testVal,
          className,
          ops,
          sel: id
        };
        storage2.push(compileName, conf);
        storage2.set(id, conf);
      }
      el.dataset[compileName] = id;
    }
  );
}
var CompileClass_default = compileClass;

// src/Attrib/compile/CompileEvent.js
async function compileEvent(elModels, component, isStatic, html, storage2, prev) {
  let compileName = "event";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      let splitted = gr;
      for (let s = 0; s < splitted.length; s++) {
        let _sp1 = splitted[s].split(":");
        let event = _sp1[0];
        let cb = _sp1[1];
        event = event.trim();
        cb = cb ? cb.trim() : cb;
        if (prev[event]) {
          event = prev[event][compileName];
        }
        const conf = {
          _component: component,
          _type: compileName,
          event,
          sel: id,
          bind: cb,
          cb
        };
        storage2.push(compileName, conf);
        storage2.set(id, conf);
        el.dataset[compileName] = id;
      }
    }
  );
}
var CompileEvent_default = compileEvent;

// src/Attrib/compile/CompileToggle.js
async function compileToggle(elModels, component, isStatic, html, storage2) {
  let c = {};
  let compileName = "toggle";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      let ns = target;
      if (c[ns]) {
        id = c[ns];
      }
      const conf = {
        _component: component,
        _type: compileName,
        sel: id,
        name: "ns-" + ns
      };
      storage2.push(compileName, conf);
      storage2.set(id, conf);
      el.dataset[compileName] = id;
      c[ns] = id;
    }
  );
}
var CompileToggle_default = compileToggle;

// src/Attrib/compile/CompileTemplate.js
async function compileTemplate(elModels, component, isStatic, html, storage2) {
  let compileName = "template";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      let bind = el.dataset[compileName];
      const conf = {
        _component: component,
        _type: compileName,
        sel: id,
        bind,
        template: el.innerHTML
      };
      storage2.push(compileName, conf);
      storage2.set(id, conf);
      el.dataset[compileName] = id;
      el.innerHTML = "";
    }
  );
}
var CompileTemplate_default = compileTemplate;

// src/Attrib/compile/CompileRoute.js
async function compileRouter(elModels, component, isStatic, html, storage2) {
  let compileName = "route";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      for (let g = 0; g < gr.length; g++) {
        let val = gr[g].split(" ").join("");
        const conf = {
          _component: component,
          _type: compileName,
          bind: val,
          sel: id
          // for: !!isFromFor,
        };
        storage2.push(compileName, conf);
        storage2.set(id, conf);
      }
      el.dataset[compileName] = id;
    }
  );
}
var CompileRoute_default = compileRouter;

// src/Attrib/compile/CompileContainer.js
async function compileToggle2(elModels, component, isStatic, html, storage2) {
  let compileName = "container";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      let bind = el.dataset[compileName];
      const conf = {
        _component: component,
        _type: compileName,
        sel: id,
        bind
      };
      storage2.push(compileName, conf);
      storage2.set(id, conf);
      el.dataset[compileName] = id;
    }
  );
}
var CompileContainer_default = compileToggle2;

// src/Attrib/compile/CompileRef.js
async function compileBind2(elModels, component, isStatic, html, storage2) {
  let compileName = "ref";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      let bind = el.dataset[compileName];
      const conf = {
        _component: component,
        _type: compileName,
        sel: id,
        bind
      };
      storage2.push(compileName, conf);
      storage2.set(id, conf);
      el.dataset[compileName] = id;
    }
  );
}
var CompileRef_default = compileBind2;

// src/Attrib/compile/CompileSubTemplate.js
async function compileSubTemplate(elModels, component, isStatic, html, storage2) {
  let compileName = "subtemplate";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      let bind = el.dataset[compileName];
      const conf = {
        _component: component,
        _type: compileName,
        sel: id,
        bind
      };
      storage2.push(compileName, conf);
      storage2.set(id, conf);
      el.dataset[compileName] = id;
      el.innerHTML = "";
    }
  );
}
var CompileSubTemplate_default = compileSubTemplate;

// src/Attrib/compile/CompileValidator.js
async function compileValidator(elModels, component, isStatic, html, storage2) {
  let compileName = "validator";
  await loop(
    compileName,
    elModels,
    component,
    isStatic,
    function(el, id, target, gr, index) {
      for (let g = 0; g < gr.length; g++) {
        let val = gr[g].split(" ").join("");
        const conf = {
          _component: component,
          _type: compileName,
          bind: val
        };
        storage2.push(compileName, conf);
        storage2.set(id, conf);
      }
    }
  );
}
var CompileValidator_default = compileValidator;

// src/Attrib/compile/index.js
async function compile(el, component, isStatic = false, storage2, keys) {
  let map2 = {
    "[data-template]": {
      handler: CompileTemplate_default,
      name: "template"
    },
    ":not([data-template]) > [data-bind]": {
      handler: CompileBind_default,
      name: "bind"
    },
    //logical
    ":not([data-template]) > [data-attr]": {
      handler: CompileAttr_default,
      name: "attr"
    },
    //logical
    ":not([data-template]) > [data-class]": {
      handler: CompileClass_default,
      name: "class"
    },
    //logical
    ":not([data-template]) > [data-toggle]": {
      handler: CompileToggle_default,
      name: "toggle"
    },
    //logical
    ":not([data-template]) > [data-event]": {
      handler: CompileEvent_default,
      name: "event"
    },
    ":not([data-template]) > [data-route]": {
      handler: CompileRoute_default,
      name: "route"
    },
    ":not([data-template]) > [data-container]": {
      handler: CompileContainer_default,
      name: "container"
    },
    ":not([data-template]) > [data-ref]": {
      handler: CompileRef_default,
      name: "ref"
    },
    ":not([data-template]) > [data-subtemplate]": {
      handler: CompileSubTemplate_default,
      name: "subtemplate"
    },
    ":not([data-template]) > [data-validator]": {
      handler: CompileValidator_default,
      name: "validator"
    }
    /*
                    - will not supported
    
                    "if":this._compileIf,//logical
                    "animate":this._compileAnimate,//use animation library
                
                */
    /*
                    - will be replaced with data-template handled by mustache
    
                    "switch":this._compileSwitch,
                    "for":this._compileFor,
                    "for-update":this._compileForUpdate,
                */
    /*
    
                    'model':this._compileModel,
                    "route":this._compileRoute,//on render
                
                */
  };
  if (keys) {
    map2 = Object.keys(map2).reduce((accu, key) => {
      let val = map2[key];
      if (keys.includes(val.name)) {
        accu[key] = val;
      }
      ;
      return accu;
    }, {});
  }
  ;
  let query = await getElementsByDataset(
    el,
    Object.keys(map2)
    // "animate",
    // "if",
    // "for",
    // "for-update",
    // "switch",
    // component == "form"
  );
  let r = [];
  let prev = storage2.get();
  storage2.destroy();
  for (let q in query) {
    if (Object.prototype.hasOwnProperty.call(query, q)) {
      if (query[q].length) {
        r.push(
          map2[q].handler.apply(this, [
            query[q],
            component,
            isStatic,
            el,
            storage2,
            prev
          ]).then((res) => {
            return map2[q].name;
          })
        );
      }
    }
  }
  return Promise.all(r.length ? r : [r]);
}
var compile_default = compile;

// src/Attrib/handler/HandlerAttr.js
async function HandlerAttr(prop, newValue, prevValue, component, html, storage2) {
  let name = "attr";
  let st = storage2.get(name);
  let configs = st.filter((item) => item._type == name && item.bind == prop);
  if (!configs.length)
    return;
  configs.forEach((config) => {
    let data;
    let hasNegate = config.hasNegate;
    let testVal = config.testVal;
    let ops = config.ops;
    let sel = config.sel;
    let attrkey = config.attrkey;
    let attrvalue = config.attrvalue;
    let els = html.querySelectorAll(
      `[data-${name}=${sel}]:not(.cake-template)`
    );
    [...els].forEach((el) => {
      let test = false;
      if (ops) {
        test = Utils_default.string.toLogical(data, ops, testVal);
        hasNegate && (test = !test);
      } else if (hasNegate) {
        test = !data;
      } else {
        test = !!data;
      }
      if (test) {
        if (attrvalue) {
          el.setAttribute(attrkey, attrvalue);
        } else {
          el.setAttribute(attrkey);
        }
      } else {
        el.removeAttribute(attrkey);
      }
    });
  });
  return name;
}
var HandlerAttr_default = HandlerAttr;

// src/Attrib/handler/HandlerBind.js
async function HandlerBind(prop, newValue, prevValue, component, html, storage2) {
  let name = "bind";
  let st = storage2.get(name);
  let configs = st.filter((item) => item._type == name && item.bind == prop);
  if (!configs.length)
    return;
  for (let c = 0; c < configs.length; c++) {
    let config = configs[c], data;
    let attr = config.attr;
    let sel = config.sel;
    data = newValue;
    let attrHyphen = Utils_default.string.toHyphen(attr);
    let els = html.querySelectorAll(`[data-${name}=${sel}]`);
    for (let p = 0; p < els.length; p++) {
      let el = els[p];
      if (data != void 0 || data != null) {
        el.setAttribute(attrHyphen, data);
        el[attr] = data;
      }
    }
  }
}
var HandlerBind_default = HandlerBind;

// src/Attrib/handler/HandlerClass.js
async function HandlerClass(prop, newValue, prevValue, component, html, storage2) {
  let name = "class";
  let st = storage2.get(name);
  let configs = st.filter((item) => item._type == name && item.bind == prop);
  if (!configs.length)
    return;
  for (let c = 0; c < configs.length; c++) {
    let config = configs[c], data;
    let hasNegate = config.hasNegate;
    let bind = config.bind;
    let testVal = config.testVal;
    let className = config.className;
    let ops = config.ops;
    let sel = config.sel;
    bind = Utils_default.string.removeSpace(bind);
    data = newValue;
    let els = html.querySelectorAll(
      `[data-${name}=${sel}]:not(.cake-template)`
    );
    for (let p = 0; p < els.length; p++) {
      let el = els[p];
      let test = false;
      if (ops) {
        test = Utils_default.string.toLogical(data, ops, testVal);
        hasNegate && (test = !test);
      } else if (hasNegate) {
        test = data == testVal;
      } else {
        test = !!data;
      }
      if (test) {
        Utils_default.string.splitBySpace(className, function(cls) {
          const classList = Utils_default.element.toArray(el.classList);
          if (!classList.includes(cls)) {
            setTimeout(() => {
              el.classList.add(cls);
            });
          }
        });
      } else {
        Utils_default.string.splitBySpace(className, function(cls) {
          const classList = Utils_default.element.toArray(el.classList);
          if (classList.includes(cls)) {
            setTimeout(() => {
              el.classList.remove(cls);
            });
          }
        });
      }
    }
  }
  return name;
}
var HandlerClass_default = HandlerClass;

// src/Attrib/handler/HandlerRoute.js
async function HandlerBind2(prop, newValue, prevValue, component, html, storage2) {
  let name = "route";
  let st = storage2.get(name);
  let configs = st.filter((item) => item._type == name && item.bind == prop);
  if (!configs.length)
    return;
  for (let s = 0; s < configs.length; s++) {
    let sub = configs[s];
    if (!sub)
      continue;
    let sel = sub.sel;
    let bind = sub.bind;
    let value = sub.value;
    let ops = sub.ops;
    let els = html.querySelectorAllIncluded(`[data-route=${sel}]`);
    Utils_default.array.each(els, function(el, index) {
      el.setAttribute("href", el.dataset.route);
    });
  }
  return name;
}
var HandlerRoute_default = HandlerBind2;

// src/Templating.js
function _getTag(template) {
  try {
    return template.match(new RegExp("(?<=<)|([^/s]+)(?=>)", "g"))[2];
  } catch (err) {
    throw new Error(`template of ${template} is empty.`);
  }
}
function _bindReplace(obj, string, lefttag, righttag) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let pattern = new RegExp(`${lefttag}${key}${righttag}`, "g");
      if (pattern) {
        string = string.replace(pattern, `${obj[key]}`);
      }
    }
  }
  return string;
}
function toElement2(template) {
  let fr = document.createElement("template");
  fr.innerHTML = template;
  return fr.content.children;
}
var Templating_default = class {
  constructor(options) {
    this.options = options;
    this.tag = (this.options && this.options.tag || "{{ }}").split(" ");
    this.lefttag = Utils_default.string.escapeRegExp(this.tag[0]);
    this.righttag = Utils_default.string.escapeRegExp(this.tag[1]);
  }
  replaceString(obj, string) {
    return _bindReplace(obj, string, this.lefttag, this.righttag);
  }
  createElement(data, template, isConvert) {
    if (data) {
      if (data instanceof Array) {
        let isString2 = typeof template == "string";
        let tag = isString2 ? _getTag(template) : template.tagName;
        template = isString2 ? template : template.outerHTML;
        let els = [];
        for (let d = 0; d < data.length; d++) {
          let dd = data[d];
          let bindData = _bindReplace(
            dd,
            template,
            this.lefttag,
            this.righttag
          );
          let element = toElement2(bindData, tag)[0];
          if (isConvert) {
            element = element.outerHTML;
          }
          els.push(element);
        }
        return els;
      } else if (data instanceof Object) {
        let isString2 = typeof template == "string";
        let tag = isString2 ? _getTag(template) : template.tagName;
        template = isString2 ? template : template.outerHTML;
        let bindData = _bindReplace(
          data,
          template,
          this.lefttag,
          this.righttag
        );
        let element = toElement2(bindData, tag)[0];
        if (isConvert) {
          element = element.outerHTML;
        }
        return element;
      }
    } else {
      let isString2 = typeof template == "string";
      let tag = isString2 ? _getTag(template) : template.tagName;
      return toElement2(template, tag)[0];
    }
  }
};

// src/Attrib/handler/HandlerTemplate.js
function insertAfter(template, elsString) {
  let parent = template.parentNode;
  let els = toElement2(elsString);
  let index = 0;
  let length = els.length;
  let o = {};
  for (let i = 0; i < length; i++) {
    o[i] = els[i];
  }
  function recur() {
    if (index >= length) {
      return;
    }
    let el = o[index];
    if (!el) {
      return;
    }
    index += 1;
    parent.insertBefore(el, template);
    recur();
  }
  recur();
}
function handleError(err) {
  throw err;
}
async function HandlerTemplate(prop, newValue, prevValue, component, html, storage2, templateCompile) {
  try {
    if (!templateCompile) {
      throw new Error("There is no templating compiler found.");
    }
    let name = "template";
    let st = storage2.get(name);
    let configs = st.filter(
      (item) => item._type == name && item.bind == prop
    );
    if (!configs.length)
      return;
    for (let s = 0; s < configs.length; s++) {
      let sub = configs[s];
      if (!sub)
        continue;
      let sel = sub.sel;
      let bind = sub.bind;
      let template = sub.template;
      let els = html.querySelectorAllIncluded(`[data-${name}=${sel}]`);
      let compiled = await templateCompile(template.trim(), newValue);
      let render = Utils_default.is.isString(compiled) ? compiled : compiled.render;
      if (!render) {
        throw new Error("template rendered not found");
      }
      if (render && compiled.trim != false) {
        render = render.replace(/\n/g, "");
        render = render.split("  ").join("");
      }
      Utils_default.array.each(els, function(el, index) {
        insertAfter(el, render);
      });
    }
    return name;
  } catch (err) {
    handleError(err);
  }
}
var HandlerTemplate_default = HandlerTemplate;

// src/Attrib/handler/HandlerSubTemplate.js
function identify(str) {
  if (str.substring(0, 1) == "-") {
    return "data";
  } else if (str.substring(0, 1) == "$") {
    return "selector";
  }
}
async function HandlerSubTemplate(component, html, storage2) {
  let name = "subtemplate";
  let st = storage2.get(name);
  let templating = new Templating_default();
  let configs = (st || []).filter((item) => item._type == name);
  if (!configs.length)
    return;
  for (let s = 0; s < configs.length; s++) {
    let sub = configs[s];
    if (!sub)
      continue;
    let sel = sub.sel;
    let bind = sub.bind;
    let value = sub.value;
    let ops = sub.ops;
    let els = html.querySelectorAllIncluded(`[data-${name}=${sel}]`);
    Utils_default.array.each(els, function(el, index) {
      let template = Utils_default.element.querySelectorIncluded(html, `#${bind}`);
      if (template) {
        if (template.tagName) {
          let content = Utils_default.template.getContent(template, true);
          let attrs = {};
          let data = {};
          for (let i = 0; i < el.attributes.length; i++) {
            let { name: name2, value: value2 } = el.attributes[i];
            let identity = identify(name2);
            if (identity == "data") {
              data[name2.slice(1)] = value2 || true;
            } else if (identity == "selector") {
              let t = name2.slice(1);
              let selector = t.substring(0, name2.indexOf("-") - 1);
              let attr = name2.substring(selector.length + 2, name2.length);
              if (!attrs[selector]) {
                attrs[selector] = {};
              }
              ;
              attrs[selector][attr] = value2 || true;
            }
          }
          let validators = "";
          Utils_default.array.each(attrs, function(item, index2) {
            let { key: selector, value: conf } = item;
            Utils_default.array.each(conf, function(item2, index3) {
              let { key, value: value2 } = item2;
              if (key.includes("data-validator")) {
                let prop = key.substring("data-validator".length + 1, key.length);
                validators += `${prop}=${value2}, `;
              }
              ;
            });
            if (validators) {
              let query = Utils_default.element.querySelectorAllIncluded(content, selector);
              Utils_default.array.each(query, function(el2, index3) {
                el2.setAttribute("data-validator", validators);
              });
              validators = "";
            }
            ;
          });
          if (Object.keys(data).length) {
            content = templating.createElement(data, content, false);
          }
          ;
          el.replaceWith(content);
        } else {
          console.error("subtemplate template should be a template tag");
        }
      } else {
        console.error("cannot find template for subtemplate #" + bind);
      }
      ;
    });
  }
  return name;
}
var HandlerSubTemplate_default = HandlerSubTemplate;

// src/Attrib/index.js
async function set(prop, newValue, prevValue, component, storage2, templateCompile, actions) {
  let dynamicActions = [
    "bind",
    "attr",
    "class",
    // "toggle",
    "event",
    "template",
    "route"
  ];
  if (actions) {
    dynamicActions = actions.filter((item) => dynamicActions.includes(item));
  }
  let { name, html } = component;
  let val = JSON.parse(JSON.stringify(newValue));
  let hits = {};
  let configs = storage2.get();
  for (let a = 0; a < dynamicActions.length; a++) {
    const action = dynamicActions[a];
    const vals = configs[action];
    if (vals) {
      for (let v = 0; v < vals.length; v++) {
        const val2 = vals[v];
        const bind = val2.bind;
        if (bind == prop) {
          hits[action] = true;
        }
      }
    }
  }
  return await Promise.all(
    Object.keys(hits).map((key) => {
      if (key == "bind") {
        return HandlerBind_default(prop, val, prevValue, name, html, storage2);
      } else if (key == "attr") {
        return HandlerAttr_default(prop, val, prevValue, name, html, storage2);
      } else if (key == "class") {
        return HandlerClass_default(prop, val, prevValue, name, html, storage2);
      } else if (key == "route") {
        return HandlerRoute_default(prop, val, prevValue, name, html, storage2);
      } else if (key == "template") {
        return HandlerTemplate_default(
          prop,
          val,
          prevValue,
          name,
          html,
          storage2,
          templateCompile
        );
      }
    })
  );
}
async function inject(el, component, isStatic = false, storage2, keys) {
  el = el.el || el;
  return await compile_default(el, component, isStatic, storage2, keys);
}
var Attrib = class {
  constructor(storage2, templateCompile) {
    this.storage = storage2;
    this.templateCompile = templateCompile;
    this.cache = {};
  }
  set(prop, newValue, prevValue, component) {
    return set(
      prop,
      newValue,
      prevValue,
      component,
      this.storage,
      this.templateCompile,
      this.cache[component]
    );
  }
  async inject(el, component, isStatic = false, isReInject = false) {
    let compiled = {};
    if (!isReInject && this.cache[component]) {
      compiled = await inject(el, component, isStatic, this.storage, this.cache[component]);
    } else {
      compiled = await inject(el, component, isStatic, this.storage);
    }
    if (!this.cache[component] && !isReInject) {
      this.cache[component] = compiled;
    }
    return compiled;
  }
  async triggerSet(key, component) {
    let { name, html } = component;
    if (key == "subtemplate") {
      return HandlerSubTemplate_default(name, html, this.storage);
    }
  }
};

// src/Storage/utils.js
function typeOf2(_obj) {
  if (!_obj) {
    return null;
  }
  return _obj.constructor.name.toLowerCase();
}
function ObjectForEach(obj, fn) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      fn(obj[key], key);
    }
  }
}
function ObjectMerge(obj, value, key) {
  obj = Object.assign(obj, { [key]: value });
}
function isNull2(d) {
  return d === null;
}
function isUndefined2(d) {
  return d === void 0;
}
function isArray2(_obj) {
  return typeOf2(_obj) == "array";
}
function isObject2(_obj) {
  return typeOf2(_obj) == "object";
}
function hasInArray(src, id) {
  var has = null;
  for (var i = 0; i < src.length; i++) {
    var item = src[i];
    if (typeOf2(id) == "object") {
      var obj = id;
      var key = Object.keys(id)[0];
      var value = obj[key];
      if (typeOf2(item) == "object") {
        const test = item[key] == value;
        if (test) {
          has = i;
          break;
        }
      }
    } else if (typeOf2(id) != "array") {
      const test = id == item;
      if (test) {
        has = i;
        break;
      }
    }
  }
  return has;
}
function hasInObject(src, id) {
  var key = null;
  var type = typeOf2(id);
  if (type == "object") {
    var _key = Object.keys(id)[0];
    if (src[key] != void 0 && src[key] == id[_key]) {
      key = _key;
    }
  } else if (type == "string") {
    key = id;
  }
  return key;
}
function hasItem(src, id) {
  var has = null;
  if (typeOf2(src) == "array") {
    has = hasInArray(src, id);
  } else if (typeOf2(src) == "object") {
    has = hasInObject(src, id);
  }
  return has;
}

// src/Storage/methods.js
function create(storage2, data) {
  if (isArray2(storage2)) {
    let unique = new Set(storage2);
    if (typeOf2(data) == "array") {
      data.forEach((i) => {
        unique.add(i);
      });
    } else {
      unique.add(data);
    }
    storage2 = Array.from(unique);
  } else if (isObject2(storage2)) {
    if (isObject2(data)) {
      ObjectForEach(data, function(value, key) {
        storage2[key] = value;
      });
    } else {
      storage2[data] = data;
    }
  }
  return storage2;
}
function createOrUpdate(storage2, data) {
  var has = hasItem(storage2, data);
  if (typeOf2(storage2) == "array") {
    if (!isNull2(has)) {
      storage2[has] = data;
    } else {
      storage2.includes(data);
    }
  } else if (typeOf2(storage2) == "object") {
    if (isNull2(has)) {
      if (isObject2(data)) {
        ObjectForEach(data, function(value, key) {
          ObjectMerge(storage2, value, key);
        });
      } else {
        storage2[data] = data;
      }
    } else {
      storage2[has] = data;
    }
  }
  return storage2;
}
function remove2(storage2, id) {
  if (id == void 0) {
    return false;
  }
  if (typeOf2(id) == "string") {
    var has = hasItem(storage2, id);
    if (typeOf2(storage2) == "object") {
      delete storage2[has];
    } else if (typeOf2(storage2) == "array") {
      var arr = [];
      for (var i = 0; i < storage2.length; i++) {
        if (i != has) {
          arr.push(storage2[i]);
        } else {
          continue;
        }
      }
      storage2 = arr;
    }
    return storage2;
  } else if (typeOf2(id) == "object") {
    return Object.filter(storage2, function(value, key) {
      var test = id[key] != void 0 && id[key] == value;
      return !test;
    });
  } else if (typeOf2(id) == "array") {
    return Object.filter(storage2, function(value, key) {
      var test = id.contains(key);
      return !test;
    });
  }
  if (isNull2(has)) {
    return false;
  }
}
function get(storage2, id) {
  var type = typeOf2(id);
  if (type == "string") {
    var has = hasItem(storage2, id);
    if (has == 0 || has) {
      return storage2[has];
    }
  } else if (type == "object") {
    return Object.filter(storage2, function(value, key) {
      var test = !isUndefined2(id[key]) && id[key] == value;
      return test;
    });
  } else if (type == "array") {
    return Object.filter(storage2, function(value, key) {
      var test = id.contains(key);
      return test;
    });
  }
  return null;
}
function getNot(storage2, id) {
  var type = typeOf2(id);
  if (type == "string") {
    return Object.filter(storage2, function(value, key) {
      var test = key != id;
      return test;
    });
  } else if (type == "object") {
    return Object.filter(storage2, function(value, key) {
      return Object.some(id, function(_value, _key) {
        var test = _key == key && _value == value;
        return !test;
      });
    });
  } else if (type == "array") {
    return Object.filter(storage2, function(value, key) {
      var test = !id.contains(key);
      return test;
    });
  }
  return null;
}

// src/Storage/storage.js
var storage_default = class {
  constructor(type, name, child) {
    this.type = type;
    this.name = `${location.origin}-${name}`;
    this.child = child;
    this.cache = {};
    if (typeOf2(this.child) == "string") {
      this.child = child == "array" ? [] : child == "object" ? {} : false;
    }
  }
  init(save) {
    if (this[this.type]) {
      this[this.type](save);
      return true;
    }
    return false;
  }
  open() {
    let decoded;
    if (this.type == "session") {
      decoded = JSON.parse(sessionStorage[this.name]);
      return decoded[this.name];
    } else if (this.type == "local") {
      decoded = JSON.parse(localStorage[this.name]);
      return decoded[this.name];
    } else {
      return this.cache[this.name];
    }
  }
  close(storage2) {
    this.child = storage2 || this.child;
    this.recache();
    return this.init(true);
  }
  recache() {
    this.cache[this.name] = this.child;
  }
  create() {
    this.cache[this.name] = this.child;
  }
  array() {
    this.create();
  }
  object() {
    this.create();
  }
  session(save) {
    if (!save) {
      this.recache();
    }
    try {
      if (!sessionStorage[this.name] && !save) {
        sessionStorage.setItem(this.name, JSON.stringify(this.cache));
      } else if (save) {
        sessionStorage.setItem(this.name, JSON.stringify(this.cache));
      }
    } catch (err) {
      this.recache();
    }
  }
  local(save) {
    if (!save) {
      this.recache();
    }
    try {
      if (!localStorage[this.name] && !save) {
        localStorage.setItem(this.name, JSON.stringify(this.cache));
      } else if (save) {
        localStorage.setItem(this.name, JSON.stringify(this.cache));
      }
    } catch (err) {
      this.recache();
    }
  }
};

// src/Storage/index.js
var StorageKit = class {
  constructor(_obj) {
    this.name = _obj.name;
    this.storageType = _obj.storage;
    this.child = _obj.child || "object";
    try {
      if (typeOf2(this.child) == "string") {
        this.child = this.child == "array" ? [] : this.child == "object" ? {} : null;
      }
    } catch (err) {
      if (this.storageType == "session") {
        sessionStorage.clear();
      } else if (this.storageType == "local") {
        localStorage.clear();
      }
      if (typeOf2(this.child) == "string") {
        this.child = this.child == "array" ? [] : this.child == "object" ? {} : null;
      }
    }
    if (!["array", "object"].includes(typeOf2(this.child))) {
      throw new Error("the child must be an object or array type.");
    }
    this.storage = new storage_default(this.storageType, this.name, this.child);
    this.storage.init();
  }
  has(id) {
    var storage2 = this.storage.open();
    var has = hasItem(storage2, id);
    return isNull2(has) ? false : has;
  }
  get(id, quick) {
    if (quick) {
      var storage2 = this.storage.open();
      return get(storage2, id);
    } else {
      return new Promise((res) => {
        setTimeout(() => {
          var storage3 = this.storage.open();
          res(storage3);
        });
      }).then((storage3) => {
        return get(storage3, id);
      });
    }
  }
  getNot(id) {
    var storage2 = this.storage.open();
    return getNot(storage2, id);
  }
  getAll() {
    var storage2 = this.storage.open();
    return Promise.resolve(storage2);
  }
  update(id, update) {
    var storage2 = this.storage.open();
    var has = hasItem(storage2, id);
    if (has == 0 || has) {
      storage2 = createOrUpdate(storage2, update);
      return this.storage.close(storage2);
    }
    return false;
  }
  createOrUpdate(data) {
    if (arguments.length > 1) {
      let key = arguments[0];
      let value = arguments[1];
      data = { [key]: value };
    }
    var storage2 = this.storage.open();
    storage2 = createOrUpdate(storage2, data);
    const close = this.storage.close(storage2);
    return close;
  }
  create(data) {
    var storage2 = this.storage.open();
    storage2 = create(storage2, data);
    return this.storage.close(storage2);
  }
  remove(id) {
    var storage2 = this.storage.open();
    storage2 = remove2(storage2, id);
    return this.storage.close(storage2);
  }
};

// src/Toggle.js
function _forceState(el, cls, isforce) {
  if (isforce) {
    if (el.classList.contains(cls)) {
      el.classList.remove(cls);
    }
  } else {
    if (!el.classList.contains(cls)) {
      el.classList.add(cls);
    }
  }
}
function _check(config, attrToggle, bind) {
  if (!config) {
    console.error(
      `${bind} is not found in toggle! choose from ${JSON.stringify(
        Object.keys(this.toggle)
      )}`
    );
  } else {
    let _config = config[bind];
    if (attrToggle.length) {
      let ns = _config.ns;
      let f = attrToggle.find((item) => {
        return item.name == `ns-${ns}`;
      });
      f && (_config.sel = `[data-toggle=${f.sel}]`);
    }
    return _config;
  }
}
function _toggle(_config, attrToggle, bind, html, bases, storage2) {
  let config = _check(_config, attrToggle, bind);
  if (!config) {
    return;
  }
  let basis = config.basis || "data-name";
  let cls = config.cls || "is-active";
  let mode = config.mode || "radio";
  let sel = config.sel;
  let persist = config.persist == void 0 ? true : config.persist;
  let targets = html.querySelectorAll(sel);
  if (!targets.length) {
    return;
  }
  let prev, next;
  if (targets.length == 1) {
    let isbool = typeof bases == "boolean";
    let isforce = !!bases;
    let el = targets[0];
    if (persist) {
      if (isbool) {
        if (isforce) {
          storage2.createOrUpdate(bind, true);
          _forceState(el, cls, true);
        } else {
          storage2.createOrUpdate(bind, false);
          _forceState(el, cls, false);
        }
        el.classList.toggle(cls);
      } else {
        storage2.createOrUpdate(bind, !el.classList.contains(cls));
        el.classList.toggle(cls);
      }
    }
  } else {
    for (let t = 0; t < targets.length; t++) {
      let el = targets[t];
      let has = el.classList.contains(cls);
      let attr = el.getAttribute(basis);
      if (attr == bases) {
        if (mode == "switch") {
          el.classList.toggle(cls);
        } else {
          if (!has) {
            el.classList.add(cls);
          }
        }
        if (persist) {
          storage2.createOrUpdate(bind, attr);
        }
        next = attr;
      } else {
        if (has) {
          el.classList.remove(cls);
          prev = el.getAttribute(basis);
        }
      }
    }
  }
  return { prev, next };
}
function _recall(_config, attrToggle, bind, html, storage2) {
  let config = _check(_config, attrToggle, bind);
  if (!config) {
    return;
  }
  let basis = config.basis || "data-name";
  let cls = config.cls || "is-active";
  let sel = config.sel;
  return storage2.get(bind).then((result) => {
    if (!result) {
      return result;
    }
    let bases = result;
    let targets = html.querySelectorAll(sel);
    if (!targets.length) {
      return;
    }
    if (targets.length == 1) {
      let el = targets[0];
      if (bases) {
        el.classList.add(cls);
      }
    } else {
      for (let t = 0; t < targets.length; t++) {
        let el = targets[t];
        let has = el.classList.contains(cls);
        let attr = el.getAttribute(basis);
        if (attr == bases) {
          if (!has) {
            el.classList.add(cls);
          }
        }
      }
    }
    return bases;
  });
}
function _get(_config, attrToggle, bind, storage2) {
  let config = _check(_config, attrToggle, bind);
  if (!config) {
    return;
  }
  return storage2.get(bind).then((result) => {
    if (!result) {
      return result;
    }
    return result;
  });
}
var Toggle_default = class {
  constructor(config) {
    this.config = config;
    this.cache = new StorageKit({
      name: "toggler",
      storage: "session",
      child: "object"
    });
  }
  handler() {
    const handler = (bind, active) => {
      return this._toggle(bind, active);
    };
    handler.recall = (bind) => {
      return this._recall(bind);
    };
    handler.get = (bind) => {
      return this._get(bind);
    };
    return handler;
  }
  setHtml(html) {
    this.html = html;
  }
  setAttr(attr) {
    this.attr = attr;
  }
  _recall(bind) {
    return _recall(this.config, this.attr, bind, this.html, this.cache);
  }
  _get(bind) {
    return _get(this.config, this.attr, bind, this.cache);
  }
  _check(bind) {
    return _check(this.config, this.attr, bind);
  }
  _toggle(bind, active) {
    return _toggle(
      this.config,
      this.attr,
      bind,
      this.html,
      active,
      this.cache
    );
  }
};

// src/Form/Validator.js
var inputEvent = function(callbacks) {
  return function(e) {
    if (e) {
      let target = e.target;
      let value = e.target.value;
      this.isLoading();
      validate(
        target,
        value,
        this.templating,
        callbacks,
        this.addSuccessClass.bind(this),
        this.addErrorClass.bind(this),
        this.showError.bind(this)
      );
      this.doneLoading();
    }
  };
};
var validate = function(target, value, templating, callbacks, successCallback, errorCallback, showErrorCallback) {
  let attr = target.dataset.validator;
  if (!attr) {
    return;
  }
  let validator = attr.split(",").reduce((accu, iter) => {
    let [key, value2] = iter.split("=");
    if (value2 && value2.includes(",")) {
      value2 = value2.split(",");
    } else {
      value2 = value2 ? value2.trim() : true;
    }
    ;
    accu.push({ key: key.trim(), value: value2 });
    return accu;
  }, []);
  if (!validator.length) {
    return;
  }
  ;
  const attrValues = {};
  let _callbacks = validator.filter((item) => {
    return callbacks[item.key];
  }).map((item) => {
    let { key, value: value2 } = item;
    attrValues[key] = value2;
    let conf = callbacks[key];
    let callback = conf.handler;
    let errorMessage = conf.error;
    callback.errorMessage = errorMessage;
    callback.validatorName = key;
    return callback;
  });
  const asy = async function(callbacks2) {
    const validation = await Promise.all(callbacks2.map(async (callback) => {
      let _attrValues = attrValues[callback.validatorName];
      let message = callback.errorMessage;
      if (_attrValues && message.includes("{") && message.includes("}")) {
        let data = _attrValues.split(",").reduce((accu, iter, index) => {
          accu[`${index}`] = iter;
          return accu;
        }, {});
        message = templating.replaceString(data, message);
      }
      let test = await callback({
        target,
        value
      }, _attrValues);
      return { test, message };
    }));
    if (validation.some((val) => !val.test)) {
      errorCallback(target);
    } else {
      successCallback(target);
    }
    showErrorCallback(target, validation);
    return validation;
  };
  return asy(_callbacks);
};
var Validator = class {
  constructor(form, validation, opts) {
    this.parentClass = opts.parentClass;
    this.errorTextParent = opts.errorTextParent;
    this.errorTextTag = opts.errorTextTag;
    this.errorTextClass = opts.errorTextClass;
    this.errorClass = opts.errorClass;
    this.successClass = opts.successClass;
    this.validation = validation;
    this.form = form;
    this.templating = new Templating_default();
    this._addEvent(this.form);
  }
  _addEvent(target) {
    target.addEventListener("input", inputEvent(this.validation).bind(this));
  }
  isLoading() {
    console.log("validating");
  }
  doneLoading() {
    console.log("validated");
  }
  addSuccessClass(target) {
    if (target.classList.contains(this.errorClass)) {
      target.classList.replace(this.errorClass, this.successClass);
    } else if (!target.classList.contains(this.successClass)) {
      target.classList.add(this.successClass);
    }
  }
  addErrorClass(target) {
    if (target.classList.contains(this.successClass)) {
      target.classList.replace(this.successClass, this.errorClass);
    } else if (!target.classList.contains(this.errorClass)) {
      target.classList.add(this.errorClass);
    }
  }
  showError(target, validated) {
    let hasError = false;
    const messages = validated.reduce((accu, item) => {
      let { test, message } = item;
      if (!test) {
        hasError = true;
        accu += `${message} <br>`;
      }
      ;
      return accu;
    }, "");
    let parentClass = `.${this.parentClass}`;
    let parent = target.closest(parentClass);
    if (!parent) {
      throw new Error("parent is not found");
    }
    ;
    const errorTagIdentity = this.errorTextClass;
    const connectedErrorTextParent = parent.querySelector(`.${errorTagIdentity}`);
    if (connectedErrorTextParent) {
      connectedErrorTextParent.remove();
    }
    ;
    if (hasError) {
      let tag = document.createElement(this.errorTextTag);
      tag.classList.add(errorTagIdentity);
      tag.innerHTML = messages;
      parent.appendChild(tag);
    }
    ;
  }
  async validate(controlSelector) {
    if (!this.form) {
      throw new Error("form is not found");
    }
    let controls = Utils_default.element.querySelectorAllIncluded(this.form, controlSelector);
    let val = await Promise.all(controls.map((control) => {
      let value = control.value;
      return validate(
        control,
        value,
        this.templating,
        this.validation,
        this.addSuccessClass.bind(this),
        this.addErrorClass.bind(this),
        this.showError.bind(this)
      );
    }));
    return val.map((item) => {
      if (item) {
        return item.every((item2) => {
          return item2.test;
        });
      } else {
        return true;
      }
    }).every((item) => {
      return item == true;
    });
  }
};

// src/Component.js
var ElementStorage = MemCache_default.element;
async function createElement(template) {
  if (!template) {
    throw new Error(`the template for ${this.name} is not found with.`);
  }
  let element = Utils_default.template.getContent(template, true);
  if (!element) {
    throw new Error(
      `it might be theres no template in component - ${this.name}`
    );
  }
  return element;
}
function attachStaticMethod(root, handlers, callback) {
  for (let key in handlers) {
    if (Object.prototype.hasOwnProperty.call(handlers, key)) {
      let handler = callback(key, handlers[key]);
      root[key] = handler;
    }
  }
}
var Component = class {
  constructor(name, template, options) {
    this.name = name;
    this.htmlTemplateSelector = template;
    this._parseOptions({ template, ...options });
    this.$templating = new Templating_default();
    this.await = {};
    this.onInit = options.onInit;
    this.options = options;
    this.renderqueue = options.renderqueue;
    this._setCustomData();
    this._setCustomCss();
    this.root = options.root ? `${options.root}:not(.cake-template)` : options.root;
    this.items = false;
    this.toggle = options.toggle;
    this.targets = {};
    this.animateOptions = options.animate;
    this.role = options.role;
    this.isReady = false;
    this.isConnected = false;
    this.animatecss = this.options.animatecss;
    this.formSelector = options.form;
    this.state = options.state;
    this.originalState = {};
    this.utils = {};
    this.$scopeData = {};
    this.renderQueing = [];
    if (!options.handlers) {
      console.error(`${this.name} has no handlers`);
    }
    if (!options.subscribe) {
      console.error(`${this.name} has no subscribe`);
    }
    this.container = {};
    this.ref = {};
    this._setUtils();
    this._compile = Promise.resolve();
    this._eventStorage = MemCache_default.object(`${this.name}-cache`);
    this.scopeHistory = {};
    this.store = {};
    this.$storage = function(type = "session") {
      if (!["session", "local"].includes(type)) {
        throw new Error("storage could be either, local or session");
      }
      return new StorageKit({
        name: `${this.name}/storage`,
        storage: type,
        child: "object"
      });
    };
    this.$cache = MemCache_default.object(`${this.name}/cache`);
  }
  async _setCustomData() {
    this.customData = this.options.data && Utils_default.is.isObject(this.options.data) || {};
  }
  async _setCustomCss() {
    this.customCss = this.options.css && Utils_default.is.isObject(this.options.css) || {};
  }
  async _create(opts) {
    if (this._isCreated) {
      return;
    }
    let { handlers, subscribe, root } = opts;
    await this._bindHandlers(handlers, this);
    let _subsribes = await this._bindSubscribe(subscribe, this);
    await this.$observer._subscriber(_subsribes, this);
    this.fire = (event, payload) => {
      return this.$observer.broadcast(this.name, event, payload);
    };
    attachStaticMethod(
      this.fire,
      handlers,
      (handlerName, handlerFunction) => {
        return async (variable) => {
          try {
            let payload = await handlerFunction(variable);
            return this.fire(handlerName, payload);
          } catch (err) {
            console.log(141, this.name, err);
            throw err;
          }
        };
      }
    );
    switch (this.type == "view" && this.template.isStatic) {
      case true:
        return this._renderStatic();
      default:
        break;
    }
    this._isCreated = true;
  }
  async render(options = {}) {
    try {
      if (this.template.isStatic) {
        return;
      }
      await this._compile;
      let multiple = this.options.multiple;
      if (options.hasqued) {
      } else {
        if (this.isConnected && !multiple) {
          console.error(
            `${this.name} is already rendered and connected to the DOM`
          );
        }
      }
      if (options.revokeque) {
        this.await.destroy = Promise.resolve();
      }
      if (this.isConnected && !multiple) {
        return Promise.resolve();
      }
      let root = options.root || this.root;
      let cleaned = options.cleaned;
      let emit = options.emit || {};
      this.customData = options.data || this.customData;
      this.customCss = options.css || this.customCss;
      if (typeof root == "string") {
        let sel = `${root}:not(.cake-template)`;
        root = document.querySelector(sel);
      }
      let payload = { emit };
      this.isConnected = true;
      this._updateRoute();
      if (!this.isReady) {
        await this._createElement();
        !this.template.has && this.fire.isConnected && this.fire.isConnected(payload, true);
        this.isReady = true;
      }
      await this.await.destroy;
      await this._getDataOnRender();
      this.customCss && this.html.css(this.customCss);
      payload.element = this.html;
      this.fire.beforeConnected && this.fire.beforeConnected(payload, true);
      this.onInit && await this.onInit();
      let el = this.$templating.createElement(this.customData, this.html.getElement());
      this._recacheFromTemplating(el);
      this.html.replaceDataSrc();
      this.template.isTemplate && this.html.appendTo(root, cleaned);
      await this._replaceRouter();
      await this._findRef();
      await this._findContainer();
      this._setToggler();
      this._activateValidator();
      this.fire.isConnected && await this.fire.isConnected(payload, true);
      await this._addEvent();
      multiple && await this._hardReset();
      await this._autoScope();
    } catch (err) {
      console.log(281, this.name, err);
    }
  }
  async _autoScope() {
    if (this.$scopeData) {
      let keys = Object.keys(this.$scopeData);
      await Utils_default.function.recurse(keys, (key, index) => {
        let val = this.$scopeData[key];
        return this.$scope(key, { [key]: val });
      });
    }
  }
  async _getDataOnRender() {
    if (this.options.onRender && this.options.onRender.constructor && ["Function", "AsyncFunction"].includes(
      this.options.onRender.constructor.name
    )) {
      this.onRenderConfig = await this.options.onRender.bind(this)(
        this
      );
      let data = this.onRenderConfig.data;
      let $scope = this.onRenderConfig.$scope;
      let css = this.onRenderConfig.css;
      if ($scope) {
        this.$scopeData = Object.assign(this.$scopeData, $scope);
      }
      if (data) {
        this.customData = Object.assign(this.customData, data);
      }
      if (css) {
        this.customCss = Object.assign(this.customCss, css);
      }
      data = null;
      $scope = null;
      css = null;
    }
  }
  async _renderStatic() {
    await this._createElement();
    this.isReady = true;
    await this._updateRoute();
    await this._getDataOnRender();
    this.fire.beforeConnected && await this.fire.beforeConnected({}, true);
    let el = this.html.getElement();
    el = this.$templating.createElement(this.customData, el);
    this.html = new Piece(el);
    this.html.replaceDataSrc();
    await this._replaceRouter();
    await this._findRef();
    await this._findContainer();
    this._setToggler();
    this._activateValidator();
    this.fire.isConnected && await this.fire.isConnected({}, true);
    await this._addEvent();
  }
  async _renderDynamic() {
  }
  _updateRoute() {
    let route = this.$router._getCurrentRoute();
    if (!route) {
      return;
    }
    for (let key in route) {
      if (Object.prototype.hasOwnProperty.call(route, key)) {
        this.$router[key] = route[key];
      }
    }
    if (route.controller) {
      this.$controller = route.controller;
    }
  }
  _findContainer() {
    let containers = this.attribStorage.get("container") || [];
    containers.forEach((container) => {
      container.sel && (container.el = this.html.querySelectorIncluded(
        `[data-container=${container.sel}]`
      ));
      this.container[container.bind] = container.el;
    });
  }
  _findRef() {
    let refs = this.attribStorage.get("ref") || [];
    refs.forEach((ref) => {
      ref.sel && (ref.el = this.html.querySelectorIncluded(
        `[data-ref=${ref.sel}]`
      ));
      this.ref[ref.bind] = ref.el;
    });
  }
  _replaceRouter() {
    let routers = this.attribStorage.get("route");
    if (routers) {
      let routes = MemCache_default.object("Router").get();
      routes = Object.keys(routes).reduce((accu, key) => {
        let val = routes[key];
        let name = val.name;
        accu[name] = { path: key, name: val.name };
        return accu;
      }, {});
      routers.forEach((conf) => {
        let sel = conf.sel;
        let bind = conf.bind;
        let el = this.html.querySelectorIncluded(`[data-route=${sel}]`);
        if (el) {
          let { path, name } = routes[bind] || {};
          if (path) {
            el.setAttribute("href", path);
            el.addEventListener("click", (e) => {
              e.preventDefault();
              document.dispatchEvent(
                new CustomEvent("pathChanged", {
                  detail: {
                    path,
                    name,
                    component: this.name
                  }
                })
              );
            });
          }
        }
      });
    }
  }
  _bindHandlers(handlers) {
    if (Utils_default.is.isObject(handlers)) {
      for (let key in handlers) {
        if (Object.prototype.hasOwnProperty.call(handlers, key)) {
          let fn = handlers[key];
          let originalName = fn.name;
          fn = fn.bind(this);
          fn.original = originalName;
          fn.binded = this.name;
          handlers[originalName] = fn;
          this._initAsync(key);
        }
      }
    } else if (Utils_default.is.isArray(handlers)) {
      for (let i = 0; i < handlers.length; i++) {
        let fn = handlers[i];
        let originalName = fn.name;
        fn = fn.bind(this);
        fn.original = originalName;
        fn.binded = this.name;
        handlers[originalName] = fn;
        this._initAsync(originalName);
      }
    }
    if (!this.await.destroy) {
      this.await.destroy = Promise.resolve();
    }
    if (!this.await.animateRemove) {
      this.await.animateRemove = Promise.resolve();
    }
  }
  _bindSubscribe(subscribe) {
    let flattened = {};
    for (let component in subscribe) {
      if (Object.prototype.hasOwnProperty.call(subscribe, component)) {
        let _subscribe = subscribe[component];
        if (!!_subscribe.components && !_subscribe.handler) {
          throw new Error(
            `there is no handler in format many of subscribe in event ${component}`
          );
        } else if (!_subscribe.components && !!_subscribe.handler) {
          throw new Error(
            `there is no components in format many of subscribe in event ${component}`
          );
        }
        let isMany = !!_subscribe.components && !!_subscribe.handler;
        if (isMany) {
          let event = component;
          let components = _subscribe.components;
          let handler = _subscribe.handler;
          handler = handler.bind(this);
          handler.binded = this.name;
          handler.original = event;
          for (let c = 0; c < components.length; c++) {
            let component2 = components[c];
            if (!flattened[component2]) {
              flattened[component2] = {};
            }
            if (!flattened[component2][event]) {
              flattened[component2][event] = {};
            }
            handler.listenTo = component2;
            flattened[component2][event] = handler;
          }
        } else {
          if (!flattened[component]) {
            flattened[component] = {};
          }
          let fns = _subscribe;
          for (let fn in fns) {
            if (Object.prototype.hasOwnProperty.call(fns, fn)) {
              let handler = fns[fn];
              let original = handler.name;
              try {
                handler = handler.bind(this);
              } catch (err) {
              }
              handler.original = original;
              handler.binded = this.name;
              handler.listenTo = component;
              if (!flattened[component][original]) {
                flattened[component][original] = {};
              }
              flattened[component][original] = handler;
            }
          }
        }
      }
    }
    return flattened;
  }
  _initAsync(name) {
    this.await[name] = Promise.resolve();
  }
  async _createElementAsync() {
    await this._createElement();
    this.isReady = true;
  }
  _parseOptions(options) {
    let template = options.template;
    this.template = {
      isStatic: false,
      isTemplate: false,
      has: false,
      isID: false
    };
    if (template) {
      this.template.has = true;
      this.template.element = document.querySelector(template);
      if (template.substring(0, 1) == "#") {
        this.template.isID = true;
        if (this.template.element) {
          this.template.isTemplate = this.template.element.toString().includes("Template");
          if (!this.template.isTemplate) {
            this.template.isStatic = true;
          }
        } else {
          throw new Error(`${template} is not found in the DOM`);
        }
      }
    } else {
      this.template.has = false;
      this.template.element = null;
    }
    this.type = options.type || "view";
  }
  async _createElement() {
    let isSelector = this.template.isID;
    if (!isSelector)
      return;
    let query = this.template.element;
    if (!query) {
      throw new Error(`the template for ${this.name} is not found with.`);
    }
    let element = null;
    if (this.template.isTemplate) {
      element = await createElement(query);
      element.cake_component = this.name;
      element.kwik_component = this.name;
    } else if (this.template.isStatic) {
      element = query;
      if (!element) {
        throw new Error(
          `it might be theres no template in component - ${this.name}`
        );
      }
      element.cake_component = this.name;
    }
    this._cloneTemplate(element);
    await this._parseHTML(this.html, this.template.isStatic);
    await this._cacheTemplate(element);
  }
  async _hardReset() {
    this.html && await this.html.remove(this.name);
    await this._eventStorage.destroy();
    this._reUseTemplate();
    return true;
  }
  async _cloneTemplate(element) {
    this.html = new Piece(element);
    this.original = this.html.cloneNode();
  }
  async _cacheTemplate(html) {
    await this._replaceSubTemplate();
    this.template.cached = true;
  }
  async _replaceSubTemplate() {
    await this.$attrib.triggerSet("subtemplate", this);
  }
  async _recacheFromSubTemplate(html) {
    if (!this.template.recacheFromSubTemplate) {
      this.html = new Piece(html);
      this.original = await html.cloneNode();
      this.template.recacheFromSubTemplate = true;
    }
  }
  async _recacheFromTemplating(html) {
    if (this.html) {
      this.html = new Piece(html);
      this.template.recacheFromTemplating = true;
    }
  }
  async _reUseTemplate() {
    if (this.original) {
      const cloned = await this.original.cloneNode();
      this.html = new Piece(cloned);
    }
  }
  async _parseHTML(html, isStatic, isReInject) {
    await this.$attrib.inject(html, this.name, isStatic, isReInject);
    this._isParsed = true;
  }
  async renderQue(options) {
    let hasNoId = options.id == void 0 && options.id != null;
    if (hasNoId) {
      throw new Error("renderQue method requires an id.");
    }
    let id = options.id;
    if (id) {
      options.hasqued = true;
      this.renderQueing.push({
        date: (/* @__PURE__ */ new Date()).toString(),
        id,
        options
      });
    }
    return this.render(options);
  }
  async reset(options = {}) {
    let hasNoId = options.id == void 0 && options.id != null;
    if (hasNoId) {
      throw new Error("renderQue method requires an id.");
    }
    let id = options.id, conf;
    if (id) {
      conf = this.renderQueing.filter((item) => {
        return item.id == id;
      });
      this.renderQueing = JSON.parse(
        JSON.stringify(this.renderQueing)
      ).filter((item) => {
        return item.id != id;
      });
    }
    await this._hardReset(this.name);
    this.container = {};
    this.ref = {};
    this.targets = {};
    this._setCustomData();
    this._setCustomCss();
    this.$cache.destroy();
    this.scopeHistory = {};
    this.store = {};
    this.$scopeData = {};
    this.isConnected = false;
    this.isReady = false;
    if (this.renderQueing && this.renderQueing.length) {
      if (conf) {
        let options2 = conf.options;
        if (!options2) {
          options2 = {};
        }
        options2.revokeque = true;
        return this.render(options2);
      }
    }
  }
  _addEvent() {
    let component = this.name;
    let $this = this;
    function notify(id, event, component2, isPreventDefault, isStopPropagation) {
      return function(e) {
        if (!isPreventDefault) {
          e.preventDefault();
        }
        if (isStopPropagation) {
          e.stopPropagation();
        }
        $this.fire[event](e);
      };
    }
    this.targets = (this.attribStorage.get("event") || []).filter(
      (item) => item._component == this.name
    );
    this.targets.forEach((cf) => {
      let { bind, cb, event, sel, _type, _component } = cf;
      let el = this.html.querySelectorIncluded(`[data-event=${sel}]`);
      let _event = event;
      let place = event.substring(0, 2);
      let isPreventDefault = place.includes("~");
      let isStopPropagation = place.includes("^");
      if (isPreventDefault || isStopPropagation) {
        _event = event.slice(1);
        cb = cb || _event;
      } else {
        if (!cb) {
          cb = event;
        }
      }
      let cache = new ElementStorage(el);
      if (!cache.get("__cake__events")) {
        cache.set("__cake__events", {});
      }
      let store = cache.get("__cake__events");
      if (!store[cb] && el) {
        Utils_default.element.addEventListener(
          el,
          _event,
          notify(
            el.dataset.event,
            cb,
            component,
            isPreventDefault,
            isStopPropagation
          ),
          true
        );
        store[cb] = true;
        cache.set("__cake__events", store);
      }
    });
  }
  async $scope(key, value) {
    if (!Utils_default.is.isString(key)) {
      throw new Error("key must be string");
    }
    if (value == void 0) {
      throw new Error("value is required");
    }
    let prev = "";
    if (Utils_default.is.isString(key) || Utils_default.is.isNumber(key)) {
      if (this.scopeHistory[key] == value) {
        prev = this.scopeHistory[key];
      }
      this.scopeHistory[key] = value;
    }
    let notify = await this.$attrib.set(key, value, prev, this);
    if (notify.includes("template")) {
      await new Promise((res) => {
        setTimeout(async () => {
          await this._parseHTML(this.html, false, true);
          await this._replaceRouter();
          await this._findRef();
          await this._findContainer();
          await this._setToggler();
          await this._addEvent();
          res();
        }, 100);
      });
    }
  }
  _activateValidator() {
    if (this.role == "form") {
      this.$validator = Validator;
    }
  }
  _setParent(groupName) {
    this.groupName = groupName;
    this.attribStorage = MemCache_default.object(
      `${this.groupName}/${this.name}/Attrib`
    );
    this.$attrib = new Attrib(this.attribStorage, this._templateCompile);
  }
  _setObserver(observer) {
    this.$observer = observer;
    this._compile = this._create(this.options);
  }
  _setDefaultRoot(root) {
    this.defaultRoot = root;
    this.root = this.root || this.defaultRoot;
  }
  _setGlobalStorage(globalStorage) {
    this.$globalStorage = globalStorage;
  }
  _setGlobalCache(globalCache) {
    this.$globalCache = globalCache;
  }
  _setRouter(router) {
    this.$router = router;
  }
  _setStorage(cache) {
  }
  _setToggler() {
    if (!this.toggle) {
      return;
    }
    let togglers = (this.attribStorage.get("toggle") || []).filter(
      (item) => item._component == this.name
    );
    let toggler = this.toggle;
    toggler.setHtml && toggler.setHtml(this.html);
    toggler.setAttr && toggler.setAttr(togglers);
    this.$toggler = toggler.handler();
  }
  _setUtils() {
    this.$utils = Utils_default;
  }
  _setTemplateCompile(templateCompile) {
    this._templateCompile = templateCompile;
  }
  on(event, handler) {
    this._bindHandlers({
      [event]: handler
    });
    return {
      on: this.on.bind(this),
      subscribeTo: this.subscribeTo.bind(this)
    };
  }
  subscribeTo(event, components, handler) {
    let isMultiple = Utils_default.is.isArray(components);
    if (isMultiple) {
      this._bindSubscribe({
        [event]: {
          components,
          handler
        }
      });
    } else {
      this._bindSubscribe({
        [components]: {
          [event]: handler
        }
      });
    }
    return {
      on: this.on.bind(this),
      subscribeTo: this.subscribeTo.bind(this)
    };
  }
  clone(name, template, opts = {}) {
    let cloned = {};
    for (let key in this.options) {
      if (Object.prototype.hasOwnProperty.call(this.options, key)) {
        cloned[key] = opts[key] ? cloned[key] = opts[key] : cloned[key] = this.options[key];
      }
    }
    return new Component(name, template || this.htmlTemplateSelector, cloned);
  }
};

// src/Router/RouterHistory.js
var RouterHistory = class {
  constructor(name, routes, options) {
    this.config = { routes, options };
    this.state = {};
    this._parseOptions();
    this._parseRoutes();
    this.onConnected();
    this.onPopState();
    this._listen();
  }
  async goTo(name, opts = {}) {
    const isUrl = Utils_default.is.isURL(name);
    if (isUrl) {
      const { origin, search } = this._parseUrl(name, true);
      let state = {};
      if (search) {
        if (opts.params && search) {
          state = { ...search, ...opts.params };
        } else if (opts.params && !search) {
          state = opts.params;
        } else if (!opts.params && search) {
          state = search;
        }
      }
      let newPath = this._addParams(origin, state);
      if (opts.replace) {
        location.replace(newPath);
      } else {
        location.href = newPath;
      }
    } else if (!isUrl) {
      let state = {};
      let { path, config } = await this._getConfigByName(name);
      if (path) {
        let parsed = this._parseUrl(path);
        let search = parsed.search;
        if (search) {
          if (opts.params && search) {
            state = { ...search, ...opts.params };
          } else if (opts.params && !search) {
            state = opts.params;
          } else if (!opts.params && search) {
            state = search;
          }
        }
        let newPath = this._addParams(path, state);
        let { components, auth, name: name2, display, strict } = config;
        let isAuth = await this._isAuth(auth);
        if (!isAuth) {
          console.error("unauthorized");
          return;
        }
        if (opts.replace) {
          history.replaceState({ auth, path, name: name2, display, strict, state }, opts.title || "", newPath);
        } else {
          history.pushState({ auth, path, name: name2, display, strict, state }, opts.title || "", newPath);
        }
        this._updateProperty({ path, auth, name: name2, display, strict, state });
        await this._destroyComponent(this.components);
        await this._renderComponent(components);
      } else {
        throw new Error(`route name ${name} is not found`);
      }
    }
  }
  async goBack(conf) {
    let state = history.state;
    let name, auth, config;
    if (state && state.name) {
      name = state.name;
      auth = state.auth;
      let found = await this._getConfigByName(name);
      if (found) {
        config = found.config;
      }
    } else if (conf && conf.name) {
      let found = await this._getConfigByName(conf.name);
      if (found) {
        config = found.config;
        name = config.name;
        auth = config.auth;
      }
    } else if (conf && conf.path) {
      let found = await this._getConfigByPath(conf.path);
      if (found) {
        config = found.config;
        name = config.name;
        auth = config.auth;
      }
    }
    if (name && auth != void 0) {
      let isAuth = await this._isAuth(auth);
      if (!isAuth) {
        console.error("unauthorized");
        return;
      }
      await this._destroyComponent(this.components);
      await this._renderComponent(config.components);
    } else {
      console.error("no history state found");
    }
  }
  _parseUrl(path, isUrl) {
    let urlClass = null;
    if (isUrl) {
      try {
        urlClass = new URL(path);
      } catch (err) {
        console.error(`path ${path} is not a URL`);
      }
    } else {
      let url = `http://localhost${path}`;
      urlClass = new URL(url);
    }
    let o = {};
    if (urlClass) {
      o.pathname = urlClass.pathname;
      o.origin = urlClass.origin;
      if (urlClass.search) {
        let params = new URLSearchParams(urlClass.search);
        o.search = {};
        for (let [key, value] of params.entries()) {
          o.search[key] = value;
        }
        o.searchParams = params.toString();
      }
    }
    return o;
  }
  _addParams(path, params) {
    let searchParams = new URLSearchParams();
    for (let key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        searchParams.append(key, params[key]);
      }
    }
    return `${path}?${searchParams.toString()}`;
  }
  async _getConfigByName(name, parsedOnly = false) {
    let config = {};
    let path = null;
    let routes = Object.keys(this.config.routes);
    for (let i = 0; i < routes.length; i++) {
      let pt = routes[i];
      let cf = this.config.routes[pt];
      if (cf.name == name) {
        config = cf;
        path = pt;
        break;
      }
    }
    if (path) {
      return { path, config };
    } else if (this.notFound && !parsedOnly) {
      let url = await this.notFound();
      try {
        let urlClass = new URL(url);
        window.location = url;
      } catch (err) {
        await this.goTo(url);
      }
      return null;
    }
    return null;
  }
  async _getConfigByPath(_path, parsedOnly = false) {
    let { search, pathname, searchParams } = this._parseUrl(_path);
    let config = {};
    let path = null;
    let routes = Object.keys(this.config.routes);
    for (let i = 0; i < routes.length; i++) {
      let pt = routes[i];
      let parseRoute = this._parseUrl(pt);
      let cf = this.config.routes[pt];
      let { strict } = cf;
      if (strict || strict == void 0) {
        if (_path == pt) {
          config = cf;
          path = _path;
          break;
        } else {
          if (pathname == parseRoute.pathname) {
            let hasAtleastContainsParamsOfRoute = false;
            for (let key in parseRoute.search) {
              if (Object.prototype.hasOwnProperty.call(parseRoute.search, key)) {
                if (search[key] == parseRoute.search[key]) {
                  hasAtleastContainsParamsOfRoute = true;
                }
              }
            }
            if (hasAtleastContainsParamsOfRoute) {
              config = cf;
              path = _path;
              break;
            }
          }
        }
      } else if (strict == false) {
        if (pathname == parseRoute.pathname) {
          config = cf;
          path = _path;
          break;
        }
      }
    }
    if (path) {
      return { path, config, search };
    } else if (this.notFound && !parsedOnly) {
      let url = await this.notFound();
      try {
        let urlClass = new URL(url);
        window.location = url;
      } catch (err) {
        await this.goTo(url);
      }
      return null;
    }
    return null;
  }
  _parseOptions() {
    let options = this.config.options || {};
    this.notFound = options.notFound;
    this.unAuthorized = options.unAuthorized;
    this.verify = options.verify;
  }
  _parseRoutes() {
    let paths = Object.keys(this.config.routes);
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      let conf = this.config.routes[path];
      conf._path = path;
      MemCache_default.object("Router").set(path, conf);
    }
  }
  clean() {
    this.user = {};
  }
  async _isAuth(auth) {
    try {
      if (auth == true || Utils_default.is.isArray(auth)) {
        if (this.verify) {
          let request = await this.verify();
          if (request.status) {
            this.user = request.data;
          } else {
            throw new Error(request.message || "error verifying auth");
          }
        } else {
          throw new Error("verify auth callback is required");
        }
      }
      if (auth == true) {
        if (this.verify) {
          let user = this.user;
          if (user) {
            return true;
          } else {
            throw new Error("router has no user, the route requires a user.");
          }
        } else {
          throw new Error("verify callback is required if the route is auth");
        }
      } else if (auth == false) {
        return true;
      } else if (Utils_default.is.isArray(auth)) {
        let user = this.user;
        if (user) {
          let role = user.role;
          if (auth.includes(role)) {
            return true;
          } else {
            throw new Error(`role ${role} is not found in allowed roles`);
          }
        } else {
          throw new Error("router has no user, the route requires a user.");
        }
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  _updateProperty(obj) {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key == "state") {
          if (!Utils_default.is.isObject(obj[key])) {
            obj[key] = {};
          } else {
            this[key] = obj[key];
          }
        } else {
          this[key] = obj[key];
        }
      }
    }
  }
  async _renderComponent(components) {
    try {
      await Utils_default.function.recurse(components || [], async (component, index) => {
        if (component) {
          await component.render.bind(component)();
          if (component.await.isConnected) {
            await component.await.isConnected;
          }
        }
      });
      await this._updateProperty({ components });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async _destroyComponent(components) {
    try {
      return await Utils_default.function.recurse(components || [], async (component, index) => {
        if (component) {
          if (component?.fire?.destroy) {
            await component.fire.destroy();
            await component.await.destroy;
          } else {
            return component.reset();
          }
        }
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async onConnected() {
    let { pathname, search } = window.location;
    let state = history.state;
    if (state && state.name && state.components) {
      this._updateProperty({
        name: state.name,
        auth: state.auth,
        components: state.components,
        display: state.display,
        state: state.state
      });
      return await this._renderComponent(state.components);
    } else {
      let config = {};
      let path = null;
      let found = await this._getConfigByPath(search ? `${pathname}${search}` : pathname);
      if (found) {
        path = found.path;
        config = found.config;
        this._updateProperty({
          path,
          strict: config.strict
        });
      }
      if (path && config.components) {
        this._updateProperty({
          name: config.name,
          auth: config.auth,
          components: config.components,
          display: config.display,
          state: found.search
        });
        return await this._renderComponent(config.components);
      }
    }
  }
  onPopState() {
    window.addEventListener("popstate", (event) => {
      let { pathname, search } = this._parseUrl();
      this.goBack({ path: pathname });
    });
  }
  _getCurrentRoute() {
    return {
      components: this.components,
      state: this.state,
      path: this.path,
      name: this.name,
      display: this.display
    };
  }
  _listen() {
    let name = "pathChanged";
    document.addEventListener(name, (e) => {
      let detail = e.detail;
      this.goTo(detail.name);
    });
  }
};
var RouterHistory_default = RouterHistory;

// src/Custom/SubTemplate.js
function getFirst(str, separator) {
  let trimmed = str.trim();
  let attrKey = trimmed.slice(0, trimmed.indexOf(separator));
  let attrValue = trimmed.slice(trimmed.indexOf(separator) + 1, trimmed.length);
  return {
    first: attrKey,
    second: attrValue
  };
}
var SubTemplate_default = customElements.define(
  "sub-template",
  class extends HTMLElement {
    constructor() {
      super();
      this.templating = new Templating_default();
      this.data = {};
      this._attr = {};
      this._selector = [];
      this.whitelistAttr = ["data-sub-template"];
    }
    connectedCallback() {
      let attrs = this.attributes;
      for (let a = 0; a < attrs.length; a++) {
        let attr = attrs[a];
        let name = attr.name;
        let value = attr.value;
        if (name.includes("@")) {
          this.data[name.replace("@", "")] = value;
        } else if (name.includes("$")) {
          let key = name.replace("$", "");
          let { first: selector, second: prop } = getFirst(key, "-");
          if (prop.includes("data-validator")) {
            this._selector.push({ selector, key: prop, value: value || true });
          }
          if (prop == "attr") {
            let grattrs = value.split(";");
            grattrs.forEach((gr) => {
              let [key2, value2] = gr.trim().split("=");
              this._selector.push({ selector, prop, key: key2, value: value2 });
            });
          }
        } else {
          this._attr[name] = value;
        }
      }
      ;
      this.replace(this);
    }
    replace(subTemplate) {
      let ref = subTemplate.dataset.subTemplate;
      let refEl = document.querySelector(`template#${ref}`);
      if (refEl.length > 1) {
        console.error(`template with name ${ref} has more than one reference.`);
        return;
      }
      ;
      if (!refEl) {
        subTemplate.remove();
        throw new Error(`${ref} is not found!`);
      }
      ;
      if (refEl) {
        let temp = refEl;
        let template = Utils_default.template.getContent(temp);
        let el = this.templating.createElement(this.data, template, false);
        Object.keys(this._attr).forEach((key) => {
          if (!this.whitelistAttr.includes(key)) {
            let val = this._attr[key];
            el.setAttribute(key, val);
          }
          ;
        });
        this._selector.forEach((item) => {
          let { selector, prop, key, value } = item;
          let targets = Utils_default.element.querySelectorAllIncluded(el, selector);
          targets.forEach((target) => {
            target.setAttribute(key, value || true);
          });
        });
        subTemplate.replaceWith(el);
      }
      ;
    }
  }
);

// src/Custom/index.js
var Custom_default = () => {
  return {
    SubTemplate: SubTemplate_default
  };
};

// src/index.js
var ElementStorage2 = MemCache_default.element;
Custom_default();
var Cake = class {
  constructor(opts) {
    this.opts = opts;
    this.name = opts.name;
    this.defaultRoot = opts.defaultRoot;
    this.components = {};
    this.globalStorage = function(type = "session") {
      if (!["session", "local"].includes(type)) {
        throw new Error("storage could be either, local or session");
      }
      return new StorageKit({
        name: "globalStorage/storage",
        storage: type,
        child: "object"
      });
    };
    this.globalCache = MemCache_default.object("globalStore");
    this.excludeQuery = [".cake-template"];
    this.router = opts.router;
    this.Observer = new Observer2(this.name);
    this.templateCompile = opts.templateCompiler;
    this.initSubscriber = [];
    this._register();
  }
  async _register() {
    await this._registerRouter();
    await this._registerComponents(this.opts.components || []);
    if (this.opts.init) {
      const initHandler = this.opts.init.bind(this);
      await initHandler();
    }
    await this._mountRouter();
  }
  async _registerRouter() {
    let router = await this.router();
    for (let route in router.routes) {
      if (Object.prototype.hasOwnProperty.call(router.routes, route)) {
        let config = router.routes[route];
        if (!["Function", "AsyncFunction"].includes(
          config.constructor.name
        )) {
          if (config.components) {
            this._registerComponents(config.components);
          } else if (config.page) {
            this._registerPage(config.page);
          }
        }
      }
    }
    if (!this.hasRouter) {
      this.$router = new RouterHistory_default(this.name, router.routes, router.options);
      this.hasRouter = true;
    }
  }
  _mountRouter() {
    Object.keys(this.components).forEach((name) => {
      let component = this.components[name];
      component._setRouter(this.$router);
    });
  }
  _registerComponents(components) {
    try {
      components.forEach((component) => {
        if (!this.components[component.name]) {
          component.onInit && this.initSubscriber.push(component.onInit.bind(component));
          component._setTemplateCompile(this.templateCompile);
          component._setParent(this.name);
          component._setObserver(this.Observer);
          component._setDefaultRoot(this.defaultRoot);
          component._setStorage(
            new StorageKit({
              name: `${this.name}/${component.name}/cache`,
              storage: "session",
              child: "object"
            })
          );
          component.options.store && Utils_default.is.isFunction(component.options.store) && component.options.store.bind(component.store)(component);
          component.options.utils && component.options.utils.bind(component.utils)(component);
          component._setGlobalStorage(this.globalStorage);
          component._setGlobalCache(this.globalCache);
          this.components[component.name] = component;
        }
      });
      this.Observer._setComponents(this.components);
    } catch (err) {
      console.log(err);
    }
  }
  _registerPageComponents(components) {
    try {
      components.forEach((component) => {
        component.setTemplateCompile(this.templateCompile);
        component.setParent(this.name);
        component.setDefaultRoot(this.defaultRoot);
        this.components[component.name] = component;
      });
    } catch (err) {
      console.log(err);
    }
  }
  _registerPage(page) {
    try {
      if (page.type != "page") {
        throw new Error("not an instance of page");
      }
      this._registerPageComponents(page.components);
    } catch (err) {
      console.log(158, err);
    }
  }
  _clone(name, component) {
    return component.clone(name);
  }
  $notify(e, callback) {
    this.initSubscriber.forEach((handler) => {
      handler(e);
    });
    try {
      callback && callback();
    } catch (err) {
      console.log(err);
    }
  }
};
export {
  Component,
  ElementStorage2 as ElementStorage,
  Observer2 as Observer,
  RouterHistory_default as Router,
  Toggle_default as Toggle,
  Cake as default
};
