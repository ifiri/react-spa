import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withState } from '../Modals';

import ActionButtons from '../ActionButtons';

import CommonModal from './CommonModal';

/**
 * Modal for notices.
 */
class NoticeModal extends CommonModal {
    constructor(props, context) {
        super(props, context);
    }

    getModalType() {
        return 'notice';
    }

    getModalId() {
        const passedModalId = super.getModalId();

        return passedModalId || 'notice-modal';
    }

    getModalContent() {
        const modalData = this.getModalData();

        return modalData.message || this.props.children || null;
    }

    getHeader() {
        const headerClass = 'modal__header';
        const data = this.getModalData();

        return (
            <div className={headerClass}>
                <h4 className="modal__title">Уведомление</h4>
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
NoticeModal.propTypes = {
    form: PropTypes.func,
    formProps: PropTypes.object,
    modalId: PropTypes.string,
    isPreloaderRequired: PropTypes.bool,
    title: PropTypes.string,

    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

export default withState(NoticeModal);