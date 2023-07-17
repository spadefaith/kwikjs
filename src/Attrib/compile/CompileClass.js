import { loop } from "../Utils";

async function compileClass(elModels, component, isStatic, html, storage) {
    let regex = new RegExp("<|>|===|==|!==|!=");
    let compileName = "class";
    await loop(
        compileName,
        elModels,
        component,
        isStatic,
        function (el, id, target, gr, index) {
            let hasRegularLog, hasNegate, bindVal, ops, testVal, hasNegateCount;
            let cls = gr;
            for (let c = 0; c < cls.length; c++) {
                let clItem = cls[c];


                if(clItem.includes("ck-")){
                    continue;
                }

                let _sp1 = clItem.split("&&");

                let test = _sp1[0];
                let className = _sp1[1];

                test = test.trim();
                className = className.trim();

                hasRegularLog = test.match(regex);

                if (test.substring(0, 2).includes("!")) {
                    hasNegate = true;
                    hasNegateCount =
                        test.substring(0, 2) == "!!"
                            ? 2
                            : test.substring(0, 1) == "!"
                            ? 1
                            : 0;
                } else {
                    hasNegate = false;
                    hasNegateCount = 0;
                }

                if (hasRegularLog) {
                    let splitted = test.split(regex);

                    bindVal = splitted[0].trim();
                    testVal = splitted[1].trim();
                    ops = hasRegularLog[0].trim();
                } else {
                    !hasNegate && (bindVal = test);
                    if (hasNegate) {
                        bindVal = test.substring(hasNegateCount);
                        testVal = hasNegateCount == 2;
                    }
                }

                const conf = {
                    _component: component,
                    _type: compileName,
                    hasNegate,
                    bind: bindVal,
                    testVal,
                    className,
                    ops,
                    sel: id,
                };
                storage.push(compileName, conf);
                storage.set(id, conf);
            }

            el.dataset[compileName] = id;
        }
    );
}

export default compileClass;
