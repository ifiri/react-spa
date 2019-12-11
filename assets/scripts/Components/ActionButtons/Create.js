import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';

import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames';

import PropTypes from 'prop-types';

const styles = theme => ({
  cssRoot: {
    color: '#ffffff',
    backgroundColor: '#369b00',

    '&:hover': {
        // #256303
      backgroundColor: '#2c7404',
    },
  }
});

/**
 * Create button. Open modal with passed ID.
 */
class Create extends React.Component {
    constructor(props) {
        super(props);

        this.openModal = this.openModal.bind(this);
    }

    /**
     * Click listener, just open a modal.
     *
     * @param {Event} event
     */
    openModal(event) {
        const { modalId, params = null } = this.props;

        this.props.modalsActions.modalOpening(modalId, params);
    }

    render() {
        const { classes } = this.props;

        const { caption = 'Добавить', inside = false } = this.props;
        let className = 'action action_type_create';
        if(inside) {
            className += ' inside';
        }

        return <Button className={className + ' ' + classNames(classes.cssRoot)} onClick={this.openModal} variant="contained" color="primary" type="button">
            { caption }
        </Button>;
    }
}

// Prop Types
Create.propTypes = {
    modalId: PropTypes.string.isRequired,
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(withStyles(styles)(Create));