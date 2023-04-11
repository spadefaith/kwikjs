import { loop } from "../Utils";

async function compileAttr(elModels, component, isStatic, html, storage) {
    let regex = new RegExp("<|>|===|==|!==|!=");
    let compileName = "attr";
    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {
            let hasRegularLog, hasNegate, bindVal, ops, testVal;
            let _sp2 = target.split("&&");
            let test = _sp2[0];
            let attrPair = _sp2[1];
            attrPair = attrPair.trim();

            let _sp1 = attrPair.split("=");
            let attrkey = _sp1[0];
            let attrvalue = _sp1[1];

            let bind = "";

            test = test.trim();

            hasRegularLog = test.match(regex);
            hasNegate = test[0] == "!";
            if (hasRegularLog) {
                let splitted = test.split(regex);

                bind = splitted[0];
                testVal = splitted[1];
                ops = hasRegularLog[0];
            } else {
                bind = test;
            }

            if (hasNegate) {
                hasNegate && (bind = bind.slice(1));
            }

            const conf = {
                _component: component,
                _type: compileName,
                hasNegate,
                bind,
                testVal,
                attrkey,
                attrvalue,
                ops,
                sel: id,
                orig: target,
            };

            storage.push(compileName, conf);
            storage.set(id, conf);

            el.dataset[compileName] = id;
        }
    );
}

export default compileAttr;
