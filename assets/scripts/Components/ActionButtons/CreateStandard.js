import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';

import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

/**
 * Create button. Open modal with passed ID.
 */
class CreateStandard extends React.Component {
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
        const { modalId } = this.props;

        this.props.modalsActions.modalOpening(modalId);
    }

    render() {
        return (
            <div class="action action_type_createstandard">
                <Button variant="contained" color="inherit" className="action__btn" type="button" onClick={this.openModal}>
                    Добавить
                </Button>
            </div>
        );
    }
}

// Prop Types
CreateStandard.propTypes = {
    modalId: PropTypes.string.isRequired,
    bankId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(CreateStandard);