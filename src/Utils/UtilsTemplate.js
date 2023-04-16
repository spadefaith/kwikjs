import MemCache from "../MemCache";
import * as UtilsElement from "./UtilsElement";

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
    if (!style) return false;
    var styles = style.textContent.trim();
    if (!styles.length) {
        return;
    }
    let regexp =
        "((\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
    let regexp1 = "([\\s\\S]*?){([\\s\\S]*?)}";

    let parsed = styles.matchAll(regexp);

    let props = {
        __x__other: {},
        __x__append: "",
    };

    for (let i of parsed) {
        let [a, b, c, d, e, f] = i;

        if (a.includes("@keyframes")) {
            props.__x__append += a;
        } else if (a.includes("@media")) {
            props.__x__append += `${a} }`;
        } else {
            let _parsed = a.matchAll(regexp1);
            for (let i of _parsed) {
                let [a, b, c] = i;
                b = b.trim();

                let cTrim = c.replace(/\n/g, "").trim();

                if (!props[b]) {
                    props[b] = cTrim;
                } else {
                    props[b] += cTrim;
                }

                if (b.slice(1).includes(".")) {
                    if (!props.__x__other[b]) {
                        props.__x__other[b] = "";
                    }
                    props.__x__other[b] += a;
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

    element = isConvert
        ? UtilsElement.toArray(element.children)
        : element.innerHTML;
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

export { getContent };
