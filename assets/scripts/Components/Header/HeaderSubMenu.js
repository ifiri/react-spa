import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import SvgIcon from '@material-ui/core/SvgIcon';

import ConfigRepository from '../../Config/Repository';
import RoutesRepository from '../../Routing/RoutesRepository';

import UserEntity from '../../User/Entity';

import HeaderMenu from './HeaderMenu';

/**
 * Represent header menu. Here prints out all menu links.
 */
class HeaderSubMenu extends HeaderMenu {
    constructor(props) {
        super(props);
    }
    
    render() {
        if (this.props.meetup.items){
            if (this.props.meetup.items.event){
                if (this.props.meetup.items.event.id != this.props.match.params.id) return null
            }
            if (this.props.meetup.items.meetup){
                if (this.props.meetup.items.meetup.id != this.props.match.params.id) return null
            }
            
            return super.render();
        }

        return null;
    }

    getMenuItems() {
        const { routes,meetup } = this.props;

        let ordered = {};
        let unordered = {};
        for(const route in routes) {
            const routeParams = routes[route];
            const order = routeParams.order || null;

            if(order) {
                ordered[route] = routes[route];
            } else {
                unordered[route] = routes[route];
            }
        }

        ordered = {
            ...ordered,
            ...unordered,
        };

        const menuItems = [];
        for(const route in ordered) {

            let type = null;
            let layout = null;
            if (meetup.items){
                if (meetup.items.event){
                    type = meetup.items.event.type;
                }
                if (meetup.items.meetup){
                    type = meetup.items.meetup.type;
                }
            }

            
            
            

            // <option value="0">Конференция</option>
            // <option value="1">Конкурс</option>
            // <option value="2">Совещание</option>

            if(type !== null) {
                type = parseInt(type);

                const routeParams = ordered[route];
                const link = routeParams.link || route;

                // Если конференция - есть все вкладки
                switch(type) {
                    case 1: // Если конкурс - нет докладов 
                        if(ordered[route].component == 'Works') {
                            continue;
                        }

                        break;

                    case 2: // Если тип мероприятия "совещание" - в навигационном баре нет докладов и результатов
                        if(ordered[route].component == 'Works' || ordered[route].component == 'Nominees') {
                            continue;
                        }

                        break;
                }

                layout = this.getMenuItemLayoutFor(link, routeParams, ordered[route].component);
            }

            menuItems.push(layout);
        }

        return menuItems;
    }
}

// Connect
function mapStateToProps(state) {
    return {
        state: state.router
    };
}

export default HeaderSubMenu;