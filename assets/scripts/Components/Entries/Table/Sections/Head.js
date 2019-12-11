import React from 'react';

import PropTypes from 'prop-types';

import Entries from '../../../Entries';
import ConfigRepository from '../../../../Config/Repository';
import Common from './Common';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';


/**
 * Represent body section of table
 */
class Head extends Common {
    render() {
        return (
            <TableHead component="div" className="entries__header">
                { this.getTableHeading() }
            </TableHead>
        );
    }

    /**
     * Returns heading row layout
     * 
     * @return JSX
     */
    getTableHeading() {
        return (
            <Entries.Row isHeading={true}>
                { this.getCellLayouts() }
            </Entries.Row>
        );
    }

    /**
     * Returns array with all cell layouts.
     * Technically, just a wrapper over `getCellLayoutsBy`.
     * 
     * @return Array | null
     */
    getCellLayouts() {
        const { entriesType } = this.props;
        const cells = ConfigRepository.get('pages.' + entriesType + '.cells');

        if(!cells) {
            return null;
        }

        const cellLayouts = this.getCellLayoutsBy(cells, {
            isHeading: true
        });
        
        return cellLayouts;
    }
}

// Prop Types
Head.propTypes = {
    entriesType: PropTypes.string.isRequired, 
};

export default Head;