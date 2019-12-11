import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalsActions from '../../Actions/ModalsActions';

import ManageEntry from './ManageEntry';

import PropTypes from 'prop-types';

/**
 * Open entry manage modal for entry in current table row.
 */
class ManageNomination extends ManageEntry {
    getModalId() {
        return 'manage-nomination-modal';
    }
}

// Prop Types
ManageNomination.propTypes = {
    entry: PropTypes.object.isRequired,
    
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch)
    };
}

export default connect(() => ({}), mapDispatchToProps)(ManageNomination);