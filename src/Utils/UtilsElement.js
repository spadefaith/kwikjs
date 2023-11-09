import { isArray } from "./UtilsIs";
import * as UtilsArray from "./UtilsArray";

function toArray(elements, reversed = false) {
    if (isArray(elements)) {
        return elements;
    }

    if (elements.length != undefined && elements.tagName != "FORM") {
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
        elements = null;
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
    // console.log(33, element);
    // console.trace();
    if (!attr && !val) {
        let qu = element.closest(selector);
        query = null;
        return qu || null;
    } else if (!!attr && !!val) {
        return element.getAttribute(attr) == val ? element : null;
    } else if (!!attr && !val) {
        return element.getAttribute(attr) ? element : null;
    }
}

function querySelectorAllIncluded(element, selector, attr, val, isLog) {
    let q = null;
    let root = null;
    let hasParent = false;
    if (element) {
        root = element.parentElement;
        hasParent = true;
    }

    let querySelector = null;

    if (selector) {
        querySelector = selector;
    } else if (attr && val) {
        querySelector = `[${attr}=${val}]`;
    } else if (attr && !val) {
        querySelector = `[${attr}]`;
    }
    if (!querySelector) {
        return null;
    }

    try {
        q = (root || element).querySelectorAll(querySelector);

        q && (q = toArray(q));
    } catch (err) {
        q = [];
    }

    if (!hasParent) {
        if (selector) {
            const cloned = element.cloneNode();
            const temp = document.createElement("html");
            temp.append(cloned);
            const has = temp.querySelector(selector);
            if (has) {
                q.push(element);
            }
        } else if (attr && val) {
            if (element.dataset[attr] == val) {
                q.push(element);
            }
        } else if (attr && !val) {
            if (element.dataset[attr]) {
                q.push(element);
            }
        }
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
    elements = null;
}

function replaceDataSrc(root) {
    if (!root) {
        throw new Error("data-src is not found");
    }
    setTimeout(() => {
        let srcs = querySelectorAllIncluded(root, "[data-src]", null);

        for (let s = 0; s < srcs.length; s++) {
            let el = srcs[s];
            if (el && el.dataset.src) {
                el.setAttribute("src", el.dataset.src);
                el.removeAttribute("data-src");
            }
        }
        srcs = null;
    }, 1000);
}
function unRequired(root) {
    let srcs = root.querySelectorAll("[required]");
    for (let i = 0; i < srcs.length; i++) {
        let el = srcs[i];

        if (el) {
            el.removeAttribute("required");
        }
    }
    srcs = null;
}

function addEventListener(el, event, handler, options) {
    return el.addEventListener(event, handler, options);
}

function toElement(template) {
    let fr = document.createElement("template");
    fr.innerHTML = template;

    return fr.content.children;
}

export {
    toArray,
    toElement,
    querySelectorIncluded,
    querySelectorAllIncluded,
    classNameTogglerByDataName,
    replaceDataSrc,
    unRequired,
    addEventListener,
};
