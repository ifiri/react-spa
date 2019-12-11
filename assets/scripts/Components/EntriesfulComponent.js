import React from 'react';

import Sorter from '../UserInterface/Sorter';

/**
 * This component represent any component, that have 
 * dynamically loaded entries inside. In other words,
 * any `entriesful` component. Here stored predicates 
 * and methods for loading, reseting and checking entries state.
 */
export default class EntriesfulComponent extends React.Component {
    /**
     * By default entriesful component loads entries at mount.
     */
    componentDidMount() {
        const entriesType = this.getEntriesType();

        if(!this.getEntries(entriesType) && !this.isLoadPerformed() && !this.isLoadStarted()) {
            const actionParams = this.getActionParams();

            this.props.entriesActions.load(entriesType, actionParams);
        }
    }

    getActionParams() {
        return {};
    }

    /**
     * By default, entriesful component clear stored entries, if required.
     */
    componentWillUnmount() {
        const { isClearRequired = false } = this.props;

        if(isClearRequired) {
            const entriesType = this.getEntriesType();
        
            this.props.entriesActions.clearEntries(entriesType);
        }
    }

    /**
     * Return nothing, because this is just abstract component.
     */
    render() {
        return null;
    }

    /**
     * Abstract component can not have entries type, but
     * every child component SHOULD return strict type.
     */
    getEntriesType() {
        return null;
    }

    /**
     * If entries by current type already loaded earlier.
     * Just check state property.
     */
    isLoadPerformed() {
        const entriesType = this.getEntriesType();

        const { isLoadPerformed = false } = this.props.state.entries[entriesType];

        return isLoadPerformed;
    }

    /**
     * If entries by current state type already started to download.
     * Just check state property.
     */
    isLoadStarted() {
        const entriesType = this.getEntriesType();
        const { state } = this.props;

        return state.entries[entriesType].isLoadStarted || false;
    }

    /**
     * If entries unsorted at this moment. Just check state property.
     */
    isSortingRequired() {
        const entriesType = this.getEntriesType();
        const { isSortingRequired = false } = this.props.state.entries[entriesType];

        return isSortingRequired;
    }

    /**
     * If user started a search by this entries type. Just check state property.
     */
    isSearching() {
        const entriesType = this.getEntriesType();

        return this.props.state.entries[entriesType].isSearching || false;
    }

    /**
     * Sort entries and returns array of sorted entries.
     * State stay unchanged.
     * 
     * @param  type String
     * @return Array
     */
    getSortedEntries(type) {
        const SorterInstance = new Sorter(type);
        const entries = this.props.state.entries[type].items ? this.props.state.entries[type].items.slice() : null;

        if(entries) {
            const order = SorterInstance.getDefaultOrder();
            const orderBy = SorterInstance.getDefaultOrderBy();
            
            SorterInstance.sort(entries, orderBy, order);
        }

        return entries || [];
    }

    /**
     * Returns all entries from state.
     * 
     * @param  type String
     * @return Array | null
     */
    getEntries(type) {
        if(!type) {
            type = this.getEntriesType();
        }

        const entries = this.props.state.entries[type].items ? this.props.state.entries[type].items : null;

        return entries;
    }
}