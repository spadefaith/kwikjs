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

import * as methods from "./methods";

import Storage from "./storage";

export default class StorageKit {
    constructor(_obj) {
        this.name = _obj.name;
        this.storageType = _obj.storage;
        this.child = _obj.child || "object";
        try {
            if (typeOf(this.child) == "string") {
                this.child =
                    this.child == "array"
                        ? []
                        : this.child == "object"
                        ? {}
                        : null;
            }
        } catch (err) {
            if (this.storageType == "session") {
                sessionStorage.clear();
            } else if (this.storageType == "local") {
                localStorage.clear();
            }

            if (typeOf(this.child) == "string") {
                this.child =
                    this.child == "array"
                        ? []
                        : this.child == "object"
                        ? {}
                        : null;
            }
        }
        if (!["array", "object"].includes(typeOf(this.child))) {
            throw new Error("the child must be an object or array type.");
        }

        this.storage = new Storage(this.storageType, this.name, this.child);
        this.storage.init();
    }
    has(id) {
        var storage = this.storage.open();
        var has = hasItem(storage, id);
        return isNull(has) ? false : has;
    }
    get(id, quick) {
        if (quick) {
            var storage = this.storage.open();

            return methods.get(storage, id);
        } else {
            return new Promise((res) => {
                setTimeout(() => {
                    var storage = this.storage.open();
                    res(storage);
                });
            }).then((storage) => {
                // console.log(342, storage)
                return methods.get(storage, id);
            });
        }
    }
    getNot(id) {
        var storage = this.storage.open();
        return methods.getNot(storage, id);
    }
    getAll() {
        var storage = this.storage.open();
        return Promise.resolve(storage);
    }
    update(id, update) {
        var storage = this.storage.open();
        var has = hasItem(storage, id);
        if (has == 0 || has) {
            storage = methods.createOrUpdate(storage, update);
            return this.storage.close(storage);
        }
        return false;
    }
    createOrUpdate(data) {
        if (arguments.length > 1) {
            let key = arguments[0];
            let value = arguments[1];
            data = { [key]: value };
        }
        var storage = this.storage.open();
        storage = methods.createOrUpdate(storage, data);
        const close = this.storage.close(storage);
        // console.log(377, storage);

        return close;
    }
    create(data) {
        var storage = this.storage.open();
        storage = methods.create(storage, data);

        return this.storage.close(storage);
    }
    remove(id) {
        var storage = this.storage.open();
        storage = methods.remove(storage, id);
        return this.storage.close(storage);
    }
}
