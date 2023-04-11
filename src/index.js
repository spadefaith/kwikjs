import Observer from "./Observer";
import Component from "./Component";
import Router from "./Router2";
// import Piece from "./Piece";

import Storage from "./Storage";

import MemCache from "./MemCache";
// import Toggle from "./Toggle";

export { Observer, Component, Router };

export default class Cake {
    constructor(opts) {
        this.name = opts.name;

        this.defaultRoot = opts.defaultRoot;

        this.components = {};

        this.Observer = new Observer(this.name);

        this.excludeQuery = [".cake-template"];

        this.router = opts.router;

        this.templateCompile = opts.templateCompiler;

        this._registerComponents(opts.components || []);
        this._registerRouter();
    }
    // Component(name, template, opts = {}) {
    //     opts._observer = this.Observer;
    //     // opts._router = this.Router;
    //     // opts._scope = this.Scope;
    //     opts._defaultRoot = this.defaultRoot;
    //     return new Component(this.name, name, template, opts);
    // }
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
                    this._registerComponents(config.components);
                }
            }
        }

        if (!this.hasRouter) {
            this._Router = new Router(this.name, router.routes, router.options);
            this.hasRouter = true;
        }

        await this._mountRouter();
    }

    _registerComponents(components) {
        components.forEach((component) => {
            component._setTemplateCompile(this.templateCompile);

            component._setParent(this.name);
            component._setObserver(this.Observer);
            component._setDefaultRoot(this.defaultRoot);
            component._setStorage(
                new Storage({
                    name: "cache",
                    storage: "session",
                    child: "object",
                })
            );

            component.options.data &&
                component.options.data.bind(component.data)(component);

            component.options.utils &&
                component.options.utils.bind(component.utils)(component);

            component._setGlobalScope(
                new Storage({
                    name: "globalScope",
                    storage: "session",
                    child: "object",
                })
            );

            // component._setToggler(new Toggle(component.toggle));

            this.components[component.name] = component;
        });
    }

    _mountRouter() {
        Object.keys(this.components).forEach((name) => {
            let component = this.components[name];
            component._setRouter(this._Router);
        });
    }
}
