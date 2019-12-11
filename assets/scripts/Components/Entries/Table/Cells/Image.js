import React from 'react';

import Common from './Common';

/**
 * Cell with image inside
 */
export default class Image extends Common {
    getCommonCellValue() {
        const imageSrc = this.getDefaultCellValue();

        return <img src={imageSrc} className="logo" />;
    }

    isCellContentShouldBeWrapped() {
        return false;
    }

    getHeadingCellValue() {
        return null;
    }
}