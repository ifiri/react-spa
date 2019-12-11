import React from 'react';
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';

/**
 * Form text input. Support many of important input attributes
 */
class TextArea extends React.Component {
    render() {
        const className = this.getInputClassName();
        const attributes = this.getAttributes();
        const type = this.getFieldType();

        return <TextField
            className={className}
            
            margin="normal"
            multiline

            {...attributes}
        />;

        // return <textarea 
        //     type={type}
        //     className={className}

        //     {...attributes}
        // />;
    }

    getInputClassName() {
        const { className = null } = this.props;

        return className || 'form__field form__field_type_textarea';
    }

    getAttributes() {
        const { 
            name, 
            id = '',
            placeholder = '', 
            title = null,
            value = null,
            label = null,
            required = false,
            disabled = false,

            forwardedRef = null,

            additional = {},

            key = Math.random()
        } = this.props;

        let attributes = {
            placeholder: placeholder,
            name: name,
            title: title,
            disabled: disabled ? true : false,

            ...additional
        };

        if(value) {
            attributes.defaultValue = value;
            attributes.key = value + attributes.key;
        }

        if(required) {
            attributes.required = true;
        }

        if(id) {
            attributes.id = id;
        }

        if(label) {
            attributes.label = label;
        }

        if(forwardedRef) {
            attributes.ref = forwardedRef;
        }

        return attributes;
    }

    getFieldType() {
        return 'text';
    }
}

// Prop Types
TextArea.propTypes = {
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

export default TextArea;