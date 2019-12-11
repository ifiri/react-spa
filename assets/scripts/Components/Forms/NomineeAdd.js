import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import {Formik} from "formik";
import moment from "moment";
import DatePicker from "react-datepicker";
import MaskedTextInput from "react-text-mask";
import ActionButtons from '../ActionButtons';

import PropTypes from 'prop-types';

import Form from '../Form';

import WorksList from '../Widgets/WorksList';
import NominationsList from '../Widgets/NominationsList';

import CommonForm from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, SelectWrapper, Subtitle, TwoColumns, ThreeColumns, BottomButtons, CuratorInfo } from './Nominee.style';

/**
 * Form for creating new users.
 */
class NomineeAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.handleNominee = this.handleNominee.bind(this);
        this.handlePlace = this.handlePlace.bind(this);
        this.handleType = this.handleType.bind(this);

        this.state = {
            place: 0,
            nominee: 0,

            type: 0,
        };

        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }



















































  handleSubmit(values) {
    const { entries } = this.props.state;
    const meetupType = this.getMeetupType();
    const meetupID = this.props.match.params.id;

    const nominations = entries.nominations.items || [];
    const works = entries.works.items || [];

    const type = Number(values.type);

    const newValues = {
        nomination: {
            id: nominations[values.nomination] && nominations[values.nomination].id,
        },
        place: this.state.place,
    };

    switch(Number(meetupType)) {
        case 0: // Конференция
            newValues.work = {
                'id': works[values.work] && works[values.work].id,
            };
            
            break;

        case 1: // Конкурс
            switch(type) {
                case 1: // ОСТ
                    newValues.department = {
                        'id': values.ost,
                    };
                    break;
 
                case 2: // Участник
                    newValues.user = {
                        'id': this.state.nominee,
                    };
                    break;
            }

            break;

        case 2: // Совещание
            return;
            break;
    }

    if (values.curator_id !== null && values.curator_id !== undefined) {
        newValues.curator_id = Number(values.curator_id);
    }

    const entryType = this.getEntriesType();
        const form = this.form;
        
        this.props.actions.create(entryType, {
            form: form,
            body:newValues,
            map: {
                nominee: '%id%',
                meetup: meetupID
            },
            headers: {
                event_id: meetupID
            }, 
        });
  }





























  handleRemove(){
    const { dispatch,data } = this.props;
    const { event, meetupID } = data;
    const {_uniq} = event;
    dispatch(deleteEntry('nominees',{headers: {
            event_id:meetupID
        },uniq:_uniq,map:{nominee:event.id}}));
    this.props.onClose();
}

    handleNominee(e, setFieldValue) {
        const { value } = e.target;

        this.setState({
            nominee: value
        });

        setFieldValue('nominee', value);
    }

    handlePlace(e, setFieldValue) {
        const { value } = e.target;
        
        this.setState({
            place: value
        });

        setFieldValue('place', value);
    }

    handleType(e, setFieldValue) {
        const { value } = e.target;
        
        this.setState({
            type: value
        });

        setFieldValue('type', value);
    }

    getMeetupType() {
        // <option value="0">Конференция</option>
        // <option value="1">Конкурс</option>
        // <option value="2">Совещание</option>
        
        const { entries } = this.props.state;
        const meetup = (
            entries.meetup.items 
            && 
            entries.meetup.items.event
        ) || null;

        return meetup && meetup.type;
    }

  render(){
    const { entries } = this.props.state;

    const events = entries.events.items || [];
    const nominations = entries.nominations.items || [];
    const works = entries.works.items || [];
    const participants = entries.participants.items || [];

    let modalTitle = 'Добавить номинанта';
    let submitButtonText = 'Добавить';
    let submitButtonColor = 'rgb(54, 155, 0)';
    
    const places = [1,2,3,4,5,6];

    const meetupType = this.getMeetupType();

    console.log('::: VALUES');
    console.log(event);

    return(
      <>
        <Formik
          ref={e => {
            this.formik = e;
          }}
          initialValues={{
            ost: null,
            user: null,
            type: this.state.type,

            nomination: null,
            work: null,

            place: null,
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
                {(() => {
                    switch(meetupType) {
                        case 0: // Конференция
                            return this.getMeetupLayout(values, setFieldValue, handleChange);

                        case 1: // Конкурс
                            return this.getContestLayout(values, setFieldValue, handleChange);

                        case 2: // Совещание
                            return this.getConferenceLayout(values, setFieldValue, handleChange);
                    }
                })()}

                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Номинация</label>

                    <SelectWrapper>
                        {nominations[values.nomination] && nominations[values.nomination].title}
                        <select key={'nomination'} id="nomination" currentValue={parseInt(values.nomination)} onChange={handleChange}>
                            <option key={`works_modal_nomination00_option_00`} value={''}>Выберите...</option>
                            {nominations.map((c,i) => (
                                <option key={`works_modal_authozzzrs_option_${c.id}`} value={i}>{c.title}</option>
                            ))};
                        </select>
                    </SelectWrapper>
                </InputWrapper>

                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Призовое место</label>

                    <SelectWrapper className="place-select">
                        { this.fuckkolya('place') }
                        
                        <select key={'place'} id="place" currentValue={values.place} onChange={e=>this.handlePlace(e, setFieldValue)}>
                            <option key={`works_modal_authors00_option_00`} value={0}>Выберите...</option>
                            {places.map(c => (
                                <option key={`works_modal_authors_option_${c}`} value={c}>{c}</option>
                            ))};
                        </select>
                    </SelectWrapper>
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

    getContestLayout(values, setFieldValue, handleChange) {
        const { entries } = this.props.state;
        const types = {
            1: 'ОСТ',
            2: 'Участник',
        };

        const participants = entries.participants.items || [];
        const osts = (
            entries['company/departments'] && entries['company/departments'].items
        ) || [];
        const ostIndex = values.ost && osts.findIndex(element => {
            if(values.ost == element.id) {
                return element;
            }
        });
    
        return (<>
            <InputWrapper>
                <label>Тип номинанта</label>

                <SelectWrapper>
                    {types[values.type]}
                    <select id="type" currentValue={values.type} onChange={e => this.handleType(e, setFieldValue)}>
                        <option key={`zevent_modal_type_option_900`} value={0}>Выберите...</option>
                        {Object.keys(types).map(key => (
                            <option key={`zevent_modal_type_option_${key}`} value={key}>{types[key]}</option>
                        ))};
                    </select>
                </SelectWrapper>
            </InputWrapper>

            {(() => {
                console.log(this.state.type);
                if(Number(this.state.type) === 1) {
                    return <InputWrapper style={{marginTop:'8px'}}>
                        <label>ОСТ</label>

                        <SelectWrapper className="ost">
                            {ostIndex && osts[ostIndex] && osts[ostIndex].title}
                            <select currentValue={values.ost} id="ost" onChange={handleChange}>
                                {osts.map((o,i) => (
                                    <option key={'nominee_modal_ost_option_' + i} value={o.id}>{o.title}</option>)
                                )}
                            </select>
                        </SelectWrapper>
                    </InputWrapper>;
                } else if(Number(this.state.type) === 2) {
                    return <InputWrapper style={{marginTop:'8px'}}>
                        <label>Участник</label>

                        <SelectWrapper className="curator-select">
                            { this.fuckkolya('nominee', participants) }
                            
                            <select key={'nominee'} id="nominee" currentValue={values.user} onChange={e=>this.handleNominee(e, setFieldValue)}>
                                <option key={`nomineeees_modal_authors00_option_00`} value={0}>Выберите...</option>
                                {participants.map(c => (
                                    <option key={`nomineeees_modal_authors_option_${c.id}`} value={c.id}>{c.fio}</option>
                                ))};
                            </select>
                        </SelectWrapper>
                    </InputWrapper>;
                }
            })()}
        </>);
    }

    getMeetupLayout(values, setFieldValue, handleChange) {
        const { entries } = this.props.state;

        const works = (
            entries['works'] && entries['works'].items
        ) || [];

        return (<>
            <InputWrapper style={{marginTop:'8px'}}>
                <label>Тема доклада</label>

                <SelectWrapper className="works">
                    {works[values.work] && works[values.work].title}

                    <select currentValue={values.works} id="work" onChange={handleChange}>
                        <option key={'nominee_modal_work_option_000'} value={''}>Выберите...</option>)
                        {works.map((o,i) => (
                            <option key={'nominee_modal_work_option_' + i} value={i}>{o.title}</option>)
                        )}
                    </select>
                </SelectWrapper>
            </InputWrapper>
        </>);
    }






    getConferenceLayout(values, setFieldValue, handleChange) {
        const { entries } = this.props.state;
        const participants = entries.participants.items || [];

        return (<>
            <InputWrapper style={{marginTop:'8px'}}>
                <label>Участник</label>

                <SelectWrapper className="curator-select">
                    { this.fuckkolya('nominee', participants) }
                    
                    <select key={'nominee'} id="nominee" currentValue={values.user} onChange={e=>this.handleNominee(e, setFieldValue)}>
                        <option key={`nomineeees_modal_authors00_option_00`} value={0}>Выберите...</option>
                        {participants.map(c => (
                            <option key={`nomineeees_modal_authors_option_${c.id}`} value={c.id}>{c.fio}</option>
                        ))};
                    </select>
                </SelectWrapper>
            </InputWrapper>
        </>);
    }

    fuckkolya(type, users = null) {
        // if(!('type' in this.state)) {
        //     return null;
        // }

        const value = this.state[type];

        // console.log(this.state);
        // console.log(value);

        if(!value || value == 0) {
            return <CuratorInfo>
                <div></div>

                {(()=> {
                    if(type === 'place') {
                        return <div className="no-curator">Место не выбрано</div>;
                    } else {
                        return <div className="no-curator">Номинант не выбран</div>;
                    }
                })()}
            </CuratorInfo>;
        } else {
            if(type === 'place') {
                const place = 'dist/images/icons/results-' + value + '-place.svg';
                let numberable = '';
                switch(value) {
                    case 1: numberable = 'Первое'; break;
                    case 2: numberable = 'Второе'; break;
                    case 3: numberable = 'Третье'; break;
                    case 4: numberable = 'Четвертое'; break;
                    case 5: numberable = 'Пятое'; break;
                    case 6: numberable = 'Шестое'; break;
                }
                return <CuratorInfo key={'_nikolaevpidor' + type + '.' + value}>
                    <div className="place-avatar" style={{backgroundImage:`url(${place})`}}></div>
                    <div className="place-title">
                        {numberable} место
                    </div>
                </CuratorInfo>;
            } else {
                const user = users.filter(c=>c.id===Number(value));

                console.log(user);
                console.log(value);

                return <CuratorInfo key={'_nikolaevpidor' + type + '.' + value}>
                    <div className="curator-avatar" style={{backgroundImage:`url(${user && user[0].photoOriginalUrl})`}}></div>
                    <div>
                        {user && user[0].fio}<br/>
                        <span>{user && user[0].department.title}</span>
                    </div>
                </CuratorInfo>;
            }
            

            
        }
    }












































































    // render() {
    //     const { match } = this.props;
    //     const meetup = (match && match.params.id) || null;

    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <WorksList
    //                 label="Работа"
    //                 name="work_id"
    //                 isRequired={true}
    //                 className="form__field form__field_type_select"
    //             />

    //             <NominationsList
    //                 label="Номинация (на что номинируем)"
    //                 name="nomination_id"
    //                 isRequired={true}
    //                 className="form__field form__field_type_select"
    //             />

    //             <Form.Select
    //                 label="Место"
    //                 name="place"
    //                 items={{
    //                     1: 1,
    //                     2: 2,
    //                     3: 3
    //                 }}
    //                 className="form__field form__field_type_select"
    //                 isRequired={true}
    //             />

    //             <Form.Footer>
    //                 <Form.Hidden name="meetup" value={meetup} />
    //                 <Form.Submit caption="Добавить" />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    

    getEntriesType() {
        return 'nominees';
    }
}

// Prop Types
NomineeAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(NomineeAdd));