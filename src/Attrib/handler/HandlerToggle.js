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

async function HandlerToggle(
    prop,
    newValue,
    prevValue,
    component,
    html,
    storage
) {
    let name = "toggle";
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

        let els = html.querySelectorAllIncluded(`[data-${name}=${sel}]`);

        Utils.array.each(els, function (el, index) {
            //TODO
            if (value == prevValue) {
                el && el.classList.remove("is-active");
            }
            if (value == newValue) {
                if (el) {
                    if (el.classList.contains("is-active")) {
                        el.classList.remove("is-active");
                    }
                    el && el.classList.add("is-active");
                }
            }
        });
    }
    return name;
}

export default HandlerToggle;
