import React from 'react';

import PropTypes from 'prop-types';

/**
 * Label for filter input and select.
 */
class Label extends React.Component {
    render() {
        const { caption } = this.props;
        const className = this.getLabelClass();

        return <label className={className}>
            <span className="label__caption">
                {caption}
            </span>

            {this.props.children}
        </label>;
    }

    getLabelClass() {
        const { className = '' } = this.props;

        let labelClass = [
            'filter__label label', 
            className
        ];

        return labelClass.join(' ');
    }
}

// Prop Types
Label.propTypes = {
    caption: PropTypes.string.isRequired, 
    className: PropTypes.string
};

export default Label;