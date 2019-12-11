import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import PropTypes from 'prop-types';

/**
 * Deleting entry. Using in page components, rendering after list component.
 */
class Delete extends React.Component {
    /**
     * Render button layout. If button should be hidden, add `display: none`
     */
    render() {
        const isButtonHidden = false; // this.isButtonShouldBeHidden();
        const { onClick } = this.props;

        // className="action action_type_entry-delete"
        return <Button variant="outlined" color="secondary" className="action action_type_delete" type="button" onClick={onClick}>
            Удалить
        </Button>;
    }

    /**
     * Determine should button be hidden or not.
     * Button should be hidden when status of almost one of selected
     * entries is `active`, or when no entries found.
     * 
     * @return Boolean
     */
    isButtonShouldBeHidden() {
        const { state, entriesType } = this.props;

        const selectedEntries = state.selected;
        const currentEntries = state[entriesType];

        let isButtonHidden = false;

        // Check current entries, if exists, check selected entries
        if(!currentEntries || !currentEntries.items || currentEntries.items.length === 0) {
            isButtonHidden = true;
        } else {
            for(const index in selectedEntries) {
                const entry = selectedEntries[index];

                const status = entry.status || entry.status_code;

                // If status is `active`
                // if(status === Statuses.ENTRY_ACTIVE) {
                //     isButtonHidden = true;
                //     break;
                // }
            }
        }

        return isButtonHidden;
    }
}

// Prop Types
Delete.propTypes = {
    onClick: PropTypes.func.isRequired,
    entriesType: PropTypes.string.isRequired,

    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

// Connection
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Delete);