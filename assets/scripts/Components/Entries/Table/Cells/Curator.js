import React from 'react';

import UserEntiry from '../../../../User/Entity';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class Curator extends Common {
    getCommonCellValue() {
        const curator = this.getDefaultCellValue();

        if(curator) {
            const User = new UserEntiry(curator);

            return User.getShortname();
        }

        return null;
    }
}