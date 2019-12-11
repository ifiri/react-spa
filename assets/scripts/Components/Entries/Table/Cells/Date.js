import React from 'react';

import RFCDateEntity from '../../../../Date/RFCDateEntity';
import Common from './Common';

/**
 * Cell for datetime values. Render formatted date.
 */
export default class Date extends Common {
    getCommonCellValue() {
        const cellValue = this.getDefaultCellValue();

        if(cellValue) {
            const DateEntity = new RFCDateEntity(cellValue, '+06:00');

            return DateEntity.getReadableDate();
        }

        return null;
    }
}