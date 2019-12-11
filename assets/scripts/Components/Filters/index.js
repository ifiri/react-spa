import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

/**
 * HOC over filter, connect filter to state and actions
 * 
 * @param  Filter Compnent
 * @return HOC
 */
function withState(Filter) {
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

    return connect(mapStateToProps, mapDispatchToProps)(Filter);
}

export { withState };