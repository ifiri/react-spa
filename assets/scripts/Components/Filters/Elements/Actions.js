import React from 'react';

/**
 * Actions block. Have inside action buttons.
 */
export default class Actions extends React.Component {
    render() {
        return <div className="filter__actions">
            {this.props.children}
        </div>;
    }
}