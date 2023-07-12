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

            // component == "static_form" && console.log(73, bind, storage.getAll());

            

            if(el.innerHTML){
                const conf = {
                    _component: component,
                    _type: compileName,
                    sel: id,
                    bind,
                    template: el.innerHTML,
                };
    
                // component == "static_form" && console.log(13, conf);
    
                storage.push(compileName, conf);
                storage.set(id, conf);
    
                el.dataset[compileName] = id;
                el.innerHTML = "";
            }

   
        }
    );
}

export default compileTemplate;
