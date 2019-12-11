import React from 'react';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class EventType extends Common {
    getCommonCellValue() {
        const types = {
            0: 'Обычное',
            1: 'Перерыв'
        };

        const eventType = parseInt(this.getDefaultCellValue());

        return (eventType in types) ? types[eventType] : types[0];
    }
}