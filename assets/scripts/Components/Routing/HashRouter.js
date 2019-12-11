import React from 'react';
import createHistory from 'history/createHashHistory';
import { Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import RoutesRepository from '../../Routing/RoutesRepository';
import UserEntity from '../../User/Entity';

import * as routerActions from '../../Actions/RouterActions';
import * as modalsActions from '../../Actions/ModalsActions';

/**
 * Custom hash router. We can't use native HashRouter from `react-router`,
 * because we need route in response to dispatch, not vice-versa.
 */
class HashRouter extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.history = createHistory();
        this.history.listen(this.onHistoryChange.bind(this));

        // Use passed store because we don't need connected component
        this.store = this.props.store || this.context.store;
    }

    /**
     * Just initialize start route.
     */
    componentDidMount() {
        const { location } = this.history;
        
        const User = new UserEntity;
        const accessLevel = User.getRole();

        const routes = RoutesRepository.getRoutesBy(accessLevel);

        const match = RoutesRepository.getMatch(location, routes);

        // return;

        // const match = RoutesRepository.getMatchByLocation(location, routes);

        this.store.dispatch(routerActions.routeChange(match))
    }

    render() {
        return <Router history={this.history}>
            {this.props.children}
        </Router>;
    }

    /**
     * When user change browser history, 
     * dispatch actions for change routes.
     * 
     * @param  location Object
     * @param  action String
     * @return void
     */
    onHistoryChange(location, action) {
        if(!this.store) {
            return null;
        }

        const User = new UserEntity;
        const accessLevel = User.getRole();

        const routes = RoutesRepository.getRoutesBy(accessLevel);
        const match = RoutesRepository.getMatch(location, routes);

        this.store.dispatch(routerActions.routeChange(match));
        this.store.dispatch(modalsActions.closeAll());
    }
}

// Prop Types
HashRouter.propTypes = {
    store: PropTypes.object.isRequired,
};

export default HashRouter;