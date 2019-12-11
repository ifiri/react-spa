import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

import ActionButtons from '../ActionButtons';
import Form from '../Form';

import Filter from '../Filter';
import SvgIcon from '@material-ui/core/SvgIcon';

import Common from './Common';

/**
 * Filter for Meetups page.
 */
export default class Works extends Common {
    render() {
        const filterData = this.getFilterData();

        const layout = <React.Fragment>
            <Filter.Actions>
                <ActionButtons.CreateStandard modalId="add-work-modal" />
            </Filter.Actions>
        </React.Fragment>;

        return (
            <Filter.Wrapper type="works" onSubmit={this.catchFilterSubmit} forwardedRef={this.setFilterRef}>
                {layout}
            </Filter.Wrapper>
        );
    }

    getEntriesType() {
        return 'works';
    }

    /**
     * Forms and returns query for filter action
     * 
     * @return Object
     */
    getFilterQuery() {
        return {};
    }
}