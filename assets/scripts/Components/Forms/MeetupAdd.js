import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import Dropzone from 'react-dropzone';

import PropTypes from 'prop-types';
import {Formik} from "formik";
import Form from '../Form';
import ActionButtons from '../ActionButtons';
import CommonUtils from '../../Utils/Common';

import CommonForm from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, TwoColumns, InputWrapper, SelectWrapper, BottomButtons } from './Meetup.style';

/**
 * Form for creating new users.
 */
class MeetupAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.logoBlob = null;
        this.coords = null;

        // Links to nodes with possible user roles and to widget with banks
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.setLogoBlob = this.setLogoBlob.bind(this);
        this.setCoords = this.setCoords.bind(this);
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }

    setLogoBlob(blob) {
        this.logoBlob = blob;
    }

    setCoords(coords) {
        if(!coords) return;
        this.coords = coords;
    }




























    handleSubmit(values) {
        const entryType = this.getEntriesType();
        const form = this.form;
        const body = CommonUtils.objectify(form);
        const newValues = Object.assign({},values);

        newValues.startDate = values.startDate.utc().format('YYYY-MM-DDTHH:mm:ssZ');
        newValues.endDate = values.endDate.utc().format('YYYY-MM-DDTHH:mm:ssZ');

        this.props.actions.create(entryType, {
            form: form,
            body: {
                ...newValues,

                // startDate: newValues.startDate,
                // endDate: newValues.endDate,

                // file: this.logoBlob
            },
            map: {
                meetup: '%id%',
            }
        });
    }













    render() {
        const { entries } = this.props;

        const types = {
            0: 'Конференция',
            1: 'Конкурс',
            2: 'Совещание'
        }

        return (
            <>
                <Formik
                        ref={e => {
                            this.formik = e;
                        }}
                        initialValues={{
                            type: 0,
                            startDate: null,
                            endDate: null,
                            title: null,
                            description: null,
                            password: null,
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
                        }) => {return (
                            <form onSubmit={handleSubmit} ref={this.setFormRef}>
                                <InputWrapper>
                                        <label>Тип мероприятия</label>
                                        <SelectWrapper>
                                            {types[values.type]}
                                            <select id="type" currentValue={values.type} onChange={handleChange}>
                                                {Object.keys(types).map(key => (
                                                    <option key={`meetup_type_option_${key}`} value={key}>{types[key]}</option>
                                                ))};
                                            </select>
                                        </SelectWrapper>
                                </InputWrapper>
                                <TwoColumns style={{marginTop:'8px'}}>
                                    <InputWrapper>
                                        <label>Дата начала</label>
                                        <DatePicker
                                            id="startDate"
                                            selected={values.startDate}
                                            onChange={e=>setFieldValue('startDate',e)}        
                                        />
                                    </InputWrapper>
                                    <InputWrapper>
                                        <label>Дата окончания</label>
                                        <DatePicker
                                            id="endDate"
                                            selected={values.endDate}
                                            onChange={e=>setFieldValue('endDate',e)}        
                                        />
                                    </InputWrapper>
                                </TwoColumns>
                                <InputWrapper style={{marginTop:'8px'}}>
                                    <label>Название мероприятия</label>
                                    <input type="text" placeholder="Укажите название" id="title" value={values.title} onChange={handleChange} />
                                </InputWrapper>
                                <InputWrapper style={{marginTop:'8px'}}>
                                    <label>Описание мероприятия</label>
                                    <textarea placeholder="Введите описание" id="description" onChange={handleChange}>{values.description}</textarea>
                                </InputWrapper>

                                <InputWrapper style={{marginTop:'24px'}}>
                                    <label>Загрузка логотипа мероприятия</label>

                                    <Form.File 
                                        label=""
                                        setLogoBlob={this.setLogoBlob} 
                                        setCoords={this.setCoords} 
                                        name="avatar" 
                                        accept=".jpg"
                                        mode="meetup"
                                    />
                                </InputWrapper>

                                <InputWrapper style={{marginTop:'24px'}}>
                                    <label>Код участника</label>
                                    <input type="text" placeholder="Введите код участника" id="password" value={values.password} onChange={handleChange} />
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
    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.Text
    //                                 label="Название мероприятия"
    //                                 name="title"
    //                                 placeholder="Введите название мероприятия"
    //                                 required={true}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.TextArea
    //                                 label="Описание мероприятия"
    //                                 name="description"
    //                                 placeholder="Введите описание мероприятия"
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>
    //                 </Form.Column>

    //                 <Form.Column>
    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.Datepicker
    //                                 label="Дата начала"
    //                                 placeholder=""
    //                                 name="start_date"
    //                                 id="meetup-manage-start-date"
    //                                 relatedTo={'#meetup-manage-end-date'}
    //                                 mode="datetime"
    //                                 isRequired={true}
    //                             />
    //                         </Form.Column>

    //                         <Form.Column>
    //                             <Form.Datepicker
    //                                 label="Дата окончания"
    //                                 placeholder=""
    //                                 name="end_date"
    //                                 id="meetup-manage-end-date"
    //                                 mode="datetime"
    //                                 relatedFrom={'#meetup-manage-start-date'}
    //                                 isRequired={true}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.Radio
    //                                 label="Тип мероприятия" 
    //                                 name="type"
    //                                 choices={{
    //                                     0: 'Конкурс',
    //                                     1: 'Конференция'
    //                                 }}

    //                                 isRequired={true}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.File 
    //                                 label="Логотип \ эмблема мероприятия" 
    //                                 setLogoBlob={this.setLogoBlob} 
    //                                 name="logo" 
    //                                 accept=".jpg,.jpeg,.png"
    //                                 id="meetup-add-logo"
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.Text
    //                                 label="Код участника"
    //                                 name="password"
    //                                 placeholder="0123"
    //                                 pattern="\d{4}"
    //                                 title="Четырехзначное число, например, 0123"
    //                                 required={true}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Добавить" />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    

    getEntriesType() {
        return 'meetups';
    }
}

// Prop Types
MeetupAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MeetupAdd);