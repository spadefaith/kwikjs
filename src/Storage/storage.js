import {
    hasItem,
    hasInObject,
    hasInArray,
    isObject,
    isArray,
    ObjectForEach,
    ObjectMerge,
    isNull,
    isUndefined,
    typeOf,
} from "./utils";

export default class {
    constructor(type, name, child) {
        this.type = type;
        this.name = `${location.origin}-${name}`;
        this.child = child;
        this.cache = {};
        if (typeOf(this.child) == "string") {
            this.child = child == "array" ? [] : child == "object" ? {} : false;
        }
    }
    init(save) {
        if (this[this.type]) {
            this[this.type](save);
            return true;
        }
        return false;
    }
    open() {
        let decoded;
        if (this.type == "session") {
            try {
                decoded = JSON.parse(sessionStorage[this.name]);
            } catch(err){
                //it will error, when the sessionStorage || localStorage is cleared, without refreshing the browser
                this.init();
                try {
                    decoded = JSON.parse(sessionStorage[this.name]);
                } catch(err){//
                }
                // throw err;
            }
            // if (this.name == '_cake_persistent'){
            //     console.log(2503,decoded);
            // };
            return decoded[this.name];
        } else if (this.type == "local") {
            decoded = JSON.parse(localStorage[this.name]);
            return decoded[this.name];
        } else {
            // console.log(119,this.type,this.cache);
            return this.cache[this.name];
        }
    }
    close(storage) {
        this.child = storage || this.child;
        this.recache();
        // console.log(94,this.name, storage);
        return this.init(true);
    }
    recache() {
        this.cache[this.name] = this.child;
    }
    create() {
        // console.log(93, this.name, this.cache);
        this.cache[this.name] = this.child;
    }
    array() {
        this.create();
    }
    object() {
        this.create();
    }
    session(save) {
        if (!save) {
            this.recache();
        }
        try {
            if (!sessionStorage[this.name] && !save) {
                sessionStorage.setItem(this.name, JSON.stringify(this.cache));
            } else if (save) {
                sessionStorage.setItem(this.name, JSON.stringify(this.cache));
            }
        } catch (err) {
            this.recache();
        }
    }
    local(save) {
        // this.verifyLocalStorage();
        if (!save) {
            this.recache();
        }
        try {
            if (!localStorage[this.name] && !save) {
                localStorage.setItem(this.name, JSON.stringify(this.cache));
            } else if (save) {
                localStorage.setItem(this.name, JSON.stringify(this.cache));
            }
        } catch (err) {
            this.recache();
        }
    }
}
