import React from 'react';

import PropTypes from 'prop-types';

/**
 * TextValue is a text line for display some immutable text data
 */
class TextValue extends React.Component {
    render() {
        const { value } = this.props;

        return <div className="form__text-value">
            {value}
        </div>;
    }
}

// Prop Types
TextValue.propTypes = {
    value: PropTypes.string.isRequired,
};

export default TextValue;