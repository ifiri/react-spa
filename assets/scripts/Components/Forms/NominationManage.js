import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Formik} from "formik";
import { withMatch } from '../Routing';
import ActionButtons from '../ActionButtons';

import PropTypes from 'prop-types';

import Form from '../Form';

import SectionsList from '../Widgets/SectionsList';

import Common from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, BottomButtons, SelectWrapper } from './Nomination.style';

/**
 * Form for update existing company.
 */
class NominationManage extends Common {
    constructor(props) {
        super(props);

        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }



















    handleRemove() {
        const form = this.form;
        const meetupID = this.props.match.params.id;
        const entry = this.getEntry();

        this.props.entriesActions.deleteEntry('nominations', {
            uniq: entry._uniq, 
            map: {
                nomination: entry.id
            }
        });
    }




    handleSubmit(values){
        const { entries } = this.props.state;

        const sections = (
            entries['meetup/sections'] && entries['meetup/sections'].items
        ) || [];
        const event = this.getEntry();
        const meetupID = this.props.match.params.id;

        values.meetup = meetupID;
        // values.section = sections[values.section] && sections[values.section].id;

        const sectionIndex = sections.findIndex(element => {
            if(parseInt(element.id) === parseInt(values.section)) {
                return element;
            }
        });

        values.section = sections[sectionIndex] && sections[sectionIndex].id;

        const form = this.form;

        this.props.entriesActions.update('nominations', {
            form: form,
            uniq: event._uniq,
            body: {
                ...values,
                id: event.id,
            },
            headers: {
                event_id: meetupID
            }, 
            map:{
                nomination: event.id
            }
        });
    }





























    

    render(){
        const { entries } = this.props.state;
        const event = this.getEntry();

        let modalTitle = 'Новая номинация';
        let submitButtonText = 'Добавить';
        let submitButtonColor = 'rgb(54, 155, 0)';
        const editMode = true;
        if(editMode) {
            modalTitle = 'Редактирование номинации';
            submitButtonText = 'Сохранить';
            submitButtonColor = 'rgb(48, 152, 212)';
        }

        const sections = (
            entries['meetup/sections'] && entries['meetup/sections'].items
        ) || [];
        
        return (
            <>
                <Formik
                    ref={e => {
                        this.formik = e;
                    }}
                    initialValues={{
                        title: editMode ? event.title : null,
                        description: editMode ? event.description : null, 
                        section: editMode ? event.section_id : null, 
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
                    const sectionIndex = values.section !== null && sections.findIndex(element => {
                        if(parseInt(element.id) === parseInt(values.section)) {
                            return element;
                        }
                    });

                    // console.log('SECCCCCCCCCCCCTIOn');
                    // console.log(sectionIndex);
                    // console.log(values.section);

                    return (
                        <form onSubmit={handleSubmit} ref={this.setFormRef}>
                            <InputWrapper>
                                <label>Название</label>
                                <input type="text" placeholder="Введите название" id="title" value={values.title} onChange={handleChange} />
                            </InputWrapper>
                            <InputWrapper style={{marginTop:'8px'}}>
                                <label>Описание</label>
                                <textarea placeholder="Введите описание" id="description" onChange={handleChange}>{values.description}</textarea>
                            </InputWrapper>
                            <InputWrapper style={{marginTop:'8px'}}>
                                <label>Секция</label>
                                <SelectWrapper>
                                    {
                                        sections[sectionIndex]
                                        &&
                                        sections[sectionIndex].title
                                    }

                                    <select id="section" currentValue={values.section} onChange={handleChange}>
                                        <option key={`nominations_modal_sections_option_00`} value={''}>Выберите...</option>
                                        {Object.keys(sections).map(key => (
                                            <option key={`nominations_modal_sections_option_${key}`} value={sections[key].id}>{sections[key].title}</option>
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






































































    // componentDidMount() {
    //     const entry = this.getEntry();
    //     const entriesType = this.getEntriesType();

    //     if(!this.getNomination() && !this.isLoadPerformed() && !this.isLoadStarted()) {
    //         this.props.entriesActions.load(entriesType, {
    //             map: {
    //                 nomination: entry.id
    //             }
    //         });
    //     }
    // }

    // componentWillUnmount() {
    //     const entriesType = this.getEntriesType();
        
    //     this.props.entriesActions.clearEntries(entriesType);
    // }

    // render() {
    //     const entry = this.getNomination() || {};

    //     // if(!entry.id) {
    //     //     return null;
    //     // }

    //     return (
    //         <Form.Wrapper onSubmit={this.onFormSubmit}>
    //             <Form.Text
    //                 label="Название номинации"
    //                 name="title"
    //                 placeholder="Введите название номинации"
    //                 value={entry.title}
    //                 required={true}
    //             />

    //             <Form.TextArea
    //                 label="Описание номинации"
    //                 name="description"
    //                 value={entry.description}
    //                 placeholder="Введите описание номинации"
    //             />

    //             <SectionsList
    //                 label="Выберите секцию"
    //                 name="section_id"
    //                 value={entry.additonalProperties && entry.additonalProperties.section_id}
    //                 className="form__field form__field_type_select"
    //                 isRequired={true}
    //             />

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

    getNomination() {
        const { state } = this.props;
        const entriesType = this.getEntriesType();

        return (
            this.props.state.entries[entriesType] && this.props.state.entries[entriesType].items
        ) || null;
    }

    

    getEntriesType() {
        return 'nomination';
    }
}

// Prop Types
NominationManage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(NominationManage));