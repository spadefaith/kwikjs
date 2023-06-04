"use strict";

import MemCache from "../MemCache";
import { recurse } from "../Utils/UtilsFunction";

export default class Observer{
    constructor(){
        this.store = MemCache.object("__observer");
    }
    async broadcast(event, payload){
        let subscribers = this.store.get(event);
        if(subscribers && subscribers.length){
            return recurse(subscribers, (handler, index)=>{
                return handler(payload);
            }).then(res=>{
                subscribers = null;
                return res;
            });
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