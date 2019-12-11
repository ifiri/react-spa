import React from 'react';

import PropTypes from 'prop-types';

/**
 * Hidden input for storing hidden but important data
 */
class HiddenInput extends React.Component {
    render() {
        const attributes = this.getAttributes();

        return <input 
            type="hidden"

            {...attributes}
        />;
    }

    getAttributes() {
        const { name, value = null, disableIfInactive = false } = this.props;

        let attributes = {
            name: name,
            readOnly: true
        };

        if(value) {
            attributes.defaultValue = value;
        }

        return attributes;
    }
}

// Prop Types
HiddenInput.propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool
    ]),
    disableIfInactive: PropTypes.bool,
};

export default HiddenInput;