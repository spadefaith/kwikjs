import { loop } from "../Utils";

async function compileEvent(
    elModels,
    component,
    isStatic,
    html,
    storage,
    prev,
    multipleEventStorage
) {
    let compileName = "event";

    // component == "TriggerList" && console.log(13,"compiled", elModels);

    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {
            let splitted = gr;

            let hasMultipleEvents = false;
            if(splitted.length > 1){
                multipleEventStorage.set(id, true);
                hasMultipleEvents = true;
            }

            const events = [];
            const callbacks = [];

            for (let s = 0; s < splitted.length; s++) {
                let _sp1 = splitted[s].split(":");
                let event = _sp1[0];
                let cb = _sp1[1];
                event = event.trim();
                cb = cb ? cb.trim() : cb;


                if(hasMultipleEvents){
                    events.push(event);
                    callbacks.push(cb);
                }

                const prevConf = prev[event];
                let evs = [];
                let cbs = [];
                if(prevConf && prevConf.isMultiple){
                    evs = prevConf.events;
                    cbs = prevConf.callbacks;

                    multipleEventStorage.destroy();
                } else if(prevConf && !prevConf.isMultiple){
                    evs = [prevConf.event];
                    cbs = [prevConf.cb];
                } else {
                    evs = [event];
                    cbs = [cb];
                }

                evs.forEach((event, index)=>{
                    let cb = cbs[index];

                    const conf = {
                        _component: component,
                        _type: compileName,
                        event,
                        sel: id,
                        bind: cb,
                        cb,
                    };
    
                    storage.push(compileName, conf);
                    storage.set(id, conf);

                });

                el.dataset[compileName] = id;
            }

            if(hasMultipleEvents){
                const conf = storage.get(id);
                conf.events = events;
                conf.callbacks = callbacks;
                conf.isMultiple = true;

                storage.set(id, conf);
            }
        }
    );
}

export default compileEvent;
