import React from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActions from '../../Actions/AuthActions';

import PropTypes from 'prop-types';

import AuthError from '../../Exceptions/AuthError';

import Error from '../Error';
import Page from '../Page';
import Header from '../Header/Header';
import AppPreloader from '../Preloaders/AppPreloader';

import RoutesRepository from '../../Routing/RoutesRepository';
import UserEntity from '../../User/Entity';

/**
 * This class perform all auth checks. If user not authorized, dispatch logout action.
 * If user in incorrect route, redirect to base route. All checks performing before
 * any another action in application.
 *
 * While checks are performing, showing preloader.
 */
class AuthGuard extends React.Component {
    constructor(props) {
        super(props);

        // This flag prevent unnecessary action performing
        this.isComponentMounted = false;
    }

    /**
     * When guard is mounted, check user for auth state and for his roles.
     * 
     * @return void
     */
    componentDidMount() {
        this.props.actions.authCheck();

        // ALso set mount flag
        this.isComponentMounted = true;
    }

    render() {
        const { isLoggedIn = false } = this.props.state;
        const User = new UserEntity();

        // Detect first mount of this component
        // At first mount we check user auth, so return null now
        if(!this.isComponentMounted) {
            return null;
        }

        // In second mount just check user auth state and make some routing
        if(isLoggedIn) {
            // First, redirect user to root
            if(this.isLoginPage() && User.isHaveAnyAccess()) {
                const basePath = RoutesRepository.getBaseRoutePathBy(User.getRole());

                return <Redirect to={basePath} />;
            }

            // Second, if check in process and this is NOT logout page,
            // show preloader with invisible header
            if(!this.isLogoutPage() && this.props.state.isCheckPerforming) {
                return <>
                    <Header isCheckPerforming={this.props.state.isCheckPerforming} />
                    <AppPreloader isCheckPerforming={this.props.state.isCheckPerforming} />
                </>;
            }

            // If user have no access, render nothing
            // This case appears when server response with 403,
            // and we should logout user after auth checking
            // if(!User.isHaveAnyAccess()) {
                if(this.props.state.error && !(this.props.state.error instanceof AuthError)) {
                    return <Error />;
                }
                
                // return null;
            // }

            return this.props.children;
        } else if(!this.isLoginPage()) {
            // If check in process, but not finished yet, render nothing
            // Prevent unwanted redirects in cases when HOC 
            // triggers update of this component
            if(this.props.state.isCheckPerforming) {
                return null;
            }

            return <Redirect to="/login" />;
        }

        // If user on login page
        return (
            <Page.Login state={this.props.state} auth={this.props.actions.auth} />
        );
    }

    isLoginPage() {
        return this.props.location.pathname === '/login';
    }

    isLogoutPage() {
        return this.props.location.pathname === '/logout';
    }
}

// Prop Types
AuthGuard.propTypes = {
    location: PropTypes.object.isRequired,
    
    state: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

// Connection
function mapStateToProps(state) {
    return {
        state: state.auth,
        router: state.router
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthGuard));