import React from 'react';

import PropTypes from 'prop-types';

import Entries from '../../../Entries';

/**
 * Abstract component for all table sections.
 */
class Common extends React.Component {
    render() {
        return null;
    }

    getCellLayouts() {
        return null;
    }

    /**
     * Returns array with all passed cells layouts.
     * 
     * @param  cells Array
     * @param  props Object
     * @return Array
     */
    getCellLayoutsBy(cells, props = {}) {
        const { entriesType, state, onSortTriggerClick = null } = this.props;
        
        let cellLayouts = [];

        // Here we go...
        for(const cellAlias in cells) {
            const cellParams = cells[cellAlias];
            const isVisible = cellParams.heading || true;

            // If cell should not be visible, out
            if(!isVisible) {
                continue;
            }

            // Get cell component by cell type. If component for current type
            // is not exists, will using Common component.
            const cellComponent = this.getCellComponentBy(cellParams.type);
            const CurrentCell = cellParams.type ? Entries.Cells[cellComponent] : Entries.Cells.Common;

            cellLayouts.push((
                <CurrentCell
                    key={cellAlias} 
                    alias={cellAlias} 
                    entriesType={entriesType} 
                    state={state} 
                    onSortTriggerClick={onSortTriggerClick}

                    {...props}
                />
            ));
        }
        
        return cellLayouts;
    }

    /**
     * Return cell component alias. Component alias is not the same
     * with cell alias, because component name can not have special symbols
     * and should be capitalized.
     * 
     * @param  type String
     * @return String
     */
    getCellComponentBy(type) {
        type = type || 'common';

        return type.toLowerCase().replace(/\b([\w\d]+?)\b/gi, word => {
            const firstLetter = word[0];

            return firstLetter.toUpperCase() + word.slice(1);
        }).replace(/(\/||_)/g, '');
    }
}

// Prop Types
Common.propTypes = {
    onSortTriggerClick: PropTypes.func,
    entriesType: PropTypes.string.isRequired, 

    state: PropTypes.object.isRequired,
};

export default Common;