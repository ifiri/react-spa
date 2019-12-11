import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as entriesActions from '../../Actions/EntriesActions';
import * as modalsActions from '../../Actions/ModalsActions';

import moment from 'moment';

import { withMatch } from '../Routing';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import CropperModal from '../Modals/CropperModal';
import { withState } from '../Modals';

import ActionButtons from '../ActionButtons';
import Filter from '../Filters/Meetups';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import MeetupAddForm from '../Forms/MeetupAdd';

import Common from './Common';

import { Wrapper, Title, ItemsCount, SelectWrapper, Button } from './Meetups.style.js';

/**
 * Meetups page
 */
class Meetups extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteMeetup = this.deleteMeetup.bind(this);
        this.state = {
            isLoad: false,
            currentType: 'all'
        }
    }

    componentDidMount(){
        if(!this.props.state.isLoadPerformed) {
            this.props.actions.load('meetups').then(()=>{
                this.setState({isLoad: true});
            });
        }
    }

    handleTypeFilter(event) {
        const { value } = event.target;
        this.setState({currentType:value});
    }

    handleAddMeetup() {
        this.props.modalsActions.modalOpening('add-meetup-modal');
    }

    getSortedItems() {
        const { currentType } = this.state;
        const items = this.props.state.meetups.items;
        let sorted = items;
        if (currentType != 'all') {
            sorted = sorted.filter(i => {
                return i.event.type === Number(currentType)
            });
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
                title="Добавить мероприятие" 
                modalId="add-meetup-modal" 
                modalClass="modal_size_sm" 
            >
                <MeetupAddForm />
            </DefaultModal>

            <CropperModal key="cropper-modal" modalClass="modal_type_cropper" />

            { this.getMessagingModals() }
            </>
        );
    }




















    getPageContent() {
        if(!this.props.state.meetups.items) return null;

        const { currentType } = this.state;
        const types = {
            0: 'Конференция',
            1: 'Конкурс',
            2: 'Совещание',
            all: 'Все типы'
        }
        const items = this.getSortedItems();

        let meetupsWord = 'мероприятий';
        if(items.length === 1) meetupsWord = 'мероприятие';
        if([2,3,4].indexOf(items.length) != -1) meetupsWord = 'мероприятия';

        return (
            <Wrapper>
                <div className="data data_loaded">
                    <div className="content__fragment content__filter-area" style={{height:'42.1px'}}>
                        <Title>Добавленные мероприятия</Title>
                        <SelectWrapper style={{marginLeft:'auto'}} className="type">
                            {types[currentType]}
                            <select currentValue={currentType} onChange={e=>this.handleTypeFilter(e)}>
                                <option value="all">Все мероприятия</option>
                                <option value="0">Конференция</option>
                                <option value="1">Конкурс</option>
                                <option value="2">Совещание</option>
                            </select>
                        </SelectWrapper>

                        <ActionButtons.Create 
                            caption="Добавить" 
                            modalId="add-meetup-modal"
                        />
                    </div>
                    <div className="content__fragment meetups-list">
                        {items.map(m => {
                            const avatar = m.event.image_link ? m.event.image_link : 'dist/images/icons/logo-grey.png';
                            const avatarSize = m.event.image_link ? 'cover' : 'inherit';
                            return (
                            <Link key={`meetups_list_item_${m.event.id}`} to={`events/${m.event.id}`} className="meetup-row">
                                <div className="meetup-avatar" style={{backgroundImage:`url(${avatar})`,backgroundSize:avatarSize}}></div>
                                <div className="meetup-title meetup-cell">
                                    <div>{m.event.title}</div>
                                    <div>Название</div>
                                </div>
                                <div className="meetup-type meetup-cell">
                                    <div>{types[m.event.type]}</div>
                                    <div>Тип</div>
                                </div>
                                <div className="meetup-dates meetup-cell">
                                    <div>{`${moment(m.event.start_date).format('DD MMMM YYYY')} - ${moment(m.event.end_date).format('DD MMMM YYYY')}`}</div>
                                    <div>Даты проведения</div>
                                </div>
                                <div className="right-corner"></div>
                            </Link>
                        )})}
                    </div>
                    <ItemsCount>{items.length} {meetupsWord}</ItemsCount>
                </div>
            </Wrapper>
        )
    }











































    getActions() {
        const entriesType = this.getEntriesType();

        return {
            delete: <ActionButtons.Delete 
                onClick={this.deleteMeetup} 
                entriesType={entriesType} 
            />,
            create: <ActionButtons.Create 
                entriesType={entriesType} 
                caption="Добавить мероприятие" 
                modalId="add-meetup-modal"
            />
        };
    }

    /**
     * Delete selected entries, if there are blocked.
     * 
     * @param  {event} event
     * @return {void}
     */
    deleteMeetup(event) {
        const selectedEntries = this.props.state.selected;
        const entriesType = this.getEntriesType();

        for(const index in selectedEntries) {
            const entry = selectedEntries[index];

            this.props.actions.deleteEntry(entriesType, {
                body: entry,
                uniq: entry._uniq,
                map: {
                    meetup: entry.meetup.id
                }
            });
        }
    }

    getPageTitle() {
        return 'Список мероприятий';
    }

    getPageTitleVariant() {
        return 'secondary';
    }

    getEntriesType() {
        return 'meetups';
    }

    getFilter() {
        return Filter;
    }
}

// Prop Types
Meetups.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Meetups));