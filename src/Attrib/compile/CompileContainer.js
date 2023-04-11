import { loop } from "../Utils";

async function compileToggle(elModels, component, isStatic, html, storage) {
    let compileName = "container";
    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {
            let bind = el.dataset[compileName];
            const conf = {
                _component: component,
                _type: compileName,
                sel: id,
                bind,
            };
            storage.push(compileName, conf);
            storage.set(id, conf);

            el.dataset[compileName] = id;
        }
    );
}

export default compileToggle;
