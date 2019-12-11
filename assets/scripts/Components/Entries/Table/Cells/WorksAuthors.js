import React from 'react';

import UserEntity from '../../../../User/Entity';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class WorksAuthors extends Common {
    getCommonCellValue() {
        const users = this.getDefaultCellValue();

        const authors = [];
        for(const i in users) {
            const nominee = users[i];

            const User = new UserEntity(nominee);

            const shortname = User.getShortname();
            authors.push(shortname);
        }

        return authors.join(', ');
    }
}