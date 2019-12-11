import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import {Formik} from "formik";
import Dropzone from 'react-dropzone';

import PropTypes from 'prop-types';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import SectionsList from '../Widgets/SectionsList';
import ParticipantsList from '../Widgets/ParticipantsList';

import CommonUtils from '../../Utils/Common';

import CommonForm from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, SelectWrapper, Subtitle, BottomButtons, UploadLine } from './Media.style';

/**
 * Form for creating new users.
 */
class MediaAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.videoRelatedElements = [];
        this.mediaTypesToggler = null;
        this.logoBlob = null;

        // this.onFormSubmit = this.onFormSubmit.bind(this);
        // this.changeTypeTab = this.changeTypeTab.bind(this);
        // this.setVideoRelatedElementsRef = this.setVideoRelatedElementsRef.bind(this);
        // this.setLogoBlob = this.setLogoBlob.bind(this);
        // this.setMediaTypeTogglerRef = this.setMediaTypeTogglerRef.bind(this);
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }














































  handleSubmit(values) {
    const currentType = values.type;

    const { match } = this.props;
    const meetupID = match.params.id;
    const entryType = this.getEntriesType();
    const form = this.form;
    const body = CommonUtils.objectify(form);

    if (currentType == 0){
            this.props.actions.create('media/photos', {
                form: form,
                headers: {
                    event_id: meetupID
                },
                body: {
                    ...values,
                    event_id:meetupID
                },
                map: {
                    meetup: meetupID
                },

            });
        } else if (currentType == 1){
            this.props.actions.create('media/videos', {
                form: form,
                body: {
                    ...values,
                    event_id: meetupID
                },
                headers: {
                    event_id: meetupID
                },
                map: {
                    meetup: meetupID
                }
            });
        }
    }














  handleFileDrop(acceptedFiles,rejectedFiles,setFieldValue){
    setFieldValue('file',acceptedFiles[0]);
  }

  handleRemove(values){
    const { dispatch,data } = this.props;
    const { media } = data;
    const {_uniq} = media;

    if (values.type == 0){
        dispatch(deleteEntry('media/photos',{uniq:_uniq,map:{media:media.id}}));
    }
    if (values.type == 1){
        dispatch(deleteEntry('media/videos',{uniq:_uniq,map:{media:media.id}}));
    }
    this.props.onClose();
  }

  render(){
    const { entries } = this.props.state;

    const types = {
        0: 'Фотография',
        1: 'Видео'
    };

    const modalTitle = 'Загрузка файла';
    const submitButtonText = 'Добавить';
    const submitButtonColor = 'rgb(54, 155, 0)';

    const currentType = 0;

    return(
      <>
        <Formik
          ref={e => {
            this.formik = e;
          }}
          initialValues={{
            type: currentType,
            title: null,
            description: null,
            file: null
          }}
          onSubmit={e=>this.handleSubmit(e)}
          render={({
            values,
            errors,
            touched,
            handleSubmit,
            handleChange,
            setFieldValue,
            isSubmitting,
            status,
          }) => {
            
            let uploadWord = 'фотографию';
            if (values.type == 1) uploadWord = 'видео';

            return (
            <form onSubmit={handleSubmit} ref={this.setFormRef}>
                <InputWrapper>
                        <label>Тип файла</label>
                        <SelectWrapper>
                            {types[values.type]}
                            <select id="type" currentValue={values.type} onChange={handleChange}>
                                {Object.keys(types).map(key => (
                                    <option key={`media_modal_type_option_${key}`} value={key}>{types[key]}</option>
                                ))};
                            </select>
                        </SelectWrapper>
                </InputWrapper>
                <InputWrapper style={{marginTop:'32px'}}>
                    <label>Загрузка файла</label>
                    <Dropzone className="dropzone"
                        onDrop={(a,b)=>this.handleFileDrop(a,b,setFieldValue)}
                    >
                        <p id="uploadPlaceholder" className="dropzone-placeholder">{values.file ? values.file.name : `Перетащите ${uploadWord} для загрузки`}</p>
                        <UploadLine id="uploadLine">
                            <div className="file-name">{values.file ? values.file.name : null} <span id="uploadInfo"></span></div>
                            <div className="all-line">
                                <div className="ready"></div>
                            </div>
                        </UploadLine>
                    </Dropzone>
                </InputWrapper>

                <Subtitle style={{marginTop:'8px'}}>Подробная информация</Subtitle>

                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Название</label>
                    <input type="text" placeholder="Укажите название" id="title" value={values.title} onChange={handleChange} />
                </InputWrapper>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Описание</label>
                    <textarea placeholder="Введите описание" id="description" onChange={handleChange}>{values.description}</textarea>
                </InputWrapper>
                
                <Form.Footer>
                    <ActionButtons.Cancel />
                    
                    <Form.Submit caption="Добавить" />
                </Form.Footer>
            </form>
          )}}
        />
        
      </>

    )

  }





























































































    // changeTypeTab(event) {
    //     const trigger = event.target;
    //     const tab = trigger.value;

    //     for(const index in this.videoRelatedElements) {
    //         const element = this.videoRelatedElements[index];

    //         switch(tab) {
    //             case 'photos':
    //                 element.style.display = 'none';
    //                 break;

    //             case 'videos':
    //                 element.removeAttribute('style');
    //                 break;
    //         }
    //     }
        
    // }

    // setVideoRelatedElementsRef(element) {
    //     this.videoRelatedElements.push(element);
    // }

    // setLogoBlob(blob) {
    //     this.logoBlob = blob;
    // }

    // setMediaTypeTogglerRef(toggler) {
    //     this.mediaTypesToggler = toggler;
    // }

    // render() {
    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Toggle
    //                         caption="Тип медиафайла"
    //                         name="type"
    //                         onToggle={this.changeTypeTab}
    //                         forwardedRef={this.setMediaTypeTogglerRef}
    //                         choices={{
    //                             'photos': 'Фото',
    //                             'videos': 'Видео'
    //                         }}
    //                         isRequired={true}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Row forwardedRef={this.setVideoRelatedElementsRef} style={{
    //                 display: 'none'
    //             }}>
    //                 <Form.Column>
    //                     <Form.Text
    //                         label="Название"
    //                         name="title"
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Row forwardedRef={this.setVideoRelatedElementsRef} style={{
    //                 display: 'none'
    //             }}>
    //                 <Form.Column>
    //                     <Form.TextArea
    //                         label="Описание"
    //                         name="description"
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.File 
    //                         label="Медиафайл"
    //                         setLogoBlob={this.setLogoBlob} 
    //                         name="file" 
    //                         accept=".jpg,.jpeg,.png,.mp4"
    //                         id="media-add-file"
    //                         isRequired={true}
    //                         isCropRequired={false}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Загрузить" />

    //                 <span className="progress" data-progress-for="media"></span>
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    

    getEntriesType() {
        if(this.mediaTypesToggler) {
            const mediaType = this.mediaTypesToggler.querySelector(':checked').value;

            return 'media/' + mediaType;
        }
        
        return 'media';
    }
}

// Prop Types
MediaAdd.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: {
            entries: state.entries
        }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(MediaAdd));