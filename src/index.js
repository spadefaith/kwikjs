import Observer from "./Observer";
import Component from "./Component";
import Router from "./Router2";
import Custom from "./Custom";
// import Piece from "./Piece";

import Storage from "./Storage";

import MemCache from "./MemCache";
import Toggle from "./Toggle";

import Utils from "./Utils";



const ElementStorage = MemCache.element;

export { Observer, Component, Router, ElementStorage , Toggle};

Custom();

export default class Cake {
    constructor(opts) {
        
        this.opts = opts;
        this.name = opts.name;

        this.defaultRoot = opts.defaultRoot;

        this.components = {};


        this.globalScope = new Storage({
            name: `${this.name}/globalScope`,
            storage: "session",
            child: "object",
        });



        this.excludeQuery = [".cake-template"];

        this.router = opts.router;

        this.Observer = new Observer(this.name);

        this.templateCompile = opts.templateCompiler;

        this.initSubscriber = [];


        this._register();

        // this._isReady = {};
        
    }
    // Component(name, template, opts = {}) {
    //     opts._observer = this.Observer;
    //     // opts._router = this.Router;
    //     // opts._scope = this.Scope;
    //     opts._defaultRoot = this.defaultRoot;
    //     return new Component(this.name, name, template, opts);
    // }
    async _register(){
        this._registerRouter()
        .then(()=>{
            // console.log(49, this.opts.components);
            this._registerComponents(this.opts.components || []);
            if(this.opts.init){
                const initHandler = this.opts.init.bind(this);




                initHandler();
            };


            this._mountRouter();
        })
    }
    async _registerRouter() {
        let router = await this.router();

        for (let route in router.routes) {
            if (Object.prototype.hasOwnProperty.call(router.routes, route)) {
                let config = router.routes[route];

                if (
                    !["Function", "AsyncFunction"].includes(
                        config.constructor.name
                    )
                ) {

                    // Object.assign(Object.create(Object.getPrototypeOf(original)), original);

                    
                    if(config.components){
                        this._registerComponents(config.components);
                    } else if (config.page){
                        this._registerPage(config.page);
                    }
                }
            }
        }
        if (!this.hasRouter) {
            this._Router = new Router(this.name, router.routes, router.options);
            this.hasRouter = true;
        }

       
    }

    _mountRouter() {
        Object.keys(this.components).forEach((name) => {
            let component = this.components[name];
            // console.log(112,name, this._Router);
            component._setRouter(this._Router);
        });
    }

    _registerComponents(components) {
        // console.log(79, components);

        try {
            components.forEach((component) => {

                if(!this.components[component.name]){

                    component.onInit && this.initSubscriber.push(component.onInit.bind(component));

                    component._setTemplateCompile(this.templateCompile);
    
                    component._setParent(this.name);
                    component._setObserver(this.Observer);//set one observer
                    component._setDefaultRoot(this.defaultRoot);
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
    
        
        
                    this.components[component.name] = component;
                }


            });

            this.Observer._setComponents(this.components);
        } catch(err){
            console.log(err);
        }
    }
    _registerPageComponents(components){
        try {
            components.forEach((component) => {
                component.setTemplateCompile(this.templateCompile);
    
                component.setParent(this.name);
                component.setDefaultRoot(this.defaultRoot);
    
                this.components[component.name] = component;
            });
        } catch(err){
            console.log(err);
        }
    }

    _registerPage(page){
        try{
            if(page.type != "page"){
                throw new Error("not an instance of page");
            };
    
            this._registerPageComponents(page.components);
        } catch(err){
            console.log(158,err);
        }
    }

    _clone(name, component){
        return component.clone(name);
    }

    $notify(e, callback){
        this.initSubscriber.forEach(handler=>{
            handler(e);
        });

        try {
            callback && (callback());
        } catch(err){
            console.log(err);
        }
    }

}
