import MemCache from "../MemCache";

function toHyphen(string) {
    const name = `to-hyphen_${string}`;
    const containerName = "toHyphen";

    const cached = MemCache.object(containerName).get(name);

    if (cached) {
        return cached;
    }

    const splitted = string.split("");
    let ss = "",
        i = -1;
    while (++i < splitted.length) {
        let s = splitted[i];
        switch (i) {
            case 0:
                {
                    ss += s.toLowerCase();
                }
                break;
            default: {
                s.charCodeAt() < 91 && (ss += "-");
                ss += s.toLowerCase();
            }
        }
    }

    MemCache.object(containerName).set(name, ss);

    return ss;
}

function toProper(string) {
    const name = `to-proper_${string}`;
    const containerName = "toProper";
    const cached = MemCache.object(containerName).get(name);

    if (cached) {
        return cached;
    }

    let first = string.substring(0, 1);
    let rest = string.slice(1).toLowerCase();
    let proper = `${first.toUpperCase()}${rest}`;

    MemCache.object(containerName).set(name, proper);

    return proper;
}

function removeSpace(string) {
    return string.replaceAll(" ", "");
}

function toCamelCase(string) {
    /*
        convert data-name to dataName;
    */

    const name = `to-proper_${string}`;
    const containerName = "toCamelCase";
    const cached = MemCache.object(containerName).get(name);

    if (cached) {
        return cached;
    }

    string = string.toLowerCase();

    if (string.length == 1) {
        return string;
    }

    let split = string.split("-");

    let join = "";
    let i = -1;
    let length = split.length;
    while (++i < length) {
        let string = split[i];
        switch (i) {
            case 0:
                {
                    join += string;
                }
                break;
            default:
                {
                    let first = string.substring(0, 1).toUpperCase();
                    let second = string.substring(1);
                    join += first + second;
                }
                break;
        }
    }
    MemCache.object(containerName).set(name, join);
    return join;
}

function sanitize(data) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#x27;",
        "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    if (typeof data == "string") {
        return data.replace(reg, (match) => map[match] || "");
    } else {
        return data;
    }
}

function uuid() {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return `ck-${uint32.toString(16)}`;
}

function toLogical(a, ops, b) {
    try {
        a = JSON.parse(a);
    } catch (err) {
        //
    }
    try {
        b = JSON.parse(b);
    } catch (err) {
        //
    }
    switch (ops) {
        case "==": {
            return a == b;
        }
        case "!=": {
            return a != b;
        }
        case "<": {
            return a < b;
        }
        case ">": {
            return a > b;
        }
        case ">=": {
            return a >= b;
        }
        case "<=": {
            return a <= b;
        }
    }
}

function splitBySpace(string, fn) {
    if (string) {
        string = string.split(" ");
        for (let i = 0; i < string.length; i++) {
            fn(string[i]);
        }
    }
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export {
    toHyphen,
    toProper,
    removeSpace,
    toCamelCase,
    sanitize,
    uuid,
    toLogical,
    splitBySpace,
    escapeRegExp,
};
