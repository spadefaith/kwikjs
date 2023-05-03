import { loop } from "../Utils";

async function compileValidator(elModels, component, isStatic, html, storage) {
    let compileName = "validator";
    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {
            for (let g = 0; g < gr.length; g++) {
                let val = gr[g].split(" ").join("");

                const conf = {
                    _component: component,
                    _type: compileName,
                    bind: val,

                };

                storage.push(compileName, conf);
                storage.set(id, conf);
            }
            // el.dataset[compileName] = id;
        }
    );
}

export default compileValidator;
