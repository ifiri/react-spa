import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {Formik} from "formik";
import Form from '../Form';
import ActionButtons from '../ActionButtons';

import CommonForm from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, BottomButtons } from './Department.style';

/**
 * Form for creating new users.
 */
class DepartmentAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }
































    handleSubmit(values) {
        const form = this.form;

        this.props.actions.create(entryType, {
            form: form
        });
    }

    // onFormSubmit(event) {
    //     const entryType = this.getEntriesType();
    //     const form = event.target;
        
    //     this.props.actions.create(entryType, {
    //         form: form
    //     });

    //     event.preventDefault();
    // }
















    handleRemove(){
        const { dispatch,data } = this.props;
        const { department } = data;
        const {_uniq} = department;
        dispatch(deleteEntry('company/departments',{uniq:_uniq,map:{departament:department.id}}));
        this.props.onClose();
    }

    render() {
        let modalTitle = 'Новое ОСТ';
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
        return 'company/departments';
    }
}

// Prop Types
DepartmentAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentAdd);