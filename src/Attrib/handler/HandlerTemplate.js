import Utils from "../../Utils";
import MemCache from "../../MemCache";
import { toElement } from "../../Templating";
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

function insertAfter(template, elsString) {
    let parent = template.parentNode;

    let els = toElement(elsString);
    let index = 0;
    let length = els.length;

    let o = {};

    for (let i = 0; i < length; i++) {
        o[i] = els[i];
    }

    function recur() {
        if (index >= length) {
            return;
        }

        let el = o[index];

        if (!el) {
            return;
        }

        index += 1;
        parent.insertBefore(el, template);

        recur();
    }

    recur();
}

function handleError(err) {
    throw err;
}

async function HandlerTemplate(
    prop,
    newValue,
    prevValue,
    component,
    html,
    storage,
    templateCompile
) {
    try {
        if (!templateCompile) {
            throw new Error("There is no templating compiler found.");
        }

        let name = "template";
        let st = storage.get(name);

        let configs = st.filter(
            (item) => item._type == name && item.bind == prop
        );

        // component == "static_form" && console.log(65, newValue);
        // component == "static_form" && console.log(66, configs);

        if (!configs.length) return;
        for (let s = 0; s < configs.length; s++) {
            let sub = configs[s];
            if (!sub) continue;

            let sel = sub.sel;
            let bind = sub.bind;
            let template = sub.template;

            let els = html.querySelectorAllIncluded(`[data-${name}=${sel}]`);

            // component == "form" && console.log(67, newValue);

            // component == "static_form" && console.log(68, template.trim());

            // console.log(87, template.trim(), {
            //     [bind]: newValue,
            // });

            let compiled = await templateCompile(template.trim(), newValue);

            // console.log(98, compiled);

            let render = Utils.is.isString(compiled)
                ? compiled
                : compiled.render;

            if (!render) {
                throw new Error("template rendered not found");
            }

            if (render && compiled.trim != false) {
                render = render.replace(/\n/g, "");
                render = render.split("  ").join("");
            }

            // component == "form" && console.log(69, render);

            Utils.array.each(els, function (el, index) {
                insertAfter(el, render);
            });

            //need to recompile;
        }

        return name;
    } catch (err) {
        // console.log(103, err);
        handleError(err);
    }
}

export default HandlerTemplate;
