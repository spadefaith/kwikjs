import { loop } from "../Utils";

async function compileTemplate(elModels, component, isStatic, html, storage) {
    let compileName = "template";
    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {


            let bind = el.dataset[compileName];

            // component == "BillingSummary" && console.log(13, id, el, bind, el.innerHTML);



            const conf = {
                _component: component,
                _type: compileName,
                sel: id,
                bind,
                template: el.innerHTML,
            };

            storage.push(compileName, conf);
            storage.set(id, conf);

            el.dataset[compileName] = id;
            el.innerHTML = "";
        }
    );
}

export default compileTemplate;
