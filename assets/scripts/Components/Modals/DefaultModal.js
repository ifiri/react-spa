import React from 'react';
import PropTypes from 'prop-types';

import { withEntry, withState } from '../Modals';

import CommonModal from './CommonModal';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import blue from '@material-ui/core/colors/blue';

/**
 * Base class for all modals in application.
 */
class DefaultModal extends CommonModal {
    //
}

DefaultModal.propTypes = {
    form: PropTypes.func,
    formProps: PropTypes.object,
    modalId: PropTypes.string,
    isPreloaderRequired: PropTypes.bool,
    title: PropTypes.string,

    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

export default withState(DefaultModal);