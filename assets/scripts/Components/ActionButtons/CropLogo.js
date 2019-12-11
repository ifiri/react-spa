import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

/**
 * Cropping button in crop modal. Fire special callback and dismiss current modal.
 */
class CropLogo extends React.Component {
    constructor(props) {
        super(props);

        this.dismissModal = this.dismissModal.bind(this);
    }

    dismissModal(event) {
        const modal = event.target.closest('.modal');

        if(modal && event.nativeEvent.which === 1) {
            const modalId = modal.getAttribute('id');
            const { onCropCallback } = this.props;

            let result = true;
            if(onCropCallback) {
                result = onCropCallback();
            }

            if(result) {
                this.props.modalsActions.modalClosing(modalId);
            }
        }
    }

    render() {
        return <Button variant="contained" color="primary" className="action action_type_crop actions__action" type="button" onClick={this.dismissModal}>
            Обрезать
        </Button>;
    }
}

// Prop Types
CropLogo.propTypes = {
    onCropCallback: PropTypes.func.isRequired,
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(CropLogo);