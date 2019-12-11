import LocalStorage from '../Storages/Local';

/**
 * Wrapper for storage. Helping class that provide
 * interface for auth and logout user in application layer.
 */
export default class Auth {
    constructor() {
        this.Storage = new LocalStorage;
    }

    /**
     * If user logged in, return true.
     * 
     * @return Boolean
     */
    check() {
        let isLoggedIn = this.Storage.getFromStore('isLoggedIn');

        if(isLoggedIn) {
            return true;
        }

        return false;
    }

    /**
     * Set user auth state to `logged in`
     * 
     * @return void
     */
    logUserInWith(token, expireAt) {
        this.Storage.store('isLoggedIn', true);
        this.Storage.store('token', token);
    }

    /**
     * Logout user from application
     * 
     * @return void
     */
    logout() {
        this.Storage.unstore('isLoggedIn');
        this.Storage.unstore('token');
    }
}