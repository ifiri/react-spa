import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withMatch } from '../../Routing';

import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

import Sorter from '../../../UserInterface/Sorter';
import EntriesfulComponent from '../../EntriesfulComponent';

import * as entriesActions from '../../../Actions/EntriesActions';

/**
 * Tag list in input component.
 */
class Multiple extends EntriesfulComponent {
    state = {
        name: [],
    };

    users = null;

    handleChange = event => {
        let value = event.target.value;
        const values = [];

        this.setState({ name: value });
    };

    getEntriesType() {
        const { type } = this.props;

        if(type) {
            return type;
        }

        return null;
    }

    mapUsersById() {
        const entries = this.getEntries();

        this.users = {};

        for(const entry of entries) {
            if(!entry.id) {
                continue;
            }

            this.users[entry.id] = entry;
        }

        return this.users;
    }

    render() {
        const attributes = this.getAttributes();
        const entriesType = this.getEntriesType();

        const { value = null } = this.props;

        let entries = [];
        if(this.isLoadPerformed()) {
            entries = this.getSortedEntries(entriesType);

            if(!this.users) {
                this.users = this.mapUsersById();
            }
        }

        let multipleValue = this.state.name;
        if(value) {
            let prepared = [];

            if(typeof value === 'object') {
                for(const user of value) {
                    prepared.push(user.id);
                }

                multipleValue = prepared;
            }
        }

        return (
      <div>
        <FormControl className="select">
          <InputLabel htmlFor="work-add-users" required={attributes.required}>{ attributes.label }</InputLabel>
          <Select
            multiple
            value={multipleValue}
            onChange={this.handleChange}
            input={<Input id="work-add-users" />}
            renderValue={selected => {
                console.log('::: selecteds!');
                console.log(selected);

                if(!this.users) {
                    this.users = this.mapUsersById();
                }
              return <div className="chips">
                {selected.map(id => {
                    const entry = this.users[id];
                  return <Chip key={id} label={entry.fio} className="chip" />
                })}
              </div>
            }}
          >
            {entries.map(entry => (
              <MenuItem
                key={entry._uniq}
                value={entry.id}
              >
                {entry.fio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
    }

    getActionParams() {
        const { match } = this.props;

        return {
            map: {
                meetup: (match && match.params.id) || null
            }
        };
    }

    getAttributes() {
        const { name, label, isRequired = false } = this.props;

        let attributes = {
            name: name,
            label: label
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
            ( <option key={0} value="">Выберите...</option> )
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

export default connect(mapStateToProps, mapDispatchToProps)(withMatch(Multiple));