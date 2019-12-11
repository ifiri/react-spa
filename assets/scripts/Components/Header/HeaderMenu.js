import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import createHistory from 'history/createHashHistory';

import styled from 'react-emotion'

import ConfigRepository from '../../Config/Repository';
import RoutesRepository from '../../Routing/RoutesRepository';

import UserEntity from '../../User/Entity';

const WorksImg = 'dist/images/icons/navbar_works_ic.svg';
const NomineesImg = 'dist/images/icons/navbar_results_ic.svg';
const MediaImg = 'dist/images/icons/navbar_photo_ic.svg';
const EventsImg = 'dist/images/icons/navbar_program_ic.svg';
const ParticipantsImg = 'dist/images/icons/ic-users.svg';
const MeetupImg = 'dist/images/icons/navbar_info_ic.svg';
const InformationImg = 'dist/images/icons/navbar_info2_ic.svg';

const MenuLi = styled('li')`
    margin-left: 35px;
    &:first-child {
        margin-left: 0;
    }
`
const MenuItem = styled(NavLink)`
    &[data-menu-item=Works] {background-image: url(${WorksImg});}
    &[data-menu-item=Nominees] {background-image: url(${NomineesImg});}
    &[data-menu-item=Media] {background-image: url(${MediaImg});}
    &[data-menu-item=Events] {background-image: url(${EventsImg});}
    &[data-menu-item=Participants] {background-image: url(${ParticipantsImg});}
    &[data-menu-item=Meetup] {background-image: url(${MeetupImg});}
    &[data-menu-item=Company] {background-image: url(${EventsImg});}
    &[data-menu-item=Meetups] {background-image: url(${MeetupImg});}
    &[data-menu-item=Information] {background-image: url(${InformationImg});}
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: contain;
    padding-left: 37px;
    height: 20px;
    display: block;
    padding-top: 3px;
    line-height: inherit !important;
    font-size: 16px;
    letter-spacing: 0.1px;
    color: #ffffff;
    opacity: 0.5;
    &.menu__link_active{
        opacity: 1;
    }
    &:hover{
        opacity: 1;
    }
`

/**
 * Represent header menu. Here prints out all menu links.
 */
class HeaderMenu extends React.Component {

    render() {
        return (
            <ul className="menu header__menu">
                { this.getMenuItems() }
            </ul>
        );
    }

    /**
     * Returns menu links by user access level.
     * 
     * @return Array
     */
    getMenuItems() {
        const User = new UserEntity();
        const accessLevel = User.getRole();
        const routes = RoutesRepository.getRoutesBy(accessLevel);
        
        let menuItems = [];
        for(const route in routes) {
            
            const routeParams = routes[route];
            const link = routeParams.link || route;

            const layout = this.getMenuItemLayoutFor(link, routeParams, routes[route].component);

            menuItems.push(layout);
        }

        return menuItems;
    }

    /**
     * Wrap every route in menu item layout
     * 
     * @param  route String
     * @param  title String
     * @return JSX
     */
    getMenuItemLayoutFor(route, routeParams = {},name) {

        const { meetup } = this.props;
        route = this.getFullqualifiedLinkFor(route);

        const history = createHistory();
        const title = routeParams.title;
        
        const isActiveClickable = routeParams.isActiveClickable || false;
        const { exact = false } = routeParams;

        const linkClass = 'menu__link';
        const linkClassActive = linkClass + '_active' + (isActiveClickable ? ' ' + linkClass + '_clickable' : '');

        return (
            <MenuLi className={'menu__item' + (routeParams.menuClass || '')} key={route}>
                <MenuItem data-menu-item={name} location={history.location} className={linkClass} activeClassName={linkClassActive} to={route} exact={exact}>
                    {title}
                </MenuItem>
            </MenuLi >
        );
    }

    getFullqualifiedLinkFor(route) {
        const { match } = this.props;

        return route.split('/').map(item => {
            const { params } = match || {};

            if(item.match(/^:/g)) {
                const paramName = item.replace(/^:/g, '');

                if(params[paramName]) {
                    item = params[paramName];
                }
            }

            return item;
        }).join('/');
    }
}

// HeaderMenu.propTypes = {
//     isCheckPerforming: PropTypes.bool,

//     state: PropTypes.object.isRequired,
// };

export default HeaderMenu;