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

async function HandlerClass(
    prop,
    newValue,
    prevValue,
    component,
    html,
    storage
) {
    let name = "class";
    let st = storage.get(name);
    let configs = st.filter((item) => item._type == name && item.bind == prop);

    if (!configs.length) return;
    for (let c = 0; c < configs.length; c++) {
        let config = configs[c],
            data;

        let hasNegate = config.hasNegate;
        let bind = config.bind;
        let testVal = config.testVal;
        let className = config.className;
        let ops = config.ops;
        let sel = config.sel;

        bind = Utils.string.removeSpace(bind);

        data = newValue;

        let els = html.querySelectorAll(
            `[data-${name}=${sel}]:not(.cake-template)`
        );

        for (let p = 0; p < els.length; p++) {
            let el = els[p];
            let test = false;
            if (ops) {
                test = Utils.string.toLogical(data, ops, testVal);
                hasNegate && (test = !test);
            } else if (hasNegate) {
                test = data == testVal;
            } else {
                test = !!data;
            }

            if (test) {
                Utils.string.splitBySpace(className, function (cls) {
                    // console.log(519, data,  ops, testVal, test);
                    const classList = Utils.element.toArray(el.classList);
                    if (!classList.includes(cls)) {
                        setTimeout(() => {
                            el.classList.add(cls);
                        });
                    }
                });
            } else {
                // console.log('remove ',className);
                Utils.string.splitBySpace(className, function (cls) {
                    const classList = Utils.element.toArray(el.classList);

                    if (classList.includes(cls)) {
                        setTimeout(() => {
                            el.classList.remove(cls);
                        });
                    }
                });
            }
        }
    }
    return name;
}

export default HandlerClass;
