import React from 'react';

import PropTypes from 'prop-types';

import TextInput from './TextInput';

/**
 * Form text input. Support many of important input attributes
 */
class EmailInput extends TextInput {
    getFieldType() {
        return 'email';
    }
}

// Prop Types
EmailInput.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired, 
    id: PropTypes.string,
    placeholder: PropTypes.string, 
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool
    ]),
    title: PropTypes.string, 
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,

    forwardedRef: PropTypes.func,

    additional: PropTypes.object,
};

export default EmailInput;