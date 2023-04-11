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
    let obj = {};

    let splitted = styles.split("}");
    for (let sp = 0; sp < splitted.length; sp++) {
        let item = splitted[sp];
        let _sp1 = item.split("{");
        let sel = _sp1[0];
        let style = _sp1[1];
        // let [sel, style] = item.split("{");
        if (sel) {
            obj[sel.trim()] = (() => {
                let n = false;
                let s = "";
                let splitted = style.split("");
                for (let sp = 0; sp < splitted.length; sp++) {
                    let item = splitted[sp];
                    if (item == "\n") {
                        n = true;
                    } else if (item == " ") {
                        if (n) {
                            //
                        } else {
                            s += item;
                        }
                    } else {
                        n = false;
                        s += item;
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
    element = isConvert
        ? UtilsElement.toArray(element.children)
        : element.innerHTML;
    return element.length == 1 ? element[0] : element;
}

export { getContent };
