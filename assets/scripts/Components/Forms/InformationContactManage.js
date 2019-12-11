import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import {Formik} from "formik";

import PropTypes from 'prop-types';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import CommonForm from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, BottomButtons } from './InformationContact.style';

/**
 * Form for update existing company.
 */
class InformationContactManage extends CommonForm {
    constructor(props) {
        super(props);

        // Links to nodes with possible user roles and to widget with banks
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }











    



    





    





    handleRemove() {
        const form = this.form;
        const meetupID = this.props.match.params.id;
        const entry = this.getEntry();

        this.props.entriesActions.deleteEntry('information/contacts', {
            uniq: entry._uniq,
            headers: {
                event_id: meetupID
            },
            map:{
                meetup: meetupID,
                contact: entry.id,
            }
        });
    }



    handleSubmit(values) {
        const meetupID = this.props.match.params.id;
        const event = this.getEntry();
        const form = this.form;
        const entriesType = this.getEntriesType();

        values.eventId = meetupID;    
        values.id = event.id;

        this.props.entriesActions.update(entriesType, {
            form: form,
            body:values,
            headers: {
                event_id: meetupID
            }, 
            uniq:event._uniq,
            map: {
                contact:event.id,
                meetup: meetupID,
            }
        });
        
    }
























    

    render() {
        const { entries } = this.props.state;
        const event = this.getEntry();

        let modalTitle = 'Новый телефон';
        let submitButtonText = 'Добавить';
        let submitButtonColor = 'rgb(54, 155, 0)';
        const editMode = true;
        if(editMode) {
            modalTitle = 'Редактирование телефона';
            submitButtonText = 'Сохранить';
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
                        phone: editMode ? event.phone : null, 
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
                                <label>Телефон</label>
                                <input type="text" placeholder="+7 (999) 999-99-99" id="phone" value={values.phone} onChange={handleChange} />
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
        return 'information/contacts';
    }
}

// Prop Types
InformationContactManage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(InformationContactManage));