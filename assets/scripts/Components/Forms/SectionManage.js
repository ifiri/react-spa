import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';
import {Formik} from "formik";
import PropTypes from 'prop-types';

import RFCDateEntity from '../../Date/RFCDateEntity';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import Common from './Common';

import { Title, InputWrapper, BottomButtons } from './Section.style.js';

import * as entriesActions from '../../Actions/EntriesActions';

/**
 * Form for update existing company.
 */
class SectionManage extends Common {
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

        this.props.entriesActions.deleteEntry('meetup/sections', {
            headers: {
                event_id: meetupID
            },
            uniq: entry._uniq,
            map:{
                section: entry.id
            }
        });
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
        const entry = this.getEntry();
        const entriesType = this.getEntriesType();
        const form = this.form;

        this.props.entriesActions.update(entriesType, {
            form: form,
            uniq: entry._uniq,
            body: values,
            headers: {
                event_id: meetupID
            }, 
        });
    }


















    render() {
        const entry = this.getEntry();

        let modalTitle = 'Новая секция';
        let submitButtonText = 'Добавить';
        let submitButtonColor = 'rgb(54, 155, 0)';
        const editMode = true;
        if(editMode) {
            modalTitle = 'Редактирование секции';
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
                        title: entry.title,
                        description: entry.description, 
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
    //     const { match } = this.props;

    //     const entry = this.getEntry();
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
    //                         value={entry.title}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>
                
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.TextArea
    //                         label="Описание секции"
    //                         name="description"
    //                         placeholder="Введите описание секции"
    //                         value={entry.description}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Добавить" />
                    
    //                 <Form.Hidden
    //                     name="id"
    //                     value={entry.id}
    //                 />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    getEntry() {
        const entry = this.props.entry || {};

        return entry;
    }

    

    getEntriesType() {
        return 'meetup/sections';
    }
}

// Prop Types
SectionManage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(SectionManage));