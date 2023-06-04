import Utils from "../../Utils";
import MemCache from "../../MemCache";

/**
 *
 * @param {*} prop
 * @param {*} newValue
 * @param {*} prevValue
 * @param {*} component
 * @param {*} html
 * @returns
 *
 *
 * for boolean attributes only;
 */

async function HandlerBind(
    prop,
    newValue,
    prevValue,
    component,
    html,
    storage
) {
    let name = "route";
    let st = storage.get(name);
    let configs = st.filter((item) => item._type == name && item.bind == prop);

    if (!configs.length) return;
    for (let s = 0; s < configs.length; s++) {
        let sub = configs[s];
        if (!sub) continue;
        // let {sel, bind, value, ops} = sub;

        let sel = sub.sel;
        let bind = sub.bind;
        let value = sub.value;
        let ops = sub.ops;

        let els = html.querySelectorAllIncluded(`[data-route=${sel}]`);

        Utils.array.each(els, function (el, index) {
            el.setAttribute("href", el.dataset.route);

            el = null;
        });

        els = null;
    }

    configs = null;
    st = null;

    return name;
}

export default HandlerBind;
