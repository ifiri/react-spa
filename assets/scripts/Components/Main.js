import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Page from './Page';

import NotFound from './NotFound';
import RouteAnimation from './Routing/RouteAnimation';

import RoutesRepository from '../Routing/RoutesRepository';
import UserEntity from '../User/Entity';

import * as entriesActions from '../Actions/EntriesActions';
import * as authActions from '../Actions/AuthActions';

/**
 * One of critical system core components.
 * Here we get and set up all routes by user privilegies
 * and pages of application. Adds animation to routes.
 */
class Main extends React.Component {
    render() {
        const { location, state } = this.props;

        // Get user privilegies
        const User = new UserEntity();
        const accessLevel = User.getRole();

        // To this route user will redirect every time when he can go to root of app.
        const baseRoute = RoutesRepository.getBaseRoutePathBy(accessLevel);

        //  <RouteAnimation routes={state.router}>
        return (
            <Switch location={location}>
                <Route exact path="/" render={
                    () => {
                        if(baseRoute !== '/' && location.pathname !== baseRoute) {
                            return <Redirect to={baseRoute} />;
                        }
                        
                        return null;
                    }
                } />

                { this.getPageRoutes() }

                <Route path='/logout' component={Page.Logout} />

                <Route component={NotFound} />
            </Switch>
        );
    }

    /**
     * Gets and returns all allowable for this user routes.
     * Routes finding by user role. Every route is a component
     * with page component inside.
     * 
     * @return Array
     */
    getPageRoutes() {
        const { entriesActions, state, location } = this.props;

        // Get user role and routes by this role from repository
        const User = new UserEntity();
        const accessLevel = User.getRole();
        const routes = RoutesRepository.getRoutesBy(accessLevel);

        // Build Route component for every route in routes map
        return this.getPageRoutesFrom(routes);
    }

    getPageRoutesFrom(routes) {
        const { location } = this.props;

        let pageRoutes = [];
        for(const routePath in routes) {
            const routeParams = routes[routePath];
            const pageComponentName = typeof routeParams.component === 'function' ?
                routeParams.component(location)
            : routeParams.component;

            // Get page component by `component` property of current route
            const PageComponent = pageComponentName && Page[pageComponentName];

            // If no page component, just pass
            if(!PageComponent) {
                continue;
            }

            if(routeParams.routes) {
                const newRoutes = this.getPageRoutesFrom(routeParams.routes);

                pageRoutes = pageRoutes.concat(newRoutes);
            }

            // Every page SHOULD be wrapper in <main> tag, this is a technical requirement
            pageRoutes.push((
                <Route key={pageComponentName} path={routePath} render={
                    props => (
                        <main className="content">
                            <PageComponent 
                                match={props.match} 
                                location={props.location}
                            />
                        </main>
                    )
                } />
            ));
        }

        return pageRoutes;
    }
}

function mapStateToProps(state) {
    return {
        state: {
            auth: state.auth,
            entries: state.entries,
            router: state.router,
        }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch),
        authActions: bindActionCreators(authActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));