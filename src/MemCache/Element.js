export default class {
    constructor(el){
        this.el = el;

        if(!this.el){
            this.el = document.createElement("div");
            el.dataset.cache = true;
            document.head.append(el);

        }

        if(!this.el.__storage){
            this.el.__storage = {}
        }

    }

    set(key, value){
        this.el.__storage[key] = value;
    }
    get(key){
        return key == undefined ?this.el.__storage : this.el.__storage[key] ;
    }
    remove(key){
        if(key == undefined){
            this.el.__storage = {};
        } else {
            delete this.el.__storage[key];
        }
    }

}
