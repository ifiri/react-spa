import React from 'react';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class ParticipantsType extends Common {
    getCommonCellValue() {
        const types = {
            0: 'Гость',
            1: 'Участник',
            2: 'Член конкурсной комиссии',
            3: 'Куратор'
        };

        const type = this.getDefaultCellValue();

        return (type in types) ? types[type] : types[0];
    }
}