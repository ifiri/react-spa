import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withMatch } from '../Routing';
import { bindActionCreators } from 'redux';
import * as entriesActions from '../../Actions/EntriesActions';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SvgIcon from '@material-ui/core/SvgIcon';

import HeaderMenu from './HeaderMenu';
import HeaderSubMenu from './HeaderSubMenu';

/**
 * Represent application header. Here prints out all menus, brand and logout button.
 */
class Header extends React.Component {

    constructor(){
        super();
        this.state = {
            isLoad: false
        }
    }

    componentDidMount(){
        if(!this.state.isLoad){
            let meetup = null;
            if (!this.props.match) return false;
            meetup = this.props.match.params.id;
            if (!meetup) return false;
            this.props.actions.load('meetup',{map:{meetup}}).then(()=>{
                this.setState({isLoad: true});
            });
        }
    }


    render() {
        //if (!this.state.isLoad) return null;
        const { match } = this.props;
        const { state,meetup } = this.props;
        const classname = this.getClassname();

        return <AppBar position="static" className={classname} id="header">
            {(() => {
                // <Typography variant="h6" color="inherit" className="brand">
                //                 Транснефть
                //             </Typography>
                if(!match || match.count <= 1) {
                    return <Toolbar className="header__top">
                        <div class="header__inner">
                            

                            <div className="header__container header__container_top">
                                <nav className="header__navigation">
                                    <HeaderMenu match={match} />
                                </nav>
                            </div>

                            <div class="header__logout-wrapper">
                                <Button color="inherit" component={Link} to="/logout" className="header__logout">
                                    Выйти
                                </Button>
                            </div>
                        </div>
                    </Toolbar>;
                }
            })()}

            {(() => {
                if(match && match.count > 1) {
                    return <Toolbar className="header__bottom">
                        <div class="header__inner">
                            <div class="header__back">
                                <a class="menu__link" aria-current="false" href="#/events">
                                    <SvgIcon className="icon" component={svgProps => (
                                        <svg {...svgProps}>
                                            <use xlinkHref="#menu-back" />
                                        </svg>
                                        )}
                                    />
                                </a>
                            </div>

                            <div className="header__container header__container_bottom">
                                <HeaderSubMenu 
                                    key='submenu' 
                                    match={match} 
                                    routes={match.routes || match.bunch} 
                                    meetup={meetup}
                                />
                            </div>

                            <div class="header__logout-wrapper">
                                <Button color="inherit" component={Link} to="/logout" className="header__logout">
                                    Выйти
                                </Button>
                            </div>
                        </div>
                    </Toolbar>;
                }
            })()}
        </AppBar>;
    }

    getClassname() {
        let className = 'header';

        if(!this.props.isCheckPerforming) {
            className += ' header_shown';
        }

        return className;
    }
}

// Prop Types
Header.propTypes = {
    isCheckPerforming: PropTypes.bool,

    state: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state.auth,
        meetup: state.entries.meetup,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(entriesActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Header));