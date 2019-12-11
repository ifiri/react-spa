import React from 'react';

import UserEntity from '../../../../User/Entity';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class NomineesAuthors extends Common {
    getCommonCellValue() {
        const participants = this.getDefaultCellValue();

        const authors = [];
        for(let i in participants) {
            let nominee = participants[i];

            const User = new UserEntity(nominee);

            const shortname = User.getShortname();
            authors.push(shortname);
        }

        return authors.join(', ');
    }
}