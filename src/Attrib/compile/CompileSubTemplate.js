import { loop } from "../Utils";

async function compileSubTemplate(elModels, component, isStatic, html, storage) {
    let compileName = "subtemplate";

    // console.log(6, elModels);

    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {


            let bind = el.dataset[compileName];

            // component == "static_form" && console.log(13, id, el, bind);

            const conf = {
                _component: component,
                _type: compileName,
                sel: id,
                bind,
            };

            // console.log(28, el, conf);

            storage.push(compileName, conf);
            storage.set(id, conf);

            // console.log(storage.get());

            el.dataset[compileName] = id;
            el.innerHTML = "";
        }
    );
}

export default compileSubTemplate;
