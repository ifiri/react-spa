import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import Form from '../Form';
import Multiple from '../Forms/Elements/Multiple';
import ActionButtons from '../ActionButtons';

import SectionsList from '../Widgets/SectionsList';
import ParticipantsList from '../Widgets/ParticipantsList';

import CommonForm from './Common';

import {Formik} from "formik";
import moment from "moment";
import DatePicker from "react-datepicker";
import MaskedTextInput from "react-text-mask";

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, SelectWrapper, Subtitle, TwoColumns, ThreeColumns, BottomButtons, CuratorInfo } from './Work.style';

/**
 * Form for creating new users.
 */
class WorkAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.state = {
            authors: [],
        };

        this.handleAuthor = this.handleAuthor.bind(this);
        this.getCurrentCuratorInfo = this.getCurrentCuratorInfo.bind(this);

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


























  handleSubmit(values) {
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
    const entryType = this.getEntriesType();
    const form = this.form;

    this.props.actions.create(entryType, {
        form: form,
        body: newValues,
        headers: {
            event_id: meetupID
        }, 
        map: {
            meetup: meetupID
        }
    });

  }

































  handleRemove(){
    const { dispatch,data } = this.props;
    const { event,meetupID } = data;
    const {_uniq} = event;
    dispatch(deleteEntry('works',{headers: {
            event_id: meetupID
        },uniq:_uniq,map:{work:event.id}}));
    this.props.onClose();
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

  render(){
    const { entries } = this.props.state;

    let participants = (
        entries.participants && entries.participants.items
    ) || [];
    participants = participants.filter(p=>p.type===1);

    // if (!participants) return null;

    let modalTitle = 'Новый доклад';
    let submitButtonText = 'Добавить';
    let submitButtonColor = 'rgb(54, 155, 0)';

    return(
      <>
        <Formik
          ref={e => {
            this.formik = e;
          }}
          initialValues={{
            date: null,
            timeStart: null,
            timeEnd: null,
            title: null,
            description: null, 
            review: null, 
            type: 0,
            authors: this.state.authors[0],
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
    //                     <Multiple
    //                         label="Авторы работы"
    //                         name="users[]"
    //                         type="participants"
    //                         isRequired={true}
    //                     />

    //                     <Form.Text
    //                         label="Название работы"
    //                         name="title"
    //                         placeholder="Введите название работы"
    //                         required={true}
    //                     />

    //                     <Form.TextArea
    //                         label="Описание работы"
    //                         name="description"
    //                         placeholder="Введите описание работы"
    //                         required={true}
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
    //                             />
    //                         </Form.Column>
    //                     </Form.Row>

    //                     <SectionsList
    //                         label="Выберите секцию"
    //                         name="section_id"
    //                         isRequired={true}
    //                         className="form__field form__field_type_select"
    //                     />

    //                     <Form.TextArea
    //                         label="Рецензия на работу"
    //                         name="review"
    //                         placeholder="Напишите рецензию на работу"
    //                         required={true}
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
        return 'works';
    }
}

// Prop Types
WorkAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(WorkAdd));