import Templating from "../Templating";
import Utils from "../Utils";


function getFirst(str, separator){
    let trimmed = str.trim();
    let attrKey = trimmed.slice(0, trimmed.indexOf(separator));
    let attrValue = trimmed.slice(trimmed.indexOf(separator)+1, trimmed.length);

    return {
        first:attrKey,
        second:attrValue
    };

};

export default customElements.define('sub-template',
class extends HTMLElement {
    constructor() {
        super();
        this.templating = new Templating();
        this.data = {};
        this._attr = {};
        this._selector = [];
        this.whitelistAttr = ["data-sub-template"];

    }
    connectedCallback(){
        let attrs = this.attributes;
        for (let a = 0; a < attrs.length; a++){
            let attr = attrs[a];
            let name = attr.name;
            let value = attr.value;
            if(name.includes("@")){
                this.data[name.replace("@","")] = value;
            } else if(name.includes("$")){
                let key = name.replace("$","");
                let {first:selector, second:prop} = getFirst(key, "-");
                /**
                 * support for
                 * attr
                 * data-validator
                 */
                if(prop.includes("data-validator")){

                    this._selector.push({selector, key:prop, value: value || true});


                } if(prop == "attr"){
                    let grattrs = value.split(";");
                    grattrs.forEach(gr=>{


                        let [key, value] = gr.trim().split("=");

                        this._selector.push({selector, prop,key:key, value});

                    });
                }

                
            }else {
                this._attr[name] = value;
            }

        };

        this.replace(this);

    }
    replace(subTemplate){
        let ref = subTemplate.dataset.subTemplate;
        let refEl = document.querySelector(`template#${ref}`);


        if (refEl.length > 1){
            console.error(`template with name ${ref} has more than one reference.`)
            return ;
        };
        if (!refEl){
            subTemplate.remove();
            throw new Error(`${ref} is not found!`);
        };


        if (refEl){
            let temp = refEl;




            let template = Utils.template.getContent(temp);

     
            
            let el = this.templating.createElement(this.data, template, false);


            Object.keys(this._attr).forEach(key=>{
                if(!this.whitelistAttr.includes(key)){
                    let val = this._attr[key];
                    el.setAttribute(key, val);
                };
            })

            this._selector.forEach(item=>{
                let {selector, prop, key, value} = item;
                let targets = Utils.element.querySelectorAllIncluded(el, selector);

                
                targets.forEach(target=>{
                    target.setAttribute(key, value || true);


                });

            })


            

            subTemplate.replaceWith(el);
        };
    }
});