import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

import PropTypes from 'prop-types';

import ActionButtons from '../ActionButtons';
import Form from '../Form';

/**
 * Abstract parent class for filters.
 */
class Common extends React.Component {
    constructor(props) {
        super(props);

        // Current filter node
        this.filter = null;
        this.focusElement = null;

        // Is user searching at this moment
        this.isSearching = false;

        // Last timeout ID
        this.lastTimeout = null;

        // Refsetter
        this.setFilterRef = this.setFilterRef.bind(this);
        this.setFocusElementRef = this.setFocusElementRef.bind(this);

        // Listeners
        this.onFilterInputChanged = this.onFilterInputChanged.bind(this);
        this.onFilterSelectChanged = this.onFilterSelectChanged.bind(this);

        this.catchFilterSubmit = this.catchFilterSubmit.bind(this);

        this.filterItems = this.filterItems.bind(this);
    }

    /**
     * Add required listeners at mount and set focus on filter
     */
    componentDidMount() {
        const filter = this.filter;

        // filter.addEventListener('change', this.onFilterSelectChanged);
        // filter.addEventListener('keypress', this.onFilterInputChanged);

        if(this.focusElement && this.focusElement.value) {
            this.focusElement.focus();
        }
    }

    render() {
        return null;
    }

    /**
     * Main function for filter. Dispatch `search` action for filtering.
     * Of course, child component should be connected to state.
     * 
     * @return void
     */
    filterItems() {
        if(this.isSearching) {
            this.isSearching = false;
        }

        this.lastTimeout = setTimeout(() => {
            const entriesType = this.getEntriesType();

            this.isSearching = true;

            this.props.actions.search(entriesType, this.filter, {
                query: this.getFilterQuery(),
            });
        }, 750);
    }

    /**
     * Fires when input in filter layout has been changed.
     * Then call `filterItems` for search.
     * 
     * @param  event Object
     * @return void
     */
    onFilterInputChanged(event) {
        const element = event.target;

        if(element.nodeName !== 'INPUT') {
            return;
        }

        clearTimeout(this.lastTimeout);

        this.filterItems();
    }

    /**
     * Fires when select in filter layout has been changed.
     * Then call `filterItems` for search.
     * 
     * @param  event Object
     * @return void
     */
    onFilterSelectChanged(event) {
        const element = event.target;

        if(element.nodeName !== 'SELECT') {
            return;
        }

        clearTimeout(this.lastTimeout);

        this.filterItems();
    }

    /**
     * All results of search stored in state. Search
     * action just update items. So if items exists in state,
     * returns it.
     * 
     * @return Array
     */
    getFilterResults() {
        const { state } = this.props;
        const entriesType = this.getEntriesType();

        return (
            state[entriesType] && state[entriesType].items
        ) ? state[entriesType].items : [];
    }

    /**
     * Returns values of every filter item, which stored in state.
     * If this values is exists and not empty, it means, user searched
     * something already.
     * 
     * @return {[type]}
     */
    getFilterData() {
        const { state } = this.props;
        const entriesType = this.getEntriesType();
        const filterData = state[entriesType].filter;

        return filterData;
    }

    /**
     * Prevent page update when user press Enter
     * 
     * @param  event Object
     * @return void
     */
    catchFilterSubmit(event) {
        // this.filterItems();

        event.preventDefault();
    }

    setFilterRef(element) {
        this.filter = element;
    }

    setFocusElementRef(element) {
        this.focusElement = element;
    }
}

// Prop Types
Common.propTypes = {
    actions: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
};

export default Common;