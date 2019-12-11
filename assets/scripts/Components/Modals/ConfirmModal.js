import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withState } from '../Modals';

import ActionButtons from '../ActionButtons';

import CommonModal from './CommonModal';

/**
 * Modal for user confirmations
 */
class ConfirmModal extends CommonModal {
    constructor(props, context) {
        super(props, context);
    }

    getModalType() {
        return 'confirm';
    }

    getModalId() {
        return 'confirm-modal';
    }

    getModalContent() {
        const modalData = this.getModalData();

        return modalData.message || null;
    }

    getHeader(data) {
        const headerClass = 'modal__header';

        return (
            <div className={headerClass}>
                <h4 className="modal__title">Подтверждение</h4>
            </div>
        );
    }

    /**
     * In this case we need footer with close and confirm actions
     * In confirm we pass callback which should be passed in props
     * 
     * @return JSX
     */
    getFooter() {
        const { callback = null } = this.getModalData() || {};

        return (
            <div className="modal__footer actions">
                <div>
                    <ActionButtons.Cancel />
                    <ActionButtons.Confirm callback={callback} />
                </div>
            </div>
        );
    }
}

ConfirmModal.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

export default withState(ConfirmModal);