import { each, reduce, map } from "./UtilsArray";

function toUrlSearchParams(obj, istrim = true) {
    let searchParams = "";
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let val = obj[key];
            if (val.toString().includes("Object")) {
                val = JSON.stringify(val);
            }
            if (istrim && val) {
                searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
            } else {
                searchParams += `${encodeURI(key)}=${encodeURI(val)}&`;
            }
        }
    }
    return searchParams.slice(0, searchParams.length - 1);
}
function sanitize(string, exclude = []) {
    if (typeof string != "string") {
        return string;
    }
    // let map = {
    //     '&': '&amp;',
    //     '<': '&lt;',
    //     '>': '&gt;',
    //     '"': '&quot;',
    //     "'": '&#x27;',
    //     "/": '&#x2F;',
    // };
    // map = Object.keys(map).reduce((accu, key)=>{
    //     if(!exclude.includes(key)){
    //         accu[key] = map[key];
    //     };
    //     return accu;
    // },{});

    // const reg = /[&<>"'/]/ig;
    // return string.replace(reg, (match)=>{
    //     return map[match] || match;
    // });
    // return decodeURIComponent(string.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,""));
    return decodeURIComponent(string.replace(/<.*>/, ""));
}
function toFormData(form, options = {}) {
    //trim, json, skipsanitize, sanitize = boolean

    const controls = [];
    const textareas = form.querySelectorAll("TEXTAREA");
    const inputs = form.querySelectorAll("INPUT");
    const selects = form.querySelectorAll("SELECT");

    function loop(arr, cont, sort) {
        let files = [];
        for (let i = 0; i < arr.length; i++) {
            let test = true;

            try {
                test = arr[i].closest(".cake-template");
            } catch (err) {
                //
            }
            try {
                if (!test) {
                    test = arr[i].classList.includes("cake-template");
                }
            } catch (err) {
                //
            }
            if (test) {
                //
            } else {
                if (arr[i].getAttribute("type") == "file") {
                    files.push(arr[i]);
                } else {
                    cont.push(arr[i]);
                }
            }
        }
        if (files.length) {
            files.forEach((item) => {
                cont.push(item);
            });
            files = [];
        }
    }

    loop(textareas, controls);
    loop(selects, controls);
    loop(inputs, controls, true);

    let o = {};

    for (let i = 0; i < controls.length; i++) {
        let control = controls[i];
        let key = control.name || control.id;

        if (key && ["{{", "((", "[[", "<<", "%%", "&&"].includes(key)) {
            //
        } else {
            let type;
            let element = form[key];

            if (element) {
                if (element.nodeType) {
                    //
                } else if (element.length) {
                    for (let i = 0; i < element.length; i++) {
                        let el = element[i];
                        if (el.nodeType == 1) {
                            let test = el.closest(".cake-template");
                            if (test) {
                                //
                            } else {
                                element = el;
                                break;
                            }
                        }
                    }
                }

                const tag = element.tagName;
                let value = "";
                if (tag == "SELECT") {
                    value = element.value;
                } else if (
                    tag == "INPUT" &&
                    element.getAttribute("type") == "checkbox"
                ) {
                    value = element.checked;
                } else if (
                    tag == "INPUT" &&
                    element.getAttribute("type") == "file"
                ) {
                    value = element.files;
                } else {
                    if (options.sanitize == false) {
                        value = element.value;
                    } else {
                        value = this.sanitize(
                            element.value,
                            options.skipsanitize
                        );
                    }
                }

                if (options.json) {
                    if (options.trim) {
                        if (value != "") {
                            o[key] = value;
                        }
                    } else {
                        o[key] = value;
                    }
                } else {
                    o[key] = value;
                }
            }
        }
    }

    if (options.json) {
        return o;
    } else {
        let fd = new FormData();
        for (let key in o) {
            if (Object.prototype.hasOwnProperty.call(o, key)) {
                let value = o[key];

                if (value.constructor.name == "FileList") {
                    each(value, function (item, index) {
                        fd.append(key, item, item.name);
                    });
                } else {
                    fd.append(key, value);
                }
            }
        }
        return fd;
    }
}
function plot(config) {
    // let {data, container} = config;

    let data = config.data;
    let container = config.container;

    if (!data && !container) {
        return;
    }
    const query = (root, selector, callback) => {
        if (!root) {
            console.info("root is not provided!");
            return;
        }
        const els = root.querySelectorAll(`${selector}`);
        const len = els.length;
        if (!len) {
            callback(null, data);
            return; //exit;
        }
        for (let e = 0; e < len; e++) {
            let el = els[e];
            let name = el.name;
            let value = data[name];

            let r = callback(el, value, e);
            if (r == "break") {
                break;
            }
            if (r == "continue") {
                continue;
            }
        }
    };

    query(container, "INPUT.input", function (el, value) {
        if (!el) {
            return;
        }
        if (value != undefined) {
            if (el.type == "date") {
                value =
                    new Date(value) == "Invalid Date"
                        ? ""
                        : new Date(value).toJSON().split("T")[0];
                el.value = value;
            } else {
                el.value = value;
            }
        }
    });

    query(container, "TEXTAREA.input", function (el, value) {
        if (!el) {
            return;
        }
        if (value != undefined) {
            el.value = value;
        }
    });

    setTimeout(() => {
        query(
            container,
            "SELECT.input:not(.cake-template)",
            function (select, value) {
                if (!select) {
                    return;
                }
                // console.log(select);
                query(
                    select,
                    "OPTION:not(.cake-template)",
                    function (option, _value, index) {
                        // console.log(option)
                        if (option) {
                            if (option.value == value) {
                                select.selectedIndex = index;
                                return "break";
                            }
                        } else {
                            // console.trace();
                            // console.log(_value);
                            console.log(option, _value, "provide schema");
                            //provide schema
                        }
                    }
                );
            }
        );
    }, 100);

    return Promise.resolve();
}

export { toFormData, toUrlSearchParams, sanitize, plot };
