import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import { withState } from '../Modals';
import { withMatch } from '../Routing';

import ActionButtons from '../ActionButtons';
import Filter from '../Filters/Nominees';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import InformationAddForm from '../Forms/InformationAdd';
import InformationManageForm from '../Forms/InformationManage';
import InformationContactAddForm from '../Forms/InformationContactAdd';
import InformationContactManageForm from '../Forms/InformationContactManage';

import Common from './Common';

import * as modalsActions from '../../Actions/ModalsActions';

import { Wrapper, MainBlock, Title, ItemsCount, Button, SelectWrapper, Sections } from './Information.style.js';

/**
 * Works page
 */
class Information extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteNominee = this.deleteNominee.bind(this);

        this.state = {
            isLoad: false,
        }
    }

    handleOSTFilter(event) {
        const { value } = event.target;
        this.setState({currentOST:value});
    }

    componentDidMount(){
        if(!this.state.isLoad){
            this.setState({isLoad: true});
            this.props.actions.load('information',{
                map:{
                    meetup:this.props.match.params.id,
                }
            });
            this.props.actions.load('information/contacts',{
                map:{
                    meetup:this.props.match.params.id,
                }
            });
        }
    }

    getSortedItems() {
        return this.props.state.information.items || [];
    }






































    render() {
        const entriesType = this.getEntriesType();

        // { super.render() }
        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() }>
                { this.getPageContent() }
            </EntriesPreloader>

            <DefaultModal
                title="Добавить достопримечательность" 
                modalId="add-information-modal" 
                modalClass="modal_size_sm" 
                isPreloaderRequired={true}
            >
                <InformationAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать достопримечательность" 
                modalId="manage-information-modal" 
                modalClass="modal_size_sm" 
                form={InformationManageForm}
                isPreloaderRequired={true}
            />


            <DefaultModal
                title="Добавить контакт" 
                modalId="add-information-contact-modal" 
                modalClass="modal_size_sm" 
                isPreloaderRequired={true}
            >
                <InformationContactAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать контакт" 
                modalId="manage-information-contact-modal" 
                modalClass="modal_size_sm" 
                form={InformationContactManageForm}
                isPreloaderRequired={true}
            />

            { this.getMessagingModals() }
            </>
        );
    }



















    getPageContent() {
        let items = [];
        if(this.state.isLoad) {
            items = this.getSortedItems();
        }
        const contacts = (
            this.props.state['information/contacts'] && this.props.state['information/contacts'].items
        ) || [];

        return (
            <Wrapper>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <MainBlock>
                        <div className="content__fragment content__filter-area" style={{height:'42px'}}>
                            <Title>О городе</Title>

                            <ActionButtons.Create 
                                caption="Добавить" 
                                modalId="add-information-modal"
                            />
                        </div>
                        <div className="content__fragment participants-list"> 
                            {items.map(p => {
                                return (
                                <div key={'information' + p.id} onClick={()=>this.handleEditInformation(p)}>
                                    <div className="participan-fio participan-cell">
                                        <div>{p.title}</div>
                                        <div>Название</div>
                                    </div>
                                    <div className="participan-description participan-cell">
                                        <div>{p.content}</div>
                                        <div>Описание</div>
                                    </div>
                                    <div className="right-corner"></div>
                                </div>
                            )})}
                        </div>
                    </MainBlock>

                    <div style={{marginLeft:'20px',marginTop:'30px'}}>
                        <Sections>
                            <Title>Телефоны</Title>

                            <ul>
                                {contacts.map(d => (
                                    <li key={`contacts_list_${d.id}`} onClick={()=>this.handleEditContact(d)}>
                                        {d.phone} ({d.title})
                                    </li>
                                ))}
                            </ul>

                            <ActionButtons.Create 
                                caption="Добавить" 
                                inside={true}
                                modalId="add-information-contact-modal"
                            />
                        </Sections>                           
                    </div>
                </div>
            </Wrapper>
        )
    }

















































    handleAddInformation(){
        this.props.modalsActions.modalOpening('add-information-modal');
    }

    handleEditInformation(event){
        this.props.modalsActions.modalOpening('manage-information-modal', event);
    }



    handleAddContact(){
        this.props.modalsActions.modalOpening('add-information-contact-modal');
    }

    handleEditContact(event){
        this.props.modalsActions.modalOpening('manage-information-contact-modal', event);
    }


    

    getPageTitle() {
        return 'Результаты участников мероприятия';
    }

    getPageTitleVariant() {
        return 'secondary';
    }

    getActions() {
        const entriesType = this.getEntriesType();

        return {
            delete: <ActionButtons.Delete 
                onClick={this.deleteNominee} 
                entriesType={entriesType} 
            />,
            create: <ActionButtons.Create 
                entriesType={entriesType} 
                caption="Добавить номинанта" 
                modalId="add-nominee-modal"
            />
        };
    }

    /**
     * Delete selected entries, if there are blocked.
     * 
     * @param  {event} event
     * @return {void}
     */
    deleteNominee(event) {
        const selectedEntries = this.props.state.selected;
        const entriesType = this.getEntriesType();

        for(const index in selectedEntries) {
            const entry = selectedEntries[index];

            this.props.actions.deleteEntry(entriesType, {
                body: entry,
                uniq: entry._uniq,
                map: {
                    nominee: entry.id
                }
            });
        }
    }

    getEntriesType() {
        return 'nominees';
    }

    getActionParams() {
        const { match } = this.props;

        return {
            map: {
                meetup: (match && match.params.id) || null
            }
        };
    }

    getFilter() {
        return Filter;
    }
}

// Prop Types
Information.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Information));