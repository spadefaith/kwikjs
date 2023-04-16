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
        // console.log(
        //     58,
        //     element,
        //     selector,
        //     q,
        //     element.closest("[data-template]")
        // );
        // console.log(
        //     57,
        //     selector,
        //     element.querySelectorAll(":not([data-template]) > [data-event]"),
        //     element.querySelectorAll(":not([data-template]) > [data-event]"),
        //     element
        //         .querySelectorAll(":not([data-template]) > [data-event]")[0]
        //         .closest("[data-template]")
        // );
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
    if(!root){
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
