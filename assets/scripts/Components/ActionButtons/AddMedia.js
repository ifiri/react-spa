import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

/**
 * Create button. Open modal with passed ID.
 */
class AddMedia extends React.Component {
    constructor(props) {
        super(props);

        this.openModal = this.openModal.bind(this);
    }

    /**
     * Click listener, just open a modal.
     *
     * @param {Event} event
     */
    openModal(event) {
        this.props.modalsActions.modalOpening('add-media-modal');
    }

    render() {
        const { caption = 'Добавить' } = this.props;

        return <Button variant="contained" color="primary" className="action action_type_add-media" type="button"  onClick={this.openModal}>
            <span className="action__label">{ caption }</span>
        </Button>;
    }
}

// Prop Types
AddMedia.propTypes = {
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(AddMedia);