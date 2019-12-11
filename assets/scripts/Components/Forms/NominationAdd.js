import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Formik} from "formik";
import ActionButtons from '../ActionButtons';

import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import Form from '../Form';

import SectionsList from '../Widgets/SectionsList';

import CommonForm from './Common';

import * as entriesActions from '../../Actions/EntriesActions';

import { Title, InputWrapper, BottomButtons, SelectWrapper } from './Nomination.style';

/**
 * Form for creating new users.
 */
class NominationAdd extends CommonForm {
    constructor(props) {
        super(props);

        this.setFormRef = this.setFormRef.bind(this);
    }

    setFormRef(element) {
        this.form = element;
    }













































    handleSubmit(values) {
        const { entries } = this.props.state;

        const sections = (
            entries['meetup/sections'] && entries['meetup/sections'].items
        ) || [];

        const meetupID = this.props.match.params.id;

        values.meetup = meetupID;
        // values.section = sections[values.section] && sections[values.section].id;

        const sectionIndex = sections.findIndex(element => {
            if(parseInt(element.id) === parseInt(values.section)) {
                return element;
            }
        });

        values.section = sections[sectionIndex] && sections[sectionIndex].id;

        console.log(values);

        const entryType = this.getEntriesType();
        const form = this.form;
        
        this.props.actions.create(entryType, {
            form: form,
            body:values,
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
        const { event } = data;
        const {_uniq} = event;
        dispatch(deleteEntry('nominations',{uniq:_uniq,map:{nomination:event.id}}));
        this.props.onClose();
    }

    render(){
        const { entries } = this.props.state;

        let modalTitle = 'Новая номинация';
        let submitButtonText = 'Добавить';
        let submitButtonColor = 'rgb(54, 155, 0)';

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
                        title: null,
                        description: null, 
                        section: null, 
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
    //             <Form.Text
    //                 label="Название номинации"
    //                 name="title"
    //                 placeholder="Введите название номинации"
    //                 required={true}
    //             />

    //             <Form.TextArea
    //                 label="Описание номинации"
    //                 name="description"
    //                 placeholder="Введите описание номинации"
    //             />

    //             <SectionsList
    //                 label="Выберите секцию"
    //                 name="section_id"
    //                 className="form__field form__field_type_select"
    //                 isRequired={true}
    //             />

    //             <Form.Footer>
    //                 <Form.Submit caption="Добавить" />
    //             </Form.Footer>
    //         </Form.Wrapper>
    //     );
    // }

    

    getEntriesType() {
        return 'nominations';
    }
}

// Prop Types
NominationAdd.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(NominationAdd));