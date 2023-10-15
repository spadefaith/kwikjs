import Component from "./Component";

export default class Blueprint {
    constructor(name, template, overides) {
        const config = {};

        for (let key in overides) {
            if (Object.prototype.hasOwnProperty.call(overides, key)) {
                if (!["handlers", "subscribe"].includes(key)) {
                    config[key] = overides[key];
                }
            }
        }

        return new Component(name, template, {
            ...config,
            handlers: {
                ...(this.handlers ? this.handlers() : {}),
                ...(overides && overides.handlers ? overides.handlers : {}),
            },
            subscribe: {
                ...(this.subscribe ? this.subscribe() : {}),
                ...(overides && overides.subscribe ? overides.subscribe : {}),
            },
        });
    }
}
