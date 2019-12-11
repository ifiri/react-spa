import React from 'react';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class Rounded extends Common {
    getCommonCellValue() {
        const imageSrc = this.getDefaultCellValue();

        return <img src={imageSrc} className="rounded" />;
    }

    isCellContentShouldBeWrapped() {
        return false;
    }

    getHeadingCellValue() {
        return null;
    }
}