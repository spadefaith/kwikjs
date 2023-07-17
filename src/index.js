import Observer from "./Observer";
import Component from "./Component";
import Router from "./Router/RouterHistory";
import Custom from "./Custom";
// import Piece from "./Piece";

import Storage from "./Storage";

import MemCache from "./MemCache";
import Toggle from "./Toggle";

import Utils from "./Utils";

import Page from "./Page";
import { recurse } from "./Utils/UtilsFunction";



const ElementStorage = MemCache.element;

export { Observer, Component, Router, ElementStorage , Toggle, Storage, Page};

Custom();

export default class Cake {
    constructor(opts) {
        
        this.opts = opts;
        this.name = opts.name;

        this.defaultRoot = opts.defaultRoot;

        this.components = {};
        this.pages = {};
        this.componentsCommon = {};
        this.routerConfig = {};

        this.globalStorage = function(type = "session"){
            if(!["session","local"].includes(type)){
                throw new Error("storage could be either, local or session");
            }
            return new Storage({
                name: "globalStorage/storage",
                storage: type,
                child: "object",
            });
        };

        this.globalCache = MemCache.object("globalStore");


        this.excludeQuery = [".cake-template"];

        this.router = opts.router;

        this.Observer = new Observer(this.name);

        this.templateCompile = opts.templateCompiler;

        this.initSubscriber = [];


        this._register();

        
    }
    async _register(){

        await this._registerRouter();
        

        await this._registerPageCommon();
        await this._registerComponentCommon();

        if(this.opts.init){
            const initHandler = this.opts.init.bind(this);
            await initHandler();
        }


        await this._activateRouter();
        
    }

    _activateRouter(){
        this.Observer._setComponents(this.components);

        this.$router.init();
    }
    async _registerRouter() {
        let router = await this.router();
        if (!this.hasRouter) {
            this.$router = new Router(this.name, router.routes, router.options);
            this.hasRouter = true;            
        }

        await recurse(Object.keys(router.routes), async (path)=>{
            const config = router.routes[path];
     
            if (
                !["Function", "AsyncFunction"].includes(
                    config.constructor.name
                )
            ) {
                // Object.assign(Object.create(Object.getPrototypeOf(original)), original);
                if(config.components && Utils.is.isArray(config.components)){
                    await recurse(config.components, async (component)=>{
                        if(component.isPage){
                            await this._registerPage(component);
                        } else {
                            await this._registerComponents(component);
                        }
                    });
                    
                }
            }
        });

        if(this.opts.components && Utils.is.isArray(this.opts.components)){
            await recurse(this.opts.components,async  (component)=>{
                // console.log(126,component.name);
               await this._registerComponents(component);
            });
        }
    }



    _registerComponents(component) {

        try {
            if(!this.components[component.name]){

                if(!component.isPage && Object.keys(component.$common).length){
                    this.componentsCommon[component.name] = component;
                    
                }

                component._setRouter(this.$router);
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
                component._setGlobalStorage(this.globalStorage);
                component._setGlobalCache(this.globalCache);

                //inject

    
                this.components[component.name] = component;

            }
           
        } catch(err){
            console.log(err);
        }
    }


    async _registerPage(page){
        try{

            if(!page.isPage){
                throw new Error("not an instance of page");
            }


            await this._registerComponents(page);


            if(Utils.is.isObject(page.$child)){
                Utils.array.each(page.$child, ({key, value})=>{

                    this._registerComponents(value);
                    value._setPage(page);
                });
            }

            if(!this.pages[page.name]){
                this.pages[page.name] = page;
            }




        } catch(err){
            console.log(158,err);
        }
    }

    _registerPageCommon(){
        Utils.array.each(this.pages, ({key, value:page})=>{
            const common = page.$common;

            if(Utils.is.isObject(common)){
                Utils.array.each(common, ({key:nameSpace, value:componentName})=>{

                    let component = this.components[componentName];

                    if(component){
                        page.$common[nameSpace] = component;
                    } else {
                        delete page.$common[nameSpace];
                    }
                });
            } else {
                page.$common = {};
            }
        });
    }

    _registerComponentCommon(){

        Utils.array.each(this.componentsCommon, ({key, value:com})=>{

            const common = com.$common;

            if(Utils.is.isObject(common)){
                Utils.array.each(common, ({key:nameSpace, value:componentName})=>{

                    let component = this.components[componentName];

                    if(component){
                        com.$common[nameSpace] = component;
                    } else {
                        delete com.$common[nameSpace];
                    }
                });
            } else {
                com.$common = {};
            }
        });
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
