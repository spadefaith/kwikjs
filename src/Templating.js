import Utils from "./Utils";

function _getTag(template) {
    //get the tag in < h1>;
    try {
        return template.match(new RegExp("(?<=<)|([^/s]+)(?=>)", "g"))[2];
    } catch (err) {
        throw new Error(`template of ${template} is empty.`);
    }
}
function _bindReplace(obj, string, lefttag, righttag) {

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let pattern = new RegExp(`${lefttag}${key}${righttag}`, "g");
            if(pattern){
                string = string.replace(pattern, `${obj[key]}`);
                
            }
        }
    }

    return string;
}

function toElement(template, raw) {
    let fr = document.createElement("template");
    fr.innerHTML = template;

    return raw? fr:fr.content.children;
}

export default class {
    constructor(options) {
        this.options = options;
        this.tag = ((this.options && this.options.tag) || "{{ }}").split(" ");
        this.lefttag = Utils.string.escapeRegExp(this.tag[0]);
        this.righttag = Utils.string.escapeRegExp(this.tag[1]);
    }

    replaceString(obj, string) {
        return _bindReplace(obj, string, this.lefttag, this.righttag);
    }

    createElement(data, template, isConvert) {
        // let template = this.template;
        // let data = this.data;
        // let isConvert = this.isConvert;
        if (data) {
            if (data instanceof Array) {
                let isString = typeof template == "string";
                let tag = isString ? _getTag(template) : template.tagName;
                template = isString ? template : template.outerHTML;

                let els = [];
                for (let d = 0; d < data.length; d++) {
                    let dd = data[d];
                    let bindData = _bindReplace(
                        dd,
                        template,
                        this.lefttag,
                        this.righttag
                    );

                    // console.log(42, dd, bindData);

                    let element = toElement(bindData)[0];
                    if (isConvert) {
                        element = element.outerHTML;
                    }
                    els.push(element);
                }
                return els;
            } else if (data instanceof Object) {
                // console.log(template)
                let isString = typeof template == "string";
                let tag = isString ? _getTag(template) : template.tagName;
                template = isString ? template : template.outerHTML;

                let bindData = _bindReplace(
                    data,
                    template,
                    this.lefttag,
                    this.righttag
                );

                // console.log(60, this.tag);
                // console.log(61, bindData);

                let element = toElement(bindData)[0];
                if (isConvert) {
                    element = element.outerHTML;
                }
                return element;
            }
        } else {
            let isString = typeof template == "string";
            let tag = isString ? _getTag(template) : template.tagName;
            return toElement(template)[0];
        }
    }
}

export { toElement };
