import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';

import ManageEntry from './ManageEntry';

import PropTypes from 'prop-types';

/**
 * Open entry manage modal for entry in current table row.
 */
class ManageEvent extends ManageEntry {
    getModalId() {
        return 'manage-event-modal';
    }
}

// Prop Types
ManageEvent.propTypes = {
    entry: PropTypes.object.isRequired,
    
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(ManageEvent);