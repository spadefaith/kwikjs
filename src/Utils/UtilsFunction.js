import {isUndefined} from "./UtilsIs";

function recurse(array, callback) {
    let l = array.length;
    let index = 0;
    let cache = [];
    return new Promise((res, rej) => {
        try {
            const _recurse = (callback) => {
                if (index < l) {
                    let item = array[index];

                    const called = callback(item, index);

                    if(isUndefined(called)) {
                        array = null;
                        res(cache);
                    } else if(called.then){
                        called.then((result) => {
                            index += 1;
                            cache.push(result);
    
                            _recurse(callback);
                        });
                    } else {
                        index += 1;
                        cache.push(called);
                        _recurse(callback);
                    }
                } else {
                    array = null;
                    res(cache);
                }
            };
            _recurse(callback);
        } catch (err) {
            rej(err);
        }
    });
}

export { recurse };
