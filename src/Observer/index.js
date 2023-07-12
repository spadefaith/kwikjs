"use strict";

import { recurse } from "../Utils/UtilsFunction";
import observer from "./Observer";
import Utils from "../Utils";
export default class Observer {
    constructor(name) {
        this.name = name;
        this.handlers = {};
        this.subscribe = [];
        this.observer = new observer();
    }
    _subscriber(_components = {}, ctx) {
        // console.log(71,_components);
        if (!Object.keys(_components).length) {
            return;
        }
        for (let _c in _components) {
            if (Object.prototype.hasOwnProperty.call(_components, _c)) {
                let events = _components[_c];

                for (let eventName in events) {
                    if (Object.prototype.hasOwnProperty.call(events, eventName)) {
                        let event = events[eventName];
                        let bindEvent = event.bind(ctx);

                        this.observer.register(`${_c}-${eventName}`, bindEvent);
                    }
                }
            }
        }

        // console.log(71, _components);
    }

    async broadcast(component, event, payload) {
        /**
         * 1. get the subscriber of the event for that component
         *
         */

        const key = `${component}-${event}`;
        let subscriber = this.observer.store.get(key);

        if(subscriber && Utils.is.isArray(subscriber)){

            
            const recur = await recurse(subscriber, (callback, index)=>{

                return callback(payload);
            });


            

            return recur && (recur.length == 1 ? recur[0]: recur);
        }
    }

    _setComponents(components){
        this.components = components;
    }
}
