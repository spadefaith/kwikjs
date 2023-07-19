import Utils from "../Utils";

function _static(component, qs, isStatic) {
    let els = [];
    for (let t = 0; t < qs.length; t++) {
        let el = qs[t];
        if (isStatic) {
            let dComponent = el.closest("[data-component]");
            dComponent = dComponent && dComponent.dataset.component;
            if (dComponent == component) {
                els.push(el);
            }
        } else {
            els.push(el);
        }
    }
    return els;
}

function loop(attr, els, component, isStatic, cb) {
    if (!els.length) {
        return false;
    }

    els = _static(component, els, isStatic);

    if (!els.length) {
        return false;
    }

    for (let i = 0; i < els.length; i++) {
        let el = els[i];
        let id = Utils.string.uuid();
        let target, gr;
        if (attr.includes(",")) {
            let attrs = attr.split(",");
            (target = {}), (gr = {});
            for (let a = 0; a < attrs.length; a++) {
                let attr = attrs[a];
                target[attr] = el.dataset[attr];
                gr[attr] = target.split(",");
            }
        } else {
            target = el.dataset[attr];
            gr = target.split(",");
        }
        cb(el, id, target, gr, i);
    }
    els = null;
    return true;
}

export { loop };
