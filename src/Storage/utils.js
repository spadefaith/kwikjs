function typeOf(_obj) {
    if (!_obj) {
        return null;
    }
    return _obj.constructor.name.toLowerCase();
}
function ObjectForEach(obj, fn) {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn(obj[key], key);
        }
    }
}
function ObjectMerge(obj, value, key) {
    obj = Object.assign(obj, { [key]: value });
}
function isNull(d) {
    return d === null;
}

function isUndefined(d) {
    return d === undefined;
}
function isArray(_obj) {
    return typeOf(_obj) == "array";
}
function isObject(_obj) {
    return typeOf(_obj) == "object";
}

function hasInArray(src, id) {
    var has = null;
    for (var i = 0; i < src.length; i++) {
        var item = src[i];
        if (typeOf(id) == "object") {
            var obj = id;
            var key = Object.keys(id)[0];
            var value = obj[key];
            if (typeOf(item) == "object") {
                const test = item[key] == value;
                if (test) {
                    has = i;
                    break;
                }
            }
        } else if (typeOf(id) != "array") {
            const test = id == item;
            if (test) {
                has = i;
                break;
            }
        }
    }
    return has;
}

function hasInObject(src, id) {
    var key = null;
    var type = typeOf(id);
    if (type == "object") {
        var _key = Object.keys(id)[0];
        if (src[key] != undefined && src[key] == id[_key]) {
            key = _key;
        }
    } else if (type == "string") {
        key = id;
    }
    return key;
}

function hasItem(src, id) {
    var has = null;
    if (typeOf(src) == "array") {
        has = hasInArray(src, id);
    } else if (typeOf(src) == "object") {
        has = hasInObject(src, id);
    }
    return has;
}

export {
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
};
