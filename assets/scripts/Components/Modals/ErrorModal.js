import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withState } from '../Modals';

import ActionButtons from '../ActionButtons';

import CommonModal from './CommonModal';

/**
 * Modal for errors
 */
class ErrorModal extends CommonModal {
    constructor(props, context) {
        super(props, context);
    }

    getModalType() {
        return 'error';
    }

    getModalId() {
        return 'error-modal';
    }

    getModalContent() {
        const modalData = this.getModalData();

        return modalData.message || null;
    }

    getHeader() {
        const headerClass = 'modal__header';
        const data = this.getModalData();

        return (
            <div className={headerClass}>
                <h4 className="modal__title">Ошибка</h4>
            </div>
        );
    }

    getFooter() {
        return (
            <div className="modal__footer actions">
                <div>
                    <ActionButtons.OK />
                </div>
            </div>
        );
    }
}

// Prop Types
ErrorModal.propTypes = {
    form: PropTypes.func,
    formProps: PropTypes.object,
    modalId: PropTypes.string,
    isPreloaderRequired: PropTypes.bool,
    title: PropTypes.string,

    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

export default withState(ErrorModal);