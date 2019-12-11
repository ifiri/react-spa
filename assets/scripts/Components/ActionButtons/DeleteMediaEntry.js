import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';
import * as modalsActions from '../../Actions/ModalsActions';

import PropTypes from 'prop-types';

/**
 * Deleting entry. Using in page components, rendering after list component.
 */
class DeleteMediaEntry extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    /**
     * Reset and delete current dynamic field item.
     * First, open confirm modal, if user want to delete item,
     * fires reset function and (optional) fires passed callback.
     * 
     * @param  {Object} entry
     * @param  {Event} event
     * @return {void}
     */
    onClick(event) {
        const { onDeleteCallback, message = 'Удалить?' } = this.props;

        if(onDeleteCallback) {
            this.props.modalsActions.modalOpening('confirm-modal', {
                message: message,
                callback: result => {
                    onDeleteCallback(result);
                }
            })
        }

        event.preventDefault();
    }

    /**
     * Render button layout.
     */
    render() {
        return (
            <a href="#" className="media-grid__delete" onClick={this.onClick}>
                <i className="fas fa-times"></i>
            </a>
        );
    }
}

// Prop Types
DeleteMediaEntry.propTypes = {
    onClick: PropTypes.func.isRequired,
    entriesType: PropTypes.string.isRequired,

    state: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

function mapDispatchToProps(dispatch) {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch),
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMediaEntry);