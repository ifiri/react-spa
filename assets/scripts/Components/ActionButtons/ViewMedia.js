import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EyeIcon from '@material-ui/icons/RemoveRedEye';

import PropTypes from 'prop-types';

/**
 * Open bank client manage modal for entry in current table row.
 * Using in bank clients list.
 */
class ViewMedia extends React.Component {
    constructor(props) {
        super(props);

        this.openViewModal = this.openViewModal.bind(this);
    }

    render() {
        return (
            <Button variant="contained" onClick={this.openViewModal} className="file-select__view">
                <EyeIcon />
            </Button>
        );
    }

    openViewModal(event) {
        const modalId = 'view-modal';
        const { source } = this.props;

        if(event.nativeEvent.which === 1) {
            this.props.modalsActions.modalOpening(modalId, {
                source: source
            });
        }

        event.preventDefault();
    }
}

// Prop Types
ViewMedia.propTypes = {
    entry: PropTypes.object,
    
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(ViewMedia);