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
 * Form for creating new users.
 */
class InformationContactAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }






























    



    
















    handleSubmit(values) {
        const meetupID  = this.props.match.params.id;
        const form = this.form;
        const entryType = this.getEntriesType();

        values.eventId = meetupID;

        this.props.actions.create(entryType, {
            form: form,
            body:values,
            map:{
                meetup: meetupID
            },
            headers: {
                event_id: meetupID
            }
        });
    }













    handleRemove(){
        const { dispatch,data } = this.props;
        const { event, meetupID } = data;
        const {_uniq} = event;
        dispatch(deleteEntry('information/contacts',{uniq:_uniq,headers: {
                event_id: meetupID
            },
            map:{
                meetup: meetupID,
                contact: event.id,
            }
        }));
        this.props.onClose();
    }

    render(){
        const { entries } = this.props.state;

        let modalTitle = 'Новый телефон';
        let submitButtonText = 'Добавить';
        let submitButtonColor = 'rgb(54, 155, 0)';

        
        return (
            <>
                <Formik
                    ref={e => {
                        this.formik = e;
                    }}
                    initialValues={{
                        title: null,
                        phone: null, 
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
        return 'information/contacts';
    }
}

// Prop Types
InformationContactAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(InformationContactAdd));