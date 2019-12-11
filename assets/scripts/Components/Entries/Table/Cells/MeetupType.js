import React from 'react';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class MeetupType extends Common {
    getCommonCellValue() {
        const types = {
            0: 'Конкурс',
            1: 'Конференция'
        };

        const meetupType = parseInt(this.getDefaultCellValue());

        return (meetupType in types) ? types[meetupType] : null;
    }
}