"use strict";

import Piece from "./Piece";
// import Scope from "./Scope";
import Attrib from "./Attrib";
import Utils from "./Utils";

import MemCache from "./MemCache";

import Templating from "./Templating";

import Toggle from "./Toggle";

async function createElement(query) {
    if (!query) {
        throw new Error(`the template for ${this.name} is not found with.`);
    }
    let element = Utils.template.getContent(query, true);
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
        this.template = template;
        // this.$observer = options._observer;
        // this.router = options._router;
        // this.globalScope = options._globalScope;

        // this.defaultRoot = options._defaultRoot;

        // this.$scope = {};
        // this.$scope.set = this.$attrib.set;

        this.$templating = new Templating();

        this.await = {};

        this.options = options;
        this.renderqueue = options.renderqueue;
        this.data = {};
        this.root = options.root
            ? `${options.root}:not(.cake-template)`
            : options.root;
        this.items = false;
        this.type = options.type || "view";
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

        this._compile = this._create(options);

        this._eventStorage = MemCache.object(`${this.name}-cache`);

        this.scopeHistory = {};
    }
    async _create(opts) {
        let { handlers, subscribe, root } = opts;

        await this._bindHandlers(handlers, this);

        // this.name == "spinner" && console.log(120, subscribe);

        let _subsribes = await this._bindSubscribe(subscribe, this);

        // this.name == "spinner" && console.log(121, _subsribes);

        await this.$observer._handlers(handlers, this);
        await this.$observer._subscriber(_subsribes, this);

        this.fire = (event, payload) => {
            // console.log(126, this.name, event, payload);
            this.$observer.broadcast(this.name, event, payload);
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

        switch (this.type == "view" && !!this.template) {
            case true:
                return this._createElementAsync();
            default:
                this.isStatic = false;
                break;
        }
    }

    async render(options = {}) {
        // this.name == "nav" && console.log(146, this.name, "render");
        await this._compile;

        // this.name == "nav" && console.log(147, this.name, "render");

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

        // let {root, cleaned, emit={}, data={}} = options || {};

        let root = options.root || this.root;
        let cleaned = options.cleaned;
        let emit = options.emit || {};
        let DATA = options.data || {};
        let CSS = options.css;

        // console.log(328, this.name, root);

        if (!root) {
            root = "#App";
        }

        // console.log(329, root);
        // console.log(330, typeof root == "string");
        if (typeof root == "string") {
            let sel = `${root}:not(.cake-template)`;
            root = document.querySelector(sel);
        }

        let payload = { emit };

        this.isConnected = true;

        // if (this.name == "nav") {
        //     console.log(137, this.name);
        //     console.log(138, this.template);
        // }
        // this.name == "nav" && console.log(197, this.isReady);

        this._updateRoute();

        if (!this.isReady) {
            await this._createElement();
            //static component;

            (await !this.template) &&
                this.fire.isConnected &&
                this.fire.isConnected(payload, true);
            this.isReady = true;
        }

        await this.await.destroy;

        //add data to the component when rendered from router;
        if (
            this.options.onRender &&
            this.options.onRender.constructor &&
            ["Function", "AsyncFunction"].includes(
                this.options.onRender.constructor.name
            )
        ) {
            this.onRenderConfig = await this.options.onRender.bind(this)(this);

            let data = this.onRenderConfig.data;
            if (data) {
                DATA = Object.assign(DATA, data);
            }
        }

        CSS && this.html.css(CSS);

        payload.element = this.html;

        this.fire.beforeConnected && this.fire.beforeConnected(payload, true);

        let el = this.html.getElement();
        el = this.$templating.createElement(DATA, el);
        this.html = new Piece(el);
        this.html.replaceDataSrc();

        DATA = null;

        // console.log(381, this.html);
        // console.log(382, root);

        // if (this.name == "nav") {
        //     console.log("_replaceRouter");
        // }

        !this.isStatic && this.html.appendTo(root, cleaned);

        await this._replaceRouter();
        await this._findRef();
        await this._findContainer();

        this._setToggler();

        this.fire.isConnected && (await this.fire.isConnected(payload, true));

        await this._addEvent();
        multiple && (await this._hardReset());

        // await this._watchReactive();
    }

    _updateRoute() {
        let route = this.$router._getCurrentRoute();
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

        if (routers) {
            let routes = MemCache.object("Router").get();
            routes = Object.keys(routes).reduce((accu, key) => {
                let val = routes[key];
                let name = val.name;

                accu[name] = key;

                return accu;
            }, {});

            // console.log(293, this.html);

            routers.forEach((conf) => {
                let sel = conf.sel;
                let bind = conf.bind;
                let el = this.html.querySelectorIncluded(`[data-route=${sel}]`);

                // console.log(288, el);

                if (el) {
                    let _path = routes[bind];
                    if (_path) {
                        // el.setAttribute("href", `#!${_path}`);
                        el.setAttribute("href", _path);

                        el.addEventListener("click", (e) => {
                            e.preventDefault();
                            document.dispatchEvent(
                                new CustomEvent("pathChanged", {
                                    detail: {
                                        path: _path,
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
    async _createElement() {
        // this.name == "nav" && console.log(this.name, "create element");
        let isSelector = this.template.substring(0, 1) == "#";
        if (!isSelector) return;
        let selector = this.template.substr(1);
        let query = document.getElementById(selector);
        let isTemplate = (this.isTemplate =
            query && query.toString().includes("Template"));

        if (!query) {
            throw new Error(`the template for ${this.name} is not found with.`);
        }

        let element = null;

        // console.log(393, isTemplate, this.name);

        if (isTemplate) {
            element = await createElement(query);
            element.cake_component = this.name;
        } else {
            element = query;
            if (!element) {
                throw new Error(
                    `it might be theres no template in component - ${this.name}`
                );
            }
            element.cake_component = this.name;
            this.isStatic = true;
        }

        this.html = new Piece(element);
        await this._parseHTML(this.html, this.isStatic);
    }
    async _hardReset() {
        // this.name == "nav" && console.log("cloned");

        // this.name == "nav" && console.log(489, this.original.el.innerHTML);
        this.html = await this.original.cloneNode();

        await this._eventStorage.destroy();

        return true;
    }

    async _parseHTML(html, isStatic) {
        // console.log(487, this.original);
        if (!this.original) {
            this.original = await html.cloneNode();
        }
        await this.$attrib.inject(html, this.name, isStatic);
        // this.name == "toolbar" &&
        //     console.log(475, this.name, this.attribStorage.get());
        // this.name == "toolbar" &&
        //     console.log(476, this.name, html.el.innerHTML);

        // this.name == "nav" && console.log(490, this.original.el.innerHTML);

        // this.name == "form" &&
        //     console.log(
        //         (this.attribStorage.get("event") || []).filter(
        //             (item) => item._component == this.name
        //         )
        //     );

        this._isParsed = true;
    }
    async reset(options = {}) {
        this.name == "nav" && console.log("reset");
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
        this.container = {};
        this.isConnected = false;
        this.isReady = false;
        await this.html.remove(this.name);
        await this._hardReset(this.name);
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

        // console.log(this.name, "addevent");

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

        // console.log(626, this.attribStorage.get("event"));

        this.targets = (this.attribStorage.get("event") || []).filter(
            (item) => item._component == this.name
        );

        // this.name == "toolbar" && console.log(624, this.attribStorage.get());

        this.targets.forEach((cf) => {
            let { bind, cb, event, sel, _type, _component } = cf;

            let el = this.html.querySelectorIncluded(`[data-event=${sel}]`);

            // console.log(506, this.name, el, `[data-event=${sel}]`);

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

            if (!this._eventStorage.get("__cake__events")) {
                this._eventStorage.set("__cake__events", {});
            }

            let store = this._eventStorage.get("__cake__events");

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
                this._eventStorage.set("__cake__events", store);
            }
        });
    }
    async $scope(key, value) {
        // if (this.name == "form") {
        //     console.log(689, this.html.el.innerHTML);
        // }

        // this.name == "toolbar" && console.log(623, this.attribStorage.get());

        if (!Utils.is.isString(key)) {
            throw new Error("key must be string");
        }
        if (value == undefined) {
            throw new Error("value is required");
        }

        if (Utils.is.isString(key) || Utils.is.isNumber(key)) {
            if (this.scopeHistory[key] == value) {
                return true; //
            }
            this.scopeHistory[key] = value;
        }

        let notify = await this.$attrib.set(key, value, null, this);

        // this.name == "toolbar" && console.log(659, notify);

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
                    await this._parseHTML(this.html);

                    await this._replaceRouter();
                    await this._findRef();
                    await this._findContainer();
                    await this._setToggler();

                    res();
                }, 100);
            });
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
    }
    _setDefaultRoot(root) {
        this.defaultRoot = root;
        this.root = this.root || this.defaultRoot;
    }
    _setGlobalScope(globalScope) {
        this.$globalScope = globalScope;
    }
    _setRouter(router) {
        this.$router = router;
    }
    _setStorage(cache) {
        this.$cache = cache;
    }
    _setToggler() {
        let togglers = (this.attribStorage.get("toggle") || []).filter(
            (item) => item._component == this.name
        );

        // console.log(711, this.name, this.attribStorage.get("toggle"));

        this.$toggler = new Toggle(this.toggle, this.html, togglers);
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
}
