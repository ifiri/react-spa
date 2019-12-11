import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import ConfigRepository from '../../Config/Repository';
import RoutesRepository from '../../Routing/RoutesRepository';

import UserEntity from '../../User/Entity';

import store from '../../store';
import { closeAll as closeAllModals } from '../../Actions/ModalsActions';

/**
 * Class for animated transitions between routes.
 */
class RouteAnimation extends React.Component {
    constructor(props) {
        super(props);

        const User = new UserEntity();
        this.accessLevel = User.getRole();

        this.onExiting = this.onExiting.bind(this);
        this.onEnter = this.onEnter.bind(this);
    }

    render() {
        const classNames = this.getTransitionClassNames();
        const { currentRoute, lastRoute } = this.props.routes;

        return (
            <TransitionGroup component={null}>
                <CSSTransition 
                    key={currentRoute.location + (lastRoute && lastRoute.location)} 
                    classNames={classNames} 
                    timeout={250} 
                    onEnter={this.onEnter} 
                    onExiting={this.onExiting}
                >
                    {this.props.children}
                </CSSTransition>
            </TransitionGroup>
        );
    }

    getTransitionClassNames() {
        const transition = 'route';

        return {
            enter: `${transition} ${transition}_enter`,
            enterActive: `${transition} ${transition}_entering`,
            enterDone: `${transition} ${transition}_entered`,

            exit: `${transition} ${transition}_exit`,
            exitActive: `${transition} ${transition}_exiting`,
            exitDone: `${transition} ${transition}_exited`,
        };
    }

    /**
     * When animation started, add animation to current page component
     * 
     * @param  node Object
     * @return void
     */
    onEnter(node) {
        if(!node) {
            return;
        }

        const { lastRoute } = this.props.routes;
        const lastRouteIndex = this.getLastRouteIndex();

        if(lastRoute && lastRoute.location !== '/login') {
            this.addTransitionClassTo(node);
        }
    }

    /**
     * When animation ended, close all modals
     * and add animation to new page component
     * 
     * @param  node Object
     * @return void
     */
    onExiting(node) {
        if(!node) {
            return;
        }

        const { currentRoute } = this.props.routes;

        switch(currentRoute&&currentRoute.location) {
            case '/logout':
                this.removeTransitionClassesFrom(node);

                break;

            default:
                this.addTransitionClassTo(node);
                
                break;
        }

        store.dispatch(closeAllModals());
    }

    /**
     * Add transition to passed node
     * 
     * @param  node Object
     * @return void
     */
    addTransitionClassTo(node) {
        const direction = this.getTransitionDirection();
        const newClass = 'route_from_' + direction;

        // First, clean up node class list for prevent unwanted flashes
        this.removeTransitionClassesFrom(node);

        // Then add new class
        node.classList.add(newClass);
    }

    /**
     * Clear transition on passed node
     * 
     * @param  node Object
     * @return void
     */
    removeTransitionClassesFrom(node) {
        node.classList.remove('route_from_left');
        node.classList.remove('route_from_right');
    }

    /**
     * Compare current and last route indexes. If current route index
     * is larger than last route index, we need swipe from left to right.
     * In other case, vice versa.
     * 
     * @return String
     */
    getTransitionDirection() {
        const currentRouteIndex = this.getCurrentRouteIndex();
        const lastRouteIndex = this.getLastRouteIndex();

        let direction = 'left';

        if(currentRouteIndex > lastRouteIndex) {
            direction = 'right';
        }

        return direction;
    }

    getCurrentRouteDepth() {
        const { currentRoute } = this.props.routes;

        return currentRoute.depth;
    }

    getLastRouteDepth() {
        const { lastRoute } = this.props.routes;

        return lastRoute.depth;
    }

    getCurrentRouteIndex() {
        const { currentRoute } = this.props.routes;
        const { match } = this.props;

        return RoutesRepository.getRouteIndex(currentRoute, currentRoute.bunch);
    }

    getLastRouteIndex() {
        const { lastRoute } = this.props.routes;
        const { match } = this.props;

        return RoutesRepository.getRouteIndex(lastRoute, lastRoute && lastRoute.bunch);
    }
}

// Prop Types
RouteAnimation.propTypes = {
    currentRoute: PropTypes.string,
    lastRoute: PropTypes.string,

    match: PropTypes.object
};

export default RouteAnimation;