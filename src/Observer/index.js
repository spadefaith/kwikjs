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
    // _handlers(callback = {}, ctx) {
    //     console.log("here");
    //     if (!Object.keys(callback).length) {
    //         return;
    //     }

    //     if (!ctx.handlers) {
    //         ctx.handlers = {};
    //     }

    //     for (let key in callback) {
    //         if (Object.prototype.hasOwnProperty.call(callback, key)) {
    //             let fn = callback[key].bind(ctx);

    //             let listeners = function () {
    //                 console.log("here");
    //                 return this.subscribe.filter((item) => {
    //                     return item.from == ctx.name;
    //                 });
    //             }.bind(this);

    //             this.handlers[key] = async function () {
    //                 let _listeners = listeners();

    //                 let payload = await fn();

    //                 await Promise.all(
    //                     _listeners.map((fn) => {
    //                         return fn.handler(payload);
    //                     })
    //                 );

    //                 return payload;
    //             }.bind(ctx);

    //             ctx.handlers[key] = async function () {
    //                 let _listeners = listeners();

    //                 let payload = await fn();

    //                 console.log(49,_listeners);

    //                 await recurse(_listeners,async (fn, index)=>{
    //                     console.log(50,fn);
    //                     return fn.handler(payload);
    //                 });

    //                 // await Promise.all(
    //                 //     _listeners.map((fn) => {
    //                 //         return fn.handler(payload);
    //                 //     })
    //                 // );

    //                 return payload;
    //             }.bind(ctx);
    //         }
    //     }
    //     // console.log(40, this.handlers);
    // }
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

                        // console.log(86, `${_c}-${eventName}`,eventName,event, bindEvent);

                        // if(key == "displayTable"){
                        //     console.log(60,_components);

                        // }
                        this.observer.register(`${_c}-${eventName}`, bindEvent);
                        // this.subscribe.push({
                        //     handler: bindEvent,
                        //     listentToEvent: eventName,
                        //     from: _c,
                        //     listener: ctx.name,
                        // });
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
        // console.log(111,`${component}-${event}`);
        // console.log(112,this.observer.store.get(`${component}-${event}`));

        // event == "displayTable" && console.log(
        //     83,
        //     component,
        //     event,
        //     payload,
        //     this.subscribe.filter((subscriber) => {
        //         return subscriber.from == component;
        //     })
        // );
        // event == "displayTable"  && console.log(88,this.subscribe
        //     .filter((subscriber) => {
        //         return (
        //             subscriber.from == component &&
        //             event == subscriber.listentToEvent
        //         );
        //     }));
        // event == "displayTable"  && console.log(97,this.subscribe);

        // console.log(107,event, payload);

        const key = `${component}-${event}`;
        let subscriber = this.observer.store.get(key);

        if(subscriber && Utils.is.isArray(subscriber)){

            
            return await recurse(subscriber, (callback, index)=>{

                return callback(payload);
            });
        }


        // return Promise.all(
        //     this.subscribe
        //         .filter((subscriber) => {

        //             return (
        //                 subscriber.from == component &&
        //                 subscriber.listentToEvent == event
        //             );
        //         })
        //         .map((subscriber) => {
        //             // event == "displayTable" && console.log(101, subscriber);
        //             // let listeningComponent = this.components[subscriber.listener];
                    
        //             // console.log(107,listeningComponent);
        //             // console.log(105,event, subscriber);
        //             return subscriber.handler(payload);
        //         })
        // );
    }

    _setComponents(components){
        this.components = components;
    }
}
