var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/Observer.js
var Observer = class {
  constructor(name) {
    this.name = name;
    this.handlers = {};
    this.subscribe = [];
  }
  _handlers(callback = {}, ctx) {
    if (!Object.keys(callback).length) {
      return;
    }
    if (!ctx.handlers) {
      ctx.handlers = {};
    }
    for (let key in callback) {
      if (Object.prototype.hasOwnProperty.call(callback, key)) {
        let fn = callback[key].bind(ctx);
        let listeners = function() {
          return this.subscribe.filter((item) => {
            return item.from == ctx.name;
          });
        }.bind(this);
        this.handlers[key] = async function() {
          let _listeners = listeners();
          let payload = await fn();
          await Promise.all(
            _listeners.map((fn2) => {
              return fn2.handler(payload);
            })
          );
          return payload;
        }.bind(ctx);
        ctx.handlers[key] = this.handlers[key];
      }
    }
  }
  _subscriber(_components = {}, ctx) {
    if (!Object.keys(_components).length) {
      return;
    }
    for (let _c in _components) {
      if (Object.prototype.hasOwnProperty.call(_components, _c)) {
        let events = _components[_c];
        for (let key in events) {
          if (Object.prototype.hasOwnProperty.call(events, key)) {
            let event = events[key].bind(ctx);
            this.subscribe.push({
              handler: event,
              listentToEvent: key,
              from: _c,
              listener: ctx.name
            });
          }
        }
      }
    }
  }
  async broadcast(component, event, payload) {
    return Promise.all(
      this.subscribe.filter((subscriber) => {
        return subscriber.from == component && event == subscriber.listentToEvent;
      }).map((subscriber) => {
        return subscriber.handler(payload);
      })
    );
  }
};

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
  isFirefox: () => isFirefox,
  isFunction: () => isFunction,
  isHTMLCollection: () => isHTMLCollection,
  isIE: () => isIE,
  isIOS: () => isIOS,
  isNodeList: () => isNodeList,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isOpera: () => isOpera,
  isSafari: () => isSafari,
  isString: () => isString,
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
  let srcs = querySelectorAllIncluded(root, "data-src", null);
  for (let s = 0; s < srcs.length; s++) {
    let el = srcs[s];
    if (el.dataset.src) {
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
function Element_default(name) {
  let storage2 = document.querySelector(`[data-cache=${name}]`);
  if (!storage2) {
    let el = document.createElement("div");
    el.dataset.cache = name;
    document.head.append(el);
    storage2 = el;
  }
  let key = "_cakes_storage";
  !storage2[key] && (storage2[key] = {});
  let cache = storage2[key];
  return {
    set(key2, value) {
      cache[key2] = value;
    },
    get(key2) {
      return cache[key2];
    },
    getAll() {
      return cache;
    },
    remove(key2) {
      delete cache[key2];
    }
  };
}

// src/MemCache/index.js
var MemCache_default = {
  object: Object_default,
  element: Element_default
};

// src/Utils/UtilsString.js
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

// src/Utils/UtilsFunction.js
var UtilsFunction_exports = {};
__export(UtilsFunction_exports, {
  recurse: () => recurse
});
function recurse(array, callback) {
  let l = array.length;
  let index = 0;
  let cache = [];
  return new Promise((res, rej) => {
    try {
      const _recurse = (callback2) => {
        if (index < l) {
          let item = array[index];
          callback2(item, index).then((result) => {
            index += 1;
            cache.push(result);
            _recurse(callback2);
          });
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
  let obj = {};
  let splitted = styles.split("}");
  for (let sp = 0; sp < splitted.length; sp++) {
    let item = splitted[sp];
    let _sp1 = item.split("{");
    let sel = _sp1[0];
    let style2 = _sp1[1];
    if (sel) {
      obj[sel.trim()] = (() => {
        let n = false;
        let s = "";
        let splitted2 = style2.split("");
        for (let sp2 = 0; sp2 < splitted2.length; sp2++) {
          let item2 = splitted2[sp2];
          if (item2 == "\n") {
            n = true;
          } else if (item2 == " ") {
            if (n) {
            } else {
              s += item2;
            }
          } else {
            n = false;
            s += item2;
          }
        }
        return s;
      })();
    }
  }
  return obj;
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
  for (let selector in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, selector)) {
      let query = element.querySelectorAll(selector);
      let css = styles[selector];
      for (let q = 0; q < query.length; q++) {
        let item = query[q];
        item.setAttribute("style", css);
      }
    }
  }
  element = isConvert ? toArray(element.children) : element.innerHTML;
  return element.length == 1 ? element[0] : element;
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
function applyCss(elements, styles) {
  Utils_default.array.each(elements, function(element, index) {
    Utils_default.array.each(styles, function(css, index2) {
      let { key, value } = css;
      if (Utils_default.is.isObject(value)) {
        let selector = key;
        let elCss = value;
        Utils_default.array.each(elCss, function(css2, index3) {
          let { key: key2, value: value2 } = css2;
          let target = Utils_default.element.querySelectorIncluded(
            element,
            selector
          );
          target.style[key2] = value2;
        });
      } else {
        element.style[key] = value;
      }
    });
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
    return remove(this.el);
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
    return applyCss(obj);
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

// src/Attrib/compile/index.js
async function compile(el, component, isStatic = false, storage2) {
  let map2 = {
    "[data-template]": CompileTemplate_default,
    ":not([data-template]) > [data-bind]": CompileBind_default,
    //logical
    ":not([data-template]) > [data-attr]": CompileAttr_default,
    //logical
    ":not([data-template]) > [data-class]": CompileClass_default,
    //logical
    ":not([data-template]) > [data-toggle]": CompileToggle_default,
    //logical
    ":not([data-template]) > [data-event]": CompileEvent_default,
    ":not([data-template]) > [data-route]": CompileRoute_default,
    ":not([data-template]) > [data-container]": CompileContainer_default,
    ":not([data-template]) > [data-ref]": CompileRef_default
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
  let query = await getElementsByDataset(
    el,
    [...Object.keys(map2)]
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
          map2[q].apply(this, [
            query[q],
            component,
            isStatic,
            el,
            storage2,
            prev
          ])
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
      pattern && (string = string.replace(pattern, `${obj[key]}`));
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

// src/Attrib/index.js
async function set(prop, newValue, prevValue, component, storage2, templateCompile) {
  let { name, html } = component;
  let val = JSON.parse(JSON.stringify(newValue));
  let hits = {};
  let actions = [
    "bind",
    "attr",
    "class",
    // "toggle",
    "event",
    "template",
    "route"
  ];
  let configs = storage2.get();
  for (let a = 0; a < actions.length; a++) {
    const action = actions[a];
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
async function inject(el, component, isStatic = false, storage2) {
  el = el.el || el;
  return await compile_default(el, component, isStatic, storage2);
}
var Attrib = class {
  constructor(storage2, templateCompile) {
    this.storage = storage2;
    this.templateCompile = templateCompile;
  }
  set(prop, newValue, prevValue, component) {
    return set(
      prop,
      newValue,
      prevValue,
      component,
      this.storage,
      this.templateCompile
    );
  }
  inject(el, component, isStatic = false) {
    return inject(el, component, isStatic, this.storage);
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
function isNull(d) {
  return d === null;
}
function isUndefined(d) {
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
    if (!isNull(has)) {
      storage2[has] = data;
    } else {
      storage2.includes(data);
    }
  } else if (typeOf2(storage2) == "object") {
    if (isNull(has)) {
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
  if (isNull(has)) {
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
      var test = !isUndefined(id[key]) && id[key] == value;
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
    return isNull(has) ? false : has;
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
  constructor(config, html, attr) {
    this.config = config;
    this.html = html;
    this.attr = attr;
    this.cache = new StorageKit({
      name: "toggler",
      storage: "session",
      child: "object"
    });
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

// src/Component.js
async function createElement(query) {
  if (!query) {
    throw new Error(`the template for ${this.name} is not found with.`);
  }
  let element = Utils_default.template.getContent(query, true);
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
    this.template = template;
    this.$templating = new Templating_default();
    this.await = {};
    this.options = options;
    this.renderqueue = options.renderqueue;
    this.data = {};
    this.root = options.root ? `${options.root}:not(.cake-template)` : options.root;
    this.items = false;
    this.type = options.type || "view";
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
    this._compile = this._create(options);
    this._eventStorage = MemCache_default.object(`${this.name}-cache`);
    this.scopeHistory = {};
  }
  async _create(opts) {
    let { handlers, subscribe, root } = opts;
    await this._bindHandlers(handlers, this);
    let _subsribes = await this._bindSubscribe(subscribe, this);
    await this.$observer._handlers(handlers, this);
    await this.$observer._subscriber(_subsribes, this);
    this.fire = (event, payload) => {
      this.$observer.broadcast(this.name, event, payload);
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
    switch (this.type == "view" && !!this.template) {
      case true:
        return this._createElementAsync();
      default:
        this.isStatic = false;
        break;
    }
  }
  async render(options = {}) {
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
    let DATA = options.data || {};
    let CSS = options.css;
    if (!root) {
      root = "#App";
    }
    if (typeof root == "string") {
      let sel = `${root}:not(.cake-template)`;
      root = document.querySelector(sel);
    }
    let payload = { emit };
    this.isConnected = true;
    this._updateRoute();
    if (!this.isReady) {
      await this._createElement();
      await !this.template && this.fire.isConnected && this.fire.isConnected(payload, true);
      this.isReady = true;
    }
    await this.await.destroy;
    if (this.options.onRender && this.options.onRender.constructor && ["Function", "AsyncFunction"].includes(
      this.options.onRender.constructor.name
    )) {
      this.onRenderConfig = await this.options.onRender.bind(this)(this);
      let data = this.onRenderConfig.data;
      if (data) {
        DATA = Object.assign(DATA, data);
      }
    }
    CSS && this.html.css(CSS);
    payload.element = this.html;
    this.fire.beforeConnected && this.fire.beforeConnected(payload, true);
    let el = this.html.getElement();
    el = this.$templating.createElement(DATA, el);
    this.html = new Piece(el);
    this.html.replaceDataSrc();
    DATA = null;
    !this.isStatic && this.html.appendTo(root, cleaned);
    await this._replaceRouter();
    await this._findRef();
    await this._findContainer();
    this._setToggler();
    this.fire.isConnected && await this.fire.isConnected(payload, true);
    await this._addEvent();
    multiple && await this._hardReset();
  }
  _updateRoute() {
    let route = this.$router._getCurrentRoute();
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
        accu[name] = key;
        return accu;
      }, {});
      routers.forEach((conf) => {
        let sel = conf.sel;
        let bind = conf.bind;
        let el = this.html.querySelectorIncluded(`[data-route=${sel}]`);
        if (el) {
          let _path = routes[bind];
          if (_path) {
            el.setAttribute("href", _path);
            el.addEventListener("click", (e) => {
              e.preventDefault();
              document.dispatchEvent(
                new CustomEvent("pathChanged", {
                  detail: {
                    path: _path,
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
  async _createElement() {
    let isSelector = this.template.substring(0, 1) == "#";
    if (!isSelector)
      return;
    let selector = this.template.substr(1);
    let query = document.getElementById(selector);
    let isTemplate = this.isTemplate = query && query.toString().includes("Template");
    if (!query) {
      throw new Error(`the template for ${this.name} is not found with.`);
    }
    let element = null;
    if (isTemplate) {
      element = await createElement(query);
      element.cake_component = this.name;
    } else {
      element = query;
      if (!element) {
        throw new Error(
          `it might be theres no template in component - ${this.name}`
        );
      }
      element.cake_component = this.name;
      this.isStatic = true;
    }
    this.html = new Piece(element);
    await this._parseHTML(this.html, this.isStatic);
  }
  async _hardReset() {
    this.html = await this.original.cloneNode();
    await this._eventStorage.destroy();
    return true;
  }
  async _parseHTML(html, isStatic) {
    if (!this.original) {
      this.original = await html.cloneNode();
    }
    await this.$attrib.inject(html, this.name, isStatic);
    this._isParsed = true;
  }
  async reset(options = {}) {
    this.name == "nav" && console.log("reset");
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
    this.container = {};
    this.isConnected = false;
    this.isReady = false;
    await this.html.remove(this.name);
    await this._hardReset(this.name);
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
      if (!this._eventStorage.get("__cake__events")) {
        this._eventStorage.set("__cake__events", {});
      }
      let store = this._eventStorage.get("__cake__events");
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
        this._eventStorage.set("__cake__events", store);
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
    if (Utils_default.is.isString(key) || Utils_default.is.isNumber(key)) {
      if (this.scopeHistory[key] == value) {
        return true;
      }
      this.scopeHistory[key] = value;
    }
    let notify = await this.$attrib.set(key, value, null, this);
    if (notify.includes("template")) {
      await new Promise((res) => {
        setTimeout(async () => {
          await this._parseHTML(this.html);
          await this._replaceRouter();
          await this._findRef();
          await this._findContainer();
          await this._setToggler();
          res();
        }, 100);
      });
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
  }
  _setDefaultRoot(root) {
    this.defaultRoot = root;
    this.root = this.root || this.defaultRoot;
  }
  _setGlobalScope(globalScope) {
    this.$globalScope = globalScope;
  }
  _setRouter(router) {
    this.$router = router;
  }
  _setStorage(cache) {
    this.$cache = cache;
  }
  _setToggler() {
    let togglers = (this.attribStorage.get("toggle") || []).filter(
      (item) => item._component == this.name
    );
    this.$toggler = new Toggle_default(this.toggle, this.html, togglers);
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
};

// src/Router2.js
var Router = class {
  constructor(name, routes, options = {}) {
    this.name = name;
    this.options = options;
    this.unauthRoute = () => null;
    this.componentConf = null;
    this.authValidRoute = null;
    this.loaderOptions = options.loader;
    this.hooks = [];
    this.authConfig = function() {
      if (!this.options) {
        return;
      }
      const confAuth = this.options.auth;
      const confComponents = this.options.components;
      if (confComponents) {
        this.componentConf = confComponents;
      }
      if (confAuth && confAuth.verify) {
        this.isAuthorized = confAuth.verify;
        this.unauthRoute = confAuth["401"] && confAuth["401"].constructor.name == "Function" ? confAuth["401"] : () => confAuth["401"];
      }
      if (confAuth && confAuth.valid) {
        this.authValidRoute = confAuth.valid;
      }
      return null;
    }.bind(this)();
    this.authRedirectRoute = {};
    this.route = this.compile(routes);
    this.prev = null;
    this.overlayComponents = options.components;
    this.watch();
    this.persist();
    this._listen();
    this.components = /* @__PURE__ */ new Map();
    for (let path in routes) {
      if (Object.prototype.hasOwnProperty.call(routes, path)) {
        let conf = routes[path];
        if (conf.name != "404") {
          let components = conf.components;
          components.forEach((component) => {
            this.components.set(component.name, component);
          });
        }
      }
    }
    return {
      goTo: this.goTo.bind(this),
      goBack: this.goBack.bind(this),
      auth: this.auth.bind(this),
      logout: this.logout.bind(this),
      login: this.login.bind(this),
      verify: this.verifyAuth.bind(this),
      _getCurrentRoute: this._getCurrentRoute.bind(this),
      ...this.prev
    };
  }
  _listen() {
    let name = "pathChanged";
    document.addEventListener(name, (e) => {
      let detail = e.detail;
      history.pushState(detail, window.title, detail.path);
      this.parse();
      this.notify().then(() => {
        return this.clear().then(() => {
          return this.navigate().then(() => {
          });
        });
      });
    });
  }
  getComponent(name, path) {
    if (this.componentConf && this.componentConf[name]) {
      let rerender = this.componentConf[name].rerender;
      if (rerender) {
        name = rerender.includes(path) ? name : null;
      }
    }
    return name ? this.components.get(name) : null;
  }
  verifyAuth(token) {
    return this.isAuthorized();
  }
  async authenticate(name, isauth) {
    let authUser = Utils_default.is.isArray(isauth) && isauth.length && isauth || null;
    if (!(isauth == true || authUser)) {
      return;
    }
    const initialize = this.unauthRoute() == name;
    if (this.unauthRoute()) {
      try {
        const isverified = await this.verifyAuth();
        if (!isverified) {
          alert("provide verify function.");
          throw new Error("provide verify function.");
        }
        if (authUser) {
          if (!authUser.includes(isverified.role)) {
            let result = await this.logout();
            if (result && result.isredirected) {
            } else {
              console.log("reload");
            }
            return;
          }
        }
        if (![1, 0].includes(Number(isverified.status) || 2)) {
          alert("verify function should be {status:1 || 0, role:''}");
          throw new Error(
            "verify function should be {status:1 || 0, role:''}"
          );
        }
        if (isverified.status == 0) {
          await this.logout();
          console.log("reload");
        }
        if (isverified.status == 1) {
          if (initialize) {
            const role = isverified.role;
            const route = this.authRedirectRoute[role];
            if (route) {
              const name2 = route.name;
              this.goTo(name2);
            }
          } else {
          }
        } else {
          if (initialize) {
          } else {
            await this.logout();
          }
        }
      } catch (err) {
        alert(JSON.stringify(err.message || err));
        if (initialize) {
        } else {
          await this.logout();
        }
      }
    }
  }
  login(cred, options) {
    let role = cred.role;
    let token = cred.token;
    let data = cred.data;
    let path = options && options.path;
    let config = options && options.config;
    if (!role) {
      throw new Error("role is not provided in router.login");
    }
    if (!token) {
      throw new Error("token is not provided in router.login");
    }
    if (!data) {
      throw new Error("data is not provided in router.login");
    }
    if (path) {
    } else if (this.authValidRoute && this.authValidRoute[role]) {
      path = this.authValidRoute[role];
    } else {
      throw new Error("provide route when login is successful");
    }
    this.goTo(path, config);
  }
  auth() {
    return true;
  }
  logout(isredirect) {
    if (this.prev.name == this.unauthRoute()) {
      return Promise.resolve();
    }
    if (isredirect) {
    } else {
      return new Promise((res, rej) => {
        try {
          this.goTo(
            this.unauthRoute(),
            { replace: true },
            function(result) {
              res(result);
            }
          );
        } catch (err) {
          alert("unauthorized");
          console.log(269, err);
          rej(err);
        }
      });
    }
  }
  goTo(routeName, config = {}, callback) {
    try {
      if (!routeName) {
        throw new Error("route name is required, provide route name");
      }
      let routes = this.route;
      let params = config.params || {};
      let isreplace = config.replace;
      let hash = null;
      const raw = Object.entries(routes);
      for (let i = 0; i < raw.length; i++) {
        const route = raw[i][0];
        const config2 = raw[i][1];
        const name = config2.name;
        if (name == routeName) {
          hash = route;
          break;
        }
      }
      if (!hash) {
        if (routeName && routeName.includes("://")) {
          location.href = routeName;
          return callback && callback({ isredirected: true });
        }
        throw new Error(`${routeName} is not found in routes`);
      }
      if (hash == "/") {
        if (isreplace) {
          history.replaceState({}, window.title, null);
          location.replace(`${location.origin}${location.pathname}`);
        } else {
          window.location = `${location.origin}${location.pathname}`;
        }
        return;
      }
      let path;
      hash = hash.slice(1);
      if (params.toString().includes("Object")) {
        let p = "";
        for (let key in params) {
          p += `${key}=${params[key]}&`;
        }
        params = p;
        path = `/${hash}?${params}`;
      } else {
        path = `/${hash}`;
      }
      if (hash == "/") {
        path = "";
      }
      if (isreplace) {
        let loc = `${location.origin}${path}`;
        Utils_default.is.isChrome() && !Utils_default.is.isFirefox() && history.replaceState(void 0, void 0, loc);
        location.replace(loc);
      } else {
        var a = document.createElement("a");
        a.href = `${path}`;
        Utils_default.is.isChrome() && !Utils_default.is.isFirefox() && history.pushState(void 0, void 0, a.href);
        a.click();
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  goBack() {
    return new Promise((res, rej) => {
      window.history.back();
      res();
    });
  }
  persist() {
    if (!document.hasRouterPersist) {
      let event = "DOMContentLoaded";
      if ("deviceready" in document) {
        event = "deviceready";
      }
      document.addEventListener(event, (e) => {
        this.parse();
        this.notify().then(() => {
          return this.navigate(true);
        });
      });
      document.hasRouterPersist = true;
    }
  }
  watch() {
    if (!window.hasRouterPop) {
      window.addEventListener("popstate", (e) => {
        this.parse();
        this.notify().then(() => {
          return this.clear().then(() => {
            return this.navigate().then(() => {
            });
          });
        });
      });
      window.hasRouterPop = true;
    } else {
      this.parse();
    }
  }
  compile(routes) {
    let con = {};
    for (let key in routes) {
      let config = routes[key];
      key = String(key);
      const len = key.length;
      let regex = key;
      if (["404"].includes(key)) {
        const callback = routes[key];
        config = { callback, name: key };
      } else {
        regex = regex.slice(1);
      }
      regex = regex.split("/");
      regex = regex.map((item, index) => {
        let param = item.includes(":");
        let a = "";
        index == 0 ? a += "^/" : a += "/";
        param ? a += "(([^/#?]+?))" : a += item;
        index == len - 1 ? a += "/?$" : a += "";
        if (param) {
          const paramKey = item.replace(":", "");
          if (!con[key]) {
            con[key] = {};
          }
          con[key].params = {
            [paramKey]: index
          };
        }
        return a;
      });
      if (con[key] && con[key].params) {
        con[key] = {
          params: con[key].params,
          regex: new RegExp(regex.join("")),
          ...config
        };
      } else {
        con[key] = {
          regex: new RegExp(regex.join("")),
          ...config
        };
      }
      if (this.authValidRoute) {
        Utils_default.array.each(this.authValidRoute, (obj, i) => {
          let key2 = obj.key;
          let value = obj.value;
          if (value == config.name) {
            if (this.authRedirectRoute[value]) {
              this.authRedirectRoute[value] = config;
              console.error(
                `auth ${value} is found in other route`
              );
            } else {
              this.authRedirectRoute[value] = config;
            }
          }
        });
      }
      MemCache_default.object("Router").set(key, con[key]);
    }
    con.length = Object.keys(routes).length;
    con.keys = Object.keys(routes);
    return con;
  }
  parse() {
    let hash = window.location.pathname, scheme, routeName;
    if (hash) {
      scheme = true;
      let h = "";
      let p = "";
      for (let i = 0; i < hash.length; i++) {
        let v = hash[i];
        if (v == "/" && p == "/") {
          continue;
        }
        if (v == "/" && !p) {
          p = "/";
          h += "/";
        }
        if (v && v != "/") {
          h += v;
          p = "";
        }
      }
      hash = h;
      h = "";
    } else {
      hash = "/";
      scheme = true;
    }
    if (!scheme) {
      return;
    }
    const url = new URL(`http://localhost${hash}`);
    let search = url.search;
    let path = url.pathname;
    const keys = this.route.keys;
    const state = {};
    const PARAMS = {};
    if (search) {
      new URLSearchParams(search).forEach((value, key) => {
        state[key] = value;
      });
    }
    let has = false;
    for (let i = 0; i < keys.length; i++) {
      const route = this.route[keys[i]];
      const regex = route.regex;
      const components = route.components;
      const params = route.params;
      const name = route.name;
      const auth = route.auth;
      const overlay = route.overlay;
      const display = route.display;
      const onrender = route.onrender;
      const controller = route.controller;
      if (params) {
        let _path = String(path);
        _path = _path.slice(1);
        _path = _path.split("/");
        Object.entries(params).forEach((param) => {
          const key = param[0];
          const value = param[1];
          if (_path[value]) {
            PARAMS[key] = _path[value];
          }
        });
      }
      const test = regex.test(path);
      if (test) {
        routeName = name;
        this.authenticate(routeName, auth);
        this.prev = {
          components,
          params: PARAMS,
          state,
          path,
          name,
          prev: this.prev,
          overlay,
          display,
          onrender,
          controller
        };
        has = true;
        break;
      }
    }
    this.redirect404(has);
  }
  redirect404(has) {
    if (!has) {
      if (this.route["404"]) {
        let path = this.route["404"].callback();
        let origin = location.origin;
        let pathname = location.pathname;
        console.log(617, `${origin}${pathname}`);
        if (this.route[path]) {
          if (path == "/") {
            path = `${origin}${pathname}`;
          } else {
            if (pathname.slice(-1) == "/") {
              path = `${origin}${pathname}#!${path}`;
            } else {
              path = `${origin}${pathname}/#!${path}`;
            }
            path = `${origin}${pathname}`;
          }
          location.replace(path);
        } else if (!!path && !this.route[path]) {
          if (origin.slice(-1) == "/") {
            if (path[0] == "/") {
              path = path.slice(1);
            }
          }
          path = `${origin}${path}`;
          location.replace(path);
        }
      }
    } else {
    }
  }
  async navigate(ispersist) {
    if (this.prev) {
      const components = [...this.prev.components];
      const state = this.prev.state;
      const path = this.prev.path;
      const name = this.prev.name;
      const overlay = this.prev.overlay;
      const onrender = this.prev.onrender || {};
      if (this.loaderOptions && this.loaderOptions.except) {
        if (!this.loaderOptions.except.includes(name)) {
          let loaderin = this.loaderOptions.in;
          let loaderout = this.loaderOptions.out;
          if (typeof loaderin == "string" && typeof loaderout == "string") {
            components.unshift(loaderin);
            components.push(loaderout);
          }
        }
      }
      try {
        if (components.length) {
          return new Promise((res, rej) => {
            const l = components.length;
            let i = 0;
            if (l) {
              const recur = () => {
                let component = components[i];
                if (components.length > i) {
                  i += 1;
                  let componentName = component;
                  let isunload = this.getComponent(
                    component,
                    path
                  );
                  new Promise((res2) => {
                    let _component = component;
                    if (_component && _component.isConnected != void 0) {
                      res2(_component);
                    } else {
                      setTimeout(() => {
                        res2(
                          this.components.get(
                            component
                          )
                        );
                      }, 50);
                    }
                  }).then((component2) => {
                    if (component2) {
                      if (component2.isConnected && !isunload) {
                        if (component2.fire.softReload) {
                          component2.fire.softReload();
                          component2.await.softReload && component2.await.softReload.then(
                            () => {
                              recur();
                            }
                          );
                        } else {
                          recur();
                        }
                      } else if (component2.type == "model") {
                        component2.initialize().then(() => {
                          recur();
                        }).catch((err) => {
                          throw err;
                        });
                      } else {
                        let fromRouter = onrender[componentName] || {};
                        let fromComponent = component2.onRenderConfig || {};
                        if (!Utils_default.is.isObject(
                          fromComponent
                        )) {
                          fromComponent = {};
                        }
                        if (!Utils_default.is.isObject(
                          fromRouter
                        )) {
                          fromRouter = {};
                        }
                        component2.render({
                          emit: {
                            route: this.prev
                          },
                          ...fromRouter,
                          ...fromComponent
                        }).then(() => {
                          if (component2.await.isConnected) {
                            component2.await.isConnected && component2.await.isConnected.then(
                              () => {
                                recur();
                              }
                            );
                          } else {
                            recur();
                          }
                        }).catch((err) => {
                          throw err;
                        });
                      }
                    }
                  });
                } else {
                  res();
                }
              };
              recur();
            } else {
              res();
            }
          });
        }
      } catch (err) {
        console.log(err);
        throw new Error(
          `some of the component in ${JSON.stringify(
            components
          )} in path ${path} of router is not found, make sure the it is created`
        );
      }
    }
  }
  clear() {
    let promise = Promise.resolve();
    const overlay = this.prev && this.prev.overlay || void 0;
    if (overlay) {
      return promise;
    }
    const recur = async function(index, componentNames, sourceComponents, callback) {
      let component = componentNames[index];
      let componentName = component;
      let self = recur;
      if (componentNames.length > index) {
        index += 1;
        component = this.getComponent(component.name, this.prev.path);
        if (component) {
          if (component.fire.destroy) {
            component.fire.destroy();
            component.await.destroy.then(() => {
              return self(
                index,
                componentNames,
                sourceComponents,
                callback
              );
            });
          } else {
            component.reset().then(() => {
              return self(
                index,
                componentNames,
                sourceComponents,
                callback
              );
            });
          }
        } else {
          await self(
            index,
            componentNames,
            sourceComponents,
            callback
          );
        }
      } else {
        callback();
      }
    }.bind(this);
    if (this.prev && this.prev.prev) {
      let components = this.prev.prev.components;
      let state = this.prev.prev.state;
      let path = this.prev.prev.path;
      let name = this.prev.prev.name;
      let overlay2 = this.prev.prev.overlay;
      let destroyPromise = Promise.resolve();
      if (overlay2) {
        destroyPromise = new Promise((res, rej) => {
          const l = components.length;
          let i = 0;
          if (l) {
            recur(i, components, this.overlayComponents, res);
          } else {
            res();
          }
        });
      }
      promise = new Promise((res, rej) => {
        const l = components.length;
        let i = 0;
        if (l) {
          recur(i, components, this.overlayComponents, res);
        } else {
          res();
        }
      });
      return destroyPromise.then(() => {
        return promise;
      });
    }
    return promise;
  }
  pushState(data, notused, path) {
    window.history.pushState(data, notused, path);
    let promise = Promise.resolve();
    this.clear();
    return promise.then(() => {
      return this.navigate();
    });
  }
  subscribe(fn) {
    if (fn && fn.constructor.name == "Function") {
      this.hooks.push(fn);
    }
  }
  notify() {
    return Promise.all(
      this.hooks.map((subscribe) => {
        return subscribe();
      })
    );
  }
  _getCurrentRoute() {
    return this.prev;
  }
};
var Router2_default = Router;

// src/index.js
var Cake = class {
  constructor(opts) {
    this.name = opts.name;
    this.defaultRoot = opts.defaultRoot;
    this.components = {};
    this.Observer = new Observer(this.name);
    this.excludeQuery = [".cake-template"];
    this.router = opts.router;
    this.templateCompile = opts.templateCompiler;
    this._registerComponents(opts.components || []);
    this._registerRouter();
  }
  // Component(name, template, opts = {}) {
  //     opts._observer = this.Observer;
  //     // opts._router = this.Router;
  //     // opts._scope = this.Scope;
  //     opts._defaultRoot = this.defaultRoot;
  //     return new Component(this.name, name, template, opts);
  // }
  async _registerRouter() {
    let router = await this.router();
    for (let route in router.routes) {
      if (Object.prototype.hasOwnProperty.call(router.routes, route)) {
        let config = router.routes[route];
        if (!["Function", "AsyncFunction"].includes(
          config.constructor.name
        )) {
          this._registerComponents(config.components);
        }
      }
    }
    if (!this.hasRouter) {
      this._Router = new Router2_default(this.name, router.routes, router.options);
      this.hasRouter = true;
    }
    await this._mountRouter();
  }
  _registerComponents(components) {
    components.forEach((component) => {
      component._setTemplateCompile(this.templateCompile);
      component._setParent(this.name);
      component._setObserver(this.Observer);
      component._setDefaultRoot(this.defaultRoot);
      component._setStorage(
        new StorageKit({
          name: "cache",
          storage: "session",
          child: "object"
        })
      );
      component.options.data && component.options.data.bind(component.data)(component);
      component.options.utils && component.options.utils.bind(component.utils)(component);
      component._setGlobalScope(
        new StorageKit({
          name: "globalScope",
          storage: "session",
          child: "object"
        })
      );
      this.components[component.name] = component;
    });
  }
  _mountRouter() {
    Object.keys(this.components).forEach((name) => {
      let component = this.components[name];
      component._setRouter(this._Router);
    });
  }
};
export {
  Component,
  Observer,
  Router2_default as Router,
  Cake as default
};
