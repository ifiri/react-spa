import React from 'react';

import PropTypes from 'prop-types';

/**
 * Root component for forms. All form component should be wrapper in wrapper
 */
class Wrapper extends React.Component {
    render() {
        const className = this.getFormClassName();
        const attributes = this.getAttribites();

        return <form className={className} {...attributes}>
            {this.props.children}
        </form>;
    }

    getFormClassName() {
        const { type } = this.props;
        let formClass = ['form'];

        if(type) {
            formClass.push('form_type_' + type);
        }

        return formClass.join(' ');
    }

    getAttribites() {
        const { onSubmit = null } = this.props;

        let attributes = {
            autoComplete: 'off'
        };

        if(onSubmit) {
            attributes.onSubmit = onSubmit;
        }

        return attributes;
    }
}

// Prop Types
Wrapper.propTypes = {
    onSubmit: PropTypes.func,
    type: PropTypes.string,
};

export default Wrapper;