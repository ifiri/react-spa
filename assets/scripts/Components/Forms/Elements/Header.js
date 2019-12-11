import React from 'react';

/**
 * Form header
 */
export default class Header extends React.Component {
    render() {
        return <div className="form__header">
            {this.props.children}
        </div>;
    }
}