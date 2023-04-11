import Utils from "../Utils";

import compile from "./compile";

import HandlerAttr from "./handler/HandlerAttr";
import HandlerBind from "./handler/HandlerBind";
import HandlerClass from "./handler/HandlerClass";
import HandlerToggle from "./handler/HandlerToggle";
import HandlerRoute from "./handler/HandlerRoute";
import HandlerTemplate from "./handler/HandlerTemplate";

async function set(
    prop,
    newValue,
    prevValue,
    component,
    storage,
    templateCompile
) {
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
        "route",
    ];

    let configs = storage.get();

    for (let a = 0; a < actions.length; a++) {
        const action = actions[a];
        const vals = configs[action];

        if (vals) {
            for (let v = 0; v < vals.length; v++) {
                const val = vals[v];
                const bind = val.bind;
                if (bind == prop) {
                    hits[action] = true;
                }
            }
        }
    }

    return await Promise.all(
        Object.keys(hits).map((key) => {
            if (key == "bind") {
                return HandlerBind(prop, val, prevValue, name, html, storage);
            } else if (key == "attr") {
                return HandlerAttr(prop, val, prevValue, name, html, storage);
            } else if (key == "class") {
                return HandlerClass(prop, val, prevValue, name, html, storage);
            } else if (key == "route") {
                return HandlerRoute(prop, val, prevValue, name, html, storage);
            }
            // else if (key == "toggle") {
            //     return HandlerToggle(prop, val, prevValue, name, html, storage);
            // }
            else if (key == "template") {
                return HandlerTemplate(
                    prop,
                    val,
                    prevValue,
                    name,
                    html,
                    storage,
                    templateCompile
                );
            }
        })
    );
}

async function inject(el, component, isStatic = false, storage) {
    el = el.el || el;
    return await compile(el, component, isStatic, storage);
}

export default class Attrib {
    constructor(storage, templateCompile) {
        // console.log(89, storage, templateCompile);

        this.storage = storage;
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
}
