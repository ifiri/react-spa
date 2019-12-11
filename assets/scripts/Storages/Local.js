/**
 * Wrapper for work with local storage
 */
export default class LocalStorage {
    store(key, value) {
        localStorage.setItem(key, value);
    }

    getFromStore(key) {
        return localStorage.getItem(key);
    }

    unstore(key) {
        localStorage.removeItem(key);
    }
}