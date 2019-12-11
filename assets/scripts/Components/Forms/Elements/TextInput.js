import React from 'react';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

/**
 * Form text input. Support many of important input attributes
 */
class TextInput extends React.Component {
    render() {
        const className = this.getInputClassName();
        const attributes = this.getAttributes();
        const type = this.getFieldType();

        const { 
            value = null, 
        } = this.props;

        let iprops = {};

        if(value) {
            iprops.defaultValue = value;
        }

        // onChange={this.handleChange('name')}

        return <TextField
            className={className}
            key={Math.random()}

            type={type === 'password' ? type : 'text'}
            margin="normal"

            inputProps={iprops}

            {...attributes}
        />;

        // return <input 
        //     type={type}
        //     className={className}

        //     {...attributes}
        // />;
    }

    getInputClassName() {
        const { className = null, unlabeled = false } = this.props;

        let final = className || 'form__field form__field_type_input';

        if(unlabeled) {
            final += ' form__field_unlabeled';
        }

        return final;
    }

    getAttributes() {
        const { 
            name, 
            id = '',
            placeholder = '', 
            value = null, 
            title = null, 
            required = false,
            disabled = false,
            pattern = null,
            label = null,

            forwardedRef = null,

            additional = {}
        } = this.props;

        let attributes = {
            placeholder: placeholder,
            name: name,
            title: title,
            disabled: disabled ? true : false,

            ...additional
        };

        // if(value) {
            // attributes.defaultValue = value;
        // }

        if(label) {
            attributes.label = label;
        }

        if(required) {
            attributes.required = true;
        }

        if(id) {
            attributes.id = id;
        }

        if(pattern) {
            attributes.pattern = pattern;
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
TextInput.propTypes = {
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

export default TextInput;