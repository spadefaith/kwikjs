"use strict";

import Utils from "./Utils";

function loop(elements, callback) {
    try {
        Utils.array.each(Utils.element.toArray(elements), callback);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function remove(element) {
    // console.log(16,element);
    let fg = document.createDocumentFragment();
    element && fg.appendChild(element);
    // el  && el.remove();
    fg = null;
    return true;
}

function getElementsByDataset() {
    let o = {};

    let element = arguments[0];
    let args = arguments[1];
    let isLog = arguments[2];

    // console.log(29, element);
    // console.trace();

    Utils.array.each(args, function (arg, index) {
        if (!o[arg]) {
            o[arg] = [];
        }

        let els = Utils.element.querySelectorAllIncluded(
            element,
            arg,
            null,
            null,
            isLog
        );

        // isLog && console.log(40, els, arg);

        Utils.array.each(els, function (el, index) {
            o[arg].push(el);
        });

        els = null;
    });
    return o;
}

function applyCss(element, styles) {
    /**
     * styles = {
     *      color:red
     * }
     * 
     * or
     * 
     * styles = {
     *      .nav-item:{
     *          color:red
     *      }
     * }
     * 
     */
    Utils.array.each(styles, function (css, index) {
        let { key, value } = css;
        if (Utils.is.isObject(value)) {
            let selector = key;
            let elCss = value;
            Utils.array.each(elCss, function (css, index) {
                let { key, value } = css;
                let target = Utils.element.querySelectorIncluded(
                    element,
                    selector
                );

                if(target){
                    target.style[key] = value;
                }

                target = null;

            });
        } else {
            element.style[key] = value;
        }
    });
}

async function appendTo(root, element, cleaned) {
    // const cloned = element.cloneNode(true);
    if (!root && !root.attributes) {
        throw new TypeError(`the ${root} is not an instance of Element`);
    }

    cleaned && (root.innerHTML = "");


    // root.appendChild(cloned);
    root.appendChild(element);
   
}

function querySelectorAllIncluded(element, selector, attr, val) {
    return Utils.element.querySelectorAllIncluded(element, selector, attr, val);
}

export default class Piece {
    constructor(el) {
        
        this.el = el && (el.el || el);
        // console.log(104, this.el);
    }
    toArray() {
        return Utils.element.toArray(this._el);
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
        Utils.element.unRequired(this.el);
    }
    replaceDataSrc() {
        Utils.element.replaceDataSrc(this.el);
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
        return Utils.element.toArray(this.el.getElementsByTagName("*"));
    }
    css(obj) {
        return applyCss(this.el, obj);
    }
    async appendTo(roots, cleaned) {
        return await appendTo(roots, this.el, cleaned);
    }
    getElementsByTagName(tag) {
        return Utils.element.toArray(this.el.getElementsByTagName(tag));
    }
    getElementById(selector) {
        return Utils.element.toArray(this.el.getElementById(selector));
    }
    querySelectorAll(selector) {
        return Utils.element.toArray(this.el.querySelectorAll(selector));
    }
    querySelector(selector) {
        return Utils.element.toArray(this.el.querySelector(selector));
    }

    querySelectorIncluded(selector, attr, val) {
        // console.log(156, this.el, this.el.closest);
        return Utils.element.querySelectorIncluded(
            this.el,
            selector,
            attr,
            val
        );
    }
    querySelectorAllIncluded(selector, attr, val) {
        return Utils.element.querySelectorAllIncluded(
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
    addClass(cl){
        this.el && cl.split(" ").forEach(cl=>this.el.classList.add(cl));
    }
    removeClass(cl){
        this.el && cl.split(" ").forEach(cl=>this.el.classList.remove(cl));
    }
    toggleClass(cl){
        this.el && cl.split(" ").forEach(cl=>this.el.classList.toggle(cl));
    }
}

export {
    remove,
    getElementsByDataset,
    applyCss,
    appendTo,
    querySelectorAllIncluded,
};
