import React from 'react';

import PropTypes from 'prop-types';

/**
 * Column is a part of form row.
 */
class Column extends React.Component {
    render() {
        const className = this.getColumnClassName();
        const attributes = this.getAttributes();

        return <div className={className} {...attributes}>
            {this.props.children}
        </div>;
    }

    /**
     * Set forwarded ref to column, if passed
     * 
     * @return Object
     */
    getAttributes() {
        const { forwardedRef = null } = this.props;

        let attributes = {};

        if(forwardedRef) {
            attributes.ref = forwardedRef;
        }

        return attributes;
    }

    getColumnClassName() {
        const { type, className = '' } = this.props;

        let columnClass = ['form__column'];

        if(type) {
            columnClass.push('form__column_type_' + type);
        }

        columnClass.push(className);

        return columnClass.join(' ');
    }
}

// Prop Types
Column.propTypes = {
    type: PropTypes.string, 
    className: PropTypes.string,
    forwardedRef: PropTypes.func,
};

export default Column;