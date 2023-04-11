"use strict";

export default class Observer {
    constructor(name) {
        this.name = name;
        this.handlers = {};
        this.subscribe = [];
    }
    _handlers(callback = {}, ctx) {
        if (!Object.keys(callback).length) {
            return;
        }

        if (!ctx.handlers) {
            ctx.handlers = {};
        }

        for (let key in callback) {
            if (Object.prototype.hasOwnProperty.call(callback, key)) {
                let fn = callback[key].bind(ctx);

                let listeners = function () {
                    return this.subscribe.filter((item) => {
                        return item.from == ctx.name;
                    });
                }.bind(this);

                this.handlers[key] = async function () {
                    let _listeners = listeners();

                    let payload = await fn();

                    await Promise.all(
                        _listeners.map((fn) => {
                            return fn.handler(payload);
                        })
                    );

                    return payload;
                }.bind(ctx);

                ctx.handlers[key] = this.handlers[key];
            }
        }
        // console.log(40, this.handlers);
    }
    _subscriber(_components = {}, ctx) {
        if (!Object.keys(_components).length) {
            return;
        }

        for (let _c in _components) {
            if (Object.prototype.hasOwnProperty.call(_components, _c)) {
                let events = _components[_c];

                for (let key in events) {
                    if (Object.prototype.hasOwnProperty.call(events, key)) {
                        let event = events[key].bind(ctx);

                        this.subscribe.push({
                            handler: event,
                            listentToEvent: key,
                            from: _c,
                            listener: ctx.name,
                        });
                    }
                }
            }
        }

        // console.log(71, _components);
    }

    async broadcast(component, event, payload) {
        /**
         * 1. get the subscriber of the event for that component
         *
         */

        // console.log(
        //     83,
        //     component,
        //     event,
        //     payload,
        //     this.subscribe.filter((subscriber) => {
        //         return subscriber.from == component;
        //     })
        // );

        return Promise.all(
            this.subscribe
                .filter((subscriber) => {
                    return (
                        subscriber.from == component &&
                        event == subscriber.listentToEvent
                    );
                })
                .map((subscriber) => {
                    // console.log(105, subscriber, payload);
                    return subscriber.handler(payload);
                })
        );
    }
}
