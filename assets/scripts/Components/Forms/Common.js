import React from 'react';

import PropTypes from 'prop-types';

import EntriesfulComponent from '../EntriesfulComponent';

/**
 * Common abstract class for all forms. Extends entriesful component,
 * because every form, usually, works with entries.
 */
class Common extends EntriesfulComponent {
    componentDidMount() {
        // ...
    }

    componentWillUnmount() {
        // ...
    }

    render() {
        return null;
    }

    getEntriesType() {
        return null;
    }

    /**
     * Override parent method for getting entries.
     * 
     * @return Array | null
     */
    getEntries() {
        const entryType = this.getEntriesType();
        const entries = this.props.state.entries[entryType].items;

        return entries;
    }

    /**
     * Returns entry for current form. Entry for form is
     * a form data, passed from data provider (usually from modal).
     * 
     * @return Object
     */
    getEntry() {
        return this.props.entry || {};
    }

    onFormSubmit(event) {
        event.preventDefault();
    }
}

// Prop Types
Common.propTypes = {
    entry: PropTypes.object,

    state: PropTypes.object.isRequired,
    entriesActions: PropTypes.object,
};

export default Common;