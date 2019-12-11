import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

import PropTypes from 'prop-types';

import DefaultModal from '../Modals/DefaultModal';
import { withState } from '../Modals';

import ActionButtons from '../../ActionButtons';

import EntriesfulComponent from '../../EntriesfulComponent';

/**
 * Clients page
 */
class CompanyDepartments extends EntriesfulComponent {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const entriesType = this.getEntriesType();

        return (<>
            <EntriesPreloader {...this.props} type={ this.getEntriesType() }>
                { super.render() }
            </EntriesPreloader>

            { this.getMessagingModals() }
            </>
        );
    }

    getPageContent() {
        return (<>
            <CompanyManageForm />
            <CompanyDepartments />
            </>
        );
    }

    getEntriesType() {
        return 'company';
    }

    getFilter() {
        return null;
    }
}

// Prop Types
CompanyDepartments.propTypes = {
    state: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyDepartments);