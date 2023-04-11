import * as UtilsIs from "./UtilsIs";

function _each(ctx, fn, type, reversed = false) {
    if (type == "object") {
        let i = 0;
        for (let key in ctx) {
            if (Object.prototype.hasOwnProperty.call(ctx, key)) {
                fn({ key, value: ctx[key] }, i);
                i = i + 1;
            }
        }
    } else {
        if (reversed) {
            for (let a = ctx.length; a > ctx.length; a--) {
                let res = fn(ctx[a], a);
                if (res == "break") {
                    break;
                } else if (res == "continue") {
                    continue;
                }
            }
        } else {
            for (let a = 0; a < ctx.length; a++) {
                let res = fn(ctx[a], a);
                if (res == "break") {
                    break;
                } else if (res == "continue") {
                    continue;
                }
            }
        }
    }
}
function each(ctx, fn, reversed) {
    var type = UtilsIs.isArray(ctx) || ctx.length ? "array" : "object";
    _each(
        ctx,
        function (obj, index) {
            fn(obj, index);
        },
        type,
        reversed
    );
}
function map(ctx, fn, reversed) {
    let type = UtilsIs.isArray(ctx) || ctx.length ? "array" : "object";
    let st = type == "array" ? [] : {};
    _each(
        ctx,
        function (obj, index) {
            let r = fn(obj, index);
            if (type == "object") {
                st[r.key] = r.value;
            } else {
                st.push(r);
            }
        },
        type,
        reversed
    );
    return st;
}
function reduce(ctx, accu, fn, reversed) {
    let type = UtilsIs.isArray(ctx) || ctx.length ? "array" : "object";
    _each(
        ctx,
        function (obj, index) {
            accu = fn(obj, accu, index);
        },
        type,
        reversed
    );
    return accu;
}
function filter(ctx, fn, reversed) {
    let type = UtilsIs.isArray(ctx) || ctx.length ? "array" : "object";
    var st = type == "array" ? [] : {};
    _each(
        ctx,
        function (obj, index) {
            var r = fn(obj, index);
            if (r) {
                if (type == "object") {
                    st[obj.key] = obj.value;
                } else {
                    st.push(obj.value);
                }
            }
        },
        type,
        reversed
    );
    return st;
}

export { each, map, reduce, filter };
