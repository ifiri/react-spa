import React from 'react';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class Description extends Common {
    getCommonCellValue() {
        const description = this.getDefaultCellValue();

        return <div className="description">{description}</div>;
    }
}