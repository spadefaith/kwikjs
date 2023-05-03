import { loop } from "../Utils";

async function compileEvent(
    elModels,
    component,
    isStatic,
    html,
    storage,
    prev
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
            for (let s = 0; s < splitted.length; s++) {
                let _sp1 = splitted[s].split(":");
                let event = _sp1[0];
                let cb = _sp1[1];
                event = event.trim();
                cb = cb ? cb.trim() : cb;

                // component == "toolbar" && console.log(20, event);
                // if (event.includes("ck-")) {
                //     // console.log("event has ck-");
                //     continue;
                // }

                if (prev[event]) {
                    event = prev[event][compileName];
                }

                // console.log(28, prev);

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

                // console.log(30, "compile event", component, storage.get());

                el.dataset[compileName] = id;
            }
        }
    );
}

export default compileEvent;
