import Observer from "./Observer";
import Storage from "./Storage";
import Utils from "./Utils";

export default class Page {
    constructor(opts) {
        this.opts = opts;
        this.name = opts.name;
        this.components = {};
        this.type = "page";
        this.Observer = new Observer(this.name);
        this.globalScope = new Storage({
            name: `${this.name}/globalScope`,
            storage: "session",
            child: "object",
        });

        this.registerComponents(this.opts.components || []);
    }
    setRouter(router){
        Object.keys(this.components).forEach((name) => {
            let component = this.components[`${this.name}/${name}`];
            component._setRouter(router);
        });
    }
    setTemplateCompile(templateCompile){
        Object.keys(this.components).forEach((name) => {
            let component = this.components[`${this.name}/${name}`];
            component._setTemplateCompile(templateCompile);
        });
    }
    setDefaultRoot(defaultRoot){
        Object.keys(this.components).forEach((name) => {
            let component = this.components[`${this.name}/${name}`];
            component._setDefaultRoot(defaultRoot);
        });
    }
    registerComponents(components) {
        try {
            components.forEach((component) => {
                component._setObserver(this.Observer);//set one observer
                component._setStorage(
                    new Storage({
                        name: `${this.name}/${component.name}/cache`,
                        storage: "session",
                        child: "object",
                    })
                );
                component.options.store && Utils.is.isFunction(component.options.store) &&
                    component.options.store.bind(component.store)(component);
                component.options.utils &&
                    component.options.utils.bind(component.utils)(component);
                component._setGlobalScope(this.globalScope);
    
    
                this.components[`${this.name}/${component.name}`] = component;
            });
        } catch(err){
            console.log(err);
        }
    }
}
