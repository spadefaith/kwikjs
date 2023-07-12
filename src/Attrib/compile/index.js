import * as Utils from "../../Utils";
import { getElementsByDataset } from "../../Piece";

import MemCache from "../../MemCache";

import compileAttr from "./CompileAttr";
import compileBind from "./CompileBind";
import compileClass from "./CompileClass";
import compileEvent from "./CompileEvent";
import compileToggle from "./CompileToggle";
import compileTemplate from "./CompileTemplate";
import compileRoute from "./CompileRoute";
import compileContainer from "./CompileContainer";
import compileRef from "./CompileRef";
import compileSubTemplate from "./CompileSubTemplate";
import compileValidator from "./CompileValidator";

async function compile(el, component, isStatic = false, storage,multipleEventStorage, keys,isReInject) {
    const templateSelector = "[data-template]";
    let map = {
        [templateSelector]: {
            handler:compileTemplate, name:"template"
        },
        ":not([data-template]) > [data-bind]": {
            handler:compileBind, name:"bind"
        }, //logical
        ":not([data-template]) > [data-attr]": {
            handler:compileAttr, name:"attr"
        }, //logical
        ":not([data-template]) > [data-class]": {
            handler:compileClass, name:"class"
        }, //logical
        ":not([data-template]) > [data-toggle]": {
            handler:compileToggle, name:"toggle"
        }, //logical
        ":not([data-template]) > [data-event]": {
            handler:compileEvent, name:"event"
        },
        ":not([data-template]) > [data-route]": {
            handler:compileRoute, name:"route"
        },
        ":not([data-template]) > [data-container]": {
            handler:compileContainer, name:"container"
        },
        ":not([data-template]) > [data-ref]": {
            handler:compileRef, name:"ref"
        },
        ":not([data-template]) > [data-subtemplate]": {
            handler:compileSubTemplate, name:"subtemplate"
        },
        ":not([data-template]) > [data-validator]": {
            handler:compileValidator, name:"validator"
        },
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

    

    if(keys){
        map = Object.keys(map).reduce((accu, key)=>{
            let val = map[key];
            if(keys.includes(val.name)){
                accu[key] = val;
            }
            return accu;
        },{});
    }

    // console.log(80,keys, map);

    


    let query = await getElementsByDataset(
        el,
        Object.keys(map)

        // "animate",
        // "if",
        // "for",
        // "for-update",
        // "switch",

        // component == "form"
    );


    

    let r = [];

    // component == "form" && console.log(68, el.innerHTML, component, query);
    // console.log(68, el.innerHTML);
    // component == "BillingSummary" && console.log(el.outerHTML);
    // component == "static_form" && console.log(73,isReInject);

    let prev = storage.get();
    storage.destroy();

    for (let q in query) {
        if (Object.prototype.hasOwnProperty.call(query, q)) {
            if (query[q].length) {
                // if (q != "[data-template]") {
                //     query[q] = query[q].filter((item) => {
                //         return item.closest("[data-template]");
                //     });
                // }

                // component == "static_form" && console.log(73, templateSelector == q && isReInject);
                if(templateSelector == q && isReInject){
                    continue;
                }
                // component == "static_form" && console.log(77, templateSelector == q && isReInject);

                r.push(
                    map[q].handler.apply(this, [
                        query[q],
                        component,
                        isStatic,
                        el,
                        storage,
                        prev,
                        multipleEventStorage
                    ]).then(res=>{
                        return map[q].name;
                    })
                );
            }
        }
    }

    // component == "static_form" && console.log(80,r);

    return Promise.all(r.length ? r : [r]);
}

export default compile;
