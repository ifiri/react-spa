import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import {Formik} from "formik";
import Dropzone from 'react-dropzone';

import PropTypes from 'prop-types';

import RFCDateEntity from '../../Date/RFCDateEntity';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import SectionsList from '../Widgets/SectionsList';
import ParticipantsList from '../Widgets/ParticipantsList';

import Common from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, SelectWrapper, Subtitle, BottomButtons, UploadLine } from './Media.style';

/**
 * Form for update existing company.
 */
class MediaManage extends Common {
    constructor(props) {
        super(props);

        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }








































    handleRemove(values) {
        const form = this.form;
        const meetupID = this.props.match.params.id;
        const entry = this.getEntry();

        if (values.type == 0) {
            this.props.entriesActions.deleteEntry('media/photos', {
                uniq: entry._uniq,
                map: {
                    media: entry.id,
                    meetup: meetupID
                }
            });
        } else if (values.type == 1) {
            this.props.entriesActions.deleteEntry('media/videos', {
                uniq: entry._uniq,
                map: {
                    media: entry.id,
                    meetup: meetupID
                }
            });
        }
    }




    handleSubmit(values) {
        const { match } = this.props;
        const meetupID = match.params.id;
        const form = this.form;
        const body = CommonUtils.objectify(form);
        const media = this.getEntry();

        const currentType = media.type || values.type;

        if (currentType == 0) {

            this.props.entriesActions.update('media/photos', {
                form: form,
                uniq: media._uniq,
                body: {
                    ...values,
                    id:media.id
                },
                headers: {
                    event_id: meetupID
                }
            });

        } else if (currentType == 1) {

            this.props.entriesActions.update('media/videos', {
                form: form,
                uniq: media._uniq,
                body: {
                    ...values,
                    id:media.id
                },
                headers: {
                    event_id: meetupID
                }
            });
            
        }
    }














  handleFileDrop(acceptedFiles,rejectedFiles,setFieldValue){
    setFieldValue('file',acceptedFiles[0]);
  }

    

  render(){
    const { entries } = this.props.state;
    const media = this.getEntry();
    const type = media.type;

    const types = {
        0: 'Фотография',
        1: 'Видео'
    };

    const editMode = true;
    const modalTitle = editMode ? 'Редактирование медиа' : 'Загрузка файла';
    const submitButtonText = editMode ? 'Сохранить' : 'Добавить';
    const submitButtonColor = editMode ? 'rgb(48, 152, 212)' : 'rgb(54, 155, 0)';

    const currentType = editMode ? type : 0;

    return(
      <>
        <Formik
          ref={e => {
            this.formik = e;
          }}
          initialValues={{
            type: currentType,
            title: editMode ? media.title : null,
            description: editMode ? media.description : null,
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
            return (
            <form onSubmit={handleSubmit} ref={this.setFormRef}>
                {editMode ? null :<InputWrapper style={{marginTop:'28px'}}>
                        <label>Тип файла</label>
                        <SelectWrapper>
                            {types[values.type]}
                            <select id="type" currentValue={values.type} onChange={handleChange}>
                                {Object.keys(types).map(key => (
                                    <option key={`media_modal_type_option_${key}`} value={key}>{types[key]}</option>
                                ))};
                            </select>
                        </SelectWrapper>
                </InputWrapper>}
                {editMode ? null :<InputWrapper style={{marginTop:'32px'}}>
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
                </InputWrapper>}
                {editMode ? null :<Subtitle style={{marginTop:'32px'}}>Подробная информация</Subtitle>}
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Название</label>
                    <input type="text" placeholder="Укажите название" id="title" value={values.title} onChange={handleChange} />
                </InputWrapper>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Описание</label>
                    <textarea placeholder="Введите описание" id="description" onChange={handleChange}>{values.description}</textarea>
                </InputWrapper>
                
                <Form.Footer>
                    <ActionButtons.Delete onClick={e=>this.handleRemove(values)} />
                    <ActionButtons.Cancel />
                    
                    <Form.Submit caption="Сохранить" />
                </Form.Footer>
            </form>
          )}}
        />
        
      </>

    )

  }






































































    // render() {
    //     const entry = this.getEntry();

    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Text
    //                         label="Название"
    //                         name="title"
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.TextArea
    //                         label="Описание"
    //                         name="description"
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Обновить" />
                    
    //                 <Form.Hidden name="type" value="videos" />
    //                 <Form.Hidden name="id" />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    getEntry() {
        const entry = this.props.entry || {};

        return entry;
    }

    

    getEntriesType() {
        return 'participants';
    }
}

// Prop Types
MediaManage.propTypes = {
    entry: PropTypes.object,

    state: PropTypes.object,
    entriesActions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state
    };
}

function mapDispatchToProps(dispatch) {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(MediaManage));