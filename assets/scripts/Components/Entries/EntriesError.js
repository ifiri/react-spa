import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Error from '../Error';

/**
 * Wrapper for base Error component. Render Error when while work with
 * current entries error was passed in state.
 */
class EntriesError extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { type, state } = this.props;

        return (<>
            {(() => {
                if(state[type].error) {
                    return <Error />;
                } else {
                    return this.props.children;
                }
            })()}
        </>);
    }
}

// Prop Types
EntriesError.propTypes = {
    type: PropTypes.string.isRequired,

    state: PropTypes.object.isRequired,
};

// Connection
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

export default connect(mapStateToProps, () => ({}))(EntriesError);