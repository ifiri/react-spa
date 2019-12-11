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
 * Form for update existing company.
 */
class DepartmentManage extends CommonForm {
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
        
        this.props.entriesActions.deleteEntry('company/departments', {
            uniq: entry._uniq,
            map: {
                departament: entry.id
            }
        });
    }


    handleSubmit(values) {
        const entry = this.getEntry();
        const entriesType = this.getEntriesType();
        const form = this.form;

        this.props.entriesActions.update(entriesType, {
            form: form,
            uniq: entry._uniq,
            map: {
                departament: form.elements.id.value
            }
        });
    }


















    render() {
        const entry = this.getEntry();

        let submitButtonText = 'Добавить';
        let submitButtonColor = 'rgb(54, 155, 0)';

        submitButtonText = 'Сохранить';
        submitButtonColor = 'rgb(48, 152, 212)';
        
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
        return 'company/departments';
    }
}

// Prop Types
DepartmentManage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentManage);