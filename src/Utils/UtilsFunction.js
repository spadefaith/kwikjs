function recurse(array, callback) {
    let l = array.length;
    let index = 0;
    let cache = [];
    return new Promise((res, rej) => {
        try {
            const _recurse = (callback) => {
                if (index < l) {
                    let item = array[index];
                    callback(item, index).then((result) => {
                        index += 1;
                        cache.push(result);

                        _recurse(callback);
                    });
                } else {
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
