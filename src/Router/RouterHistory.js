
/**
    {
        "/bshm":{
            name: "bshm",
            display:'BSHM',
            components: [
                SpinnerShow,
                Header,
                CourseDetails,
                
                Footer,
                ToTop,
                SpinnerHide,
                Aos,
            ],
            auth:false,
        },
        "/bsba":{
            name: "bsba",
            display:'BSBA',
            components: [
                SpinnerShow,
                Header,
                CourseDetails,
                
                Footer,
                ToTop,
                SpinnerHide,
                Aos,
            ],
            auth:false,
        },
    }
 */

import Utils from "../Utils";
import MemCache from "../MemCache";


class RouterHistory {
    constructor(name, routes,options){
        this.config = {routes,options};
        this.state = {};



    }
    init(){
        this._parseOptions();
        this._parseRoutes();
        this.onConnected();
        this.onPopState();
        this._listen();
    }
    async goTo(name, opts={}){
        /**
         * 1. call history.pushState
         * 2. call render components
         */
        const isUrl = Utils.is.isURL(name);
        
        if(isUrl){
            const {origin, search} = this._parseUrl(name, true);
            let state = {};
            if(search){
                if(opts.params && search){
                    state={...search, ...opts.params};
                } else if (opts.params && !search){
                    state=opts.params;
                } else if (!opts.params && search){
                    state=search;
                }
            }

            let newPath = this._addParams(origin, state);

            if(opts.replace){
                location.replace(newPath);
            } else {
                location.href=newPath;
            }

        } else if(!isUrl){
            let state = {};
            let {path,config} = await this._getConfigByName(name);

            if(path){
                let parsed = this._parseUrl(path);

                let search = parsed.search;

    
                if(search){
                    if(opts.params && search){
                        state={...search, ...opts.params};
                    } else if (opts.params && !search){
                        state=opts.params;
                    } else if (!opts.params && search){
                        state=search;
                    }
                }
    
    
    
                let newPath = this._addParams(path, state);
    
    
                let {components,auth, name, display, strict} = config;
                let isAuth = await this._isAuth(auth);
                if(!isAuth){
                    console.error("unauthorized");
                    return;
                }
    
                if(opts.replace){
                    history.replaceState({auth,path, name, display,strict, state}, opts.title || "", newPath);
                } else {
                    history.pushState({auth,path, name, display,strict, state}, opts.title || "", newPath);
                }
                this._updateProperty({path,auth, name, display,strict, state});
                await this._destroyComponent(this.components);
                await this._renderComponent(components);
            } else {
                throw new Error(`route name ${name} is not found`);
            }

        }
    }

    async goBack(conf){
        let state = history.state;
        let name, auth, config;
        if(state && state.name){
            name = state.name;
            auth = state.auth;
            let found = await this._getConfigByName(name);
            if(found){
                config = found.config;
            }
        } else if(conf && conf.name){
            let found = await this._getConfigByName(conf.name);
            if(found){
                config = found.config;
                name = config.name;
                auth = config.auth;
            }
        }else if(conf && conf.path) {
            let found = await this._getConfigByPath(conf.path);
            if(found){
                config = found.config;
                name = config.name;
                auth = config.auth;
            }
        }



        if(name && auth != undefined){


            let isAuth = await this._isAuth(auth);
            if(!isAuth){
                console.error("unauthorized");
                return;
            }

            // console.log(114,this.components);
            // console.log(115,config.component);

            await this._destroyComponent(this.components);
            await this._renderComponent(config.components);
        } else {
            //
            console.error("no history state found");
        }
    }
    _parseUrl(path, isUrl){
        let urlClass = null;
        if(isUrl){
            try {
                urlClass = new URL(path);
            } catch(err){
                console.error(`path ${path} is not a URL`);   
            }
        } else {
            let url = `http://localhost${path}`;
            urlClass = new URL(url);
        }

        let o = {search:{}};
        if(urlClass){
            o.pathname = urlClass.pathname;
            o.origin = urlClass.origin;

    
            if(urlClass.search){
                let params = new URLSearchParams(urlClass.search);
                for (let [key, value] of params.entries()){
                    o.search[key] = value;
                }
                o.searchParams = params.toString();
            }
        }

        return o;
    }
    _addParams(path,params){
        let searchParams = new URLSearchParams();
        for (let key in params){
            if (Object.prototype.hasOwnProperty.call(params, key)){
                searchParams.append(key, encodeURIComponent(params[key]));
            }
        }


        return `${path}?${searchParams.toString()}`;
    }
    async _getConfigByName(name, parsedOnly = false){
        let config = {};
        let path = null;
        let routes = Object.keys(this.config.routes);


        for (let i = 0; i < routes.length; i++){
            let pt = routes[i];
            let cf = this.config.routes[pt];
            // console.log(154,cf.name == name,name,cf);
            if(cf.name == name){
                config = cf;
                path = pt;
                break;
            }
        }


        routes = null;

        if(path){
            return {path,config};
        } else if(this.notFound && !parsedOnly){
            let url = await this.notFound();
            try {
                //valid url;
                let urlClass = new URL(url);
                window.location = url;
            } catch(err){
                await this.goTo(url);
            }
            return null;
        }
        return null;
    }
    async _getConfigByPath(_path, parsedOnly = false){


        let {search, pathname, searchParams} = this._parseUrl(_path);

        /**
         * 1. look for path without search params
         * 2. look for exact
         */


        let config = {};
        let path = null;
        let routes = Object.keys(this.config.routes);

        for (let i = 0; i < routes.length; i++){
            let pt = routes[i];
            let parseRoute = this._parseUrl(pt);
            let cf = this.config.routes[pt];
            let {strict} = cf;



            if(strict || strict == undefined){
                //exact same
                if(_path == pt){
                    config = cf;
                    path = _path;
    
                    break;
                } else {
                    //_path has extra params;
                    if(pathname == parseRoute.pathname){
                        let hasAtleastContainsParamsOfRoute = false;
                        for (let key in parseRoute.search){
                            if (Object.prototype.hasOwnProperty.call(parseRoute.search, key)){
                                if(search[key] == parseRoute.search[key]){
                                    hasAtleastContainsParamsOfRoute = true;
                                }
                            }
                        }
                        if(hasAtleastContainsParamsOfRoute){
                            config = cf;
                            path = _path;
            
                            break;
                        }
                    }
                    // else if(){}
                }
            } else if(strict == false){
                //match only the pathname;
                
                if(pathname == parseRoute.pathname){
                    config = cf;
                    path = _path;
    
                    break;
                }
            }

        }


        routes = null;

        if(path){
            return {path,config,search};
        } else if(this.notFound && !parsedOnly){
            let url = await this.notFound();
            try {
                //valid url if new URL will not throw error;
                let urlClass = new URL(url);
                window.location = url;
            } catch(err){
                await this.goTo(url);
            }
            return null;
        }
        return null;
    }
    _parseOptions(){
        let options = this.config.options || {};
        // console.log(318,options);
        this.notFound = options.notFound;//function returns url
        this.unAuthorized = options.unAuthorized;//function returns url
        this.verify = options.verify;//function returns {status:1,role}
    }
    _parseRoutes(){
        let paths = Object.keys(this.config.routes);

        for (let i = 0; i < paths.length; i++){
            let path = paths[i];
            let conf = this.config.routes[path];
            conf._path = path;

            MemCache.object("Router").set(path, conf);
        }

        paths = null;

    }
    clean(){
        this.user = {};
    }
    async _isAuth(auth){
        try {
            if(auth == true || Utils.is.isArray(auth)){
                if(this.verify){
                    let request = await this.verify();
                    if(request.status){
                        this.user = request.data;
                    } else {
                        throw new Error(request.message || "error verifying auth");
                    }
                } else {
                    throw new Error("verify auth callback is required");
                }
            }



            if(auth == true){//valid for all role;
                if(this.verify){
                    let user = this.user;
                    if(user){
                        return true;
                    } else {
                        throw new Error("router has no user, the route requires a user.");
                    }
                } else {
                    throw new Error("verify callback is required if the route is auth");
                }
            } else if (auth == false){//public route
                return true;
            } else if (Utils.is.isArray(auth)){//role allowed to the route
                let user = this.user;
                if(user){
                    let role = user.role;
                    if(auth.includes(role)){
                        return true;
                    } else {
                        throw new Error(`role ${role} is not found in allowed roles`);
                    }
                } else {
                    throw new Error("router has no user, the route requires a user.");
                }
            }
        } catch(err){
            console.log(err);
            return false;
        }
    }
    _updateProperty(obj){

        for (let key in obj){
            if (Object.prototype.hasOwnProperty.call(obj, key)){
                if(key == "state"){
                    //this.state is an object;
                    if(!Utils.is.isObject(obj[key])){
                        obj[key] = {};
                    } else {
                        this[key] = obj[key];
                    }
                } else {
                    this[key] = obj[key];
                }
            }
        }
    }
    async _renderComponent(components){
        try {
            /**render components */
            await Utils.function.recurse(components || [], async (component, index)=>{
                if(component){
                    await component.render.bind(component)();
                    if(component.await.isConnected){
                        await component.await.isConnected;
                    }
                }
                
            });

            await this._updateProperty({components});

            return true;
        } catch(err){
            console.log(err);
            return false;
        }
    }
    async _destroyComponent(components){
        try {
            /**destroy previous components*/
            return await Utils.function.recurse(components || [],async (component, index)=>{

                if(component){
                    if(component?.fire?.destroy){
                        await component.fire.destroy();
                        await component.await.destroy;
                    } else {
                        return component.reset();
                    }
                }
            });
        } catch(err){
            console.log(err);
            return false;
        }

    }
    async onConnected(){
 
        let {pathname, search} = window.location;
        let state = history.state;


        if(state && state.name && state.components){
            this._updateProperty({
                name:state.name,
                auth:state.auth,
                components:state.components,
                display:state.display,
                state:state.state,
            });
            return await this._renderComponent(state.components);
        } else {
            let config = {};
            let path = null;

            let found = await this._getConfigByPath(search?`${pathname}${search}`:pathname);



            if(found){
                path = found.path;
                config = found.config;
                this._updateProperty({
                    path,
                    strict:config.strict, 
                });
            }


            if(path && config.components){
                this._updateProperty({
                    name:config.name,
                    auth:config.auth,
                    components:config.components,
                    display:config.display,
                    state:found.search
                });

                found = null;
                return await this._renderComponent(config.components);
            }
        }
    }
    onPopState(){
        window.addEventListener("popstate", (event) => {
            let {pathname, search} = this._parseUrl();
            this.goBack({path:pathname});
        });
    }
    _getCurrentRoute(){
        const state = Object.keys(this.state).reduce((accu, key)=>{
            let value = this.state[key];
            value = decodeURIComponent(value);
            value = value.replaceAll("(", "");
            accu[key] = value;
            return accu;
        },{});
        return {
            components:this.components,
            state,
            path:this.path,
            name:this.name,
            display:this.display,
        };
    }
    _listen() {
        let name = "pathChanged";

        document.addEventListener(name, (e) => {
            let detail = e.detail;

            // console.log(510,detail);
            this.goTo(detail.name);

        });
    }
}



export default RouterHistory;