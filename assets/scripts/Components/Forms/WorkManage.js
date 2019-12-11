import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import RFCDateEntity from '../../Date/RFCDateEntity';

import Multiple from '../Forms/Elements/Multiple';
import Form from '../Form';
import ActionButtons from '../ActionButtons';

import SectionsList from '../Widgets/SectionsList';
import ParticipantsList from '../Widgets/ParticipantsList';

import Common from './Common';

import {Formik} from "formik";
import moment from "moment";
import DatePicker from "react-datepicker";
import MaskedTextInput from "react-text-mask";

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, SelectWrapper, Subtitle, TwoColumns, ThreeColumns, BottomButtons, CuratorInfo } from './Work.style';

/**
 * Form for update existing company.
 */
class WorkManage extends Common {
    constructor(props) {
        super(props);

        const event = this.getEntry();
        const { users = [] } = event;

        const authors = [];
        for (const index in users) {
            const user = users[index];

            authors.push(parseInt(user.id));
        }

        this.state = {
            authors: authors || [],
        };

        this.handleAuthor = this.handleAuthor.bind(this);
        this.getCurrentCuratorInfo = this.getCurrentCuratorInfo.bind(this);

        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
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

    handleAuthor(e,setFieldValue, index = 1, currentValue = 0){
        const { value } = e.target;
        const { authors } = this.state;

        console.log('!!!!!!!!!!!');
        console.log(value + ' : ' + currentValue);

        if(!parseInt(value)) {
            // const indexOf = authors.indexOf(currentValue);

            // if(~indexOf) {
            //     authors.splice(indexOf, 1);

            //     setFieldValue('author' + index, value);
            // }

            return;
        }

        

        authors.push(parseInt(value));

        this.setState({
            authors: authors.filter( (v, i, a) => a.indexOf(v) === i)
        });

        // console.log(authors);
        // console.log(this.state.authors);

        setFieldValue('author' + index,value);
    }























    handleRemove() {
        const form = this.form;
        const meetupID = this.props.match.params.id;
        const entry = this.getEntry();
        
        this.props.entriesActions.deleteEntry('works', {
            headers: {
                event_id: meetupID
            },
            uniq: entry._uniq,
            map: {
                work: entry.id
            }
        });
    }


    handleSubmit(values) {
        const event = this.getEntry();
        const form = this.form;

        const { entries } = this.props.state;

        const participants = (
            entries.participants && entries.participants.items
        ) || [];

        const users = [];
        const authors = this.state.authors;
        if(authors[0]) {
            users.push(authors[0]);

            for(const participant of participants) {
                if(participant.id == authors[0]) {
                    values['section'] = participant.additonalProperties && participant.additonalProperties.section_id;
                    break;
                }
            }
        }
        if(authors[1]) users.push(authors[1]);
        if(authors[2]) users.push(authors[2]);
        
        const newValues = {
            users: users,
            title: values.title,
            description: values.description,
            section_id: values.section,
            review: values.review,
            startDate: values.date.format('YYYY-MM-DD')+values.timeStart.format('THH:mm:ssZ'),
            endDate: values.date.format('YYYY-MM-DD')+values.timeEnd.format('THH:mm:ssZ'),
            date: values.date.format('YYYY-MM-DD'),
            start_time: values.timeStart.format('THH:mm:ssZ'),
            end_time: values.timeEnd.format('THH:mm:ssZ'),
        };

        // console.log('::: SUBMIUTTTTTTTTTTT');
        // console.log(newValues);
        // console.log(data);
        
        const meetupID = this.props.match.params.id;
        this.props.entriesActions.update('works', {
            form: form,
            uniq: event._uniq,
            body: {
                ...newValues,
                id: event.id
            },
            map: {
                work: event.id
            },
            headers: {
                event_id: meetupID
            }, 
        });
    }


































  getCurrentCuratorInfo(curators, setFieldValue){
    const authors = this.state.authors;

    if (!authors || authors.length === 0){
        return (
            <SelectWrapper className="curator-select">
                <CuratorInfo>
                    <div></div>
                    <div className="no-curator">Авторы не выбраны</div>
                </CuratorInfo>
                
                <select key={'author1'} id="author1" currentValue={0} onChange={e=>this.handleAuthor(e,setFieldValue,1)}>
                    <option key={`works_modal_authors00_option_00`} value={0}>Выберите...</option>
                    {curators.map(c => (
                        <option key={`works_modal_authors_option_${c.id}`} value={c.id}>{c.fio}</option>
                    ))};
                </select>
            </SelectWrapper>
        )
    }

    const layouts = [];

    for(const index in authors) {
        const currentId = authors[index];

        const currents = curators.filter(c=>c.id===Number(currentId));
        
        if(!currents.length) return null;

        const current = currents[0];

        layouts.push(
            <SelectWrapper key={'curators' + Math.random()} className="curator-select">
                    {(()=>this.kolyanikolaevgovnoed(index, current))()}
                    
                    
            </SelectWrapper>
        );

        if(index == authors.length - 1 && index < 3) {
            layouts.push(
                <SelectWrapper key={'curators_' + Math.random()} className="curator-select">
                        <CuratorInfo>
                            <div></div>
                            <div className="no-curator">Выбрать еще одного автора</div>
                        </CuratorInfo>
                        
                        <select key={Math.random()} id={"author" + (index + 2)} currentValue={currentId} onChange={e=>this.handleAuthor(e,setFieldValue, index + 2, currentId)}>
                            <option key={`works_modal_authors_option_00`} value={0}>Выберите...</option>
                            {curators.map(c => (
                                <option key={`works_modal_authors_option_${c.id}`} value={c.id}>{c.fio}</option>
                            ))};
                        </select>
                </SelectWrapper>
            );
        }
    }

    return layouts;
    



  }

  handleAuthorRemove(e, index, current) {
    const { authors } = this.state;

    authors.splice(index, 1);

    console.log(authors);

    this.setState({
        authors: authors
    });
  }

  kolyanikolaevgovnoed(index, current) {
    return (
        <CuratorInfo key={index} onClick={this.handleAuthorRemove.bind(this, index, current)}>
            <div className="curator-avatar" style={{backgroundImage:`url(${current.photoSmallUrl})`}}></div>
            <div>
                {current.fio}<br/>
                <span>{current.department.title}</span>
            </div>
        </CuratorInfo>
    );
  }

  render() {
    const { entries } = this.props.state;
    const event = this.getEntry();

    let participants = (
        entries.participants && entries.participants.items
    ) || [];
    participants = participants.filter(p=>p.type===1);

    // if (!participants) return null;

    let modalTitle = 'Новый доклад';
    let submitButtonText = 'Добавить';
    let submitButtonColor = 'rgb(54, 155, 0)';
    const editMode = true;
    if(editMode) {
        modalTitle = 'Редактирование доклада';
        submitButtonText = 'Сохранить';
        submitButtonColor = 'rgb(48, 152, 212)';
    }

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
            review: editMode ? event.review : null, 
            type: editMode ? event.type : 0,
            authors: editMode ? event.curator_id : this.state.authors[0],
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
                <Subtitle>Дата и время выступления</Subtitle>
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
                    <label>Тема доклада</label>
                    <input type="text" placeholder="Укажите тему" id="title" value={values.title} onChange={handleChange} />
                </InputWrapper>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Аннотация к докладу</label>
                    <textarea placeholder="Вставьте сюда текст аннотации" id="description" onChange={handleChange}>{values.description}</textarea>
                </InputWrapper>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Рецензия к докладу</label>
                    <textarea placeholder="Вставьте сюда текст рецензии" id="review" onChange={handleChange}>{values.review}</textarea>
                </InputWrapper>
                <InputWrapper style={{marginTop:'32px'}}>
                        <label>Авторы работы</label>
                        {this.getCurrentCuratorInfo(participants, setFieldValue)}
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




















































    // componentDidMount() {
    //     const entry = this.getEntry();
    //     const entriesType = this.getEntriesType();

    //     if(!this.getWork() && !this.isLoadPerformed() && !this.isLoadStarted()) {
    //         this.props.entriesActions.load(entriesType, {
    //             map: {
    //                 work: entry.id
    //             }
    //         });
    //     }
    // }

    // componentWillUnmount() {
    //     const entriesType = this.getEntriesType();
        
    //     this.props.entriesActions.clearEntries(entriesType);
    // }

    // render() {
    //     const entry = this.getWork() || {};

    //     const StartDateEntity = new RFCDateEntity(entry && entry.startDate, '+06:00');
    //     const EndDateEntity = new RFCDateEntity(entry && entry.endDate, '+06:00');

    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Multiple
    //                         label="Авторы работы"
    //                         name="users[]"
    //                         type="participants"
    //                         value={entry && entry.users}
    //                         isRequired={true}
    //                     />

    //                     <Form.Text
    //                         label="Название работы"
    //                         name="title"
    //                         placeholder="Введите название работы"
    //                         required={true}
    //                         value={entry && entry.title}
    //                     />

    //                     <Form.TextArea
    //                         label="Описание работы"
    //                         name="description"
    //                         placeholder="Введите описание работы"
    //                         required={true}
    //                         value={entry.description}
    //                         additional={{
    //                             style: {
    //                                 height: '288px'
    //                             }
    //                         }}
    //                     />
    //                 </Form.Column>

    //                 <Form.Column>
    //                     <Form.Datepicker
    //                         label="Дата"
    //                         placeholder=""
    //                         name="date"
    //                         id="work-add-date"
    //                         mode="date"
    //                         isRequired={true}
    //                         value={entry && StartDateEntity.getReadableDate2()}
    //                     />

    //                     <Form.Row>
    //                         <Form.Column>
    //                             <Form.Datepicker
    //                                 label="Время начала"
    //                                 placeholder=""
    //                                 name="start_time"
    //                                 id="work-add-start-time"
    //                                 relatedTo="#work-add-end-time"
    //                                 mode="time"
    //                                 isRequired={true}
    //                                 value={entry && StartDateEntity.getReadableTime()}
    //                             />
    //                         </Form.Column>

    //                         <Form.Column>
    //                             <Form.Datepicker
    //                                 label="Время окончания"
    //                                 placeholder=""
    //                                 name="end_time"
    //                                 id="work-add-end-time"
    //                                 mode="time"
    //                                 isRequired={true}
    //                                 value={entry && EndDateEntity.getReadableTime()}
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <SectionsList
    //                         label="Выберите секцию"
    //                         name="section_id"
    //                         isRequired={true}
    //                         value={entry && entry.additonalProperties && entry.additonalProperties.section_id}
    //                         className="form__field form__field_type_select"
    //                     />

    //                     <Form.TextArea
    //                         label="Рецензия на работу"
    //                         name="review"
    //                         placeholder="Напишите рецензию на работу"
    //                         value={entry && entry.review}
    //                         required={true}
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Добавить" />

    //                 <Form.Hidden name="id" value={entry && entry.id} />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    getEntry() {
        const entry = this.props.entry || {};

        return entry;
    }

    getWork() {
        const { state } = this.props;
        const entriesType = this.getEntriesType();

        return (
            this.props.state.entries[entriesType] && this.props.state.entries[entriesType].items
        ) || null;
    }

    getEntriesType() {
        return 'work';
    }
}

// Prop Types
WorkManage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(WorkManage));