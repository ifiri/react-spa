import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../../Actions/ModalsActions';
import Dropzone from 'react-dropzone';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

import ActionButtons from '../../ActionButtons';

/**
 * Fileselect widget component
 */
class FileSelect extends React.Component {
    constructor(props) {
        super(props);

        // Visible scaled canvas for preview
        this.viewCanvas = null;

        // Invisible unscaled canvas for image data
        this.storeCanvas = null;

        // File object. Not null when user select file
        this.selectedFile = null;

        // True when logo was deleted by user
        this.isLogoDeleted = false;

        this.onLogoDelete = this.onLogoDelete.bind(this);

        this.setViewCanvasRef = this.setViewCanvasRef.bind(this);
        this.setStoreCanvasRef = this.setStoreCanvasRef.bind(this);

        this.onFileSelect = this.onFileSelect.bind(this);
        this.canvasClickListener = this.canvasClickListener.bind(this);
        this.fitImageOn = this.fitImageOn.bind(this);

        this.handleDropzone = this.handleDropzone.bind(this);
    }

    /**
     * At mount, if value isset, update canvas
     * with existing value
     */
    componentDidMount() {
        const { value = '' } = this.props;

        if(value) {
            this.updateCanvas(this.viewCanvas, value);
            this.updateCanvas(this.storeCanvas, value);
        }
    }

    handleDropzone(acceptedFiles, rejectedFiles) {
        const file = acceptedFiles[0];

        console.log(file);

        this.fileSelect(file);

    }
    
    render() {
        const { 
            name, 
            id, 
            value = '', 
            label = '',
            accept = '*',
            isRequired = false, 
            onResetCallback = null,

            mode = 'participants'
        } = this.props;

        return (<>
            <div className="file-select">
                <TextField
                    className={'file-select__caption'}
                    id={id + '-caption-field'}
                    value={value}
                    label={label}

                    InputProps={{
                        readOnly: true,
                    }}

                    style={{
                        display: 'none',
                    }}
                />

                <canvas 
                    ref={this.setStoreCanvasRef} 
                    onClick={this.canvasClickListener} 
                    style={{display: 'none'}}
                />

                <div className={"file-select__logo-upload" + ' file-select_type_' + mode}>

                    <input
                        accept={accept}
                        onChange={this.onFileSelect}

                        className="file-select__file" 
                        name={name} 
                        id={id + '-logo-field'} 

                        data-form-component="file" 
                        data-file-caption={'#' + id + '-caption-field'} 
                        type="file"

                        style={{display: 'none'}}
                    />

                    {(() => {
                        switch(mode) {
                            case 'participants':
                                return (<>
                                    <div className="participant-avatar">
                                        <canvas 
                                            ref={this.setViewCanvasRef} 
                                            className="file-select__canvas"
                                            
                                        />
                                    </div>


                                    <label htmlFor={id + '-logo-field'} id={id + '-logo-label'} className="file-select__btn-wrapper">
                                        <Button variant="contained" color="primary" component="span" className="file-select__btn">
                                            {'ЗАГРУЗИТЬ'}
                                        </Button>
                                    </label>
                                </>);

                                break;

                            case 'meetup':
                                return (<>
                                    <canvas 
                                        ref={this.setViewCanvasRef} 
                                        className="file-select__canvas"
                                        onClick={this.canvasClickListener} 
                                        style={{display: 'none'}}
                                    />

                                    <Dropzone className="dropzone"
                                        onDrop={this.handleDropzone}
                                    >
                                        <p className="dropzone-placeholder">{`Перетащите логотип для загрузки`
                                        }</p>
                                    </Dropzone>
                                </>);
                                break;
                        }
                    })()}

                
                    

                    
                

            {(() => {
                const style = {};
                if((value || this.selectedFile) && !this.isLogoDeleted) {
                    // return <ActionButtons.ViewMedia source={this.selectedFile || value} />;
                }
                
            })()}
                </div>
            {(() => {
                const style = {};
                if((!value && !this.selectedFile) || this.isLogoDeleted) {
                    style.display = 'none';
                }

                // <_button className="file-select__remove " type="button" onClick={this.onLogoDelete}>
                //             <svg className="icon icon__trash">
                //                 <use xlinkHref="#trash" />
                //             </svg>
                //         </_button>
                
                return null;
            })()}
            </div>
            </>
        );
    }

    setViewCanvasRef(element) {
        this.viewCanvas = element;
    }

    setStoreCanvasRef(element) {
        // console.log(':: store');
        // console.log(element);
        this.storeCanvas = element;
    }

    fileSelect(file, file_caption = null) {
        // If file selected
        if(file) {
            // Check file size
            const filesize = file.size / 1024; // in kb

            // If filesize is larger than 2mb, notice user and return
            // if(filesize > 2048) {
            //     this.props.modalsActions.modalOpening('notice-modal', {
            //         message: 'Файл слишком большой! Выберите файл, который не превышает 2 МБ'
            //     });

            //     // ALso clear fileselect element
            //     element.value = '';
            //     element.type = '';
            //     element.type = 'file';

            // } else {
                // If filesize is correct, set caption (if we can do it)
                if(file_caption) {
                    if(!file_caption.hasAttribute('data-original')) {
                        file_caption.setAttribute('data-original', file_caption.value);
                    }

                    file_caption.value = file.name;
                }

                // Store selected file in prop
                this.selectedFile = file;

                // And update canvas
                this.updateCanvas(this.viewCanvas, file, null, true);
                this.updateCanvas(this.storeCanvas, file, null, true);

                this.forceUpdate();
            // }
        } else {
            // If file is not selected, just reset some system data
            if(file_caption) {
                file_caption.value = file_caption.dataset.original || '';
                file_caption.title = '';
            }
        }

        // Reset delete flag
        this.isLogoDeleted = false;
    }

    /**
     * When user select file, check filesize and open cropping modal
     * if filesize is not too big. If filesize is larger than 2mb,
     * show warning modal.
     * 
     * @param  event Object
     * @return void
     */
    onFileSelect(event) {
        let element = event.target;

        console.log('!!! SELECT');

        if(element.dataset.formComponent === 'file' && element.dataset.fileCaption) {
            const file_caption = document.querySelector(element.dataset.fileCaption);

            if(element.files && element.files[0]) {
                this.fileSelect(element.files[0], file_caption);
            }

            event.stopPropagation();
        }
    }

    /**
     * Opens confirm modal for user confirmation.
     * If user want to delete logo, fires deleteCallback 
     * from props. If callback is not set, just reset selectedFile 
     * and force update component.
     *  
     * @param  event Object
     * @return void
     */
    onLogoDelete(event) {
        const { value = '' } = this.props;

        this.props.modalsActions.modalOpening('confirm-modal', {
            message: 'Удалить лого?',
            callback: (result = false) => {
                // Delete logo only if user click `OK`
                if(!result) {
                    return;
                }

                const { onDeleteCallback = null } = this.props;

                // After deleting set delete flag to true and update component
                if(value && onDeleteCallback) {
                    onDeleteCallback().then(response => {
                        this.isLogoDeleted = true;
                        this.forceUpdate();
                    });
                } else {
                    this.selectedFile = null;
                    this.forceUpdate();
                }
            }
        });
    }

    /**
     * Draw image on canvas with saving scale. Coords is cropping coords,
     * if coords is not null, image will be cropped.
     * 
     * @param  canvas Object
     * @param  imageObj Object
     * @param  coords Object | null
     * @return void
     */
    fitImageOn(canvas, imageObj, coords = null, isDrawable = true) {
        const context = canvas.getContext('2d');
        let renderableHeight, renderableWidth, xStart, yStart;

        // Clear canvas context
        context.clearRect(0, 0, canvas.width, canvas.height);

        if(isDrawable) {
            // Calculate image data. Crop image if required
            const imageWidth = (coords && coords.width) || imageObj.width;
            const imageHeight = (coords && coords.height) || imageObj.height;
            const imageTop = (coords && coords.top) || 0;
            const imageLeft = (coords && coords.left) || 0;

            // Calculate ratio
            const imageAspectRatio = imageWidth / imageHeight;
            const canvasAspectRatio = canvas.width / canvas.height;

            // If image's aspect ratio is less than canvas's we fit on height
            // and place the image centrally along width
            if(imageAspectRatio < canvasAspectRatio) {
                const ratio = canvas.height / imageHeight;

                renderableWidth = imageWidth * ratio;
                renderableHeight = canvas.height;

                xStart = (canvas.width - renderableWidth) / 2;
                yStart = 0;

            } else if(imageAspectRatio > canvasAspectRatio) {
                // If image's aspect ratio is greater than canvas's we fit on width
                // and place the image centrally along height
                const ratio = canvas.width / imageWidth;

                renderableWidth = canvas.width;
                renderableHeight = imageHeight * ratio;

                xStart = 0;
                yStart = (canvas.height - renderableHeight) / 2;

            } else { 
                // Happy path - keep aspect ratio
                renderableHeight = canvas.height;
                renderableWidth = canvas.width;
                xStart = 0;
                yStart = 0;
            }

            // Draw image
            context.drawImage(imageObj, imageLeft, imageTop, imageWidth, imageHeight, 0, yStart, renderableWidth, renderableHeight);
        }

        // Save raw image data to logoBlob
        if(canvas === this.storeCanvas) {
            canvas.toBlob(blob => {
                const { setLogoBlob } = this.props;

                setLogoBlob(blob);
            }, 'image/jpeg');
        }
    };

    /**
     * Update passed canvas, draw passed imageData on canvas
     * 
     * @param  canvas Object
     * @param  imageData Object
     * @param  coords Object | null
     * @param  openModal Boolean
     * @return void
     */
    updateCanvas(canvas, imageData, coords = null, openModal = false) {
        // if(canvas === this.viewCanvas) {
        //     return;
        // }

        if(canvas && imageData) {
            const { setCoords } = this.props;
            setCoords(coords);

            const context = canvas.getContext('2d');

            const onImgLoad = event => {
                if(canvas === this.storeCanvas) {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                this.fitImageOn(canvas, img, coords);

                if(canvas !== this.viewCanvas && openModal && this.isImage(imageData)) {
                    const { isCropRequired = true } = this.props;

                    if(isCropRequired) this.openCropModal();
                }
            }

            const img = new Image();
            img.crossOrigin = 'Anonymous';

            // ImageData is file
            if(typeof imageData === 'object') {
                const reader = new FileReader();
                reader.onload = event => {
                    if(this.isImage(imageData)) {
                        img.src = event.target.result;
                    } else if(this.isVideo(imageData)) {
                        const { setLogoBlob } = this.props;
                        
                        setLogoBlob(imageData);
                    }
                };

                img.onload = onImgLoad;

                reader.readAsDataURL(imageData);
            } else {
                // ImageData is url
                img.src = imageData;

                img.onload = onImgLoad;

                // img.onload = event => {
                //     if(canvas === this.storeCanvas) {
                //         canvas.width = img.width;
                //         canvas.height = img.height;
                //     }

                //     this.fitImageOn(canvas, img, coords);

                //     // if(openModal) {
                //     //     this.openCropModal();
                //     // }
                // };
            }
        }
    }

    isVideo(file) {
        return file.type === 'video/mp4';
    }

    isImage(file) {
        return file.type === 'image/jpeg' || file.type === 'image/png';
    }

    /**
     * Open crop modal for image cropping.
     * 
     * @return void
     */
    openCropModal() {
        let { value = '' } = this.props;

        const modalId = 'cropper-modal';

        /**
         * Inner function which dispatch modal opening action
         * 
         * @param  value String
         * @return void
         */
        console.log('::: store');
        console.log(this.storeCanvas);
        const openModal = (value) => {
            this.props.modalsActions.modalOpening(modalId, {
                imageUrl: value,
                canvas: this.viewCanvas,
                storeCanvas: this.storeCanvas,
                updateCanvas: this.updateCanvas,
                fitImageOn: this.fitImageOn,
            });
        }

        // If value is null and file is selected,
        // it means, we will upload new logo. Read selected file
        // and pass file data to modal
        if(!value && this.selectedFile) {
            const reader = new FileReader();
            reader.onload = event => {
                value = event.target.result;

                openModal(value);
            };

            reader.readAsDataURL(this.selectedFile);
        } else {
            // In other case, if selected file exists and value is set
            // it means, user want update existing logo. Read file too
            // and pass file data to modal
            if(this.selectedFile) {
                const reader = new FileReader();
                reader.onload = event => {
                    value = event.target.result;

                    openModal(value);
                };

                reader.readAsDataURL(this.selectedFile);
            } else {
                // Otherwise, if value is set, but file is not exists,
                // it means, user want to crop uploaded logo again
                // Just pass image url to modal
                openModal(value);
            }
        }
    }

    /**
     * Canvas click event handler.
     * Opens modal for cropping logo.
     * 
     * @param  event Object
     * @return void
     */
    canvasClickListener(event) {
        if(event.nativeEvent.which === 1) {
            // this.openCropModal();
        }
    }
}

// Prop Types
FileSelect.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    isRequired: PropTypes.bool,
    
    setLogoBlob: PropTypes.func.isRequired,

    onResetCallback: PropTypes.func,
    onDeleteCallback: PropTypes.func,

    modalsActions: PropTypes.object.isRequired,
};

// Connect
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch),
    };
}

export default connect(() => ({}), mapDispatchToProps)(FileSelect);