import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';
import * as modalsActions from '../../Actions/ModalsActions';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import CropperModal from '../Modals/CropperModal';
import { withState } from '../Modals';
import { withMatch } from '../Routing';

import ActionButtons from '../ActionButtons';
import Filter from '../Filters/Participants';
import CompanyManageForm from '../Forms/CompanyManage';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import ParticipantAddForm from '../Forms/ParticipantAdd';
import ParticipantManageForm from '../Forms/ParticipantManage';

import Common from './Common';

import { SelectWrapper, Button, ItemsCount, Title, Wrapper } from './Participants.style.js';

/**
 * Participants page
 */
class Participants extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteParticipant = this.deleteParticipant.bind(this);
        this.loading = false;
        this.state = {
            isLoad: false,
            currentType: 'all',
            currentOST: 'all'
        }

    }

    componentDidMount(){
        if(!this.state.isLoad){
            this.props.actions.load('participants',{map:{meetup:this.props.match.params.id}}).then(()=>{
                this.setState({isLoad: true});
            });
            this.props.actions.load('meetup/sections',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('company/departments');
        }
    }

    handleTypeFilter(event) {
        const { value } = event.target;
        this.setState({currentType:value});
    }

    handleOSTFilter(event) {
        const { value } = event.target;
        this.setState({currentOST:value});
    }

    handleAddParticipant(){
        this.props.modalsActions.modalOpening('add-participant-modal');
    }

    handleEditParticipant(participant){
        this.props.modalsActions.modalOpening('manage-participant-modal', participant);
    }

    getSortedItems() {
        const { currentType,currentOST } = this.state;
        const osts = this.props.state['company/departments'].items;
        const items = this.props.state.participants.items;
        let sorted = items;
        if (currentType != 'all') {
            sorted = sorted.filter(i => i.type === Number(currentType));
        }
        if (currentOST != 'all'){
            sorted = sorted.filter(i => i.department.title === osts[currentOST].title);
        }
        return sorted;
    }








    render() {
        

        const entriesType = this.getEntriesType();

        // { super.render() }
        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() }>
                { this.getPageContent() }
            </EntriesPreloader>

            <DefaultModal
                title="Добавить участника" 
                modalId="add-participant-modal" 
                modalClass="modal_size_sm" 
                isPreloaderRequired={true}
            >
                <ParticipantAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать участника" 
                modalId="manage-participant-modal" 
                modalClass="modal_size_sm" 
                form={ParticipantManageForm}
                isPreloaderRequired={true}
            />

            <CropperModal key="cropper-modal" modalClass="modal_type_cropper" cropperParams={{
                aspectRatio: 1
            }} />

            { this.getMessagingModals() }
            </>
        );
    }





























    


    getPageContent() {
        if(!this.state.isLoad || !this.props.state.participants.items || !this.props.state['company/departments'].items) return null;

        const { currentType,currentOST } = this.state;
        let currentTypeText = 'Все участники';

        switch (currentType){
            case '1':
                currentTypeText = 'Участник';
                break;
            case '2':
                currentTypeText = 'Член конкурсной комиссии';
                break;
            case '3':
                currentTypeText = 'Куратор';
                break;    
            default:
                break;
        }

        const osts = this.props.state['company/departments'].items;
        const items = this.getSortedItems();

        let participantsWord = 'участников';
        if(items.length === 1) participantsWord = 'участник';
        if([2,3,4].indexOf(items.length) != -1) participantsWord = 'участника'; 

        return <Wrapper>
            <div className="content__fragment content__filter-area" style={{height:'42.1px'}}>
                <Title>Список участников</Title>
                <SelectWrapper style={{marginLeft:'auto'}} className="type">
                    {currentTypeText}
                    <select currentValue={currentType} onChange={e=>this.handleTypeFilter(e)}>
                        <option value="all">Все участники</option>
                        <option value="1">Участник</option>
                        <option value="2">Член конкурсной комиссии</option>
                        <option value="3">Куратор</option>
                    </select>
                </SelectWrapper>
                <SelectWrapper style={{marginLeft:'21px'}} className="ost">
                    {currentOST === 'all' ? 'Все ОСТ' : osts[currentOST].title}
                    <select currentValue={currentOST} onChange={e=>this.handleOSTFilter(e)}>
                        <option value="all">Все ОСТ</option>
                        {osts.map((o,i) => (<option value={i}>{o.title}</option>))}
                    </select>
                </SelectWrapper>

                <ActionButtons.Create 
                    caption="Добавить" 
                    modalId="add-participant-modal"
                />
            </div>

            <div className="content__fragment participants-list">
                {items.map(p => {
                    let type = '';
                    let borderColor = 'black';
                    switch (p.type){
                        case 1:
                            type = 'Участник';
                            borderColor = '#005b9b';
                            break;
                        case 2:
                            type = 'Член конкурсной комиссии';
                            borderColor = '#e62b27';
                            break;
                        case 3:
                            type = 'Куратор';
                            borderColor = '#3098d4';
                            break;    
                        default:
                            break;
                    }
                    return (
                    <div key={p.id} style={{borderColor}} onClick={()=>this.handleEditParticipant(p)}>
                        <div className="participan-avatar" style={{backgroundImage:`url(${p.photoOriginalUrl})`}}></div>
                        <div className="participan-fio participan-cell">
                            <div>{p.fio}</div>
                            <div>{type}</div>
                        </div>
                        <div className="participan-ost participan-cell">
                            <div>{p.department.title}</div>
                            <div>ОСТ</div>
                        </div>
                        <div className="participan-department participan-cell">
                            <div>{p.role}</div>
                            <div>Отдел</div>
                        </div>
                        <div className="participan-position participan-cell">
                            <div>{p.position}</div>
                            <div>Должность</div>
                        </div>
                        <div className="right-corner"></div>
                    </div>
                )})}
            </div>

            <ItemsCount>{items.length} {participantsWord}</ItemsCount>
        </Wrapper>;
    }

    




















    getPageTitle() {
        return 'Список участников';
    }

    getPageTitleVariant() {
        return 'secondary';
    }

    getEntriesType() {
        return 'participants';
    }

    getActions() {
        const entriesType = this.getEntriesType();

        return {
            delete: <ActionButtons.Delete 
                onClick={this.deleteParticipant} 
                entriesType={entriesType} 
            />,
            create: <ActionButtons.Create 
                entriesType={entriesType} 
                caption="Добавить участника" 
                modalId="add-participant-modal"
            />
        };
    }

    /**
     * Delete selected entries, if there are blocked.
     * 
     * @param  {event} event
     * @return {void}
     */
    deleteParticipant(event) {
        const selectedEntries = this.props.state.selected;
        const entriesType = this.getEntriesType();

        for(const index in selectedEntries) {
            const entry = selectedEntries[index];

            this.props.actions.deleteEntry(entriesType, {
                body: entry,
                uniq: entry._uniq,
                map: {
                    participant: entry.id
                }
            });
        }
    }

    getActionParams() {
        const { match } = this.props;

        return {
            map: {
                meetup: match.params && match.params.id
            }
        };
    }

    getFilter() {
        return Filter;
    }
}

// Prop Types
Participants.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state.entries,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(entriesActions, dispatch),
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Participants));