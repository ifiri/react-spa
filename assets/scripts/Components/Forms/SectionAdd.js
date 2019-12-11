import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Formik} from "formik";
import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import CommonForm from './Common';

import { Title, InputWrapper, BottomButtons } from './Section.style.js';

import * as entriesActions from '../../Actions/EntriesActions';

/**
 * Form for creating new users.
 */
class SectionAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }













    handleSubmit(values) {
        // const { dispatch,data } = this.props;
        // const { formType,section,meetupID } = data;
        // const editMode = formType === 'edit';

        // values.meetup = meetupID;
            
        // if(editMode) {
        //     values.id = section.id;
        //     const {_uniq} = section;
        //     dispatch(update('meetup/sections',{body:values,headers: {
        //             event_id: meetupID
        //         }, uniq:_uniq,map:{section:section.id}})).then(()=>{
        //         dispatch(load('meetup/sections',{map:{meetup:meetupID}}))
        //     });
        // } else {
        //     dispatch(create('meetup/sections',{
        //         body:values,
        //         headers: {
        //             event_id: meetupID
        //         }
        //     }));
        // }

        const meetupID = this.props.match.params.id;
        const entryType = this.getEntriesType();
        const form = this.form;
        
        this.props.actions.create(entryType, {
            form: form,
            body: values,
            headers: {
                event_id: meetupID
            },
            map: {
                meetup: meetupID
            }
        });
    }

    onFormSubmit(event) {
        // const entryType = this.getEntriesType();
        // const form = this.form;
        
        // this.props.actions.create(entryType, {
        //     form: form
        // });
    }

    render() {
        let modalTitle = 'Новая секция';
        let submitButtonText = 'Добавить';
        let submitButtonColor = 'rgb(54, 155, 0)';

        const editMode = false;
        
        return (
            <>
                <Formik
                    ref={e => {
                        this.formik = e;
                    }}
                    initialValues={{
                        title: null,
                        description: null, 
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
                                <textarea placeholder="Введите описание к секции" id="description" onChange={handleChange}>{values.description}</textarea>
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
    //     const { match } = this.props;
    //     const meetup = (match && match.params.id) || null;

    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Hidden name="meetup" value={meetup} />

    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Text 
    //                         label="Название секции"
    //                         name="title"
    //                         placeholder="Введите название секции"
    //                         required={true}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>
                
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.TextArea
    //                         label="Описание секции"
    //                         name="description"
    //                         placeholder="Введите описание секции"
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
        return 'meetup/sections';
    }
}

// Prop Types
SectionAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(SectionAdd));