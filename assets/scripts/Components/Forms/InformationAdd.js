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
 * Form for creating new users.
 */
class InformationAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }






























    handleSubmit(values) {
        const meetupID = this.props.match.params.id;
        const newValues = Object.assign({},values);
        newValues.eventId = meetupID;
        const form = this.form;
        const entryType = this.getEntriesType();

        this.props.actions.create(entryType, {
            form: form,
            body: newValues,
            headers: {
                event_id: meetupID
            },
            map: {
                meetup: meetupID,
                information: '%id%',
            }
        });
    }



    handleFileDrop(acceptedFiles,rejectedFiles,setFieldValue){
        setFieldValue('file',acceptedFiles[0]);
    }

    

    handleRemove(){
        const { dispatch,data } = this.props;
        const { event, meetupID } = data;
        const {_uniq} = event;
        dispatch(deleteEntry('information',{uniq:_uniq,headers: {
                event_id: meetupID
            },
            map:{
                meetup: meetupID,
                information: event.id,
            }
        }));
        this.props.onClose();
    }

    render(){
        const { entries } = this.props.state;

        let submitButtonText = 'Добавить';
        let modalTitle = 'Новая достопримечательность';
        let submitButtonColor = 'rgb(54, 155, 0)';

        return (
            <>
                <Formik
                        ref={e => {
                            this.formik = e;
                        }}
                        initialValues={{
                            title: null,
                            content: null,
                            file: null,
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
                                    <ActionButtons.Cancel />
                                    
                                    <Form.Submit caption="Добавить" />
                                </Form.Footer>
                            </form>
                        )}}
                    />
            </>
        )
    }





























    // render() {
    //     // We should pass to server current date
    //     const currentDate = new Date();

    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Text
    //                         label="Название ОСТ"
    //                         name="title"
    //                         placeholder="Введите название ОСТ"
    //                         required={true}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.TextArea
    //                         label="Описание ОСТ"
    //                         name="description"
    //                         placeholder="Введите описание ОСТ"
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Добавить" />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    

    getEntriesType() {
        return 'information';
    }
}

// Prop Types
InformationAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(InformationAdd));