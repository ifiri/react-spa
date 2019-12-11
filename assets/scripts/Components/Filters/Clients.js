import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';

import ActionButtons from '../ActionButtons';
import Form from '../Form';

import Filter from '../Filter';

import Common from './Common';

/**
 * Filter for Clients page.
 */
export default class Clients extends Common {
    render() {
        const filterData = this.getFilterData();

        const layout = <>
            <Filter.Item type="search-by-login">
                <Filter.Label caption="Поиск по логину пользователя">
                    <Form.Text
                        name="login"
                        id="filter-login-search"
                        className="filter__field filter__field_type_input"
                        placeholder="Логин пользователя"

                        forwardedRef={this.setFocusElementRef}

                        value={(filterData && filterData.login) || null}
                    />
                </Filter.Label>
            </Filter.Item>

            <Filter.Actions>
                <ActionButtons.Create modalId="add-client-modal" />
            </Filter.Actions>
        </>;

        return (
            <Filter.Wrapper type="clients" onSubmit={this.catchFilterSubmit} forwardedRef={this.setFilterRef}>
                {layout}
            </Filter.Wrapper>
        );
    }

    getEntriesType() {
        return 'clients';
    }

    /**
     * Forms and returns query for filter action
     * 
     * @return Object
     */
    getFilterQuery() {
        const banksList = this.filter.elements.bank;

        return {
            'filter.bank_id': banksList.options[banksList.selectedIndex].value || null,
            'filter.login': this.filter.elements.login.value || null
        };
    }
}