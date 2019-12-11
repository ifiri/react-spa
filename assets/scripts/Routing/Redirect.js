import createHistory from 'history/createHashHistory';

/**
 * Repository for routes. Provides interface for
 * getting routes by access level and route index by route.
 */
export default class Redirect {
    constructor(redirect, map = {}) {

        this.redirect = this.getFullqualifiedRedirect(redirect, map);
        this.history = createHistory();
    }

    getFullqualifiedRedirect(redirect, map) {
        const fullqualifiedRedirect = redirect.replace(/%([\w\.]+)%/g, (match, group) => {
            const groupParts = group.split('.');
            let isMatchFound = false;

            let currentStack = map;
            for(const index in groupParts) {
                currentStack = (groupParts[index] in currentStack) && currentStack[groupParts[index]];

                isMatchFound = true;
            }

            return isMatchFound ? currentStack : '';
        });

        return fullqualifiedRedirect;
    }

    execute() {
        if(this.redirect) {
            this.history.push(this.redirect);
        }
    }
}