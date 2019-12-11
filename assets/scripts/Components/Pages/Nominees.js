import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

import { withRouter } from 'react-router-dom'
import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import { withState } from '../Modals';

import ActionButtons from '../ActionButtons';
import Filter from '../Filters/Nominees';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import NomineeAddForm from '../Forms/NomineeAdd';
import NomineeManageForm from '../Forms/NomineeManage';
import NominationAddForm from '../Forms/NominationAdd';
import NominationManageForm from '../Forms/NominationManage';

import Common from './Common';

import * as modalsActions from '../../Actions/ModalsActions';

import { Wrapper, MainBlock, Title, ItemsCount, Button, SelectWrapper, Sections } from './Nominees.style.js';

/**
 * Nominees page
 */
class Nominees extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteNominee = this.deleteNominee.bind(this);

        this.state = {
            isLoad: false,
            currentOST: 'all'
        }
    }

    handleOSTFilter(event) {
        const { value } = event.target;
        this.setState({currentOST:value});
    }

    componentDidMount(){
        if(!this.state.isLoad){
            this.setState({isLoad: true});
            this.props.actions.load('nominees',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('nominations',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('participants',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('works',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('company/departments');
            this.props.actions.load('meetup/sections',{map:{meetup:this.props.match.params.id}});
        }
    }

    getSortedItems() {
        // const { currentOST } = this.state;
        // const osts = this.props.state['company/departments'].items || [];
        // const items = this.props.state.nominees.items || [];
        // let sorted = items;

        // if (currentOST != 'all'){
        //     sorted = sorted.filter(i => i.department.title === osts[currentOST].title);
        // }
        return this.props.state.nominees.items || [];
    }

    getMeetupType() {
        // <option value="0">Конференция</option>
        // <option value="1">Конкурс</option>
        // <option value="2">Совещание</option>
        
        const { state } = this.props;
        const meetup = (
            state.meetup.items 
            && 
            state.meetup.items.event
        ) || null;

        return meetup && meetup.type;
    }

    handleAddNominee() {
        this.props.modalsActions.modalOpening('add-nominee-modal');
    }

    handleEditNominee(event) {
        this.props.modalsActions.modalOpening('manage-nominee-modal', event);
    }

    handleAddNomination() {
        this.props.modalsActions.modalOpening('add-nomination-modal');
    }

    handleEditNomination(event) {
        this.props.modalsActions.modalOpening('manage-nomination-modal', event);
    }


    render() {
        const entriesType = this.getEntriesType();

        // { super.render() }
        return (<>
            <EntriesPreloader key={'preload' + this.getEntriesType()} {...this.props} type={ this.getEntriesType() }>
                { this.getPageContent() }
            </EntriesPreloader>

            <DefaultModal
                title="Добавить номинанта" 
                modalId="add-nominee-modal" 
                modalClass="modal_size_sm" 
                isPreloaderRequired={true}
            >
                <NomineeAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать номинанта" 
                modalId="manage-nominee-modal" 
                modalClass="modal_size_sm" 
                form={NomineeManageForm}
                isPreloaderRequired={true}
            />

            <DefaultModal
                title="Добавить номинацию" 
                modalId="add-nomination-modal" 
                modalClass="modal_size_sm" 
                isPreloaderRequired={true}
            >
                <NominationAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать номинацию" 
                modalId="manage-nomination-modal" 
                modalClass="modal_size_sm" 
                form={NominationManageForm}
                isPreloaderRequired={true}
            />

            { this.getMessagingModals() }
            </>
        );
    }





















































    getPageContent() {
        let items = [];
        if(!this.props.state.nominees.items || !this.state.isLoad || !this.props.state['company/departments'].items) {
            items = [];
        } else {
            items = this.getSortedItems();
        }

        const meetupType = this.getMeetupType();

        const { currentOST } = this.state;

        const osts = (
            this.props.state['company/departments'] && this.props.state['company/departments'].items
        ) || [];
        const nominations = (
            this.props.state['nominations'] && this.props.state['nominations'].items
        ) || [];

        return (
            <Wrapper>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>

                    <MainBlock>
                        <div className="content__fragment content__filter-area" style={{height:'42.1px'}}>
                            <Title>Результаты мероприятия</Title>

                            <ActionButtons.Create 
                                caption="Добавить" 
                                modalId="add-nominee-modal"
                            />
                        </div>
                        <div className="content__fragment participants-list"> 
                            {items.map(p => {
                                let icon = '';
                                icon = 'dist/images/icons/results-' + (p.place || 6) + '-place.svg';

                                return (<>
                                    {(() => {
                                        let type = '';
                                        switch (p.participant && p.participant.type) {
                                            case 1:
                                                type = 'Участник';
                                                break;
                                            case 2:
                                                type = 'Член конкурсной комиссии';
                                                break;
                                            case 3:
                                                type = 'Куратор';
                                                break;    
                                            default:
                                                break;
                                        }

                                        switch(Number(meetupType)) {
                                            case 0: // Конференция
                                                
                                                return <div key={'nominee' + p.id} onClick={()=>this.handleEditNominee(p)}>
                                                    <div className="participan-place" style={{backgroundImage:`url(${icon})`}}></div>
                                                    <div className="participan-avatar" style={{backgroundImage:`url(${p.participant && p.participant.photo_original_url})`}}></div>
                                                    <div className="participan-fio participan-cell">
                                                        <div>{
                                                            p.participant && (
                                                                p.participant.sirname + ' ' +
                                                                p.participant.name + ' ' +
                                                                p.participant.patronymic
                                                            )
                                                        }</div>
                                                        <div>{type}</div>
                                                    </div>
                                                    <div className="participan-ost participan-cell">
                                                        <div>{
                                                            p.participant && (
                                                                p.participant.department
                                                                &&
                                                                p.participant.department.title
                                                            )
                                                        }</div>
                                                        <div>ОСТ</div>
                                                    </div>
                                                    <div className="right-corner"></div>
                                                </div>;

                                            case 1: // Конкурс
                                                
                                                if(p.type === 2) {
                                                    return <div key={'nominee' + p.id} onClick={()=>this.handleEditNominee(p)}>
                                                        <div className="participan-place" style={{backgroundImage:`url(${icon})`}}></div>
                                                        <div className="participan-avatar" style={{backgroundImage:`url(${p.participant && p.participant.photo_original_url})`}}></div>
                                                        <div className="participan-fio participan-cell">
                                                            <div>{
                                                                p.participant && (
                                                                    p.participant.sirname + ' ' +
                                                                    p.participant.name + ' ' +
                                                                    p.participant.patronymic
                                                                )
                                                            }</div>
                                                            <div>{type}</div>
                                                        </div>
                                                        <div className="participan-ost participan-cell">
                                                            <div>{
                                                                p.participant && (
                                                                    p.participant.department
                                                                    &&
                                                                    p.participant.department.title
                                                                )
                                                            }</div>
                                                            <div>ОСТ</div>
                                                        </div>
                                                        <div className="right-corner"></div>
                                                    </div>;
                                                }

                                                if(p.type === 1) {
                                                    var dep = p.departmentId && osts.findIndex(element => {
                                                        if(element.id && parseInt(element.id) === parseInt(p.departmentId)) {
                                                            return element;
                                                        }
                                                    });

                                                    return <div key={'nominee' + p.id} onClick={()=>this.handleEditNominee(p)}>
                                                        <div className="participan-place" style={{backgroundImage:`url(${icon})`}}></div>
                                                        <div className="participan-avatar" style={{backgroundImage:`url(${p.participant && p.participant.photo_original_url})`}}></div>
                                                        <div className="participan-fio participan-cell">
                                                            <div>{
                                                                osts[dep] && osts[dep].title
                                                            }</div>
                                                            <div>ОСТ</div>
                                                        </div>
                                                        <div className="participan-ost participan-cell">
                                                            <div></div>
                                                            <div></div>
                                                        </div>
                                                        <div className="right-corner"></div>
                                                    </div>;
                                                }

                                                break;

                                            case 2: // Совещание
                                                return null;
                                        }
                                    })()}
                                
                            </>)})}
                        </div>
                    </MainBlock>

                    <div style={{marginLeft:'20px',marginTop:'30px'}}>
                        <Sections>
                            <Title>Номинации</Title>
                            <ul>
                                {nominations.map(d => (
                                    <li key={`department_list_${d.id}`} onClick={()=>this.handleEditNomination(d)}>{d.title}</li>
                                ))}
                            </ul>

                            <ActionButtons.Create 
                                caption="Добавить" 
                                inside={true}
                                modalId="add-nomination-modal"
                            />
                        </Sections>                           
                    </div>
                </div>
            </Wrapper>
        );
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
Nominees.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Nominees));