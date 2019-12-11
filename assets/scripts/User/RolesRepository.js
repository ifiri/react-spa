import LocalStorage from '../Storages/Local';

/**
 * Repository for user roles. At this moment,
 * roles store in this class by hardcode.
 */
export default class RolesRepository {
    constructor() {
        this.roles = [
            {
                title: 'Администратор',
                alias: 'ROLE_ADMIN'
            },
            {
                title: 'Пользователь',
                alias: 'ROLE_USER'
            },
            {
                title: 'Администратор банка',
                alias: 'ROLE_BANK_ADMIN'
            }
        ];
    }

    /**
     * Return all roles
     * 
     * @return Array
     */
    getRoles() {
        return this.roles;
    }

    /**
     * Find role by passed alias and return its title if role found
     * 
     * @param  alias String
     * @return String | null
     */
    getRoleTitleByAlias(alias) {
        for(const index in this.roles) {
            const role = this.roles[index];

            if(alias === role.alias) {
                return role.title;
            }
        }

        return null;
    }
}