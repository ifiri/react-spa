import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';

import {Formik} from "formik";

import PropTypes from 'prop-types';

import RFCDateEntity from '../../Date/RFCDateEntity';

import Form from '../Form';
import ActionButtons from '../ActionButtons';

import SectionsList from '../Widgets/SectionsList';
import DepartmentsList from '../Widgets/DepartmentsList';

import CommonUtils from '../../Utils/Common';

import Common from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { AvatarBlock, InputWrapper, SelectWrapper, Subtitle, TwoColumns, ThreeColumns, BottomButtons } from './Participant.style';

/**
 * Form for update existing company.
 */
class ParticipantsManage extends Common {
    constructor(props) {
        super(props);

        // Links to nodes with possible user roles and to widget with banks
        this.form = null;
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

    setCoords(coords) {
        if(!coords) return;
        this.coords = coords;
    }







    handleRemove() {
        const form = this.form;
        const meetupID = this.props.match.params.id;
        const entry = this.getEntry();

        this.props.entriesActions.deleteEntry('participants', {
            headers: {
                event_id: meetupID
            },
            uniq: entry._uniq, 
            map: {
                participant: entry.id
            }
        });
    }



    handleSubmit(values) {
        const participant = this.getEntry();
        const entriesType = this.getEntriesType();
        const form = this.form;
        const body = CommonUtils.objectify(form);

        const { match } = this.props;
        const meetupID = match.params.id;

        this.props.entriesActions.update(entriesType, {
            form: form,
            uniq: participant._uniq,

            body: {
                ...body,
                ...values,

                id: participant.id,

                // avatar: this.logoBlob
            },
            map: {
                participant: participant.id
            },
            headers: {
                event_id: meetupID
            },
        });
      };
















    

  setAvatar(file,setFieldValue){
    setFieldValue("avatar",file);
    this.setState({currentAvatar:URL.createObjectURL(file)});
  }

  render(){
    const { entries } = this.props.state;
    const participant = this.getEntry();

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
    const editMode = true;
    if(editMode) {
        submitButtonText = 'Сохранить';
        submitButtonColor = 'rgb(48, 152, 212)';
    }

    let avatar = null;

    if(editMode) avatar = participant.photoOriginalUrl;
    if(this.state.currentAvatar) avatar = this.state.currentAvatar;

    return(
      <>
        <Formik
          ref={e => {
            this.formik = e;
          }}
          initialValues={{
            name: editMode ? participant.name : null,
            surname: editMode ? participant.sirname : null,
            patronymic: editMode ? participant.patronymic : null,
            departament_id: editMode ? participant.department.id : (
                departments[0] && departments[0].id
            ),
            position: editMode ? participant.position : null,
            role: editMode ? participant.role : null, 
            section_id: editMode ? participant.additonalProperties.section_id : (
                sections[0] && sections[0].id
            ),
            type: editMode ? participant.type : 1,
            email: editMode ? participant.email : null,
            phone: editMode ? participant.phone : null,
            avatar: null
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
                <AvatarBlock>
                    <InputWrapper>
                        <Form.File 
                            label=""
                            setLogoBlob={this.setLogoBlob} 
                            setCoords={this.setCoords} 
                            name="avatar" 
                            accept=".jpg"
                            mode="participants"
                            value={avatar}
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
    //     if(this.formBlock) {
    //         const entry = this.getEntry();

    //         this.formBlock.style.display = 'flex';

    //         if(entry && entry.type) {
    //             const type = parseInt(entry.type);

    //             this.toggleSegments(type);
    //         }
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

    // render() {
    //     const entry = this.getEntry();

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
    //                         value={entry.type}
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
    //                         value={entry.name}
    //                         required={true}
    //                     />

    //                     <Form.Text
    //                         label="Фамилия"
    //                         name="surname"
    //                         placeholder="Введите фамилию участника"
    //                         value={entry.sirname}
    //                         required={true}
    //                     />

    //                     <Form.Text
    //                         label="Отчество"
    //                         name="patronymic"
    //                         placeholder="Введите отчество участника"
    //                         value={entry.patronymic}
    //                         required={true}
    //                     />
                        
    //                     <Form.File 
    //                         label="Фотография"
    //                         setLogoBlob={this.setLogoBlob} 
    //                         name="avatar" 
    //                         accept=".jpg,.png" 
    //                         value={entry.photo_original_url}
    //                     />
    //                 </Form.Column>

    //                 <Form.Column>
    //                     <DepartmentsList
    //                         label="ОСТ"
    //                         name="departament_id"
    //                         value={entry.department && entry.department.id}
    //                         isRequired={true}
    //                         className="form__field form__field_type_select"
    //                     />

    //                     <div data-segment="participant-position">
    //                         <Form.Text
    //                             label="Должность"
    //                             name="position"
    //                             placeholder="Введите должность"
    //                             value={entry.position}
    //                         />
    //                     </div>
                        
    //                     <SectionsList
    //                         label="Секция"
    //                         name="section_id"
    //                         value={entry.additonalProperties && entry.additonalProperties.section_id}
    //                         isRequired={true}
    //                         className="form__field form__field_type_select"
    //                     />

    //                     <div data-segment="participant-position">
    //                         <Form.Text
    //                             label="Отдел"
    //                             name="role"
    //                             value={entry.role}
    //                         />
    //                     </div>

    //                     <div data-segment="participant-personal">
    //                         <Form.Email
    //                             label="Электронная почта"
    //                             name="email"
    //                             value={entry.email}
    //                         />
    //                     </div>
                        
    //                     <div data-segment="participant-personal">
    //                         <Form.Text
    //                             label="Телефон"
    //                             name="phone"
    //                             value={entry.phone}
    //                         />
    //                     </div>
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
        return 'participants';
    }

    setLogoBlob(blob) {
        this.logoBlob = blob;
    }
}

// Prop Types
ParticipantsManage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(ParticipantsManage));