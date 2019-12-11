import React from 'react';

/**
 * Form footer
 */
export default class Footer extends React.Component {
    render() {
        return <div className="form__footer actions">
            {this.props.children}
        </div>;
    }
}