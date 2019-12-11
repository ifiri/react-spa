import React from 'react';
import Redirect from '../../../Routing/Redirect';
import TableRow from '@material-ui/core/TableRow';

import PropTypes from 'prop-types';

/**
 * Row of entries table
 */
class Row extends React.Component {
    constructor(props) {
        super(props);

        this.onRowClick = this.onRowClick.bind(this);
    }

    render() {
        const attributes = this.getRowAttributes();

        return (
            <TableRow component="div" {...attributes}>
                {this.props.children}
            </TableRow>
        );
    }

    /**
     * Row click handler. If row have a modal, open it.
     * 
     * @param  event Object
     * @return void
     */
    onRowClick(event) {
        const { modal = null, redirect = null, entry, modalsActions } = this.props;
        const element = event.target;

        const isPreventModal = element.dataset.preventModal || element.closest('[data-prevent-modal="true"]');

        if(event.nativeEvent.which === 1 && !element.dataset.check && !isPreventModal) {
            if(modal) {
                modalsActions.modalOpening(modal, entry);
            } else if(redirect) {
                const RowRedirect = new Redirect(redirect, entry);

                RowRedirect.execute();
            }
        }
    }

    /**
     * Build and return attributes for row. Usually,
     * all row attributes is `onClick` handler for modal opening.
     * Also get classname.
     * 
     * @return Object
     */
    getRowAttributes() {
        const { modal = null, redirect = null } = this.props;
        const classes = this.getRowClasses();

        let attributes = {
            className: classes.join(' ')
        };

        if(modal || redirect) {
            attributes['onClick'] = this.onRowClick;
        }

        return attributes;
    }

    /**
     * Build and return classes for current table row.
     * 
     * @return Array
     */
    getRowClasses() {
        const { entry, isHeading = false } = this.props;
        // const selected = (this.props.state && this.props.state.selected) || [];

        let classes = ['entries__row'];

        // Determine, active (selected) current row or not.
        let isActive = false;
        if(entry) {
            // For it try to find entry in selected entries
            // const entryIndexByUniq = selected.findIndex(element => {
            //     if(element._uniq && element._uniq === entry._uniq) {
            //         return element;
            //     }
            // });
            
            // if(~entryIndexByUniq) {
            //     isActive = true;
            // }
        }

        // If current row is heading row, add special modificator
        if(isHeading) {
            classes.push('entries__row_heading');
        } else if(isActive) {
            // classes.push('entries__active');
        }

        return classes;
    }
}

// Prop Types
Row.propTypes = {
    modal: PropTypes.string,
    entry: PropTypes.object,
    isHeading: PropTypes.bool,

    state: PropTypes.object,
    modalsActions: PropTypes.object,
};

export default Row;