"use strict";

import MemCache from "../MemCache";
import { recurse } from "../Utils/UtilsFunction";
import Utils from "../Utils";
import { DynamicEventItemType } from "../types";



export default class Observer{
    store: any;
    constructor(){
        this.store = MemCache.object("__observer");
    }
    async broadcast(event:string, payload:any, hookEvents: DynamicEventItemType[]){
        const handlers: any[] = [];



        let subscribers = this.store.get(event);

        //push subscribers of event
        subscribers && subscribers.forEach((subscriber: DynamicEventItemType) => handlers.push(subscriber));

        //push dynamic events
        


        if(hookEvents && Utils.is.isArray(hookEvents)){

            hookEvents.filter(item=>{
                return item.event == event;
            }).forEach(item=>{
 
                handlers.push(item.handler);
            });
        }

        if(handlers && Utils.is.isArray(handlers) && handlers.length){
            const recur = await recurse(handlers, (callback, index)=>{
                return callback(payload);
            });
            return recur && (recur.length == 1 ? recur[0]: recur);
        } else {
            return payload;
        }
    }
    register(event, handler){
        if(!this.store.get(event)){
            this.store.set(event,[]);
        }
        let subscribers = this.store.get(event);
        subscribers.push(handler);
        this.store.set(event,subscribers);

        subscribers = null;
    }
}