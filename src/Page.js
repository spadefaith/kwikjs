import Utils from "./Utils";
import Component from "./Component";

export default class Page {
    constructor(name, template, options) {
        this.opts = options;
        this.name = name;

        options.isPage = true;
        

        return new Component(name, template, options);
    }
}
