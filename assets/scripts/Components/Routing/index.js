import React from 'react';
import { connect } from 'react-redux';

import createHistory from 'history/createHashHistory';

import RoutesRepository from '../../Routing/RoutesRepository';
import UserEntity from '../../User/Entity';

function withMatch(Component) {
    class ComponentWithMatch extends React.Component {
        render() {
            const User = new UserEntity;
            const accessLevel = User.getRole();

            const routes = RoutesRepository.getRoutesBy(accessLevel);
            const match = this.getMatchFromRoutes(routes);

            return <Component {...this.props} match={match} />;
        }

        getMatchFromRoutes(routes) {
            const history = createHistory();
            const location = history.location;

            return RoutesRepository.getMatch(location, routes);
        }
    }

    return ComponentWithMatch;
}

export { withMatch };