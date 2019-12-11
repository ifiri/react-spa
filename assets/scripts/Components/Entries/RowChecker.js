import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as entriesActions from '../../Actions/EntriesActions';
import Checkbox from '@material-ui/core/Checkbox';

import PropTypes from 'prop-types';

/**
 * Checkbox in cells with `check` type. Can work in two modes: all and current.
 * All mode for checking all rows, current for check only current one.
 */
class RowChecker extends React.Component {
    constructor(props) {
        super(props);

        // Ref link to checkbox node
        this.checkbox = null;

        // Refsetter and listener
        this.setCheckboxRef = this.setCheckboxRef.bind(this);
        this.changeSelectedState = this.changeSelectedState.bind(this);
        this.test = this.test.bind(this);
    }

    test(event, checked) {
        const { mode = 'current' } = this.props;
        const { entry } = this.props;
        const isChecked = checked; 

        switch(mode) {
            case 'all': // Select / deselect all
                const { type } = this.props;
                const entries = this.props.state[type].items || [];

                for(const index in entries) {
                    if(isChecked) {
                        this.changeSelectedState(entries[index], isChecked);
                    } else {
                        this.deselectAll();
                    }
                }

                break;

            case 'current': // Select only current entry
            default:
                this.changeSelectedState(entry, isChecked);
                break;
        }
    }

    /**
     * At mounting, add change listener for checkbox node.
     */
    componentDidMount() {
        const checkbox = this.checkbox;
        const { entry } = this.props;
        const { mode = 'current' } = this.props;

        // return;

        checkbox.addEventListener('cяhange', event => {
            const checkMode = mode;
            const isChecked = checkbox.checked; 

            switch(checkMode) {
                case 'all': // Select / deselect all
                    const { type } = this.props;
                    const entries = this.props.state[type].items || [];

                    for(const index in entries) {
                        if(!isChecked) {
                            this.changeSelectedState(entries[index], isChecked);
                        } else {
                            this.deselectAll();
                        }
                    }

                    break;

                case 'current': // Select only current entry
                default:
                    this.changeSelectedState(entry, isChecked);
                    break;
            }
        });
    }

    render() {
        const { mode = 'current', id, entry = null } = this.props;
        const selected = this.props.state.selected.slice() || [];

        let isChecked = false;
        let isIntermediate = false;

        // If entry is exists, check, there's it in selected entries or not.
        // We need this information for initial `checked` attribute
        if(entry) {
            const entryIndexByUniq = selected.findIndex(element => {
                if(element._uniq && element._uniq === entry._uniq) {
                    return element;
                }
            });
            
            if(~entryIndexByUniq) {
                isChecked = true;
            }
        } else if(mode === 'all') {
            // If mode is `all`, we just check if all entries are in selected entries array
            const { type } = this.props;
            const entries = this.props.state[type].items || [];

            if(selected.length === entries.length) {
                isChecked = true;
            } else if(selected.length) {
                isIntermediate = true;
            }
        }

        return (
            <div data-prevent-modal="true">
                <Checkbox 
                    inputRef={this.setCheckboxRef} 
                    indeterminate={isIntermediate}
                    checked={isChecked}
                    onChange={this.test}
                />
            </div>
        );
    }

    /**
     * Dispatch `deselectAll` action
     * 
     * @return void
     */
    deselectAll() {
        const { type } = this.props;
        
        this.props.entriesActions.deselectAll(type);
    }

    /**
     * Check selected state of entry and dispatch `select`
     * or `deselect` actions depends of checked state.
     * 
     * @param  entry Object
     * @param  isChecked Boolean
     * @return void
     */
    changeSelectedState(entry, isChecked) {
        const selected = this.props.state.selected.slice() || [];

        /**
         * Dispatch `select`, add entry to selected
         */
        const addToSelected = entry => {
            const { type } = this.props;

            this.props.entriesActions.select(entry, type);
        };

        /**
         * Dispatch `deselect`, remove entry from selected
         */
        const removeFromSelected = entry => {
            const { type } = this.props;

            this.props.entriesActions.deselect(entry, type);
        };

        // Find entry in selected entries by its uniq
        const entryIndexByUniq = selected.findIndex(element => {
            if(element._uniq && element._uniq === entry._uniq) {
                return element;
            }
        });

        // Depends of search results, fire required function
        if(isChecked) {
            if(!~entryIndexByUniq) {
                addToSelected(entry);
            }
        } else {
            if(~entryIndexByUniq) {
                removeFromSelected(entry);
            }
        }
    }

    setCheckboxRef(element) {
        this.checkbox = element;
    }
}

// Prop Types
RowChecker.propTypes = {
    mode: PropTypes.string, 
    id: PropTypes.string.isRequired, 
    entry: PropTypes.object,
    type: PropTypes.string.isRequired,
    isPaginated: PropTypes.bool,
    actionParams: PropTypes.object,

    state: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
};

// Connection
function mapStateToProps(state) {
    return {
        state: state.entries
    };
}

function mapDispatchToProps(dispatch) {
    return {
        entriesActions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RowChecker);