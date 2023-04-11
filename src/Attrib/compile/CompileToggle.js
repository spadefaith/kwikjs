import { loop } from "../Utils";

async function compileToggle(elModels, component, isStatic, html, storage) {
    let c = {};
    let compileName = "toggle";
    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {
            let ns = target;
            if (c[ns]) {
                id = c[ns];
            }

            const conf = {
                _component: component,
                _type: compileName,
                sel: id,
                name: "ns-" + ns,
            };
            storage.push(compileName, conf);
            storage.set(id, conf);

            el.dataset[compileName] = id;
            c[ns] = id;
        }
    );
}

export default compileToggle;
