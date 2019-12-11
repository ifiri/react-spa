import store from '../store';

import RolesRepository from './RolesRepository';

/**
 * Base user class. Store itself all user-related properties.
 * Provide interface for getting any information about user.
 */
export default class Entity {
    /**
     * User entity builds from passed user data.
     * If no data provided, entity will builded by data from state.
     * 
     * @param  userData Object | null
     * @return void
     */
    constructor(userData = null) {
        if(!userData) {
            const state = store.getState();

            userData = (state.auth && state.auth.data) || {};
        }

        this.data = userData;

        // default predefined role
        this.role = 'ROLE_ADMIN';
    }

    /**
     * Return user login
     * 
     * @return String | null
     */
    getLogin() {
        const { login = null } = this.data;

        return login;
    }

    /**
     * Return user shortname. Shortname is a surname
     * with first letters of name and patronymic.
     * F.e., Ivanov I.I.
     *
     * If user haven't enough data for shortname,
     * return empty string.
     * 
     * @return String
     */
    getShortname() {
        const fullname = this.getFullname();

        if(!fullname) {
            return '';
        }

        const nameParts = fullname.split(' ');
        const surname = nameParts[0];
        const name = nameParts[1] || null;
        const patronymic = nameParts[2] || null;

        let shortName = surname + ' ';

        if(name && name.slice) {
            shortName += name.slice(0, 1) + '.';
        }

        if(patronymic && patronymic.slice) {
            shortName += patronymic.slice(0, 1) + '.';
        }

        return shortName;
    }

    /**
     * Returns user fullname.
     * 
     * @return String
     */
    getFullname() {
        const data = this.data;

        let fullname = '';
        if(data['name'] || data['sirname'] || data['patronymic']) {
            fullname = [
                data['sirname'] || '',
                data['name'] || '',
                data['patronymic'] || '',
            ].join(' ').trim();
        }

        return fullname;
    }

    /**
     * Return title of user role.
     * 
     * @return String | null
     */
    getRoleTitle() {
        const RolesRepositoryInstance = new RolesRepository();

        const role = this.getRole();
        const title = RolesRepositoryInstance.getRoleTitleByAlias(role);

        return title;
    }

    /**
     * Return user role alias.
     * If user haven't any role, default guest role
     * will be returned.
     * 
     * @return String
     */
    getRole() {
        // const { roles = {} } = this.data;

        // return roles[0] || 'ROLE_GUEST';
        // 
        return this.role;
    }

    /**
     * If user not guest, returns true.
     * Otherwise returns false.
     * 
     * @return Boolean
     */
    isHaveAnyAccess() {
        return this.getRole() === 'ROLE_GUEST' ? false : true;
    }

    /**
     * Returns true if user is admin
     * 
     * @return Boolean
     */
    isAdmin() {
        return this.getRole() === 'ROLE_ADMIN';
    }

    /**
     * Returns true if user is bank manager
     * 
     * @return Boolean
     */
    isBankManager() {
        return this.getRole() === 'ROLE_BANK_ADMIN';
    }

    /**
     * Returns true if user is just an user
     * 
     * @return Boolean
     */
    isUser() {
        return this.getRole() === 'ROLE_USER';
    }
}