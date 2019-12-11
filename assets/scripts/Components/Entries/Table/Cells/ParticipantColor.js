import React from 'react';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class ParticipantsType extends Common {
    getCommonCellValue() {
        const types = {
            0: 'guest',
            1: 'participant',
            2: 'jury',
            3: 'curator'
        };

        const type = this.getDefaultCellValue();
        const alias = types[type] || '';

        return <div className={"color color_for_" + alias}></div>;
    }

    isCellContentShouldBeWrapped() {
        return false;
    }

    getHeadingCellValue() {
        return null;
    }
}