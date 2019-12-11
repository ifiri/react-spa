import React from 'react';

import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import { withStyles } from '@material-ui/core/styles';
import Entries from '../../../Entries';
import ConfigRepository from '../../../../Config/Repository';
import UserEntity from '../../../../User/Entity';

import Common from './Common';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

/**
 * Represent body section of table
 */
class Body extends Common {
    render() {
        const { entries } = this.props;

        if(!entries) {
            return null;
        }

        return (
            <TableBody component="div" className="entries__list sort__list">
                { this.getTableRows() }
            </TableBody>
        );
    }

    /**
     * Returns array with all table rows layouts, or null if table is empty.
     * 
     * @return Array | null
     */
    getTableRows() {
        const { entries } = this.props;

        if(entries) {
            let tableRows = [];

            for(const entry of entries) {
                tableRows.push(this.getRowLayoutFor(entry));
            }

            return tableRows;
        }

        return null;
    }

    /**
     * Returns JSX layout for passed entry.
     * 
     * @param  entry Object
     * @return JSX
     */
    getRowLayoutFor(entry) {
        const { entriesType, modalsActions, state } = this.props;

        // Get key field of current cell
        const { 
            keyField = '_uniq' 
        } = ConfigRepository.get('pages.' + entriesType) || {};

        // And prepare unique key of current cell
        const key = (
            entry[keyField] && entry[keyField]
        ) || null;

        // Get modal for current row
        const modal = this.getModalForCurrentRow(entry);
        const redirect = this.getRedirectForCurrentRow(entry);
        const cells = this.getCellLayouts(entry);

        return (
            <Entries.Row 
                key={key} 
                entry={entry} 
                modal={modal} 
                redirect={redirect} 
                modalsActions={modalsActions}
                state={state}
            >
                {cells}
            </Entries.Row>
        );
    }

    getRedirectForCurrentRow(entry) {
        const { entriesType } = this.props;
        const { redirects = {} } = ConfigRepository.get('pages.' + entriesType);

        const redirectBy = redirects.by || null;
        const rowRedirects = this.getRowRedirectFrom(redirects);

        let redirect = rowRedirects;
        if(typeof rowRedirects === 'object') {
            redirect = null;

            if(redirectBy) {
                const redirectByValue = entry[redirectBy] || null;

                if(redirectByValue && redirectByValue in rowRedirects) {
                    redirect = rowRedirects[redirectByValue];
                }
            }
        }

        return redirect;
    }

    /**
     * If in config for curren entries type there is `modals` property
     * with `row` subproperty in, we have a modal which should be opening
     * by click on row. So in this method we check it and return modal ID.
     * 
     * @param  entry Object
     * @return String | Array
     */
    getModalForCurrentRow(entry) {
        const { entriesType } = this.props;
        const { modals = {} } = ConfigRepository.get('pages.' + entriesType);

        const modalBy = modals.by || null;
        const rowModals = this.getRowModalFrom(modals);

        let modal = rowModals;
        if(typeof rowModals === 'object') {
            modal = null;

            if(modalBy) {
                const modalByValue = entry[modalBy] || null;

                if(modalByValue && modalByValue in rowModals) {
                    modal = rowModals[modalByValue];
                }
            }
        }

        return modal;
    }

    /**
     * Get modal which should be opening by row click
     * from all row modals. Also check user level and, if it possible,
     * get modal only for required user level.
     * 
     * @param  modals Array
     * @return String | null
     */
    getRowModalFrom(modals) {
        const User = new UserEntity();
        const accessLevel = User.getRole();

        if(modals.row) {
            return modals.row;
        }

        if(accessLevel && modals[accessLevel]) {
            return modals[accessLevel].row || null;
        }

        return null;
    }

    /**
     * Get redirect which should be executed by row click
     * from all row modals. Also check user level and, if it possible,
     * get modal only for required user level.
     * 
     * @param  redirects Array
     * @return String | null
     */
    getRowRedirectFrom(redirects) {
        const User = new UserEntity();
        const accessLevel = User.getRole();

        if(redirects.row) {
            return redirects.row;
        }

        if(accessLevel && redirects[accessLevel]) {
            return redirects[accessLevel].row || null;
        }

        return null;
    }

    /**
     * Returns array with all cell layouts for current entry.
     * Technically, just a wrapper over `getCellLayoutsBy`.
     * 
     * @param  entry Object
     * @return Array | null
     */
    getCellLayouts(entry) {
        const { entriesType, entries } = this.props;
        const cells = ConfigRepository.get('pages.' + entriesType + '.cells');

        if(!cells) {
            return null;
        }

        const cellLayouts = this.getCellLayoutsBy(cells, {
            entry: entry,
            entries: entries
        });

        return cellLayouts;
    }
}

// Prop Types
Body.propTypes = {
    entries: PropTypes.array,
    entriesType: PropTypes.string.isRequired, 

    state: PropTypes.object.isRequired,
    modalsActions: PropTypes.object.isRequired,
};

export default withStyles(styles)(Body);