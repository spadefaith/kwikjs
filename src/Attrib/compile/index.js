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

async function compile(el, component, isStatic = false, storage) {
    let map = {
        "[data-template]": compileTemplate,
        ":not([data-template]) > [data-bind]": compileBind, //logical
        ":not([data-template]) > [data-attr]": compileAttr, //logical
        ":not([data-template]) > [data-class]": compileClass, //logical
        ":not([data-template]) > [data-toggle]": compileToggle, //logical
        ":not([data-template]) > [data-event]": compileEvent,
        ":not([data-template]) > [data-route]": compileRoute,
        ":not([data-template]) > [data-container]": compileContainer,
        ":not([data-template]) > [data-ref]": compileRef,

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
        [...Object.keys(map)]

        // "animate",
        // "if",
        // "for",
        // "for-update",
        // "switch",

        // component == "form"
    );

    let r = [];

    // component == "form" && console.log(68, el.innerHTML, component, query);
    // component == "toolbar" && console.log(68, el.innerHTML);

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

                // component == "form" && console.log(73, q, query[q]);

                r.push(
                    map[q].apply(this, [
                        query[q],
                        component,
                        isStatic,
                        el,
                        storage,
                        prev,
                    ])
                );
            }
        }
    }
    return Promise.all(r.length ? r : [r]);
}

export default compile;
