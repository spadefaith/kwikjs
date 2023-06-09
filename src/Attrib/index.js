import Utils from "../Utils";

import compile from "./compile";

import HandlerAttr from "./handler/HandlerAttr";
import HandlerBind from "./handler/HandlerBind";
import HandlerClass from "./handler/HandlerClass";
import HandlerToggle from "./handler/HandlerToggle";
import HandlerRoute from "./handler/HandlerRoute";
import HandlerTemplate from "./handler/HandlerTemplate";
import HandlerSubTemplate from "./handler/HandlerSubTemplate";

async function set(
    prop,
    newValue,
    prevValue,
    component,
    storage,
    templateCompile,
    actions 
) {

    const isTarget = component.name == "static_form";

    let dynamicActions = [
        "bind",
        "attr",
        "class",
        // "toggle",
        "event",
        "template",
        "route",
    ];

    // console.log(32,component,prop, actions);


    if(actions){
        dynamicActions = actions.filter(item=>dynamicActions.includes(item));
    }

    // console.log(37,dynamicActions);

    let { name, html } = component;

    let val = JSON.parse(JSON.stringify(newValue));

    let hits = {};

    let configs = storage.get();


    

    for (let a = 0; a < dynamicActions.length; a++) {
        const action = dynamicActions[a];
        const vals = configs[action];

        // console.log(56, vals);
        // isTarget && action == "template" && console.log(prop,configs);
        
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

async function inject(el, component, isStatic = false, storage,multipleEventStorage, keys,isReInject) {
    el = el.el || el;
    return await compile(el, component, isStatic, storage,multipleEventStorage, keys,isReInject);
}

export default class Attrib {
    constructor(storage,multipleEventStorage, templateCompile) {
        // console.log(89, storage, templateCompile);

        this.storage = storage;
        this.multipleEventStorage = multipleEventStorage;
        this.templateCompile = templateCompile;

        this.cache = {};
    }
    async set(prop, newValue, prevValue, component) {
        // console.log(108, prop, newValue);
        const setted = await set(
            prop,
            newValue,
            prevValue,
            component,
            this.storage,
            this.templateCompile,
            this.cache[component]
        );

        // console.log(109,setted);

        return setted;
    }
    async inject(el, component, isStatic = false, isReInject = false) {
        let compiled = {};

        if(!isReInject && this.cache[component]){
            compiled = await inject(el, component, isStatic, this.storage,this.multipleEventStorage, this.cache[component],isReInject);
        } else {
            compiled = await inject(el, component, isStatic, this.storage,this.multipleEventStorage, undefined, isReInject);
        }

        // console.log(126,component, this.cache[component]);

        if(!this.cache[component] && !isReInject){
            this.cache[component] = compiled;
        }

        return compiled;
    }
    async triggerSet(key, component){
        let { name, html } = component;

        // console.log(139,key, name, html);

        if (key == "subtemplate") {
            return HandlerSubTemplate(name,html,this.storage);
        }
    }
}
