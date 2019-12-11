import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Entries from '../Entries';
import NotFound from '../NotFound';

import Sorter from '../../UserInterface/Sorter';

import ActionButtons from '../ActionButtons';
import EntriesfulComponent from '../EntriesfulComponent';

import * as modalsActions from '../../Actions/ModalsActions';
import * as entriesActions from '../../Actions/EntriesActions';

/**
 * Represent table with entries of some type. One of more important classes in app.
 */
class PhotosGrid extends EntriesfulComponent {
    constructor(props) {
        super(props);
    }

    /**
     * Override parent method. Load current entries and sort, if required.
     */
    componentDidMount() {
        const entriesType = this.getEntriesType();
        const actionParams = this.props.actionParams || {};

        if(!this.getEntries(entriesType) && !this.isLoadPerformed() && !this.isLoadStarted()) {
            this.props.entriesActions.load(entriesType, actionParams);
        } else if(this.isSortingRequired()) {
            this.sortEntries();
        }
    }

    /**
     * After update, check, should entries be sorted again. If yes, sort it.
     *
     * @param  prevProps Object
     * @return void
     */
    componentDidUpdate(prevProps) {
        const entriesType = this.getEntriesType();

        if(this.getEntries(entriesType) && this.isLoadPerformed()) {
            if(this.isSortingRequired()) {
                this.sortEntries();
            }
        }
    }

    render() {
        const { state, modalsActions } = this.props;
        const entriesType = this.getEntriesType();
        const entries = this.getPreparedEntries();

        return (<div>
            {(() => {
                if(
                    (!entries || !entries.length) 
                    &&
                    this.isLoadPerformed()
                ) {
                    return <NotFound />;
                } else {
                    return <React.Fragment>
                        {(() => {
                            const layouts = [];
                            for(const index in entries) {
                                const entry = entries[index];

                                layouts.push((
                                    <a className="media-grid__item" href={entry.original}>
                                        <ActionButtons.DeleteMediaEntry 
                                            message="Удалить фото?"
                                            entryId={entry.id} 
                                            onDeleteCallback={this.onDelete.bind(this, entry)}
                                        />

                                        <img className="media-grid__img" src={entry.preview} />
                                    </a>
                                ));
                            }

                            return layouts;
                        })()}
                    </React.Fragment>;
                }
            })()}
        </div>);
    }

    /**
     * Dispatch `sort` action for sort current entries.
     * 
     * @return void
     */
    sortEntries() {
        const entriesType = this.getEntriesType();

        const SorterInstance = new Sorter(entriesType);
        const { order, orderBy } = SorterInstance.getSortParameters(this.props.state.entries);

        this.props.entriesActions.sort(entriesType, orderBy, order);
    }

    /**
     * Returns current entries type.
     * @return string
     */
    getEntriesType() {
        const { entriesType } = this.props;

        return entriesType;
    }

    /**
     * Returns entries, splitted by page, if required, or all entries.
     * 
     * @return Array
     */
    getPreparedEntries() {
        const { entriesType } = this.props;

        let entries = this.getEntries(entriesType);

        return entries;
    }

    onDelete(entry, result) {
        const entriesType = this.getEntriesType();

        // this.props.actions.deleteEntry(entriesType, {
        //     body: entry,
        //     uniq: entry._uniq
        // });
    }
}

// Prop Types
PhotosGrid.propTypes = {
    entriesType: PropTypes.string.isRequired,
    actionParams: PropTypes.object,
    isClearRequired: PropTypes.bool,

    state: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    modalsActions: PropTypes.object.isRequired,
};

// Connection
function mapStateToProps(state) {
    return {
        state: {
            modals: state.modals,
            entries: state.entries
        }
    };
}

function mapDispatchToProps(dispatch) {
    return {
        modalsActions: bindActionCreators(modalsActions, dispatch),
        entriesActions: bindActionCreators(entriesActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotosGrid);