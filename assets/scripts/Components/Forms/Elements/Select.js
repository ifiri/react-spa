import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';



import Sorter from '../../../UserInterface/Sorter';
import EntriesfulComponent from '../../EntriesfulComponent';

import * as entriesActions from '../../../Actions/EntriesActions';

/**
 * Form select. Support two modes - with predefined entries and with 
 * dynamically loading entries. So for second case this component
 * is entriesful. For first case just pass `items` in props, for second
 * pass entries type.
 */
class Select extends EntriesfulComponent {
    state = {
        value: null,
    };

    handleChange = event => {
        const { onChange = false } = this.props;

        if(onChange) {
            onChange(event);
        }

        this.setState({ value: event.target.value });
    };

    componentDidMount() {
        const entriesType = this.getEntriesType();
        
        if(entriesType && !this.getSortedEntries(entriesType)) {
            this.props.entriesActions.load(entriesType);
        }
    }

    componentWillUnmount() {
        // ...
    }

    render() {
        const className = this.getSelectClassName();
        const attributes = this.getAttributes();

        const { value = null, label = null, variant = 'standard' } = this.props;

        return <FormControl className={'select'}>
            {(() => {
                if(label) {
                    return <InputLabel shrink htmlFor={attributes.id} required={attributes.required}>{label}</InputLabel>
                }
            })()}

            <NativeSelect
                value={this.state.value !== null ? this.state.value : value}
                onChange={this.handleChange}
                inputProps={attributes}
                variant={variant}
                
                input={<Input name={attributes.name} />}
              >
                { this.getListOptions() }
            </NativeSelect>
        </FormControl>;
    }

    getSelectClassName() {
        const { className = null } = this.props;

        return className || 'form__field form__field_type_select';
    }

    getAttributes() {
        const { name, isRequired = false } = this.props;

        let attributes = {
            name: name
        };

        attributes.required = isRequired;

        return attributes;
    }

    getEntriesType() {
        const { type = null } = this.props;

        return type;
    }

    /**
     * Build and return select options. First option every time dummy option.
     * Entries source or items property in props, or state.
     * 
     * @return Array
     */
    getListOptions() {
        const { items = null, value = null } = this.props;
        const type = this.getEntriesType();

        let options = [
            ( <option key={'empty'} value="">Выберите...</option> )
        ];

        if(items) {
            for(const index in items) {
                const item = items[index];

                if(value && value == index) {
                    options.push((
                        <option key={index} value={index} selected>{item}</option>
                    ));
                } else {
                    options.push((
                        <option key={index} value={index}>{item}</option>
                    ));
                }
            }
        } else if(type) {
            const entries = this.getSortedEntries(entriesType) || [];

            for(const index in entries) {
                const entry = entries[index];
                const key = index + 1;

                if(entry && entry.bank_id) {
                    options.push((
                        <option key={key} value={entry.id}>{entry.name}</option>
                    ));
                }
            }
        }

        return options;
    }
}

// Prop Types
Select.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,
    onChange: PropTypes.func,
    type: PropTypes.string,
    items: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    state: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
};

// Connect
function mapStateToProps(state) {
    return {
        state: {
            entries: state.entries
        }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Select);