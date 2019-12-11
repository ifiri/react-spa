import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import {Formik} from "formik";
import moment from 'moment';
import DatePicker from "react-datepicker";
import Dropzone from 'react-dropzone';

import PropTypes from 'prop-types';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import CommonForm from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, TwoColumns, InputWrapper, SelectWrapper, BottomButtons } from './Information.style';

/**
 * Form for update existing company.
 */
class InformationManage extends CommonForm {
    constructor(props) {
        super(props);

        // Links to nodes with possible user roles and to widget with banks
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }











    handleRemove() {
        const form = this.form;
        const meetupID = this.props.match.params.id;
        const entry = this.getEntry();

        this.props.entriesActions.deleteEntry('information', {
            uniq: entry._uniq,
            headers: {
                event_id: meetupID
            },
            map:{
                meetup: meetupID,
                information: entry.id,
            }
        });
    }



    handleSubmit(values) {
        const meetupID = this.props.match.params.id;
        const event = this.getEntry();
        const form = this.form;
        const entriesType = this.getEntriesType();

        const newValues = Object.assign({},values);

        newValues.eventId = meetupID;
        newValues.id = event.id;


        this.props.entriesActions.update(entriesType, {
            form: form,
            body:newValues,
            headers: {
                event_id: meetupID
            }, 
            uniq:event._uniq,
            map: {
                information: event.id,
                meetup: meetupID,
            }
        });
    }





    handleFileDrop(acceptedFiles,rejectedFiles,setFieldValue){
        setFieldValue('file',acceptedFiles[0]);
    }

    

    

    render(){
        const { entries } = this.props.state;
        const event = this.getEntry();

        let submitButtonText = 'Добавить';
        let modalTitle = 'Новая достопримечательность';
        let submitButtonColor = 'rgb(54, 155, 0)';
        const editMode = true;
        if(editMode) {
            submitButtonText = 'Сохранить';
            modalTitle = 'Редактирование достопримечательноcти';
            submitButtonColor = 'rgb(48, 152, 212)';
        }

        return (
            <>
                <Formik
                        ref={e => {
                            this.formik = e;
                        }}
                        initialValues={{
                            title: editMode ? event.title : null,
                            content: editMode ? event.content : null,
                            file: editMode ? event.file : null,
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
                        }) => {return (
                            <form onSubmit={handleSubmit} ref={this.setFormRef}>
                                <InputWrapper>
                                    <label>Название</label>
                                    <input type="text" placeholder="Введите название" id="title" value={values.title} onChange={handleChange} />
                                </InputWrapper>
                                <InputWrapper style={{marginTop:'8px'}}>
                                    <label>Описание</label>
                                    <textarea placeholder="Добавьте описание достопримечательности" id="content" onChange={handleChange}>{values.content}</textarea>
                                </InputWrapper>
                                <InputWrapper style={{marginTop:'24px'}}>
                                    <label>Загрузка файла</label>
                                    <Dropzone className="dropzone"
                                        onDrop={(a,b)=>this.handleFileDrop(a,b,setFieldValue)}
                                    >
                                        <p className="dropzone-placeholder">{values.file ? values.file.name : `Перетащите фотографию для загрузки`}</p>
                                    </Dropzone>
                                </InputWrapper>
                                
                                <Form.Footer>
                                    <ActionButtons.Delete onClick={e=>this.handleRemove()} />
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
    //             <Form.Hidden
    //                 name="id"
    //                 value={entry.id}
    //             />

    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Text
    //                         label="Название ОСТ"
    //                         name="title"
    //                         placeholder="Введите название ОСТ"
    //                         required={true}
    //                         value={entry.title}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.TextArea
    //                         label="Описание ОСТ"
    //                         name="description"
    //                         placeholder="Введите описание ОСТ"
    //                         value={entry.description}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Обновить" />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    getEntry() {
        const entry = this.props.entry || {};

        return entry;
    }

    getEntriesType() {
        return 'information';
    }
}

// Prop Types
InformationManage.propTypes = {
    entry: PropTypes.object,

    state: PropTypes.object,
    entriesActions: PropTypes.object.isRequired,
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
        entriesActions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(InformationManage));