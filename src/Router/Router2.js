import Utils from "../Utils";

import MemCache from "../MemCache";

class Router {
    constructor(name, routes, options = {}) {
        this.name = name;
        this.options = options;
        this.unauthRoute = () => null;
        this.componentConf = null;
        this.authValidRoute = null;
        this.loaderOptions = options.loader;

        this.hooks = [];

        // console.log(21,this.options.auth['401'].constructor.name);

        // throw new Error('pause');

        this.authConfig = function () {
            if (!this.options) {
                return;
            }
            const confAuth = this.options.auth;
            const confComponents = this.options.components;
            // console.log(29, confComponents);
            if (confComponents) {
                this.componentConf = confComponents;
            }
            if (confAuth && confAuth.verify) {
                this.isAuthorized = confAuth.verify;
                // this.verifyComponent = verify[0];
                // this.verifyComponentHandler = verify[1];
                this.unauthRoute =
                    confAuth["401"] &&
                    confAuth["401"].constructor.name == "Function"
                        ? confAuth["401"]
                        : () => confAuth["401"];
                // return confAuth;
            }

            if (confAuth && confAuth.valid) {
                this.authValidRoute = confAuth.valid;
            }

            return null;
        }.bind(this)();

        this.authRedirectRoute = {}; //route to redirect back when the token is still valid;
        this.route = this.compile(routes);
        this.prev = null;
        this.overlayComponents = options.components;

        this.watch();
        this.persist();
        this._listen();

        this.components = new Map();

        for (let path in routes) {
            if (Object.prototype.hasOwnProperty.call(routes, path)) {
                let conf = routes[path];

                if (conf.name != "404") {
                    let components = conf.components;

                    components.forEach((component) => {
                        this.components.set(component.name, component);
                    });
                }
            }
        }


        ;(()=>{

            
        /**
         * for asynchronous routes;
         * routes is a async function 
         * this is to trigger the rendering, upon resolving the routes.
         */

            let _path = "/";
            for (let path in routes) {
                if (Object.prototype.hasOwnProperty.call(routes, path)) {
                    // if(location.pathname == path && path == "/"){
                    //     // _path = null;
                    // } else 
                    
                    if(this._parsePathName(location.pathname) == path){
                        _path =this._parsePathName(location.pathname);
                    }   
                    
                }
            };

            /**
             * prevent from dispatching the pathChanged whem the path is equal to "/"
             */
            if(!_path){
                return;
            };

            document.dispatchEvent(
                (()=>{
                    /**
                     * make sure that the path is the current path, upon refresh
                     */


                    if(location.search){
                        _path = `${_path}${location.search}`;
                    }

                    return new CustomEvent("pathChanged", {
                        detail: {
                            path: _path,
                            component: this.name,
                        },
                    })
                })()
            );
        })();

        return {
            goTo: this.goTo.bind(this),
            goBack: this.goBack.bind(this),
            auth: this.auth.bind(this),
            logout: this.logout.bind(this),
            updateAuth: this.updateAuth.bind(this),
            login: this.login.bind(this),
            verify: this.verifyAuth.bind(this),
            _getCurrentRoute: this._getCurrentRoute.bind(this),
            ...this.prev,
        };
    }
    _parsePathName(){
        let path = location.pathname;
        let lastIsSlash = path[path.length - 1] == "/";
        
        return lastIsSlash ? path.substring(0,path.length-1) : path;
    }
    _listen() {
        let name = "pathChanged";
        // alert(name);
        document.addEventListener(name, (e) => {
            let detail = e.detail;

            history.pushState(detail, window.title, detail.path);



            this.parse();
            this.notify().then(() => {
                // console.log('notified');
                return this.clear().then(() => {
                    // console.log('cleared');
                    return this.navigate().then(() => {
                        // console.log('navigated');
                    });
                });
            });
        });
    }
    getComponent(name, path) {
        if (this.componentConf && this.componentConf[name]) {
            let rerender = this.componentConf[name].rerender;

            if (rerender) {
                name = rerender.includes(path) ? name : null;
            }
        }
        return name ? this.components.get(name) : null;
    }
    verifyAuth(token) {
        // return models.$loaded(this.verifyComponent).then((model) => {
        //     return model.fire[this.verifyComponentHandler](token).then(
        //         (res) => {
        //             this.isauth = res && res.status == 1;
        //             return res;
        //         }
        //     );
        // });

        return this.isAuthorized();
    }
    async authenticate(name, isauth) {
        let authUser =
            (Utils.is.isArray(isauth) && isauth.length && isauth) || null;

        // console.log(isauth, authUser, !(isauth == true || authUser));
        if (!(isauth == true || authUser)) {
            return;
        }

        // console.log(113, "here");
        /*
            happens when the current page is in the unAuthRoute
            usually the login page,
            when still the token is valid,
            instead of redirect to unAuthRoute
            it will redirect to the route declared per role
            this happens in mobile app, when the app is minimized,
            the path is reset to '/';
        */

        // console.log(103, this.unauthRoute , name);

        const initialize = this.unauthRoute() == name;
        // const initialize = this.unauthRoute[name];

        if (this.unauthRoute()) {
            //has 401;
            try {
                const isverified = await this.verifyAuth();

                if (!isverified) {
                    alert("provide verify function.");
                    throw new Error("provide verify function.");
                }

                if (authUser) {
                    if (!authUser.includes(isverified.role)) {
                        // this.redirect401(null);

                        let result = await this.logout();

                        if (result && result.isredirected) {
                            //
                        } else {
                            // location.reload();
                            console.log("reload");
                        }
                        return;
                    }
                }

                if (![1, 0].includes(Number(isverified.status) || 2)) {
                    alert("verify function should be {status:1 || 0, role:''}");
                    throw new Error(
                        "verify function should be {status:1 || 0, role:''}"
                    );
                }

                if (isverified.status == 0) {
                    await this.logout();
                    // location.reload();
                    console.log("reload");
                }

                if (isverified.status == 1) {
                    if (initialize) {
                        const role = isverified.role;

                        const route = this.authRedirectRoute[role]; //redirect back to a page;
                        if (route) {
                            const name = route.name;
                            this.goTo(name);
                        }
                    } else {
                        //
                    }
                } else {
                    if (initialize) {
                        //
                    } else {
                        await this.logout();
                    }
                }
            } catch (err) {
                alert(JSON.stringify(err.message || err));

                if (initialize) {
                    //
                } else {
                    await this.logout();
                }
            }
        }
    }
    login(cred, options) {

        const authRedirect = this.updateAuth(cred, options);


        // console.log(authRedirect);
        // alert(authRedirect);

        if(this.prev.name == authRedirect && authRedirect ==  path){
            //
        } else {
            this.goTo(authRedirect, options);
        };
    }
    updateAuth(cred, options){
        let role = cred.role;
        let token = cred.token;
        let data = cred.data;

        let path = options && options.path;

        // console.log(this.authValidRoute);
        let authRedirect = "";

        if (!role) {
            throw new Error("role is not provided in router.login");
        }
        if (!token) {
            throw new Error("token is not provided in router.login");
        }
        if (!data) {
            throw new Error("data is not provided in router.login");
        }
        if (path) {
            //
        } else if (this.authValidRoute && this.authValidRoute[role]) {
            authRedirect = this.authValidRoute[role];
            if(!path){
                path = authRedirect;
            }
        } else {
            throw new Error("provide route when login is successful");
        }
        this.authUserCred = cred;

        return authRedirect
        
    }
    auth() {
        return this.authUserCred;
    }
    logout(isredirect) {
        // alert(this.unauthRoute);

        if (this.prev.name == this.unauthRoute()) {
            return Promise.resolve();
        }

        if (isredirect) {
            //
        } else {
            return new Promise((res, rej) => {
                try {
                    this.goTo(
                        this.unauthRoute(),
                        { replace: true },
                        function (result) {
                            res(result);
                        }
                    );
                } catch (err) {
                    alert("unauthorized");
                    console.log(269, err);

                    rej(err);
                }
            });
        }
        // sessionStorage.createOrUpdate('history',[]);
    }
    goTo(routeName, config = {}, callback) {
        try {
            if (!routeName) {
                throw new Error("route name is required, provide route name");
            }
            let routes = this.route;

            let params = config.params || {};
            let isreplace = config.replace;

            let hash = null;
            const raw = Object.entries(routes);

            for (let i = 0; i < raw.length; i++) {
                const route = raw[i][0];
                const config = raw[i][1];
                const name = config.name;

                if (name == routeName) {
                    hash = route;
                    break;
                }
            }

            // console.log(277, hash);

            if (!hash) {
                if (routeName && routeName.includes("://")) {
                    location.href = routeName;

                    return callback && callback({ isredirected: true });
                }

                throw new Error(`${routeName} is not found in routes`);
            }

            // console.log(286, `${location.origin}${location.pathname}`);

            
            // console.log(401,hash);
            // console.log(402,isreplace);
            // alert("pause");

            if (hash == "/") {
                if (isreplace) {
                    history.replaceState({}, window.title, null);
                    location.replace(`${location.origin}${this._parsePathName(location.pathname)}`);
                } else {
                    window.location = `${location.origin}${this._parsePathName(location.pathname)}`;
                }
                return;
            }

            let path;
            hash = hash.slice(1);
            if (params.toString().includes("Object")) {
                let p = "";
                for (let key in params) {
                    p += `${key}=${params[key]}&`;
                }
                params = p;
                path = `/${hash}?${params}`;
            } else {
                path = `/${hash}`;
            }
            if (hash == "/") {
                path = "";
            }

            // console.log(159, path);


            if (isreplace) {
                let loc = `${location.origin}${path}`;
                // console.log(180,loc, !Utils.isFirefox());
                // console.log(!Utils.isFirefox());
                // console.log(
                //     276,
                //     Utils.is.isChrome() && !Utils.is.isFirefox(),
                //     loc
                // );
                Utils.is.isChrome() &&
                    !Utils.is.isFirefox() &&
                    history.replaceState(undefined, undefined, loc);
                location.replace(loc);
            } else {


                var a = document.createElement("a");
                a.href = `${path}`;
                Utils.is.isChrome() &&
                    !Utils.is.isFirefox() &&
                    history.pushState(undefined, undefined, a.href);
                a.click();
                // console.log(171,a.href);
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    goBack() {
        return new Promise((res, rej) => {
            window.history.back();
            res();
        });
    }
    persist() {
        if (!document.hasRouterPersist) {
            let event = "DOMContentLoaded";
            if ("deviceready" in document) {
                event = "deviceready";
            }
            document.addEventListener(event, (e) => {
                this.parse();
                this.notify().then(() => {
                    return this.navigate(true);
                });
            });

            document.hasRouterPersist = true;
        }
    }
    watch() {
        if (!window.hasRouterPop) {
            // console.log('set pop state');
            window.addEventListener("popstate", (e) => {
                this.parse();
                this.notify().then(() => {
                    // console.log('notified');
                    return this.clear().then(() => {
                        // console.log('cleared');
                        return this.navigate().then(() => {
                            // console.log('navigated');
                        });
                    });
                });
            });

            window.hasRouterPop = true;
        } else {
            this.parse();
        }
    }
    compile(routes) {
        // console.log(167, this);
        let con = {};
        let _routes = [];
        for (let key in routes) {
            let config = routes[key];
            // console.log(281, config);
            key = String(key);

            // let u = new URL(`http://localhost${key}`);

            // console.log(478,u.pathname);
            // if(u.search){
            //     key = u.pathname;
            // }


            _routes.push(key);


            const len = key.length;
            let regex = key;

           

            if (["404"].includes(key)) {
                //http errors;
                const callback = routes[key]; //function

                config = { callback, name: key };
            } else {
                regex = regex.slice(1);
            }

            // console.log(496, regex, key);

            regex = regex.split("/");
            regex = regex.map((item, index) => {
                let param = item.includes(":");
                let a = "";
                index == 0 ? (a += "^/") : (a += "/");
                param ? (a += "(([^/#?]+?))") : (a += item);
                index == len - 1 ? (a += "/?$") : (a += "");
                if (param) {
                    const paramKey = item.replace(":", "");
                    if (!con[key]) {
                        con[key] = {};
                    }
                    con[key].params = {
                        [paramKey]: index,
                    };
                }
                return a;
            });
            

            // con[key]._path = key;

            if (con[key] && con[key].params) {
                con[key] = {
                    params: con[key].params,
                    regex: new RegExp(regex.join("")),
                    ...config,
                };
            } else {
                con[key] = {
                    regex: new RegExp(regex.join("")),
                    ...config,
                };
            }

            if (this.authValidRoute) {
                Utils.array.each(this.authValidRoute, (obj, i) => {
                    let key = obj.key;
                    let value = obj.value;

                    if (value == config.name) {
                        if (this.authRedirectRoute[value]) {
                            this.authRedirectRoute[value] = config;
                            console.error(
                                `auth ${value} is found in other route`
                            );
                        } else {
                            this.authRedirectRoute[value] = config;
                        }
                    }
                });
            }
            con[key]._path = key;
            MemCache.object("Router").set(key, con[key]);
        }


        con.length = _routes.length;
        con.keys = _routes;
        
        // console.log(550,con);
        return con;
    }
    _cleanPath(path){

    }
    parse() {
        let hash = window.location.pathname,
            scheme,
            routeName;
        const url = new URL(location.href);

        let search = url.search;
        let path = url.pathname;


        const keys = this.route.keys;
        let  state = {};
        const PARAMS = {};
        if (search) {
            new URLSearchParams(search).forEach((value, key) => {
                state[key] = value;
            });
        }
        // console.log(574,state);
        let has = false;
        for (let i = 0; i < keys.length; i++) {
            const route = this.route[keys[i]];



            const regex = route.regex;
            const components = route.components;
            const params = route.params;
            const name = route.name;
            const auth = route.auth;
            // const entry = route.entry;
            const overlay = route.overlay;
            const display = route.display;
            const onrender = route.onrender;
            const controller = route.controller;

            if (params) {
                let _path = String(path);
                _path = _path.slice(1);
                _path = _path.split("/");
                Object.entries(params).forEach((param) => {
                    const key = param[0];
                    const value = param[1];

                    if (_path[value]) {
                        PARAMS[key] = _path[value];
                    }
                });
            }

 

            const test = regex.test(path);



            // console.log(path)
            // console.log(name)
            // console.log(test)
            // alert('pause')

            // alert(1);
            if (test) {
                if(route.params){
                    state = Object.keys(state).length ? state:params;
                }

                routeName = name;

                this.authenticate(routeName, auth);

                this.prev = {
                    components,
                    params: PARAMS,
                    state,
                    path,
                    name,
                    prev: this.prev,
                    overlay,
                    display,
                    onrender,
                    controller,
                };
                has = true;
                break;
            }
        }

        this.redirect404(has);
    }
    _parsePath(str){
            let _u = new URL(`http://localhost${str}`);
            return {
                pathname: _u.pathname,
                search: _u.search,
            }
    }
    redirect404(has) {
        // console.log("redirect404", !has);
        if (!has) {
            // console.log(464, this.route, this.options);
            // console.log(465, this.route['404']);
            if (this.route["404"]) {
                let path = this.route["404"].callback();
                // const {origin, pathname} = location;

                // console.log(470,path);

                let origin = location.origin;
                let pathname = this._parsePathName(location.pathname);

                // console.log(617, `${origin}${pathname}`);
                if (this.route[path]) {
                    // console.log(1);
                    if (path == "/") {
                        path = `${origin}${pathname}`;
                    } else {
                        if (pathname.slice(-1) == "/") {
                            path = `${origin}${pathname}#!${path}`;
                        } else {
                            path = `${origin}${pathname}/#!${path}`;
                        }

                        path = `${origin}${pathname}`;
                    }
                    location.replace(path);
                } else if (!!path && !this.route[path]) {
                    if (origin.slice(-1) == "/") {
                        if (path[0] == "/") {
                            path = path.slice(1);
                        }
                    }
                    path = `${origin}${path}`;
                    location.replace(path);
                }
            }
        } else {
            // return await this.log(routeName);
        }
    }
    async navigate(ispersist) {
        // console.log("here", this.prev);
        if (this.prev) {
            // const {components, state, path, name, overlay, onrender={}} = this.prev;

            const components = [...this.prev.components];
            const state = this.prev.state;
            const path = this.prev.path;
            const name = this.prev.name;
            const overlay = this.prev.overlay;
            const onrender = this.prev.onrender || {};

            // console.log(663, components);

            // if(overlay){
            //     storage.create(name);
            // };

            //TODO - insert before and after the Loader and the LoaderOut
            //TODO - exception can be found in loader:{except:[]}
            if (this.loaderOptions && this.loaderOptions.except) {
                if (!this.loaderOptions.except.includes(name)) {
                    let loaderin = this.loaderOptions.in;
                    let loaderout = this.loaderOptions.out;
                    if (
                        typeof loaderin == "string" &&
                        typeof loaderout == "string"
                    ) {
                        components.unshift(loaderin);
                        components.push(loaderout);
                    }
                }
            }

            try {
                // console.log(hooks);
                if (components.length) {
                    // return Promise.all(components.map(item=>{
                    //     return this.components[item].render({emit:{route:this.prev}});
                    // }));
                    return new Promise((res, rej) => {
                        const l = components.length;
                        let i = 0;

                        if (l) {
                            const recur = () => {
                                let component = components[i];

                                if (components.length > i) {
                                    i += 1;
                                    let componentName = component;
                                    // component = this.components[component];

                                    let isunload = this.getComponent(
                                        component,
                                        path
                                    );

                                    new Promise((res) => {
                                        let _component = component;

                                        if (
                                            _component &&
                                            _component.isConnected != undefined
                                        ) {
                                            res(_component);
                                        } else {
                                            setTimeout(() => {
                                                res(
                                                    this.components.get(
                                                        component
                                                    )
                                                );
                                            }, 50);
                                        }
                                    }).then((component) => {
                                        //TODO - look to model?
                                        // if (!component) {
                                        //     component = models[componentName];
                                        // }

                                        if (component) {
                                            // console.log(638, component);
                                            if (
                                                component.isConnected &&
                                                !isunload
                                            ) {
                                                if (component.fire.softReload) {
                                                    component.fire.softReload();
                                                    component.await
                                                        .softReload &&
                                                        component.await.softReload.then(
                                                            () => {
                                                                recur();
                                                            }
                                                        );
                                                } else {
                                                    recur();
                                                }
                                            } else if (
                                                component.type == "model"
                                            ) {
                                                component
                                                    .initialize()
                                                    .then(() => {
                                                        recur();
                                                    })
                                                    .catch((err) => {
                                                        throw err;
                                                    });
                                            } else {
                                                let fromRouter =
                                                    onrender[componentName] ||
                                                    {};
                                                let fromComponent =
                                                    component.onRenderConfig ||
                                                    {};

                                                if (
                                                    !Utils.is.isObject(
                                                        fromComponent
                                                    )
                                                ) {
                                                    fromComponent = {};
                                                }
                                                if (
                                                    !Utils.is.isObject(
                                                        fromRouter
                                                    )
                                                ) {
                                                    fromRouter = {};
                                                }

                                                component
                                                    .render({
                                                        emit: {
                                                            route: this.prev,
                                                        },
                                                        ...fromRouter,
                                                        ...fromComponent,
                                                    })
                                                    .then(() => {
                                                        if (
                                                            component.await
                                                                .isConnected
                                                        ) {
                                                            component.await
                                                                .isConnected &&
                                                                component.await.isConnected.then(
                                                                    () => {
                                                                        recur();
                                                                    }
                                                                );
                                                        } else {
                                                            recur();
                                                        }
                                                    })
                                                    .catch((err) => {
                                                        throw err;
                                                    });
                                            }
                                        }
                                    });

                                    // if(component){

                                    // } else {
                                    //     recur();
                                    // }
                                } else {
                                    res();
                                    // rej(`${component} is not found`);
                                }
                            };
                            recur();
                        } else {
                            res();
                        }
                    });
                }
            } catch (err) {
                console.log(err);
                throw new Error(
                    `some of the component in ${JSON.stringify(
                        components
                    )} in path ${path} of router is not found, make sure the it is created`
                );
            }
        }
    }
    clear() {
        // console.log("start cleaning");
        let promise = Promise.resolve();

        const overlay = (this.prev && this.prev.overlay) || undefined;
        //if overlay prevent in detroying current rendered component;
        if (overlay) {
            return promise;
        }

        // console.log('has cleared?', overlay);

        const recur = async function (
            index,
            componentNames,
            sourceComponents,
            callback
        ) {
            // console.log(849, componentNames, index);
            let component = componentNames[index];
            let componentName = component;
            let self = recur;

            // console.log(856, component);

            if (componentNames.length > index) {
                index += 1;
                // component = sourceComponents[component];

                component = this.getComponent(component.name, this.prev.path);

                // console.log(857, component);

                if (component) {
                    if (component.fire.destroy) {
                        component.fire.destroy();
                        component.await.destroy.then(() => {
                            return self(
                                index,
                                componentNames,
                                sourceComponents,
                                callback
                            );
                        });
                        // throw new Error(
                        //     `${componentName} has no destroy handler!`
                        // );
                    } else {
                        component.reset().then(() => {
                            return self(
                                index,
                                componentNames,
                                sourceComponents,
                                callback
                            );
                        });
                    }
                } else {
                    await self(
                        index,
                        componentNames,
                        sourceComponents,
                        callback
                    );
                }
            } else {
                // rej(`${component} is not found`);
                callback();
            }
        }.bind(this);

        // console.log(624, this.components);

        if (this.prev && this.prev.prev) {
            // const {components, state, path, name, overlay} = this.prev.prev;
            let components = this.prev.prev.components;
            let state = this.prev.prev.state;
            let path = this.prev.prev.path;
            let name = this.prev.prev.name;
            let overlay = this.prev.prev.overlay;
            let destroyPromise = Promise.resolve();
            // const components = this.prev.components;

            // console.log(905, components);

            if (overlay) {
                destroyPromise = new Promise((res, rej) => {
                    const l = components.length;

                    let i = 0;
                    if (l) {
                        recur(i, components, this.overlayComponents, res);
                    } else {
                        res();
                    }
                });
            }

            promise = new Promise((res, rej) => {
                const l = components.length;
                // console.log(644, components, l);
                let i = 0;
                if (l) {
                    recur(i, components, this.overlayComponents, res);
                } else {
                    res();
                }
            });
            return destroyPromise.then(() => {
                return promise;
            });
        }
        return promise;
    }
    pushState(data, notused, path) {
        window.history.pushState(data, notused, path);
        let promise = Promise.resolve();
        this.clear();
        return promise.then(() => {
            return this.navigate();
        });
    }
    subscribe(fn) {
        if (fn && fn.constructor.name == "Function") {
            this.hooks.push(fn);
        }
    }
    notify() {
        return Promise.all(
            this.hooks.map((subscribe) => {
                return subscribe();
            })
        );
    }
    _getCurrentRoute() {
        return this.prev;
    }
}

export default Router;
