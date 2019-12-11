import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';
import * as modalsActions from '../../Actions/ModalsActions';

import PropTypes from 'prop-types';

import moment from 'moment';
moment.locale('ru');

import DefaultModal from '../Modals/DefaultModal';
import { withState } from '../Modals';
import { withMatch } from '../Routing';

import ActionButtons from '../ActionButtons';
import Filter from '../Filters/Events';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import EventAddForm from '../Forms/EventAdd';
import EventManageForm from '../Forms/EventManage';

import Common from './Common';

import {Button,Title,Wrapper} from './Events.style.js';

/**
 * Events page
 */
class Events extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteEvent = this.deleteEvent.bind(this);

        this.state = {
            isLoad: false
        }
    }

    componentDidMount(){
        if(!this.state.isLoad){
            this.setState({isLoad: true});
            this.props.actions.load('events',{map:{meetup:this.props.match.params.id}});
            this.props.actions.load('participants',{map:{meetup:this.props.match.params.id}});
        }
    }

    handleAddEvent() {
        this.props.modalsActions.modalOpening('add-event-modal');
    }

    handleEditEvent(event) {
        this.props.modalsActions.modalOpening('manage-event-modal', event);
    }

    getEventsByDays(){
        const { items } = this.props.state.events;
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

    getEventDayTitle(day){
        return (<div>{moment(day,'DD/MM/YYYY').format('DD MMMM YYYY')}<span>{moment(day,'DD/MM/YYYY').format(' (dddd)')}</span></div>)
    }





    

    render() {
        const entriesType = this.getEntriesType();

        // { super.render() }
        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() }>
                { this.getPageContent() }
            </EntriesPreloader>

            <DefaultModal
                title="Добавить событие" 
                modalId="add-event-modal" 
                modalClass="modal_size_sm" 
                isPreloaderRequired={true}
            >
                <EventAddForm />
            </DefaultModal>

            <DefaultModal
                title="Редактировать событие" 
                modalId="manage-event-modal" 
                modalClass="modal_size_sm" 
                form={EventManageForm}
                isPreloaderRequired={true}
            />

            { this.getMessagingModals() }
            </>
        );
    }









    getPageContent(){
        if(!this.props.state.events.items) return null;

        const events = this.getEventsByDays();

        return (
            <Wrapper>
                <div className="content__fragment content__filter-area" style={{height:'42.1px'}}>
                    <Title>Программа мероприятия</Title>
                    
                    <ActionButtons.Create 
                        caption="Добавить" 
                        modalId="add-event-modal"
                    />
                </div>
                <div className="content__fragment events-list"> 
                    {events.map((dayObj,i)=>(
                        <div key={`events_day_${i}`}>
                            <div className="event-title">{this.getEventDayTitle(dayObj.day)}</div>
                            <div className="event-table">
                                <div className="titles-row">
                                    <div>Время проведения</div>
                                    <div>Название события</div>
                                    <div>Описание</div>
                                    <div></div>
                                </div>
                                {dayObj.items.map(event=>(
                                    <div key={`events_element_${event.id}`} className="regular-row" onClick={()=>this.handleEditEvent(event)}>
                                        <div>{`${moment(event.startDate).format('HH:mm')} - ${moment(event.endDate).format('HH:mm')}`}</div>
                                        <div>{event.title.length < 59 ? event.title : event.title.substring(0,59)+'...'}</div>
                                        <div>{event.description.length < 129 ? event.description : event.description.substring(0,129)+'...'}</div>
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
                onClick={this.deleteEvent} 
                entriesType={entriesType} 
            />,
            create: <ActionButtons.Create 
                entriesType={entriesType} 
                caption="Добавить событие" 
                modalId="add-event-modal"
            />
        };
    }

    /**
     * Delete selected entries, if there are blocked.
     * 
     * @param  {event} event
     * @return {void}
     */
    deleteEvent(event) {
        const selectedEntries = this.props.state.selected;
        const entriesType = this.getEntriesType();

        for(const index in selectedEntries) {
            const entry = selectedEntries[index];

            this.props.actions.deleteEntry(entriesType, {
                body: entry,
                uniq: entry._uniq,
                map: {
                    event: entry.id
                }
            });
        }
    }

    getPageTitle() {
        return 'Программа мероприятий';
    }

    getPageTitleVariant() {
        return 'secondary';
    }

    getEntriesType() {
        return 'events';
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
Events.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Events));