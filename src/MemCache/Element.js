export default function (name) {
    let storage = document.querySelector(`[data-cache=${name}]`);
    if (!storage) {
        let el = document.createElement("div");
        el.dataset.cache = name;
        document.head.append(el);
        storage = el;
    }
    let key = "_cakes_storage";
    !storage[key] && (storage[key] = {});

    let cache = storage[key];
    return {
        set(key, value) {
            cache[key] = value;
        },
        get(key) {
            return cache[key];
        },
        getAll() {
            return cache;
        },
        remove(key) {
            delete cache[key];
        },
    };
}
