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

function create(storage, data) {
    if (isArray(storage)) {
        let unique = new Set(storage);
        if (typeOf(data) == "array") {
            data.forEach((i) => {
                unique.add(i);
            });
        } else {
            unique.add(data);
        }
        storage = Array.from(unique);
    } else if (isObject(storage)) {
        if (isObject(data)) {
            ObjectForEach(data, function (value, key) {
                storage[key] = value;
            });
        } else {
            storage[data] = data;
        }
    }

    return storage;
}

function createOrUpdate(storage, data) {
    var has = hasItem(storage, data);
    if (typeOf(storage) == "array") {
        if (!isNull(has)) {
            storage[has] = data;
        } else {
            storage.includes(data);
        }
    } else if (typeOf(storage) == "object") {
        if (isNull(has)) {
            if (isObject(data)) {
                ObjectForEach(data, function (value, key) {
                    ObjectMerge(storage, value, key);
                });
            } else {
                storage[data] = data;
            }
        } else {
            storage[has] = data;
        }
    }
    return storage;
}

function remove(storage, id) {
    if (id == undefined) {
        return false;
    }

    if (typeOf(id) == "string") {
        var has = hasItem(storage, id);
        if (typeOf(storage) == "object") {
            delete storage[has];
        } else if (typeOf(storage) == "array") {
            var arr = [];
            for (var i = 0; i < storage.length; i++) {
                if (i != has) {
                    arr.push(storage[i]);
                } else {
                    continue;
                }
            }
            storage = arr;
        }
        return storage;
    } else if (typeOf(id) == "object") {
        return Object.filter(storage, function (value, key) {
            var test = id[key] != undefined && id[key] == value;
            return !test;
        });
    } else if (typeOf(id) == "array") {
        return Object.filter(storage, function (value, key) {
            var test = id.contains(key);
            return !test;
        });
    }
    if (isNull(has)) {
        return false;
    }
}

function get(storage, id) {
    var type = typeOf(id);
    if (type == "string") {
        var has = hasItem(storage, id);

        if (has == 0 || has) {
            return storage[has];
        }
    } else if (type == "object") {
        return Object.filter(storage, function (value, key) {
            var test = !isUndefined(id[key]) && id[key] == value;
            return test;
        });
    } else if (type == "array") {
        return Object.filter(storage, function (value, key) {
            var test = id.contains(key);
            return test;
        });
    }
    return null;
}

function getNot(storage, id) {
    var type = typeOf(id);
    if (type == "string") {
        return Object.filter(storage, function (value, key) {
            var test = key != id;
            return test;
        });
    } else if (type == "object") {
        return Object.filter(storage, function (value, key) {
            return Object.some(id, function (_value, _key) {
                var test = _key == key && _value == value;

                return !test;
            });
        });
    } else if (type == "array") {
        return Object.filter(storage, function (value, key) {
            var test = !id.contains(key);
            return test;
        });
    }
    return null;
}

function getAll(storage) {
    return storage;
}

export { create, createOrUpdate, remove, get, getNot, getAll };
