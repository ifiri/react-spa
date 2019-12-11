import React from 'react';

import PropTypes from 'prop-types';

/**
 * Form error. Display current error inside form. Using only in login form.
 */
class Error extends React.Component {
    render() {
        const errorMessage = this.getErrorMessage();
        const errorClass = this.getErrorClass();

        return <div className={errorClass}>{errorMessage}</div>;
    }

    getErrorMessage() {
        return this.props.state ? (
            this.props.state.error ? this.props.state.error.message : ''
        ) : '';
    }

    getErrorClass() {
        let errorClass = 'form__error';

        if(this.getErrorMessage()) {
            errorClass += ' form__error_shown';
        }

        return errorClass;
    }
}

// Prop Types
Error.propTypes = {
    state: PropTypes.object, 
};

export default Error;