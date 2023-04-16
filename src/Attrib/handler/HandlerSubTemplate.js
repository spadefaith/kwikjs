import Utils from "../../Utils";
import MemCache from "../../MemCache";

import Templating from "../../Templating";

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
 * 
 */


function identify(str){
    if(str.substring(0,1) == "-"){
        return "data";
    } else if (str.substring(0,1) == "$"){
        return "selector";
    }
};

async function HandlerSubTemplate(
    component,
    html,
    storage
) {
    let name = "subtemplate";
    let st = storage.get(name);

    let templating = new Templating();

    let configs = (st || []).filter((item) => item._type == name);

    if (!configs.length) return;
    for (let s = 0; s < configs.length; s++) {
        let sub = configs[s];
        if (!sub) continue;
        // let {sel, bind, value, ops} = sub;

        let sel = sub.sel;
        let bind = sub.bind;
        let value = sub.value;
        let ops = sub.ops;

        let els = html.querySelectorAllIncluded(`[data-${name}=${sel}]`);

        Utils.array.each(els, function (el, index) {
            //TODO
            
            /**
             * 1. query the template
             * 2. replace it.
             */





            let template = Utils.element.querySelectorIncluded(html, `#${bind}`);

            if(template){
                if(template.tagName){
                    let content = Utils.template.getContent(template, true);


                    let attrs ={};
                    let data ={};
                    for (let i = 0; i <  el.attributes.length; i++){
                        let {name, value} = el.attributes[i];
                        let identity = identify(name);
                        if(identity == "data"){
                            data[name.slice(1)] = value || true;
                        } else if (identity == "selector"){
                            let t = name.slice(1);
                            let selector = t.substring(0, name.indexOf("-")-1);
                            let attr = name.substring(selector.length+2, name.length);


                            if(!attrs[selector]){
                                attrs[selector] = {};
                            };
                            attrs[selector][attr] = value || true;

                        }
                    }


                    /**
                     * reformat the data-validators-* as data-validators="required=true, string=true"; 
                     */
                    let validators = "";
                    Utils.array.each(attrs, function(item,index){
                        let {key:selector, value:conf} = item;


                        Utils.array.each(conf, function(item,index){
                            let {key, value} = item;

                            if(key.includes("data-validator")){
                                let prop = key.substring("data-validator".length +1, key.length);
                                validators += `${prop}=${value}, `;
                            };

                        })



                        if(validators){
                            let query = Utils.element.querySelectorAllIncluded(content, selector);
                            Utils.array.each(query, function(el,index){
                                el.setAttribute("data-validator", validators);
                            });

                            

                            validators = "";
                        };


                    });



                    if(Object.keys(data).length){
                        content = templating.createElement(data, content, false);
                    };

                    
                    el.replaceWith(content);
                } else {
                    console.error("subtemplate template should be a template tag");
                }
            } else {
                console.error("cannot find template for subtemplate #"+bind);
            };
        });
    }
    return name;
}

export default HandlerSubTemplate;
