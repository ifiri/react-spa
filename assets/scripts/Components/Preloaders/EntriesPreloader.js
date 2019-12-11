import React from 'react';

import PropTypes from 'prop-types';

/**
 * Preloader for entries. Showing when entries is loading.
 */
class EntriesPreloader extends React.Component {
    constructor(props) {
        super(props);

        this.isLoadingWasPerformed = false;
        this.lock = false;
    }

    /**
     * At mount, check, if entries already loaded, it means, 
     * loading was performed already. Set related flag and update component.
     */
    componentDidMount() {
        const { type, type2, state } = this.props;

        if(
            (state[type] && state[type].items)
            || 
            (state[type2] && state[type2].items)
        ) {
            this.isLoadingWasPerformed = true;

            this.forceUpdate();
        }
    }

    /**
     * If loading of binded entries was performed, BUT something
     * is loading now, it means, we have widgets on page or list.
     * Set lock to true and return false. Otherwise return true.
     * 
     * @param  nextProps Object
     * @param  nextState Object
     * @return Boolean
     */
    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.state.isLoading === nextProps.state.isLoading && this.isLoadingWasPerformed) { //  
            // this.lock = true;

            // return false;
        }

        return true;
    }

    render() {
        const { type, state } = this.props;

        let layout = this.props.children;

        // If no items...
        if(!state[type] || !state[type].items) {
            // ...and loading is performing, show preloader
            if(state.isLoading) {
                layout = <div className="data data_loading">Загружаем данные...</div>;
            }
        } 

        // If items there are and if load is performed..
        else if(state[type].items && this.isLoadPerformed()) {
            // ...BUT loading in process and lock is not set,
            // reset component loading flag to false.
            // This is required, because flag in state determine
            // loading status for `entries`, and flag in component
            // determine loading status for `component`.
            if(state.isLoading && !this.lock) {
                this.isLoadingWasPerformed = false;
            }

            // If loading in process and loading is not performed,
            // show preloader too
            if(state.isLoading && !this.isLoadingWasPerformed) {
                layout = <div className="data data_loading">Загружаем данные...</div>;
            } else {
                // In other case, if loading not in process and loading was not performed,
                // show final animation and set inner loading flag to true
                if(!state.isLoading && !this.isLoadingWasPerformed) {
                    layout = <div key={'loaded_' + type} className="data data_loaded">{this.props.children}</div>;

                    this.isLoadingWasPerformed = true;
                }
            }
        }

        // In all other cases just render childrens
        return layout;
    }

    /**
     * Predicate. Get flag from state which determine that
     * entries loading was performed earlier
     */
    isLoadPerformed() {
        const { type, state } = this.props;
        const { isLoadPerformed = false } = state[type];

        return isLoadPerformed;
    }
}

// Prop Types
EntriesPreloader.propTypes = {
    type: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
};

export default EntriesPreloader;