import React from 'react';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

/**
 * Form submit button
 */
class Submit extends React.Component {
    render() {
        const { caption = 'Сохранить' } = this.props;

        return <Button variant="contained" color="primary" className="form__submit" type="submit">
            <span data-rel="label">{caption}</span>
        </Button>;
    }
}

// Prop Types
Submit.propTypes = {
    caption: PropTypes.string,
};

export default Submit;