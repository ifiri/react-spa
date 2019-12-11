import React from 'react';

import RowChecker from '../../RowChecker';
import Common from './Common';

/**
 * Cell with row checker inside
 */
export default class Check extends Common {
    /**
     * In heading cell return all-checking row checker
     * 
     * @return JSX | null
     */
    getHeadingCellValue() {
        const alias = this.getCellAlias();
        const cellParams = this.getCellParams();

        // return null if cell params is empty or not found
        if(!cellParams) {
            return null;
        }

        const id = "id" + alias + this.entriesType;

        return <RowChecker 
            key={id} 
            mode="all" 
            id={id} 
            entry={this.entry}
            type={this.entriesType}
        />;
    }

    /**
     * In common cells, return row checker that binded to current entry
     * 
     * @return JSX
     */
    getCommonCellValue() {
        const id = "id" + this.getEntryKey() + this.entriesType;

        return <RowChecker 
            mode="current" 
            key={id} 
            id={id} 
            entry={this.entry}
            type={this.entriesType}
        />;
    }
}