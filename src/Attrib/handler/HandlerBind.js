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
    let name = "bind";
    let st = storage.get(name);
    let configs = st.filter((item) => item._type == name && item.bind == prop);

    if (!configs.length) return;

    for (let c = 0; c < configs.length; c++) {
        let config = configs[c],
            data;
        let attr = config.attr;
        let sel = config.sel;

        data = newValue;
        let attrHyphen = Utils.string.toHyphen(attr);

        let els = html.querySelectorAll(`[data-${name}=${sel}]`);
        for (let p = 0; p < els.length; p++) {
            let el = els[p];
            if (data != undefined || data != null) {
                el.setAttribute(attrHyphen, data);
                el[attr] = data;
            }
        }
    }
}

export default HandlerBind;
