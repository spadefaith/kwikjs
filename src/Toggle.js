import Storage from "./Storage";

function _forceState(el, cls, isforce) {
    if (isforce) {
        if (el.classList.contains(cls)) {
            el.classList.remove(cls);
        }
    } else {
        if (!el.classList.contains(cls)) {
            el.classList.add(cls);
        }
    }
}

function _check(config, attrToggle, bind) {
    // let config = this.toggle[bind];
    // console.log(this.toggle)
    // let attrToggle = this.$attrib.getWatchItemsByType(this.name, 'toggle');
    if (!config) {
        console.error(
            `${bind} is not found in toggle! choose from ${JSON.stringify(
                Object.keys(this.toggle)
            )}`
        );
    } else {
        let _config = config[bind];
        if (attrToggle.length) {
            // let {ns} = config;
            let ns = _config.ns;
            //toggle is use only for namespacing;
            let f = attrToggle.find((item) => {
                return item.name == `ns-${ns}`;
            });

            f && (_config.sel = `[data-toggle=${f.sel}]`);
        }

        return _config;
    }
}

function _toggle(_config, attrToggle, bind, html, bases, storage) {
    // console.log(43, _config, attrToggle, bind, html, bases, storage);
    let config = _check(_config, attrToggle, bind);

    if (!config) {
        return;
    }

    // let {basis='data-name', cls='is-active', mode='radio', sel, persist=true} = config;

    let basis = config.basis || "data-name";
    let cls = config.cls || "is-active";
    let mode = config.mode || "radio";
    let sel = config.sel;
    let persist = config.persist == undefined ? true : config.persist;

    // let targets = this.html.querySelectorAll(sel);
    let targets = html.querySelectorAll(sel);
    if (!targets.length) {
        return;
    }

    let prev, next;

    // console.log(targets);

    if (targets.length == 1) {
        let isbool = typeof bases == "boolean";
        let isforce = !!bases;
        let el = targets[0];
        // console.log(isbool, isforce)
        if (persist) {
            if (isbool) {
                if (isforce) {
                    storage.createOrUpdate(bind, true);
                    _forceState(el, cls, true);
                } else {
                    storage.createOrUpdate(bind, false);
                    _forceState(el, cls, false);
                }
                el.classList.toggle(cls);
            } else {
                storage.createOrUpdate(bind, !el.classList.contains(cls));
                el.classList.toggle(cls);
            }
        }
    } else {
        for (let t = 0; t < targets.length; t++) {
            let el = targets[t];
            let has = el.classList.contains(cls);
            let attr = el.getAttribute(basis);

            if (attr == bases) {
                if (mode == "switch") {
                    el.classList.toggle(cls);
                } else {
                    if (!has) {
                        el.classList.add(cls);
                    }
                }
                if (persist) {
                    storage.createOrUpdate(bind, attr);
                }
                next = attr;
            } else {
                if (has) {
                    el.classList.remove(cls);
                    prev = el.getAttribute(basis);
                }
            }
        }
    }
    return { prev, next };
}

function _recall(_config, attrToggle, bind, html, storage) {
    let config = _check(_config, attrToggle, bind);
    if (!config) {
        return;
    }
    // let {basis='data-name', cls='is-active',  sel} = config;

    let basis = config.basis || "data-name";
    let cls = config.cls || "is-active";
    let sel = config.sel;

    return storage.get(bind).then((result) => {
        if (!result) {
            return result;
        }
        let bases = result;
        let targets = html.querySelectorAll(sel);
        if (!targets.length) {
            return;
        }
        if (targets.length == 1) {
            let el = targets[0];
            // console.log(bases, this.bind);
            if (bases) {
                el.classList.add(cls);
            }
        } else {
            for (let t = 0; t < targets.length; t++) {
                let el = targets[t];
                let has = el.classList.contains(cls);
                let attr = el.getAttribute(basis);
                if (attr == bases) {
                    if (!has) {
                        el.classList.add(cls);
                    }
                }
            }
        }
        return bases;
    });
}

function _get(_config, attrToggle, bind, storage) {
    let config = _check(_config, attrToggle, bind);
    if (!config) {
        return;
    }
    return storage.get(bind).then((result) => {
        if (!result) {
            return result;
        }
        return result;
    });
}

// function(_this){
//     /*
//         @params
//         {basis} - comparison of elements;
//         {cls} - class to toggle;
//         {mode} - radio/ switch;
//         {sel} - siblings selector;
//         {persist} - bool;
//     */
//     let attrToggle = this.$attrib.getWatchItemsByType(this.name, 'toggle');

//     let cl = class{
//         constructor(bind, bases, html, _this){
//             this.toggle = _this.toggle;
//             this.bind = bind;
//             this.bases = bases;
//             this.cache = _this.$cache;
//             this.html = html;
//         }
//         check(bind){
//             let config = this.toggle[bind];
//             // console.log(this.toggle)

//             if (!config){
//                 console.error(`${bind} is not found in toggle! choose from ${JSON.stringify(Object.keys(this.toggle))}`);
//             } else {
//                 if (attrToggle.length){
//                     // let {ns} = config;
//                     let ns = config.ns;
//                     //toggle is use only for namespacing;
//                     let f = attrToggle.find(item=>{return item.name == `ns-${ns}`});
//                     f && (config.sel = `[data-toggle=${f.sel}]`);
//                 };
//                 return config;
//             };
//         }
//         _toggle(){
//             let config = this.check(this.bind);
//             if(!config){ return;}
//             // let {basis='data-name', cls='is-active', mode='radio', sel, persist=true} = config;

//             let basis = config.basis || 'data-name';
//             let cls = config.cls || 'is-active';
//             let mode = config.mode || 'radio';
//             let sel = config.sel;
//             let persist = config.persist == undefined? true : config.persist;

//             let targets = this.html.querySelectorAll(sel);
//             if (!targets.length) { return; };

//             let prev, next;

//             // console.log(targets);

//             if (targets.length == 1){
//                 let isbool = typeof this.bases == 'boolean'
//                 let isforce =  !!this.bases;
//                 let el =  targets[0];
//                 // console.log(isbool, isforce)
//                 if (persist){
//                     const _forceState = function(el, cls, isforce){
//                         if(isforce){
//                             if (el.classList.contains(cls)){
//                                 el.classList.remove(cls);
//                             };
//                         } else {
//                             if (!el.classList.contains(cls)){
//                                 el.classList.add(cls);
//                             };
//                         }
//                     };
//                     if (isbool){
//                         if (isforce){
//                             this.cache.createOrUpdate(this.bind, true);
//                             _forceState(el, cls, true);
//                         } else {
//                             this.cache.createOrUpdate(this.bind,false);
//                             _forceState(el, cls, false);
//                         }
//                         el.classList.toggle(cls);
//                     } else {
//                         this.cache.createOrUpdate(this.bind, !el.classList.contains(cls));
//                         el.classList.toggle(cls);
//                     };
//                 };
//             } else {
//                 for (let t = 0; t < targets.length; t++){
//                     let el = targets[t];
//                     let has = el.classList.contains(cls);
//                     let attr = el.getAttribute(basis);

//                     if (attr == this.bases){
//                         if (mode == 'switch'){
//                             el.classList.toggle(cls);
//                         } else {
//                             if (!has){ el.classList.add(cls) };
//                         };
//                         if (persist){
//                             this.cache.createOrUpdate(this.bind, attr);
//                         };
//                         next = attr;
//                     } else {
//                         if(has){
//                             el.classList.remove(cls)
//                             prev = el.getAttribute(basis);
//                         };
//                     };
//                 };
//             }
//             return {prev, next};
//         }
//         _recall(){
//             let config = this.check(this.bind);
//             if(!config){ return;}
//             // let {basis='data-name', cls='is-active',  sel} = config;

//             let basis = config.basis || 'data-name';
//             let cls = config.cls || 'is-active';
//             let sel = config.sel;

//             return this.cache.get(this.bind).then(result=>{
//                 if (!result){
//                     return result;
//                 };
//                 let bases = result;
//                 let targets = this.html.querySelectorAll(sel);
//                 if (!targets.length) { return ;};
//                 if (targets.length == 1){
//                     let el = targets[0];
//                     // console.log(bases, this.bind);
//                     if (bases){
//                         el.classList.add(cls);
//                     };
//                 } else {
//                     for (let t = 0; t < targets.length; t++){
//                         let el = targets[t];
//                         let has = el.classList.contains(cls);
//                         let attr = el.getAttribute(basis);
//                         if (attr == bases){
//                             if (!has){ el.classList.add(cls) };
//                         };
//                     };
//                 };
//                 return bases;
//             });
//         }
//         _get(){
//             let config = this.check(this.bind);
//             if(!config){ return;}
//             return this.cache.get(this.bind).then(result=>{
//                 if (!result){
//                     return result;
//                 };
//                 return result;
//             });
//         }
//     };
//     let fn = (bind, bases)=>{
//         return new cl(bind, bases, this.html, this)._toggle();
//     };
//     fn.recall = (bind)=>{
//         return new cl(bind, false, this.html, this)._recall();
//     };
//     fn.get = (bind)=>{
//         return new cl(bind, false, this.html, this)._get();
//     };
//     return fn;
// }

export default class {
    constructor(config, html, attr) {
        this.config = config;
        this.html = html;
        this.attr = attr;
        this.cache = new Storage({
            name: "toggler",
            storage: "session",
            child: "object",
        });

        const handler = (bind, active) => {
            // console.log(347, bind, active);
            return this._toggle(bind, active);
        };
        handler.recall = (bind) => {
            return this._recall(bind);
        };
        handler.get = (bind) => {
            return this._get(bind);
        };
        return handler;
    }
    _recall(bind) {
        return _recall(this.config, this.attr, bind, this.html, this.cache);
    }
    _get(bind) {
        return _get(this.config, this.attr, bind, this.cache);
    }
    _check(bind) {
        return _check(this.config, this.attr, bind);
    }
    _toggle(bind, active) {
        return _toggle(
            this.config,
            this.attr,
            bind,
            this.html,
            active,
            this.cache
        );
    }
}
