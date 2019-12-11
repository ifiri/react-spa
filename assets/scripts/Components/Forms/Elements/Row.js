import React from 'react';

/**
 * Form row
 */
export default class Wrapper extends React.Component {
    render() {
        const { forwardedRef = null, style = {} } = this.props;

        const attributes = {};

        if(forwardedRef) {
            attributes.ref = forwardedRef;
        }

        return <div className="form__row" {...attributes} style={style}>
            {this.props.children}
        </div>;
    }
}