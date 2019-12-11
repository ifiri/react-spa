import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

/**
 * Similar to `Cancel`, but have another layout.
 */
class OK extends React.Component {
    constructor(props) {
        super(props);

        this.dismissModal = this.dismissModal.bind(this);
    }

    render() {
        return <Button variant="contained" color="primary" className="action action_type_ok actions__action" type="button" onClick={this.dismissModal}>
            OK
        </Button>;
    }

    dismissModal(event) {
        const modal = event.target.closest('.modal');

        if(modal && event.nativeEvent.which === 1) {
            const modalId = modal.getAttribute('id');
            
            this.props.modalsActions.modalClosing(modalId);
        }
    }
}

// Prop Types
OK.propTypes = {
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(OK);