"use strict";


import observer from "./Observer";

export default class Observer {
    constructor(name) {
        this.name = name;
        this.handlers = {};
        this.subscribe = [];
        this.observer = new observer();
    }
    subscriber(_components = {}, ctx) {
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
        // console.log(41,component.name,event);

        const key = `${component.name}-${event}`;
        return this.observer.broadcast(key, payload, component.dynamicEvents);
    }

    _setComponents(components){
        this.components = components;
    }
}
