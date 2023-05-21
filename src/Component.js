"use strict";

import Piece from "./Piece";
// import Scope from "./Scope";
import Attrib from "./Attrib";
import Utils from "./Utils";

import MemCache from "./MemCache";

import Templating from "./Templating";

import Storage from "./Storage";

import Toggle from "./Toggle";

import Validator from "./Form/Validator";

const ElementStorage = MemCache.element;

async function createElement(template) {
    if (!template) {
        throw new Error(`the template for ${this.name} is not found with.`);
    }
    let element = Utils.template.getContent(template, true);
    if (!element) {
        throw new Error(
            `it might be theres no template in component - ${this.name}`
        );
    }
    return element;
}

function getAttributes(element) {
    let o = {};
    if (!element) {
        return o;
    }
    let attributes = element.attributes;
    if (attributes) {
        for (let i = 0; i < attributes.length; i++) {
            let attribute = attributes[i];
            let name = attribute.name;
            let value = attribute.value;
            o[name] = value;
        }
    }
    return o;
}

function attachStaticMethod(root, handlers, callback) {
    for (let key in handlers) {
        if (Object.prototype.hasOwnProperty.call(handlers, key)) {
            let handler = callback(key, handlers[key]);

            root[key] = handler;
        }
    }
}

export default class Component {
    constructor(name, template, options) {
        this.name = name;

        this.htmlTemplateSelector = template;

        this._parseOptions({ template, ...options });


        this.$templating = new Templating();

        this.await = {};

        this.onInit = options.onInit;

        this.options = options;
        this.renderqueue = options.renderqueue;

        this._setCustomData();
        this._setCustomCss();
        

        this.root = options.root
            ? `${options.root}:not(.cake-template)`
            : options.root;
        this.items = false;
        
        this.toggle = options.toggle;
        this.targets = {};
        this.animateOptions = options.animate;
        this.role = options.role;
        this.isReady = false;
        this.isConnected = false;

        // this.Node = Piece;

        this.animatecss = this.options.animatecss;

        this.formSelector = options.form;

        this.state = options.state;
        this.originalState = {};

        this.utils = {};
        this.$scopeData = {};
        this.renderQueing = [];

        if (!options.handlers) {
            console.error(`${this.name} has no handlers`);
        }
        if (!options.subscribe) {
            console.error(`${this.name} has no subscribe`);
        }

        this.container = {};
        this.ref = {};

        this._setUtils();

        this._compile = Promise.resolve();

        this._eventStorage = MemCache.object(`${this.name}-cache`);

        this.scopeHistory = {};
        this.store = {};


        this.$storage = function(type = "session"){
            if(!["session","local"].includes(type)){
                throw new Error("storage could be either, local or session");
            }
            return new Storage({
                name: `${this.name}/storage`,
                storage: type,
                child: "object",
            });
        };
        this.$cache = MemCache.object(`${this.name}/cache`);
    }
    async _setCustomData(){
        this.customData = this.options.data && Utils.is.isObject(this.options.data) || {};
    }
    async _setCustomCss(){
        this.customCss = this.options.css && Utils.is.isObject(this.options.css) || {};
    }
    async _create(opts) {

        if(this._isCreated){
            return;
        }
        let { handlers, subscribe, root } = opts;

        await this._bindHandlers(handlers, this);
        let _subsribes = await this._bindSubscribe(subscribe, this);
        await this.$observer._subscriber(_subsribes, this);

        this.fire = (event, payload) => {
            return this.$observer.broadcast(this.name, event, payload);
        };

        attachStaticMethod(
            this.fire,
            handlers,
            (handlerName, handlerFunction) => {
                return async (variable) => {
                    try {
                        let payload = await handlerFunction(variable);

                        return this.fire(handlerName, payload);
                    } catch (err) {
                        console.log(141, this.name, err);
                        throw err;
                    }
                };
            }
        );

        switch (this.type == "view" && this.template.isStatic) {
            case true:
                // return this._createElementAsync();
                return this._renderStatic();
            default:
                // this.isStatic = false;
                break;
        }

        this._isCreated = true;
    }

    async render(options = {}) {
        try {
            if(this.template.isStatic){
                return;
            }
            await this._compile;
            let multiple = this.options.multiple;
            if (options.hasqued) {
                //
            } else {
                if (this.isConnected && !multiple) {
                    console.error(
                        `${this.name} is already rendered and connected to the DOM`
                    );
                }
            }
            if (options.revokeque) {
                //TODO why the this.wait.destroy is hanging when renderQue
                this.await.destroy = Promise.resolve();
            }

            if (this.isConnected && !multiple) {
                return Promise.resolve();
            }

            let root = options.root || this.root;
            let cleaned = options.cleaned;
            let emit = options.emit || {};
            this.customData = options.data || this.customData;
            this.customCss = options.css || this.customCss;

            if (typeof root == "string") {
                let sel = `${root}:not(.cake-template)`;
                root = document.querySelector(sel);
            }

            let payload = { emit };

            this.isConnected = true;

            this._updateRoute();

            if (!this.isReady) {
                /**
                 * this is where the target data-* is being parsed 
                 * and the final html is created;
                 */
                await this._createElement();

                !this.template.has &&
                    this.fire.isConnected &&
                    this.fire.isConnected(payload, true);
                this.isReady = true;
            }

            await this.await.destroy;

            await this._getDataOnRender();

            this.customCss && this.html.css(this.customCss);

            payload.element = this.html;

            this.fire.beforeConnected &&
                this.fire.beforeConnected(payload, true);


            /**call onInit hook */
            this.onInit && await this.onInit();


            /**replace the mustache before rendering those without data-* */
            let el = this.$templating.createElement(this.customData, this.html.getElement());


            /**recache the template after templating */
            this._recacheFromTemplating(el);

            /**replace the data-src by src */
            this.html.replaceDataSrc();

            /**append the html if template type in the root */
            this.template.isTemplate && this.html.appendTo(root, cleaned);
            
            /**replace data-router with hash */
            await this._replaceRouter();

            /**cache the data-ref elements */
            await this._findRef();

            /**cache the data-container elements */
            await this._findContainer();

            /**activate toggler */
            this._setToggler();

            /**activate validator if form type */
            this._activateValidator();

            /**call isConnected hook */
            this.fire.isConnected &&
                (await this.fire.isConnected(payload, true));

            /**add event to element when rendered */
            await this._addEvent();

            /**reset if multiple type */
            multiple && (await this._hardReset());


            /**run auto scope */
            await this._autoScope();
        } catch (err) {
            console.log(281, this.name, err);
        }
    }
    async _autoScope(){
        if(this.$scopeData){
            let keys = Object.keys(this.$scopeData);
            await Utils.function.recurse(keys, (key, index)=>{
                let val = this.$scopeData[key];
                return this.$scope(key, {[key]:val});
            });
        }
    }
    async _getDataOnRender(){
        if (
            this.options.onRender &&
            this.options.onRender.constructor &&
            ["Function", "AsyncFunction"].includes(
                this.options.onRender.constructor.name
            )
        ) {
            this.onRenderConfig = await this.options.onRender.bind(this)(
                this
            );

            let data = this.onRenderConfig.data;
            let $scope = this.onRenderConfig.$scope;
            let css = this.onRenderConfig.css;

            if($scope){
                this.$scopeData = Object.assign(this.$scopeData, $scope);
            }
            if (data) {
                this.customData = Object.assign(this.customData, data);
            }
            if (css) {
                this.customCss = Object.assign(this.customCss, css);
            }

            data = null;
            $scope = null;
            css = null;
        }
    }

    async _renderStatic() {
        await this._createElement();
        this.isReady = true;

        await this._updateRoute();

        await this._getDataOnRender();

        this.fire.beforeConnected &&
        await this.fire.beforeConnected({}, true);

        let el = this.html.getElement();
        el = this.$templating.createElement(this.customData, el);
        this.html = new Piece(el);
        this.html.replaceDataSrc();



        await this._replaceRouter();
        await this._findRef();
        await this._findContainer();

        this._setToggler();

        this._activateValidator();

        this.fire.isConnected &&
            (await this.fire.isConnected({}, true));

        await this._addEvent();


    }
    async _renderDynamic() {}

    _updateRoute() {
        // console.log(358, 356, this.name, this.$router);
        let route = this.$router._getCurrentRoute();


        if(!route){
            return;
        }

        for (let key in route) {
            if (Object.prototype.hasOwnProperty.call(route, key)) {
                this.$router[key] = route[key];
            }
        }

        if (route.controller) {
            this.$controller = route.controller;
        }
    }

    _findContainer() {
        let containers = this.attribStorage.get("container") || [];

        containers.forEach((container) => {
            container.sel &&
                (container.el = this.html.querySelectorIncluded(
                    `[data-container=${container.sel}]`
                ));

            this.container[container.bind] = container.el;
        });
    }
    _findRef() {
        let refs = this.attribStorage.get("ref") || [];

        refs.forEach((ref) => {
            ref.sel &&
                (ref.el = this.html.querySelectorIncluded(
                    `[data-ref=${ref.sel}]`
                ));

            this.ref[ref.bind] = ref.el;
        });
    }
    _replaceRouter() {
        let routers = this.attribStorage.get("route");

        // this.name == "nav" && console.log(271, this.name, routers);
        // this.name == "nav" &&
        //     console.log(272, this.name, this.attribStorage.get());

        // console.log(442,routers);
        if (routers) {
            let routes = MemCache.object("Router").get();
            // console.log(443,routes);
            routes = Object.keys(routes).reduce((accu, key) => {
                let val = routes[key];
                let name = val.name;

                accu[name] = {path:key,name:val.name};

                return accu;
            }, {});

            // console.log(293, this.html);

            routers.forEach((conf) => {
                let sel = conf.sel;
                let bind = conf.bind;
                let el = this.html.querySelectorIncluded(`[data-route=${sel}]`);

                // console.log(288, el);
                // console.log(463,conf);

                if (el) {
                    let {path, name} = routes[bind] || {};
                    if (path) {
                        // el.setAttribute("href", `#!${_path}`);
                        el.setAttribute("href", path);

                        el.addEventListener("click", (e) => {
                            e.preventDefault();
                            document.dispatchEvent(
                                new CustomEvent("pathChanged", {
                                    detail: {
                                        path: path,
                                        name:name,
                                        component: this.name,
                                    },
                                })
                            );
                        });
                    }
                }
            });
        }
    }
    _bindHandlers(handlers) {
        for (let key in handlers) {
            if (Object.prototype.hasOwnProperty.call(handlers, key)) {
                let fn = handlers[key];
                let originalName = fn.name;
                fn = fn.bind(this);
                fn.original = originalName;
                fn.binded = this.name;
                handlers[originalName] = fn;

                this._initAsync(key);
            }
        }
        if (!this.await.destroy) {
            this.await.destroy = Promise.resolve();
        }
        if (!this.await.animateRemove) {
            this.await.animateRemove = Promise.resolve();
        }
    }
    _bindSubscribe(subscribe) {
        //binding the subscribe to component;
        let flattened = {};

        for (let component in subscribe) {
            if (Object.prototype.hasOwnProperty.call(subscribe, component)) {
                let _subscribe = subscribe[component];

                if (!!_subscribe.components && !_subscribe.handler) {
                    throw new Error(
                        `there is no handler in format many of subscribe in event ${component}`
                    );
                } else if (!_subscribe.components && !!_subscribe.handler) {
                    throw new Error(
                        `there is no components in format many of subscribe in event ${component}`
                    );
                }

                let isMany = !!_subscribe.components && !!_subscribe.handler;

                if (isMany) {
                    /**
                     * multiple components triggering the same event;
                     * this component is listening to that one event;
                        event :{
                            components:[],
                            handler(){},
                        }
                    */
                    let event = component;

                    let components = _subscribe.components;
                    let handler = _subscribe.handler;

                    handler = handler.bind(this);
                    handler.binded = this.name;
                    handler.original = event;

                    for (let c = 0; c < components.length; c++) {
                        let component = components[c];

                        if (!flattened[component]) {
                            flattened[component] = {};
                        }
                        if (!flattened[component][event]) {
                            // flattened[component][event] = [];
                            flattened[component][event] = {};
                        }
                        handler.listenTo = component;
                        flattened[component][event] = handler;
                    }
                } else {
                    if (!flattened[component]) {
                        flattened[component] = {};
                    }
                    /**
            single event is triggerd by a component;
                component:{
                    event:{
                        handler(){},
                    }
                }
             */
                    let fns = _subscribe; //object

                    for (let fn in fns) {
                        if (Object.prototype.hasOwnProperty.call(fns, fn)) {
                            let handler = fns[fn];
                            let original = handler.name;

                            try {
                                handler = handler.bind(this);
                            } catch (err) {
                                //
                            }
                            handler.original = original;
                            handler.binded = this.name;
                            handler.listenTo = component;

                            if (!flattened[component][original]) {
                                flattened[component][original] = {};
                            }

                            flattened[component][original] = handler;
                        }
                    }
                }
            }
        }

        return flattened;
    }
    _initAsync(name) {
        this.await[name] = Promise.resolve();
    }
    async _createElementAsync() {
        // console.trace();
        await this._createElement();
        this.isReady = true;
    }

    _parseOptions(options) {
        let template = options.template;



        this.template = {
            isStatic: false,
            isTemplate: false,
            has:false,
            isID:false,
        };


        if (template) {


            this.template.has = true;
            this.template.element = document.querySelector(template);



            if (template.substring(0, 1) == "#") {
                this.template.isID = true;

                if(this.template.element){
                    this.template.isTemplate = this.template.element
                        .toString()
                        .includes("Template");
                    
                    if(!this.template.isTemplate){
                        this.template.isStatic = true;
                    }
                } else {
                    throw new Error(`${template} is not found in the DOM`);
                }
                
            }
        } else {
            this.template.has = false;
            this.template.element = null;
            
        }


        this.type = options.type || "view";

        // console.log(538, this.name, this.template);

    }

    async _createElement() {
        let isSelector = this.template.isID;
        if (!isSelector) return;
        let query = this.template.element;

        if (!query) {
            throw new Error(`the template for ${this.name} is not found with.`);
        }

        let element = null;

        if (this.template.isTemplate) {
            element = await createElement(query);
            element.cake_component = this.name;
            element.kwik_component = this.name;
        } else if(this.template.isStatic) {
            element = query;


            if (!element) {
                throw new Error(
                    `it might be theres no template in component - ${this.name}`
                );
            }
            element.cake_component = this.name;
            // this.isStatic = true;
        }

        // console.log(element.outerHTML);

        // console.log(this.name,'parsing template');

        // this.html = new Piece(element);

        
        
        this._cloneTemplate(element);

        // console.log(669,this.html, this.template.isStatic);

        await this._parseHTML(this.html, this.template.isStatic);
        // console.log(663, "done parsing");

        await this._cacheTemplate(element);
    }
    async _hardReset() {
        // this.name == "nav" && console.log("cloned");

        // this.name == "nav" && console.log(489, this.original.el.innerHTML);
        // this.html = await this.original.cloneNode();
        this.html && await this.html.remove(this.name);
        await this._eventStorage.destroy();
        this._reUseTemplate();

        return true;
    }
    async _cloneTemplate(element){
        this.html = new Piece(element);
        this.original = this.html.cloneNode();
    }
    async _cacheTemplate(html){
        await this._replaceSubTemplate();


            

        this.template.cached = true;
    }

    async _replaceSubTemplate(){

        await this.$attrib.triggerSet("subtemplate",this);
    }

    async _recacheFromSubTemplate(html){
        if(!this.template.recacheFromSubTemplate){
            
            this.html = new Piece(html);
            this.original = await html.cloneNode();

            this.template.recacheFromSubTemplate = true;
        }
    }

    async _recacheFromTemplating(html){
        if(this.html){
            this.html = new Piece(html);
            this.template.recacheFromTemplating = true;
        }
    }

    async _reUseTemplate(){
        if(this.original){
            const cloned = await this.original.cloneNode();
            this.html = new Piece(cloned);
        }
    }

    async _parseHTML(html, isStatic, isReInject) {
        await this.$attrib.inject(html, this.name, isStatic, isReInject);
        this._isParsed = true;
    }
    async renderQue(options) {
        let hasNoId = options.id == undefined && options.id != null;
        if (hasNoId) {
            throw new Error("renderQue method requires an id.");
        }
        let id = options.id;
        if (id) {
            options.hasqued = true;
            this.renderQueing.push({
                date: new Date().toString(),
                id,
                options,
            });
        }
        return this.render(options);
    }
    async reset(options = {}) {
        let hasNoId = options.id == undefined && options.id != null;
        if (hasNoId) {
            throw new Error("renderQue method requires an id.");
        }
        let id = options.id,
            conf;

        if (id) {
            conf = this.renderQueing.filter((item) => {
                return item.id == id;
            });
            this.renderQueing = JSON.parse(
                JSON.stringify(this.renderQueing)
            ).filter((item) => {
                return item.id != id;
            });
        }

        // console.log(599, this.html.el);
       
        await this._hardReset(this.name);
        // console.log(600, this.html.el);

        /**reset the containers to release memory */
        this.container = {};
        this.ref = {};
        this.targets = {};
        this._setCustomData();
        this._setCustomCss();
        this.$cache.destroy();
        this.scopeHistory={};
        this.store = {};
        this.$scopeData = {};

        this.isConnected = false;
        this.isReady = false;

        if (this.renderQueing && this.renderQueing.length) {
            if (conf) {
                let options = conf.options;
                if (!options) {
                    options = {};
                }
                options.revokeque = true;
                return this.render(options);
            }
        }
    }
    _addEvent() {
        let component = this.name;
        let $this = this;



        function notify(
            id,
            event,
            component,
            isPreventDefault,
            isStopPropagation
        ) {
            return function (e) {
                // console.log(512,e);
                // console.log(509, !isPreventDefault, component, event);
                if (!isPreventDefault) {
                    e.preventDefault();
                }
                if (isStopPropagation) {
                    e.stopPropagation();
                }
                $this.fire[event](e);
                // $this.$observer.broadcast(component, event, e);
            };
        }

        // setTimeout(()=>{
        //     this.name == "TriggerList" && console.log(626, this.attribStorage.get("event"));
        // },2000);

        this.targets = (this.attribStorage.get("event") || []).filter(
            (item) => item._component == this.name
        );

        // this.name == "FormAccount" && console.log(841,this.targets);

        // this.name == "TriggerList" && console.log(624, "add event",this.targets);

        this.targets.forEach((cf) => {
            let { bind, cb, event, sel, _type, _component } = cf;

            let el = this.html.querySelectorIncluded(`[data-event=${sel}]`);

            // console.log(506, this.name, el, `[data-event=${sel}]`);

            // this.name == "FormAccount" && console.log(507, this.name, el, `[data-event=${sel}]`);

            let _event = event;

            let place = event.substring(0, 2);
            let isPreventDefault = place.includes("~"); //default to true;
            let isStopPropagation = place.includes("^"); //default to false;

            // console.log(542,isPreventDefault);

            if (isPreventDefault || isStopPropagation) {
                _event = event.slice(1);
                cb = cb || _event;
            } else {
                if (!cb) {
                    cb = event;
                }
            }


            
            let cache = new ElementStorage(el);



            if (!cache.get("__cake__events")) {
                cache.set("__cake__events", {});
            }

            let store = cache.get("__cake__events");

            // console.log(507, store);

            // console.log(593, this.name, el, `[data-event=${sel}]`);

            // this.name == "form" && console.log(633, this.name, cb, el);

            if (!store[cb] && el) {
                Utils.element.addEventListener(
                    el,
                    _event,
                    notify(
                        el.dataset.event,
                        cb,
                        component,
                        isPreventDefault,
                        isStopPropagation
                    ),
                    true
                );
                store[cb] = true;
                cache.set("__cake__events", store);
            }
        });
    }
    async $scope(key, value) {

        if (!Utils.is.isString(key)) {
            throw new Error("key must be string");
        }
        if (value == undefined) {
            throw new Error("value is required");
        }

        let prev = "";
        if (Utils.is.isString(key) || Utils.is.isNumber(key)) {
            if (this.scopeHistory[key] == value) {
                // return true; //
                prev = this.scopeHistory[key];
            }
            this.scopeHistory[key] = value;
        }

        let notify = await this.$attrib.set(key, value, prev, this);

        if (notify.includes("template")) {
            // this.name == "toolbar" && console.log(659, this.html.el.innerHTML);
            /**
             * recall
             * 1. recompile (data-router, data-container, data-toggler)
             * 2. _replaceRouter - data-router
             * 3. _findContainer - data-container
             * 3. _findRef - data-ref
             * 4. _setToggler - data-toggler
             * 5. _addEvent - data-event
             *
             * 6. data-class
             * 7. data-bind
             */
            // await this._replaceRouter();
            // await this._findContainer();
            // await this._findRef();
            // this._setToggler();

            // if (this.name == "form") {
            //     console.log(690, this.html.el.innerHTML);
            // }

            // setTimeout(async () => {
            //     await this._parseHTML(this.html);

            //     await this._replaceRouter();
            //     await this._findRef();
            //     await this._findContainer();
            //     await this._setToggler();
            // }, 5000);

            // this.name == "toolbar" && console.log(736, this.html.el.outerHTML);

            await new Promise((res) => {
                setTimeout(async () => {
                    await this._parseHTML(this.html, false, true);

                    await this._replaceRouter();
                    await this._findRef();
                    await this._findContainer();
                    await this._setToggler();
                    await this._addEvent();
                    res();
                }, 100);
            });
        }
    }
    _activateValidator(){
        if(this.role == "form"){

            this.$validator = Validator; 
        }
    }
    _setParent(groupName) {
        this.groupName = groupName;
        this.attribStorage = MemCache.object(
            `${this.groupName}/${this.name}/Attrib`
        );
        this.$attrib = new Attrib(this.attribStorage, this._templateCompile);
    }
    _setObserver(observer) {


        this.$observer = observer;
        this._compile = this._create(this.options);



        // if(this.name == "AdmissionTable"){
        //     // console.log(121,this.name,  _subsribes);
        //     console.log(121,this.name);
        //     console.trace();
        // }
    }
    _setDefaultRoot(root) {
        this.defaultRoot = root;
        this.root = this.root || this.defaultRoot;
    }
    _setGlobalStorage(globalStorage) {
        this.$globalStorage = globalStorage;
    }
    _setGlobalCache(globalCache) {
        this.$globalCache = globalCache;
    }
    _setRouter(router) {
        this.$router = router;

        // console.log(916, this.name, this.$router);
    }
    _setStorage(cache) {
        // this.$cache = cache;
    }
    _setToggler() {
        if(!this.toggle){
            return;
        }


        let togglers = (this.attribStorage.get("toggle") || []).filter(
            (item) => item._component == this.name
        );

        // console.log(711, this.name, this.attribStorage.get("toggle"));

        let toggler = this.toggle;

        // console.log(1056,toggler);

        toggler.setHtml && toggler.setHtml(this.html);
        toggler.setAttr && toggler.setAttr(togglers);
        

        // this.$toggler = new Toggle(this.toggle, this.html, togglers);
        this.$toggler = toggler.handler();
    }
    _setUtils() {
        this.$utils = Utils;
    }
    _setTemplateCompile(templateCompile) {
        this._templateCompile = templateCompile;
    }
    on(event, handler) {
        this._bindHandlers({
            [event]: handler,
        });

        return {
            on: this.on.bind(this),
            subscribeTo: this.subscribeTo.bind(this),
        };
    }
    subscribeTo(event, components, handler) {
        let isMultiple = Utils.is.isArray(components);

        if (isMultiple) {
            this._bindSubscribe({
                [event]: {
                    components,
                    handler,
                },
            });
        } else {
            this._bindSubscribe({
                [components]: {
                    [event]: handler,
                },
            });
        }

        return {
            on: this.on.bind(this),
            subscribeTo: this.subscribeTo.bind(this),
        };
    }
    clone(name, template, opts = {}){
        let cloned = {};

        for(let key in this.options){
            if(Object.prototype.hasOwnProperty.call(this.options, key)){


                cloned[key] = opts[key]? (cloned[key] = opts[key]) : (cloned[key] = this.options[key]); 

            }
        };

        // console.log(1088,cloned);

        return new Component(name, template || this.htmlTemplateSelector, cloned);
    }
}
