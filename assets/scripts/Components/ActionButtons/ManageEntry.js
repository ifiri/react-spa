import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';

import IconButton from '@material-ui/core/IconButton';
import EyeIcon from '@material-ui/icons/RemoveRedEye';

import PropTypes from 'prop-types';

/**
 * Open entry manage modal for entry in current table row.
 */
class ManageEntry extends React.Component {
    constructor(props) {
        super(props);

        this.openModal = this.openModal.bind(this);
    }

    render() {
        return (
            <IconButton onClick={this.openModal} className="action action_type_manage">
                <EyeIcon />
            </IconButton>
        );
    }

    getModalId() {
        return null;
    }

    openModal(event) {
        const modalId = this.getModalId();
        const { entry } = this.props;

        if(event.nativeEvent.which === 1 && modalId) {
            this.props.modalsActions.modalOpening(modalId, entry);
        }

        event.preventDefault();
    }
}

// Prop Types
ManageEntry.propTypes = {
    entry: PropTypes.object.isRequired,
    
    modalsActions: PropTypes.object.isRequired,
};

export default ManageEntry;

// Connection
// function mapDispatchToProps(dispatch) {
//     return {
//         modalsActions: bindActionCreators(modalsActions, dispatch)
//     };
// }

// export default connect(() => ({}), mapDispatchToProps)(ManageEntry);