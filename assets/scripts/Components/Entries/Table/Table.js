import React from 'react';
import Table from '@material-ui/core/Table';

import PropTypes from 'prop-types';

/**
 * Represent table in entries list.
 */
class zTable extends React.Component {
    render() {
        const className = this.getTableClassName();

        return (
            <Table component="div" className={className} data-check-group>
                {this.props.children}
            </Table>
        );
    }

    /**
     * Returns fullqualified table classname
     * 
     * @return string
     */
    getTableClassName() {
        const classes = ['entries', 'sort'];
        const { tableType, modifier } = this.props;

        if(tableType) {
            const formattedType = tableType.replace(/\//g, '_');

            classes.push('entries_type_' + formattedType);
        }

        if(modifier) {
            classes.push('entries_' + modifier);
        }

        return classes.join(' ');
    }
}

// Prop Types
zTable.propTypes = {
    tableType: PropTypes.string,
    modifier: PropTypes.string,
};

export default zTable;