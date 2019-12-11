import React from 'react';

import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

import Radio from './Radio';

/**
 * Form toggle.
 */
class Toggle extends Radio {
    state = {
        value: null,
      };
      
    handleChange = event => {
        const { onToggle } = this.props;

        if(onToggle) {
            onToggle(event);
        }

        this.setState({ value: event.target.value });
      };

    render() {
        const { caption = '', onToggle = null, type = null, forwardedRef = null } = this.props;

        const className = 'form__field form__field_type_toggle toggle' + (type ? ' toggle_type_' + type : '');
        const attributes = {
            className: className
        };

        if(forwardedRef) {
            attributes.ref = forwardedRef;
        }

        if(onToggle) {
            attributes.onChange = onToggle;
        }

        return <div {...attributes}>
            {(() => {
                if(caption) { 
                    return <div className="toggle__label">{caption}</div>;
                }
            })()}

            { this.getChoicesLayouts() }
        </div>;
    }
}

// Prop Types
Toggle.propTypes = {
    name: PropTypes.string.isRequired, 
    id: PropTypes.string, 
    
    title: PropTypes.string, 
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,

    choices: PropTypes.object.isRequired,
};

export default Toggle;