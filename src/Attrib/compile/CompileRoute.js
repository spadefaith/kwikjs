import { loop } from "../Utils";

async function compileRouter(elModels, component, isStatic, html, storage) {
    let compileName = "route";
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
                    sel: id,
                    // for: !!isFromFor,
                };

                storage.push(compileName, conf);
                storage.set(id, conf);
            }
            el.dataset[compileName] = id;
        }
    );
}

export default compileRouter;
