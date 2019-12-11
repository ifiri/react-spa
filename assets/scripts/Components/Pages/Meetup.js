import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import * as entriesActions from '../../Actions/EntriesActions';
import * as modalsActions from '../../Actions/ModalsActions';

import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import CropperModal from '../Modals/CropperModal';
import { withState } from '../Modals';

import ActionButtons from '../ActionButtons';
import MeetupManageForm from '../Forms/MeetupManage';
import EntriesPreloader from '../Preloaders/EntriesPreloader';
import EntityTitle from '../EntityTitle';

import SectionAddForm from '../Forms/SectionAdd';
import SectionManageForm from '../Forms/SectionManage';

import Common from './Common';

import { Button } from '@material-ui/core';

import { Wrapper, MainBlock, Title, Sections } from './Meetup.style.js';

/**
 * Clients page
 */
class Meetup extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteSection = this.deleteSection.bind(this);

        this.state = {
            isLoad: false
        }
    }

    componentDidMount(){
        if(!this.props.state.isLoadPerformed && this.props.match.params.id) {
            this.setState({isLoad: true});
            this.props.actions.load('meetup',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('meetup/sections',{map:{meetup:this.props.match.params.id}});
        }
    }

    handleLogoDrop(acceptedFiles,rejectedFiles,setFieldValue){
        setFieldValue('file',acceptedFiles[0]);
    }

    
























    handleAddSection() {
        this.props.modalsActions.modalOpening('add-section-modal');
    }

    handleEditSection(section) {
        this.props.modalsActions.modalOpening('manage-section-modal', section);
    }

    





































    render() {
        const entriesType = this.getEntriesType();

        // { super.render() }
        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() }>
                { this.getPageContent() }
            </EntriesPreloader>

            <DefaultModal
                title="Добавить секцию" 
                modalId="add-section-modal" 
                modalClass="modal_size_sm" 
            >
                <SectionAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать секцию" 
                modalId="manage-section-modal" 
                modalClass="modal_size_sm" 
                form={SectionManageForm}
            />

            <CropperModal key="cropper-modal" modalClass="modal_type_cropper" />

            { this.getMessagingModals() }
            </>
        );
    }





    getPageContent() {
        const { dispatch,data } = this.props;
        let meetup = this.props.state.meetup.items;
        if (!meetup) return null;
        if ('event' in meetup) meetup = meetup.event;
        if ('meetup' in meetup) meetup = meetup.meetup;
        const sections = this.props.state['meetup/sections'].items;
        if (!sections) return null;
        if(meetup.id != this.props.match.params.id) return null;
        const editMode = true;

        const types = {
            0: 'Конференция',
            1: 'Конкурс',
            2: 'Совещание'
        }

        return(
            <Wrapper>
                <MainBlock>
                    <Title>Информация о мероприятии</Title>
                    
                    <MeetupManageForm />
                </MainBlock>
                <div style={{marginLeft:'40px'}}>
                    <Sections>
                        <Title>Секции</Title>
                        <ul>
                            {sections.map(s => (
                                <li key={`section_list_${s.id}`} onClick={()=>this.handleEditSection(s)}>{s.title}</li>
                            ))}
                        </ul>

                        <ActionButtons.Create 
                            caption="Добавить" 
                            inside={true}
                            modalId="add-section-modal"
                        />
                    </Sections>                           
                </div>
            </Wrapper>
        )
    }

    













































    getPageTitle() {
        const { state } = this.props;
        const entriesType = this.getEntriesType();
        const items = state[entriesType].items || [];

        const title = items.meetup && items.meetup.title;

        return title;
    }

    // getPageContent() {
    //     return (<>
    //         <MeetupManageForm />

    //         <br/><br/>
            
    //         { this.getEntriesListFor({ entriesType: 'meetup/sections', actionButtons: this.getActions(), isClearRequired: true }) }
    //         </>
    //     );
    // }

    getActions() {
        const entriesType = 'meetup/sections';

        return {
            delete: <ActionButtons.Delete 
                onClick={this.deleteSection} 
                entriesType={entriesType} 
            />,
            create: <ActionButtons.Create 
                entriesType={entriesType} 
                caption="Добавить секцию" 
                modalId="add-section-modal"
            />
        };

        // return <div className="actions actions_type_list">
        //     <ActionButtons.Delete 
        //         onClick={this.deleteSection} 
        //         entriesType={entriesType} 
        //     />
            
        //     <ActionButtons.Create 
        //         entriesType={entriesType} 
        //         caption="Добавить секцию" 
        //         modalId={"add-section-modal"}
        //     />
        // </div>;
    }

    /**
     * Delete selected entries, if there are blocked.
     * 
     * @param  {event} event
     * @return {void}
     */
    deleteSection(event) {
        const selectedEntries = this.props.state.selected;
        const entriesType = 'meetup/sections';

        for(const index in selectedEntries) {
            const entry = selectedEntries[index];

            this.props.actions.deleteEntry(entriesType, {
                body: entry,
                uniq: entry._uniq,
                map: {
                    section: entry.id
                }
            });
        }
    }

    getActionParams() {
        const { match } = this.props;

        return {
            map: {
                meetup: (match && match.params.id) || null
            }
        };
    }

    getEntriesType() {
        return 'meetup';
    }

    getFilter() {
        return null;
    }
}

// Prop Types
Meetup.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(entriesActions, dispatch),
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withMatch(Meetup)));