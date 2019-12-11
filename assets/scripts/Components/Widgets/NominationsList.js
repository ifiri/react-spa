import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../Routing';
import PropTypes from 'prop-types';

import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import UserEntity from '../../User/Entity';
import EntriesfulComponent from '../EntriesfulComponent';

import * as entriesActions from '../../Actions/EntriesActions';

/**
 * Entriesful select with banks.
 */
class NominationsList extends EntriesfulComponent {
    state = {
        value: null,
    };

    handleChange = event => {
        this.setState({ value: event.target.value });
    };

    render() {
        const options = this.getListOptions();
        const attributes = this.getAttributes();
        const className = this.getClassName();
        const { value = null, label = null } = this.props;

        return <FormControl className={className}>
            <InputLabel shrink htmlFor={attributes.id} required={attributes.required}>{label}</InputLabel>
            <NativeSelect
                value={this.state.value !== null ? this.state.value : value}
                onChange={this.handleChange}
                inputProps={attributes}
                
                input={<Input name={attributes.name} id={attributes.id} />}
              >
                {options}
            </NativeSelect>
        </FormControl>;
    }

    getClassName() {
        const { className } = this.props;

        return className || "filter__field filter__field_type_select";
    }

    getAttributes() {
        const { name = null, id = null, isRequired = false } = this.props;

        let attributes = {
            required: isRequired
        };

        if(name) {
            attributes.name = name;
        }

        if(id) {
            attributes.id = id;
        }

        return attributes;
    }

    getEntriesType() {
        return 'nominations';
    }

    getActionParams() {
        const { match } = this.props;

        return {
            map: {
                meetup: (match && match.params.id) || null
            }
        };
    }

    getListOptions() {
        const entriesType = this.getEntriesType();
        const entries = this.getSortedEntries(entriesType);
        const { value = null } = this.props;

        let options = [
            ( <option key={0} value="">Выберите...</option> )
        ];

        for(const index in entries) {
            const entry = entries[index];
            const key = index + 1;

            if(entry && entry.id) {
                if(value && value === entry.id) {
                    options.push((
                        <option key={key} value={entry.id} selected>{entry.title}</option>
                    ));
                } else {
                    options.push((
                        <option key={key} value={entry.id}>{entry.title}</option>
                    ));
                }
            }
        }

        return options;
    }
}

// Prop Types
NominationsList.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired, 
    id: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    state: PropTypes.object.isRequired,
    match: PropTypes.object,
    entriesActions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: {
            entries: state.entries,
        }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(NominationsList));