import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import RFCDateEntity from '../../Date/RFCDateEntity';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import {Formik} from "formik";
import moment from "moment";
import DatePicker from "react-datepicker";
import MaskedTextInput from "react-text-mask";


import CuratorsList from '../Widgets/CuratorsList';

import Common from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, SelectWrapper, Subtitle, TwoColumns, ThreeColumns, BottomButtons, CuratorInfo } from './Event.style';

/**
 * Form for update existing company.
 */
class EventManage extends Common {
    constructor(props) {
        super(props);

        // Links to nodes with possible user roles and to widget with banks
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }





























    handleClose(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(hideModal());
      }

    handleTimeStart(e,timeEnd,setFieldValue){
        if (!e) return false
        if (timeEnd){
            if(e.diff(timeEnd)>0) setFieldValue('timeEnd',e);
        }
        setFieldValue('timeStart',e);
    }

    handleTimeStartRaw(e,timeEnd,setFieldValue){
        const { value } = e.target;
        if (value && /^([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value)){
            const newTimeStart = moment(value,'HH:mm');
            if (timeEnd){
                if(newTimeStart.diff(timeEnd)>0) setFieldValue('timeEnd',newTimeStart);
            }
            setFieldValue('timeStart',newTimeStart);
        }
    }

    handleTimeEnd(e,timeStart,setFieldValue){
        if (!e) return false
        if (timeStart){
            if(e.diff(timeStart)<0) setFieldValue('timeStart',e);
        }
        setFieldValue('timeEnd',e);
    }

    handleTimeEndRaw(e,timeStart,setFieldValue){
        const { value } = e.target;
        if (value && /^([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value)){
            const newTimeEnd = moment(value,'HH:mm');
            if (timeStart){
                if(newTimeEnd.diff(timeStart)<0) setFieldValue('timeStart',newTimeEnd);
            }
            setFieldValue('timeEnd',newTimeEnd);
        }
    }

    handleDateRaw(e,setFieldValue){
        const { value } = e.target;
        if (value && /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/.test(value)){
            const newDate = moment(value,'DD:MM:YYYY');
            setFieldValue('date',newDate);
        }
    }











    handleRemove() {
        const form = this.form;
        const meetupID = this.props.match.params.id;
        const entry = this.getEntry();
        
        this.props.entriesActions.deleteEntry('events', {
            headers: {
                event_id: meetupID
            },
            uniq: entry._uniq,
            map: {
                event: entry.id
            }
        });
    }




    handleSubmit(values) {
        const meetupID = this.props.match.params.id;

        const entry = this.getEntry();
        const entriesType = this.getEntriesType();
        const form = this.form;
        
        const newValues = {
            event_id: Number(meetupID),
            title: values.title,
            description: values.description,
            type: Number(values.type),
            startDate: values.date.format('YYYY-MM-DD')+values.timeStart.format('THH:mm:ssZ'),
            endDate: values.date.format('YYYY-MM-DD')+values.timeEnd.format('THH:mm:ssZ')
        };

        if (values.curator_id !== null && values.curator_id !== undefined) {
            newValues.curator_id = Number(values.curator_id);
        }
        

        this.props.entriesActions.update(entriesType, {
            form: form,
            uniq: entry._uniq,
            body: newValues,
            headers: {
                event_id: meetupID
            }, 
            map: {
                event: entry.id
            }
        });
    }














  getCurrentCuratorInfo(currentId,curators){
    if (currentId === null || currentId === undefined){
        return (
            <CuratorInfo>
                <div></div>
                <div className="no-curator">Куратор не выбран</div>
            </CuratorInfo>
        )
    }
    const current = curators.filter(c=>c.id===Number(currentId));
    if(!current.length) return null;
    const p = current[0];
    return (
        <CuratorInfo>
            <div className="curator-avatar" style={{backgroundImage:`url(${p.photoSmallUrl})`}}></div>
            <div>
                {p.fio}<br/>
                <span>{p.department.title}</span>
            </div>
        </CuratorInfo>
    )
  }

  render(){
    const { entries } = this.props.state;
    const event = this.getEntry();

    const events = entries.events.items;
    const participants = entries.participants.items;
    const types = {
        0: 'Обычное',
        1: 'Перерыв'
    };

    if (!events || !participants) return null;

    let modalTitle = 'Новое событие';
    let submitButtonText = 'Добавить';
    let submitButtonColor = 'rgb(54, 155, 0)';
    const editMode = true;
    if(editMode) {
        modalTitle = 'Редактирование события';
        submitButtonText = 'Сохранить';
        submitButtonColor = 'rgb(48, 152, 212)';
    }
    const curators = participants.filter(p=>p.type===3);

    return(

      <>
        <Formik
          ref={e => {
            this.formik = e;
          }}
          initialValues={{
            date: editMode ? moment(event.startDate) : null,
            timeStart: editMode ? moment(moment(event.startDate).format('HH:mm'),'HH:mm') : null,
            timeEnd: editMode ? moment(moment(event.endDate).format('HH:mm'),'HH:mm') : null,
            title: editMode ? event.title : null,
            description: editMode ? event.description : null, 
            type: editMode ? event.type : 0,
            curator_id: editMode ? event.curator_id : null,
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
          }) => {

        return (
            <form onSubmit={handleSubmit} ref={this.setFormRef}>
                <InputWrapper>
                        <label>Тип события</label>
                        <SelectWrapper>
                            {types[values.type]}
                            <select id="type" currentValue={values.type} onChange={handleChange}>
                                {Object.keys(types).map(key => (
                                    <option key={`event_modal_type_option_${key}`} value={key}>{types[key]}</option>
                                ))};
                            </select>
                        </SelectWrapper>
                </InputWrapper>
                <Subtitle style={{marginTop:'32px'}}>Дата и время проведения</Subtitle>
                <ThreeColumns style={{marginTop:'8px'}}>
                    <InputWrapper>
                        <label>Дата</label>
                        <DatePicker
                            id="date"
                            selected={values.date}
                            onChange={e=>setFieldValue('date',e)}
                            onChangeRaw={e=>this.handleDateRaw(e,setFieldValue)}
                            customInput={
                                <MaskedTextInput
                                  type="text"
                                  mask={[/\d/, /\d/, ".", /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/]}
                                />
                            }
                            disabledKeyboardNavigation        
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Время начала</label>
                        <DatePicker
                            id="timeStart"
                            selected={values.timeStart}
                            onChange={e=>this.handleTimeStart(e,values.timeEnd,setFieldValue)}
                            onChangeRaw={e=>this.handleTimeStartRaw(e,values.timeEnd,setFieldValue)}
                            //customInput={<TimePickerInput moment={values.timeStart} />}
                            
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={1}
                            dateFormat="LT"
                            timeCaption="Время начала"
                            disabledKeyboardNavigation
                        />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Время окончания</label>
                        <DatePicker
                            id="timeEnd"
                            selected={values.timeEnd}
                            onChange={e=>this.handleTimeEnd(e,values.timeStart,setFieldValue)}
                            onChangeRaw={e=>this.handleTimeEndRaw(e,values.timeStart,setFieldValue)}
                            
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={1}
                            dateFormat="LT"
                            minTime={values.timeStart}
                            maxTime={moment().hours(23).minutes(59)}
                            timeCaption="Время окончания"
                        />
                    </InputWrapper>
                </ThreeColumns>
                <Subtitle style={{marginTop:'32px'}}>Подробная информация</Subtitle>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Название события</label>
                    <input type="text" placeholder="Укажите название" id="title" value={values.title} onChange={handleChange} />
                </InputWrapper>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Описание события</label>
                    <textarea placeholder="Введите описание" id="description" onChange={handleChange}>{values.description}</textarea>
                </InputWrapper>
                <InputWrapper style={{marginTop:'32px'}}>
                        <label>Куратор события</label>
                        <SelectWrapper className="curator-select">
                            {this.getCurrentCuratorInfo(values.curator_id,curators)}
                            <select id="curator_id" currentValue={values.type} onChange={handleChange}>
                                <option key={`event_modal_curator_option_null`} value={''}>Выберите...</option>
                                {curators.map(c => (
                                    <option key={`event_modal_curator_option_${c.id}`} value={c.id}>{c.fio}</option>
                                ))};
                            </select>
                        </SelectWrapper>
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

    //     const StartDateEntity = new RFCDateEntity(entry.startDate, '+06:00');
    //     const EndDateEntity = new RFCDateEntity(entry.endDate, '+06:00');

    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Hidden name="meetup" value={meetup} />

    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Text
    //                         label="Название события"
    //                         name="title"
    //                         placeholder="Введите название события"
    //                         value={entry.title}
    //                         required={true}
    //                     />

    //                     <Form.TextArea
    //                         label="Описание события"
    //                         name="description"
    //                         placeholder="Введите описание события"
    //                         value={entry.description}
    //                         required={true}
    //                     />
    //                 </Form.Column>

    //                 <Form.Column>
    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.Datepicker
    //                                 label="Дата"
    //                                 placeholder=""
    //                                 name="date"
    //                                 value={
    //                                     StartDateEntity.getReadableDate2()
    //                                 }
    //                                 isRequired={true}
    //                             />
    //                         </Form.Column>

    //                         <Form.Column>
    //                             <Form.Datepicker
    //                                 label="Время начала"
    //                                 placeholder=""
    //                                 name="start_time"
    //                                 id="event-manage-start-time"
    //                                 relatedTo="#event-manage-end-time"
    //                                 mode="time"
    //                                 value={
    //                                     StartDateEntity.getReadableTime()
    //                                 }
    //                                 isRequired={true}
    //                             />
    //                         </Form.Column>

    //                         <Form.Column>
    //                             <Form.Datepicker
    //                                 label="Время окончания"
    //                                 placeholder=""
    //                                 name="end_time"
    //                                 id="event-manage-end-time"
    //                                 mode="time"
    //                                 value={
    //                                     EndDateEntity.getReadableTime()
    //                                 }
    //                                 isRequired={true}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <CuratorsList 
    //                                 label="Куратор события"
    //                                 name="curator_id"
    //                                 value={entry.curator && entry.curator.id}
    //                                 className="form__field form__field_type_select"
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.Radio
    //                                 label="Тип события"
    //                                 name="type"
    //                                 type="inline"
    //                                 value={entry.type}
    //                                 choices={{
    //                                     0: 'Обычное',
    //                                     1: 'Перерыв'
    //                                 }}

    //                                 isRequired={true}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Обновить" />
                    
    //                 <Form.Hidden name="id" value={entry.id} />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    getEntry() {
        const entry = this.props.entry || {};

        return entry;
    }

    getEntriesType() {
        return 'events';
    }
}

// Prop Types
EventManage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(EventManage));