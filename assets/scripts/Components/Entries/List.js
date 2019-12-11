import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Entries from '../Entries';
import NotFound from '../NotFound';

import Sorter from '../../UserInterface/Sorter';
import PaginationUtils from '../../Utils/Pagination';

import UserEntity from '../../User/Entity';
import EntriesfulComponent from '../EntriesfulComponent';

import Toolbar from './Toolbar';

import Paper from '@material-ui/core/Paper';

import * as modalsActions from '../../Actions/ModalsActions';
import * as entriesActions from '../../Actions/EntriesActions';

/**
 * Represent table with entries of some type. One of more important classes in app.
 */
class List extends EntriesfulComponent {
    constructor(props) {
        super(props);

        // We should wrap sort trigger click handler because we need save current entries type
        this.onSortTriggerClick = this.onSortTriggerClick.bind(this);
    }

    /**
     * Override parent method. Load current entries and sort, if required.
     */
    componentDidMount() {
        const entriesType = this.getEntriesType();
        const actionParams = this.props.actionParams || {};

        if(!this.getPaginateEntries(entriesType) && !this.isLoadPerformed() && !this.isLoadStarted()) {
            this.props.entriesActions.load(entriesType, actionParams);
        } else if(this.isSortingRequired()) {
            this.sortEntries();
        }
    }

    /**
     * After update, check, should entries be sorted again. If yes, sort it.
     *
     * @param  prevProps Object
     * @return void
     */
    componentDidUpdate(prevProps) {
        const entriesType = this.getEntriesType();

        if(this.getPaginateEntries(entriesType) && this.isLoadPerformed()) {
            if(this.isSortingRequired()) {
                this.sortEntries();
            }
        }
    }

    render() {
        const { state, modalsActions, actionButtons } = this.props;
        const entriesType = this.getEntriesType();
        const entries = this.getPreparedEntries();

        const selected = state.entries.selected || [];

        return (<div>
            {(() => {
                if(
                    (!entries || !entries.length) 
                    &&
                    this.isLoadPerformed()
                ) {
                    return <React.Fragment><NotFound /></React.Fragment>;
                } else {
                    return <Entries.Table tableType={entriesType}>
                        <Entries.Body 
                            state={this.props.state.entries}
                            entriesType={entriesType}
                            entries={entries}
                            modalsActions={modalsActions}
                        />
                    </Entries.Table>;
                }
            })()}
        </div>);
    }

    /**
     * Dispatch `sort` action for sort current entries.
     * 
     * @return void
     */
    sortEntries() {
        const entriesType = this.getEntriesType();

        const SorterInstance = new Sorter(entriesType);
        const { order, orderBy } = SorterInstance.getSortParameters(this.props.state.entries);

        this.props.entriesActions.sort(entriesType, orderBy, order);
    }

    /**
     * Returns current entries type.
     * @return string
     */
    getEntriesType() {
        const { entriesType } = this.props;

        return entriesType;
    }

    /**
     * Returns entries, splitted by page, if required, or all entries.
     * 
     * @return Array
     */
    getPreparedEntries() {
        const { entriesType, isPaginated = true } = this.props;

        let entries;
        if(isPaginated) {
            entries = this.getPaginateEntries(entriesType);
        } else {
            entries = this.getEntries(entriesType);
        }

        return entries;
    }

    /**
     * Returns entries, splitted page by page.
     * 
     * @param  type String
     * @return Array | null
     */
    getPaginateEntries(type) {
        const entries = this.getEntries(type);

        if(entries) {
            const currentPage = PaginationUtils.getCurrentPage(this.props.state.entries, type);
            const entriesByPage = PaginationUtils.getEntriesByPage(entries, currentPage);

            return entriesByPage || null;
        }

        return null;
    }

    /**
     * Dispatch `sort` action for sorting entries by selected column.
     * 
     * @param  event Object
     * @return void
     */
    onSortTriggerClick(event) {
        const { entriesType } = this.props;

        const target = event.target;

        const SorterInstance = new Sorter(entriesType);

        // Get order params from event target and state
        const orderBy = target.dataset.sortBy || target.closest('[data-sort-by]').dataset.sortBy;
        const currentOrder = target.dataset.sortOrder || (
            target.closest('[data-sort-order]')
            &&
            target.closest('[data-sort-order]').dataset.sortOrder
        );

        let order = SorterInstance.getDefaultOrder();

        // If we have data-sort-order attribute, it means, we already sort
        // by this column, and we need get new order direction
        if(currentOrder) {
            order = SorterInstance.getOrder(this.props.state.entries);
        }

        this.props.entriesActions.sort(entriesType, orderBy, order);

        event.preventDefault();
    }
}

// Prop Types
List.propTypes = {
    entriesType: PropTypes.string.isRequired,
    isPaginated: PropTypes.bool,
    actionParams: PropTypes.object,
    actionButtons: PropTypes.object,
    isClearRequired: PropTypes.bool,

    state: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapStateToProps(state) {
    return {
        state: {
            modals: state.modals,
            entries: state.entries
        }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch),
        entriesActions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(List);