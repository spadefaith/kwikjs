import { loop } from "../Utils";

async function compileBind(elModels, component, isStatic, html, storage) {
    let compileName = "bind";
    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {
            for (let g = 0; g < gr.length; g++) {
                let val = gr[g].split(" ").join("");
                let bind, attr;
                if (val.includes(":")) {
                    const _sp1 = val.split(":");
                    attr = _sp1[0];
                    bind = _sp1[1];
                } else {
                    bind = val;
                    attr =
                        el.value != undefined && el.tagName != "BUTTON"
                            ? "value"
                            : "textContent";
                }

                const conf = {
                    _component: component,
                    _type: compileName,
                    attr,
                    bind,
                    sel: id,
                };

                storage.push(compileName, conf);
                storage.set(id, conf);
            }
            el.dataset[compileName] = id;
        }
    );
}

export default compileBind;
