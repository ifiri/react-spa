import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';
import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types';

import {Formik} from "formik";
import moment from 'moment';
import DatePicker from "react-datepicker";
import Dropzone from 'react-dropzone';
import RFCDateEntity from '../../Date/RFCDateEntity';

import Form from '../Form';
import ActionButtons from '../ActionButtons';
import CommonUtils from '../../Utils/Common';

import Common from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, TwoColumns, InputWrapper, SelectWrapper, BottomButtons } from './Meetup.style';

/**
 * Form for update existing company.
 */
class MeetupManage extends Common {
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

    componentDidMount() {
        const entriesType = this.getEntriesType();

        if(!this.getEntries(entriesType) && !this.isLoadPerformed() && !this.isLoadStarted()) {
            const { match } = this.props;

            // this.props.actions.load('meetup',{map:{meetup:this.props.match.params.id}});
            // this.props.actions.load('meetup/sections',{map:{meetup:this.props.match.params.id}});

            // this.props.entriesActions.load(entriesType, {
            //     map: {
            //         meetup: (match && match.params.id) || null
            //     }
            // });
        }
    }

    // componentWillUnmount() {
    //     const entriesType = this.getEntriesType();
        
    //     this.props.entriesActions.clearEntries(entriesType);
    // }























    handleRemove() {
        const form = this.form;
        const meetupID = this.props.match.params.id;
        const entry = this.getEntry();

        this.props.actions.deleteEntry('meetups', {
            uniq: entry._uniq, 
            map: {
                meetup: meetupID
            }
        });
        
        // setTimeout(function() {
        //     this.props.actions.load('meetups');
        // }, 1000);

        this.props.history.push("/events");
    }

    handleSubmit(values,meetup) {
        const { id } = meetup;
        const form = this.form;
        const { _uniq } = this.props.state.entries.meetup.items;
        const newValues = Object.assign({},values);

        newValues.startDate = values.startDate.utc().format('YYYY-MM-DDTHH:mm:ssZ');
        newValues.endDate = values.endDate.utc().format('YYYY-MM-DDTHH:mm:ssZ');
        newValues.id = id;

        const entriesType = this.getEntriesType();

        // actions.update(
        //     'meetup',{body:newValues,uniq:_uniq,map:{meetup:id}});

        this.props.actions.update(entriesType, {
            form: form,
            uniq: _uniq,

            body: {
                ...newValues,

                // file: this.logoBlob
            },

            map: {
                meetup: meetup.id,
            }
        });
    }
















    render() {
        const { dispatch,data } = this.props;
        let meetup = this.props.state.entries.meetup.items;
        if (!meetup) return null;
        if ('event' in meetup) meetup = meetup.event;
        if ('meetup' in meetup) meetup = meetup.meetup;
        const sections = this.props.state.entries['meetup/sections'].items;
        if (!sections) return null;
        if(meetup.id != this.props.match.params.id) return null;
        const editMode = true;

        const types = {
            0: 'Конференция',
            1: 'Конкурс',
            2: 'Совещание'
        }

        return (
            <Formik
                ref={e => {
                    this.formik = e;
                }}
                initialValues={{
                    type: meetup.type,
                    startDate: moment(meetup.startDate),
                    endDate: moment(meetup.endDate),
                    title: meetup.title,
                    description: meetup.description,
                    password: this.props.state.entries.meetup.items.pincode,
                    file: this.props.state.entries.meetup.items.event.imageLink
                }}
                onSubmit={e=>this.handleSubmit(e,meetup)}
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
                                value={values.file ? values.file : ''}
                            />

                        </InputWrapper>

                        <InputWrapper style={{marginTop:'24px'}}>
                            <label>Код участника</label>
                            <input type="text" placeholder="Введите код участника" id="password" value={values.password} onChange={handleChange} />
                        </InputWrapper>

                        <Form.Footer>
                            <ActionButtons.Delete onClick={e=>this.handleRemove()} />
                            
                            <Form.Submit caption="Сохранить" />
                        </Form.Footer>
                    </form>
                )}}
            />
        );
    }








































    // render() {
    //     const entry = this.getEntry();
    //     const meetup = entry && entry.event;
    //     const pincode = entry && entry.pincode;

    //     if(!meetup) {
    //         return null;
    //     }

    //     const StartDateEntity = new RFCDateEntity(meetup.startDate, '+06:00');
    //     const EndDateEntity = new RFCDateEntity(meetup.endDate, '+06:00');

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
    //                                 value={meetup && meetup.title}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.TextArea
    //                                 name="description"
    //                                 label="Описание мероприятия"
    //                                 placeholder="Введите описание мероприятия"
    //                                 value={meetup && meetup.description}
    //                                 height={'232px'}
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
    //                                 relatedTo={'#meetup-manage-end-date'}
    //                                 isRequired={true}
    //                                 mode="datetime"
    //                                 value={
    //                                     meetup && meetup.startDate &&
    //                                     StartDateEntity.getDateInRFCFormat()
    //                                 }
    //                             />
    //                         </Form.Column>

    //                         <Form.Column>
    //                             <Form.Datepicker
    //                                 label="Дата окончания"
    //                                 placeholder=""
    //                                 name="end_date"
    //                                 id="meetup-manage-end-date"
    //                                 isRequired={true}
    //                                 isDepending={true}
    //                                 mode="datetime"
    //                                 value={
    //                                     meetup && meetup.endDate &&
    //                                     EndDateEntity.getDateInRFCFormat()
    //                                 }
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.Radio
    //                                 name="type"
    //                                 label="Тип мероприятия" 
    //                                 choices={{
    //                                     0: 'Конкурс',
    //                                     1: 'Конференция'
    //                                 }}
    //                                 value={meetup.type}

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
    //                                 id="meetup-manage-logo"
    //                                 value={meetup.imageLink}
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
    //                                 value={pincode}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Обновить" />

    //                 <Form.Hidden name="id" value={meetup && meetup.id} />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    getEntry() {
        const entriesType = this.getEntriesType();
        const entry = this.props.state.entries[entriesType].items || {};

        return entry;
    }

    getEntriesType() {
        return 'meetup';
    }
}

// Prop Types
MeetupManage.propTypes = {
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
        actions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withMatch(MeetupManage)));