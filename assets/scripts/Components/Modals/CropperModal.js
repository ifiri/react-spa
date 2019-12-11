import React from 'react';
import PropTypes from 'prop-types';

import ActionButtons from '../ActionButtons';

import CommonModal from './CommonModal';
import { withState } from '../Modals';

/**
 * Modal for cropping images
 */
class CropperModal extends CommonModal {
    constructor(props, context) {
        super(props, context);

        // Get params for Cropper from props
        const { cropperParams = {}, boxRestrict = {} } = this.props || {};

        // Image which we will crop, scaled and visible
        this.cropperImg = null;

        // Invisible image which will store unscaled cropped image
        this.storeImg = null;

        // Link to cropper instance
        this.cropper = null;

        // Store itself coordinates and sizes of cropped area
        this.cropData = null;

        this.setCropperImgRef = this.setCropperImgRef.bind(this);
        this.setStoreRef = this.setStoreRef.bind(this);

        // This callback fires after crop
        this.onCropCallback = this.onCropCallback.bind(this);

        // Restriction of minimal crop size
        this.boxRestrict = {
            width: 20,
            height: 20,

            ...boxRestrict
        }

        // Params for cropper, see more on Github
        this.cropperParams = {
            viewMode: 1,
            dragMode: 'move',
            // aspectRatio: 1,
            rotatable: false,
            zoomable: false,

            ...cropperParams,
        };
    }

    /**
     * On every update check modal status and init Cropper,
     * if modal opened and image is loaded.
     * 
     * @param  {Object} prevProps
     * @return {void}
     */
    componentDidUpdate(prevProps) {
        super.componentDidUpdate(prevProps);

        const { state: currentState } = this.props;
        const currentModalStatus = this.getModalStatusFrom(currentState);

        if(currentModalStatus === 'opened' && this.cropperImg) {
            const data = this.getModalData();

            const width = this.cropperImg.scrollWidth;
            const height = this.cropperImg.scrollHeight;

            this.cropper = new Cropper(this.cropperImg, {
                ...this.cropperParams,

                crop: event => {
                    this.cropData = {
                        top: event.detail.y,
                        left: event.detail.x,
                        bottom: event.detail.y + event.detail.height,
                        right: event.detail.x + event.detail.width,

                        width: event.detail.width,
                        height: event.detail.height,
                    }
                },
            });
        }
    }

    componentWillUnmount() {
        const modalData = this.getModalData();

        if(!modalData) {
            return;
        }

        const { fitImageOn, canvas, storeCanvas } = modalData;

        storeCanvas.width = this.cropData.width;
        storeCanvas.height = this.cropData.height;

        fitImageOn(storeCanvas, this.cropperImg, this.cropData);
    }

    /**
     * After every crop check size of cropped area. If there are some restrictions,
     * and size of cropped area is not in, show warning modal and out.
     *
     * Otherwise, update canvas, which should be passed in modal data.
     * 
     * @param  {event} event
     * @return {Boolean}
     */
    onCropCallback(event) {
        const { fitImageOn, canvas, storeCanvas } = this.getModalData();

        if(fitImageOn) {
            if(this.boxRestrict.width && this.boxRestrict.height) {
                if(this.cropData.width < this.boxRestrict.width || this.cropData.height < this.boxRestrict.height) {
                    this.props.actions.modalOpening('notice-modal', {
                        message: 'Обрезанное изображение слишком маленькое! Выберите участок размером не менее 200х200 пикселов'
                    });

                    return false;
                }
            }

            storeCanvas.width = this.cropData.width;
            storeCanvas.height = this.cropData.height;

            canvas.width = 70;
            canvas.height = 70;

            fitImageOn(canvas, this.cropperImg, this.cropData);
            fitImageOn(storeCanvas, this.cropperImg, this.cropData);

            return true;
        }

        return false;
    }

    /**
     * In footer we output cropping button
     * 
     * @return {JSX}
     */
    getFooter() {
        return (
            <div className="modal__footer actions">
                <div>
                    <ActionButtons.CropLogo onCropCallback={this.onCropCallback} />
                </div>
            </div>
        );
    }

    setCropperImgRef(element) {
        this.cropperImg = element;
    }

    setStoreRef(element) {
        this.storeImg = element;
    }

    getModalContent() {
        const data = this.getModalData();

        return (
            <img crossOrigin="anonymous" className="cropper-img" ref={this.setCropperImgRef} src={data.imageUrl} />
        ); 
    }

    getModalType() {
        return 'cropper';
    }

    getModalId() {
        return 'cropper-modal';
    }

    getHeader(data) {
        const headerClass = 'modal__header';

        return (
            <div className={headerClass}>
                <h4 className="modal__title">Обрезать логотип</h4>
                
                { this.getCloseButton() }
            </div>
        );
    }
}

// Prop Types
CropperModal.propTypes = {
    form: PropTypes.func,
    formProps: PropTypes.object,
    modalId: PropTypes.string,
    isPreloaderRequired: PropTypes.bool,
    title: PropTypes.string,

    cropperParams: PropTypes.object, 
    boxRestrict: PropTypes.object,

    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

export default withState(CropperModal);