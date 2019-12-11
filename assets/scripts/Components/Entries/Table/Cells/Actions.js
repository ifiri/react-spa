import React from 'react';

import ActionButtons from '../../../ActionButtons';
import Common from './Common';

/**
 * Cell with some action buttons
 */
export default class Actions extends Common {
    /**
     * Returns value for TH cells
     * 
     * @return null
     */
    getHeadingCellValue() {
        return null;
    }

    isCellContentShouldBeWrapped() {
        return false;
    }

    /**
     * Returns value for TD cells
     * 
     * @return JSX | null
     */
    getCommonCellValue() {
        const cellParams = this.getCellParams();

        const CurrentAction = ActionButtons[cellParams.data[0]] || null;

        if(CurrentAction) {
            return <CurrentAction entry={this.entry} />;
        }

        return null;
    }
}