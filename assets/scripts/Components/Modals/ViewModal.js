import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withState } from '../Modals';

import ActionButtons from '../ActionButtons';

import CommonModal from './CommonModal';
import CommonUtils from '../../Utils/Common';

/**
 * Modal for notices.
 */
class ViewModal extends CommonModal {
    constructor(props, context) {
        super(props, context);

        this.viewElement = null;
        this.viewSource = null;

        this.setViewElement = this.setViewElement.bind(this);
    }

    setViewElement(element) {
        this.viewElement = element;
    }

    getModalType() {
        return 'notice';
    }

    getModalId() {
        const passedModalId = super.getModalId();

        return passedModalId || 'view-modal';
    }

    getModalContent() {
        const modalData = this.getModalData();
        const source = modalData && modalData.source;

        let modalContent = null;

        let sourceType = null;
        if(source) {
            if(typeof source === 'object') {
                sourceType = source.type;
            } else {
                const parts = source.split('.');

                sourceType = CommonUtils.removeQueryArgsFrom(parts[parts.length - 1]);
            }

            switch(sourceType.toLowerCase()) {
                case 'video/mp4':
                    if(!this.viewSource) {
                        const reader = new FileReader();
                        reader.onload = event => {
                            // if(this.viewElement) {
                                // const viewSource = this.viewElement.querySelector('source');

                                this.viewSource = event.target.result;
                            // }
                        };

                        reader.readAsDataURL(source);
                    } else {
                        modalContent = <video className="viewing viewing_type_video" preload="metadata" ref={this.setViewElement} controls>
                            <source type="video/mp4" src={this.viewSource} />
                        </video>;
                    }

                    break;

                case 'mp4':
                    modalContent = <video className="viewing viewing_type_video" preload="metadata" controls>
                        <source src={source} />
                    </video>;
                    break;

                case 'jpg':
                case 'jpeg':
                case 'png':
                    modalContent = <img src={source} className="viewing viewing_type_image" />;
                    break;

                case 'image/jpeg':
                case 'image/png':
                    if(!this.viewElement) {
                        const reader = new FileReader();
                        reader.onload = event => {
                            if(this.viewElement) {
                                this.viewElement.src = event.target.result;
                            }
                        };

                        reader.readAsDataURL(source);
                    }

                    modalContent = <img ref={this.setViewElement} className="viewing viewing_type_image" />;
                    break;
            }
        }

        return modalContent;
    }

    getHeader() {
        return null;
    }

    getFooter() {
        return null;
    }
}

// Prop Types
ViewModal.propTypes = {
    modalId: PropTypes.string,
    isPreloaderRequired: PropTypes.bool,
    title: PropTypes.string,

    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

export default withState(ViewModal);