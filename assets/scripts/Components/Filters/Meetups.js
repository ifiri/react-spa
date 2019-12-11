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
export default class Meetups extends Common {
    render() {
        const filterData = this.getFilterData();

        const layout = <React.Fragment>
            <Filter.Item type="search-by-type">
                <Filter.Select
                    name="type"
                    placeholder="Все типы"
                    icon={
                        <SvgIcon className="icon" component={svgProps => (
                            <svg {...svgProps}>
                                <use xlinkHref="#filter-ost" />
                            </svg>
                            )}
                        />
                    }

                    forwardedRef={this.setFocusElementRef}

                    items={{
                        0: 'Конкурс',
                        1: 'Конференция'
                    }}

                    value={(filterData && filterData.type) || null}
                />
            </Filter.Item>

            <Filter.Actions>
                <ActionButtons.CreateStandard modalId="add-meetup-modal" />
            </Filter.Actions>
        </React.Fragment>;

        return (
            <Filter.Wrapper type="meetups" onSubmit={this.catchFilterSubmit} forwardedRef={this.setFilterRef}>
                {layout}
            </Filter.Wrapper>
        );
    }

    getEntriesType() {
        return 'meetups';
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