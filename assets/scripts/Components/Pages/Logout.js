import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActions from '../../Actions/AuthActions';

import PropTypes from 'prop-types';

import Error from '../Error';

/**
 * Confirm page. There is no data. When user going on this page,
 * just logout his automatically.
 */
class Logout extends React.Component {
    constructor(props) {
        super(props);

        this.rootElement = document.getElementById('root');
    }

    /**
     * Add special styling for current page and logout automatically
     */
    componentDidMount() {
        this.rootElement.classList.add('app_page_logout');

        this.props.actions.logout();
    }

    /**
     * Remove special styling for current page
     */
    componentWillUnmount() {
        this.rootElement.classList.remove('app_page_logout');
    }

    /**
     * If there are some errors in logout process,
     * render Error component, otherwise render nothing.
     */
    render() {
        const { state } = this.props;

        if(state.error) {
            return <Error />;
        }

        return null;
    }
}

// Prop Types
Logout.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);