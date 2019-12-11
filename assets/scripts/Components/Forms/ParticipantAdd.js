import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import {Formik} from "formik";

import PropTypes from 'prop-types';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import SectionsList from '../Widgets/SectionsList';
import DepartmentsList from '../Widgets/DepartmentsList';

import CommonForm from './Common';

import CommonUtils from '../../Utils/Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { AvatarBlock, InputWrapper, SelectWrapper, Subtitle, TwoColumns, ThreeColumns, BottomButtons } from './Participant.style';

/**
 * Form for creating new users.
 */
class ParticipantAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.formBlock = null;
        this.logoBlob = null;
        this.coords = null;

        this.onFormSubmit = this.onFormSubmit.bind(this);
        // this.onRoleToggle = this.onRoleToggle.bind(this);
        this.setLogoBlob = this.setLogoBlob.bind(this);
        this.setCoords = this.setCoords.bind(this);
        this.setFormRef = this.setFormRef.bind(this);

        this.state = {
          currentAvatar : null
      }
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
        console.log('::: COOOOORDS');
        console.log(coords);
    }

    getEntriesType() {
        return 'participants';
    }

    
















    handleClose(event){
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(hideModal());
  }
  








  handleSubmit(values) {
    const form = this.form;
    const entryType = this.getEntriesType();
    const meetupID = this.props.match.params.id;

    const body = CommonUtils.objectify(form);
        
    this.props.actions.create(entryType, {
        form: form,
        body: {
            ...body,
            ...values,

            avatar: this.logoBlob
        },
        map: {
            participant: '%id%',
            meetup: meetupID
        },
        headers: {
            event_id: meetupID
        },
    });
  };











  handleRemove(){
    const { dispatch,data } = this.props;
    const { participant,meetupID } = data;
    const {_uniq} = participant;
    dispatch(deleteEntry('participants',{headers: {
            event_id: data.meetupID
        },uniq:_uniq,map:{participant:participant.id}}));
    this.props.onClose();
  }

  setAvatar(file,setFieldValue){
    setFieldValue("avatar",file);
    this.setState({currentAvatar:URL.createObjectURL(file)});
  }

  render(){
    const { entries } = this.props.state;

    const departments = entries['company/departments'].items;
    const sections = entries['meetup/sections'].items;
    const types = {
        1: 'Участник',
        2: 'Член конкурсной комиссии',
        3: 'Куратор'
    };

    if (!departments || !sections) return null;

    let submitButtonText = 'Добавить';
    let submitButtonColor = 'rgb(54, 155, 0)';

    let avatar = null;

    if(this.state.currentAvatar) avatar = this.state.currentAvatar;


    // <input
    //                   className="participant-upload"
    //                   autoComplete="off"
    //                   id="avatar"
    //                   type="file"
    //                   onChange={event => {
    //                     this.setAvatar(event.currentTarget.files[0],setFieldValue);
    //                   }}
    //                 />

    return(
      <>
        <Formik
          ref={e => {
            this.formik = e;
          }}
          initialValues={{
            name: null,
            surname: null,
            patronymic: null,
            departament_id: (
                departments[0] && departments[0].id
            ),
            position: null,
            role: null, 
            section_id: (
                sections[0] && sections[0].id
            ),
            type: 1,
            email: null,
            phone: null,
            avatar: undefined
          }}
          onSubmit={(e)=>this.handleSubmit(e)}
          render={({
            values,
            errors,
            touched,
            handleSubmit,
            handleChange,
            setFieldValue,
            isSubmitting,
            status,
          }) => {console.log(values); return (
            <form onSubmit={handleSubmit} ref={this.setFormRef}>
                <AvatarBlock avatar={avatar}>
                    <InputWrapper>
                        <Form.File 
                            label=""
                            setLogoBlob={this.setLogoBlob} 
                            setCoords={this.setCoords} 
                            name="avatar" 
                            accept=".jpg"
                            mode="participants"
                        />
                    </InputWrapper>
                </AvatarBlock>
                
                

                <InputWrapper style={{marginTop:'34px'}}>
                    <label>Тип участника</label>
                    <SelectWrapper>
                        <span>{types[values.type]}</span>
                        <select id="type" currentValue={values.type} onChange={handleChange}>
                            {Object.keys(types).map(key => (
                                <option key={`paticipant_modal_type_option_${key}`} value={key}>{types[key]}</option>
                            ))};
                        </select>
                    </SelectWrapper>
                </InputWrapper>
                <Subtitle style={{marginTop:'32px'}}>Общая информация</Subtitle>
                <ThreeColumns style={{marginTop:'8px'}}>
                    <InputWrapper>
                        <label>Фамилия</label>
                        <input type="text" placeholder="Введите фамилию" id="surname" value={values.surname} onChange={handleChange} />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Имя</label>
                        <input type="text" placeholder="Введите имя" id="name" value={values.name} onChange={handleChange} />
                    </InputWrapper>
                    <InputWrapper>
                        <label>Отчество</label>
                        <input type="text" placeholder="Введите отчество" id="patronymic" value={values.patronymic} onChange={handleChange}  />
                    </InputWrapper>
                </ThreeColumns>
                <Subtitle style={{marginTop:'32px'}}>Подробная информация</Subtitle>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>ОСТ</label>
                    <SelectWrapper>
                        {values.departament_id ? departments.filter(d=>d.id == values.departament_id)[0].title : null}
                        <select id="departament_id" currentValue={values.departament_id} onChange={handleChange}>
                            {departments.map(d => (
                                <option key={`paticipant_modal_department_option_${d.id}`} value={d.id}>{d.title}</option>
                             ))};
                        </select>
                    </SelectWrapper>
                </InputWrapper>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Отдел</label>
                    <input type="text" placeholder="Укажите отдел" id="role" value={values.role} onChange={handleChange} />
                </InputWrapper>
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Должность</label>
                    <input type="text" placeholder="Укажите должность" id="position" value={values.position} onChange={handleChange} />
                </InputWrapper>
                {values.type != 3 ?
                <InputWrapper style={{marginTop:'8px'}}>
                    <label>Секция</label>
                    <SelectWrapper>
                    {values.section_id ? sections.filter(s=>s.id == values.section_id)[0].title : null}
                        <select id="section_id" currentValue={values.section_id} onChange={handleChange} >
                            {sections.map(s => (
                                <option key={`paticipant_modal_section_option_${s.id}`} value={s.id}>{s.title}</option>
                             ))}
                        </select>
                    </SelectWrapper>
                </InputWrapper> :
                <TwoColumns style={{marginTop:'8px'}}>
                        <InputWrapper>
                            <label>Email</label>
                            <input type="text" placeholder="Укажите email" id="email" value={values.email} onChange={handleChange} />
                        </InputWrapper>
                        <InputWrapper>
                            <label>Номер телефона</label>
                            <input type="text" placeholder="Укажите номер телефона" id="phone" value={values.phone} onChange={handleChange} />
                        </InputWrapper>         
                </TwoColumns>}

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










































































    // componentDidMount() {
    //     if(this.formBlock) {
    //         this.formBlock.style.display = 'none';

    //         const segments = this.formBlock.querySelectorAll('[data-segment]');

    //         for(const segment of segments) {
    //             segment.style.display = 'none';
    //         }
    //     }
    // }

    // onRoleToggle(event) {
    //     const selectedTrigger = event.target;
    //     const role = parseInt(selectedTrigger.value);

    //     if(this.formBlock && this.formBlock.style.display === 'none') {
    //         this.formBlock.style.display = 'flex';
    //     }

    //     if(this.formBlock) {
    //         this.toggleSegments(role);
    //     }
    // }

    // toggleSegments(role) {
    //     const positionSegments = this.formBlock.querySelectorAll('[data-segment="participant-position"]');
    //     const personalSegments = this.formBlock.querySelectorAll('[data-segment="participant-personal"]');

    //     switch(role) {
    //         case 1: // Участник
    //         case 2: // Член жюри
    //             for(const segment of positionSegments) {
    //                 const input = segment.querySelector('input');
    //                 segment.style.display = 'block';

    //                 input && input.removeAttribute('disabled');
    //             }

    //             for(const segment of personalSegments) {
    //                 const input = segment.querySelector('input');
    //                 segment.style.display = 'none';

    //                 input && input.setAttribute('disabled', true);
    //             }
    //             break;

    //         case 3: // Куратор
    //             for(const segment of positionSegments) {
    //                 const input = segment.querySelector('input');
    //                 segment.style.display = 'none';

    //                 input && input.setAttribute('disabled', true);
    //             }

    //             for(const segment of personalSegments) {
    //                 const input = segment.querySelector('input');
    //                 segment.style.display = 'block';

    //                 input && input.removeAttribute('disabled');
    //             }
    //             break;
    //     }
    // }

    // render() {
    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Row>
    //                 <Form.Column>
    //                     <Form.Toggle
    //                         caption="Выберите тип участника"
    //                         choices={{
    //                             1: 'Участник',
    //                             2: 'Член жюри',
    //                             3: 'Куратор'
    //                         }}
    //                         onToggle={this.onRoleToggle}
    //                         name="type"
    //                     />
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Row forwardedRef={this.setFormRef}>
    //                 <Form.Column>
    //                     <Form.Text
    //                         label="Имя"
    //                         name="name"
    //                         placeholder="Введите полное имя участника"
    //                         required={true}
    //                     />

    //                     <Form.Text
    //                         label="Фамилия"
    //                         name="surname"
    //                         placeholder="Введите фамилию участника"
    //                         required={true}
    //                     />

    //                     <Form.Text
    //                         label="Отчество"
    //                         name="patronymic"
    //                         placeholder="Введите отчество участника"
    //                         required={true}
    //                     />
                        
                        // <Form.File 
                        //     label="Фотография"
                        //     setLogoBlob={this.setLogoBlob} 
                        //     name="avatar" 
                        //     accept=".jpg,.png" 
                        // />
    //                 </Form.Column>

    //                 <Form.Column>
    //                     <DepartmentsList
    //                         label="ОСТ"
    //                         name="departament_id"
    //                         isRequired={true}
    //                         className="form__field form__field_type_select"
    //                     />

    //                     <div data-segment="participant-position">
    //                         <Form.Text
    //                             label="Должность"
    //                             name="position"
    //                             placeholder="Введите должность"
    //                         />
    //                     </div>
                        
    //                     <SectionsList
    //                         label="Секция"
    //                         name="section_id"
    //                         isRequired={true}
    //                         className="form__field form__field_type_select"
    //                     />

    //                     <div data-segment="participant-position">
    //                         <Form.Text
    //                             label="Отдел"
    //                             name="role"
    //                         />
    //                     </div>

    //                     <div data-segment="participant-personal">
    //                         <Form.Email
    //                             label="Электронная почта"
    //                             name="email"
    //                         />
    //                     </div>
                        
    //                     <div data-segment="participant-personal">
    //                         <Form.Text
    //                             label="Телефон"
    //                             name="phone"
    //                         />
    //                     </div>
    //                 </Form.Column>
    //             </Form.Row>

    //             <Form.Footer>
    //                 <Form.Submit caption="Добавить" />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    

    
}

// Prop Types
ParticipantAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(ParticipantAdd));