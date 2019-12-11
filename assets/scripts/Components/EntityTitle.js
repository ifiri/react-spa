import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Little component which represent base network error.
 * Using in every situation, where network error was thrown.
 */
class EntityTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h2 className="page__title" key={Math.random()}>{ this.getTitle() }</h2>;
    }

    getTitle() {
        const { type, state } = this.props;
        const items = state[type].items || [];

        if(type === 'meetup') {
            return items.event && items.event.title;
        }

        return items && items.title;
    }
}

// Connect
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

export default connect(mapStateToProps, (() => ({})))(EntityTitle);