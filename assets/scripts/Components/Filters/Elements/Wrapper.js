import React from 'react';

import PropTypes from 'prop-types';

/**
 * Wrapper for all filter sections.
 */
class Wrapper extends React.Component {
    render() {
        // We should forward ref for possibility make with form some actions in another sections
        const { type = null, forwardedRef, onSubmit } = this.props;

        return <form className={"filter" + (type ? " filter_type_" + type : '')} ref={forwardedRef} onSubmit={onSubmit}>
            {this.props.children}
        </form>;
    }
}

// Prop Types
Wrapper.propTypes = {
    type: PropTypes.string, 
    forwardedRef: PropTypes.func,
    onSubmit: PropTypes.func,
};

export default Wrapper;