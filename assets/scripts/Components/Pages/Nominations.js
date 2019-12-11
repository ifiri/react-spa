import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import { withState } from '../Modals';
import { withMatch } from '../Routing';

import ActionButtons from '../ActionButtons';
import Filter from '../Filters/Nominations';
import EntriesPreloader from '../Preloaders/EntriesPreloader';

import NominationAddForm from '../Forms/NominationAdd';
import NominationManageForm from '../Forms/NominationManage';

import Common from './Common';

/**
 * Works page
 */
class Nominations extends Common {
    constructor(props, context) {
        super(props, context);

        this.deleteNomination = this.deleteNomination.bind(this);
    }

    render() {
        const entriesType = this.getEntriesType();

        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() }>
                { super.render() }
            </EntriesPreloader>

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

    getActions() {
        const entriesType = this.getEntriesType();

        return {
            delete: <ActionButtons.Delete 
                onClick={this.deleteNomination} 
                entriesType={entriesType} 
            />,
            create: <ActionButtons.Create 
                entriesType={entriesType} 
                caption="Добавить номинацию" 
                modalId="add-nomination-modal"
            />
        };
    }

    /**
     * Delete selected entries, if there are blocked.
     * 
     * @param  {event} event
     * @return {void}
     */
    deleteNomination(event) {
        const selectedEntries = this.props.state.selected;
        const entriesType = this.getEntriesType();

        for(const index in selectedEntries) {
            const entry = selectedEntries[index];

            this.props.actions.deleteEntry(entriesType, {
                body: entry,
                uniq: entry._uniq,
                map: {
                    nomination: entry.id
                }
            });
        }
    }

    getPageTitle() {
        return 'Список номинаций';
    }

    getPageTitleVariant() {
        return 'secondary';
    }

    getEntriesType() {
        return 'nominations';
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
Nominations.propTypes = {
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
        actions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Nominations));