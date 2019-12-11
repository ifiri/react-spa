import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';
import * as modalsActions from '../../Actions/ModalsActions';

import moment from 'moment';
moment.locale('ru');

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import { withState } from '../Modals';
import { withMatch } from '../Routing';

import ActionButtons from '../ActionButtons';
import Filter from '../Filters/Works';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import WorkAddForm from '../Forms/WorkAdd';
import WorkManageForm from '../Forms/WorkManage';

import Common from './Common';

import { Wrapper, Title, Button } from './Works.style.js';

/**
 * Works page
 */
class Works extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteWork = this.deleteWork.bind(this);

        this.state = {
            isLoad: false
        }
    }

    componentDidMount(){
        if(!this.state.isLoad){
            this.setState({isLoad: true});
            this.props.actions.load('works',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('participants',{map:{meetup:this.props.match.params.id}});
        }
    }
    

    getWorksByDays(){
        const { items } = this.props.state.works;
        const itemsByDays = {};
        items.forEach(item => {
            const dayKey = moment(item.startDate).format('DD/MM/YYYY');
            if (!(dayKey in itemsByDays)) {
                itemsByDays[dayKey] = [item];
            } else {
                itemsByDays[dayKey].push(item);
            }
        });

        const sortedKeys = Object.keys(itemsByDays).sort(function(a, b){
            var aa = a.split('/').reverse().join(),
                bb = b.split('/').reverse().join();
            return aa < bb ? -1 : (aa > bb ? 1 : 0);
        });

        const result = sortedKeys.map(key => { return {day: key, items: itemsByDays[key]}});

        return result;
    }

    getWorkDayTitle(day){
        return (<div>{moment(day,'DD/MM/YYYY').format('DD MMMM YYYY')}<span>{moment(day,'DD/MM/YYYY').format(' (dddd)')}</span></div>)
    }

    handleAddEvent(){
        this.props.modalsActions.modalOpening('add-work-modal');
    }

    handleEditEvent(event){
        this.props.modalsActions.modalOpening('manage-work-modal', event);
    }










































    render() {
        const entriesType = this.getEntriesType();

        // { super.render() }
        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() }>
                { this.getPageContent() }
            </EntriesPreloader>

            <DefaultModal
                title="Добавить доклад" 
                modalId="add-work-modal" 
                modalClass="modal_size_sm" 
                isPreloaderRequired={true}
            >
                <WorkAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать доклад" 
                modalId="manage-work-modal" 
                modalClass="modal_size_sm" 
                form={WorkManageForm}
                isPreloaderRequired={true}
            />

            { this.getMessagingModals() }
            </>
        );
    }






    getPageContent() {
        if(!this.props.state.works.items) return null;

        const works = this.getWorksByDays();

        return (
            <Wrapper>
                <div className="content__fragment content__filter-area" style={{height:'42.1px'}}>
                    <Title>Доклады участников мероприятия</Title>
                    
                    <ActionButtons.Create 
                        caption="Добавить" 
                        modalId="add-work-modal"
                    />
                </div>
                <div className="content__fragment events-list"> 
                    {works.map((dayObj,i)=>(
                        <div key={`works_day_${i}`}>
                            <div className="event-title">{this.getWorkDayTitle(dayObj.day)}</div>
                            <div className="event-table">
                                <div className="titles-row">
                                    <div>Время выступления</div>
                                    <div>ФИО докладчика</div>
                                    <div>Тема доклада</div>
                                    <div></div>
                                </div>
                                {dayObj.items.map(work=>(
                                    <div key={`works_element_${work.id}`} className="regular-row" onClick={()=>this.handleEditEvent(work)}>
                                        <div>{`${moment(work.startDate).format('HH:mm')} - ${moment(work.endDate).format('HH:mm')}`}</div>
                                        <div>
                                            {
                                                work.users.map(user => {
                                                    return user.name + ' ' + user.sirname + ' ' + user.patronymic;
                                                })
                                            }
                                        </div>
                                        <div>{work.title}</div>
                                        <div><div></div></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Wrapper>
        )
    }

















































    getActions() {
        const entriesType = this.getEntriesType();

        return {
            delete: <ActionButtons.Delete 
                onClick={this.deleteWork} 
                entriesType={entriesType} 
            />,
            create: <ActionButtons.Create 
                entriesType={entriesType} 
                caption="Добавить работу" 
                modalId="add-work-modal"
            />
        };
    }

    /**
     * Delete selected entries, if there are blocked.
     * 
     * @param  {event} event
     * @return {void}
     */
    deleteWork(event) {
        const selectedEntries = this.props.state.selected;
        const entriesType = this.getEntriesType();

        for(const index in selectedEntries) {
            const entry = selectedEntries[index];

            this.props.actions.deleteEntry(entriesType, {
                body: entry,
                uniq: entry._uniq,
                map: {
                    work: entry.id
                }
            });
        }
    }

    getPageTitle() {
        return 'Доклады участников мероприятия';
    }

    getPageTitleVariant() {
        return 'secondary';
    }

    getEntriesType() {
        return 'works';
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
Works.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Works));