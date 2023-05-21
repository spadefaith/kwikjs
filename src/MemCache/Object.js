// Object.cache = Object.create(null);

// Object.caching = (name) => {
//     const obj = Object.cache;
//     if (!obj[name]) {
//         obj[name] = {};
//     }

//     return {
//         set(key, value) {
//             obj[name][key] = value;
//             return true;
//         },
//         get(key) {
//             return obj[name][key];
//         },
//     };
// };

let storage = {};
export default function (name) {
    
    if (!storage[name]) {
        storage[name] = {};
    }
    return {
        set(key, value) {
            storage[name][key] = value;
            return true;
        },
        push(key, value) {
            if (!storage[name][key]) {
                storage[name][key] = [];
            }
            storage[name][key].push(value);
        },
        get(key) {
            if (key) {
                return storage[name][key];
            } else {
                return storage[name];
            }
        },
        getAll(){
            return storage[name];
        },
        destroy(key) {
            if (key) {
                delete storage[name][key];
            } else {
                storage[name] = {};
            }
            return true;
        },
    };
}
