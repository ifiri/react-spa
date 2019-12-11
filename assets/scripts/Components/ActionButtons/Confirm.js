import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

/**
 * Confirm button in confirm modal. Fire callback and close current modal.
 */
class Confirm extends React.Component {
    constructor(props) {
        super(props);

        this.dismissModal = this.dismissModal.bind(this);
    }

    /**
     * Click listener, just dismiss a modal and fire callback.
     *
     * @param {Event} event
     */
    dismissModal(event) {
        const modal = event.target.closest('.modal');

        if(modal && event.nativeEvent.which === 1) {
            const { callback } = this.props;
            const modalId = modal.getAttribute('id');

            if(typeof callback === 'function') {
                callback(true);
            }
            
            this.props.modalsActions.modalClosing(modalId);
        }
    }

    render() {
        return <Button variant="contained" color="primary" className="action action_type_ok actions__action" type="button" onClick={this.dismissModal}>
            Да
        </Button>;
    }
}

// Prop Types
Confirm.propTypes = {
    callback: PropTypes.func.isRequired,
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(Confirm);