import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';
import Button from '@material-ui/core/Button';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = theme => ({
  cssRoot: {
    color: '#ffffff',
    backgroundColor: '#8a96a0',

    '&:hover': {
      backgroundColor: '#6f7880',
    },
  }
});

/**
 * Just dismiss current modal.
 */
class Cancel extends React.Component {
    constructor(props) {
        super(props);

        this.dismissModal = this.dismissModal.bind(this);
    }

    dismissModal(event) {
        const modal = event.target.closest('.modal');

        if(modal && event.nativeEvent.which === 1) {
            const modalId = modal.getAttribute('id');
            
            this.props.modalsActions.modalClosing(modalId);
        }
    }

    render() {
        const { classes } = this.props;

        return <Button variant="contained" color="primary" className={"action action_type_cancel " + classNames(classes.cssRoot)} type="button" onClick={this.dismissModal}>
            Отменить
        </Button>;
    }
}

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(withStyles(styles)(Cancel));