import Utils from "../../Utils";
import MemCache from "../../MemCache";

async function HandlerAttr(
    prop,
    newValue,
    prevValue,
    component,
    html,
    storage
) {
    let name = "attr";
    let st = storage.get(name);
    let configs = st.filter((item) => item._type == name && item.bind == prop);

    if (!configs.length) return;

    configs.forEach((config) => {
        let data;

        let hasNegate = config.hasNegate;
        // let bind = config.bind;
        let testVal = config.testVal;
        // let attr = config.attr;
        let ops = config.ops;
        let sel = config.sel;
        let attrkey = config.attrkey;
        let attrvalue = config.attrvalue;

        let els = html.querySelectorAll(
            `[data-${name}=${sel}]:not(.cake-template)`
        );

        [...els].forEach((el) => {
            let test = false;
            if (ops) {
                test = Utils.string.toLogical(data, ops, testVal);
                hasNegate && (test = !test);
            } else if (hasNegate) {
                test = !data;
            } else {
                test = !!data;
            }

            if (test) {
                if (attrvalue) {
                    el.setAttribute(attrkey, attrvalue);
                } else {
                    el.setAttribute(attrkey);
                }
            } else {
                el.removeAttribute(attrkey);
            }
        });
    });

    return name;
}

export default HandlerAttr;
