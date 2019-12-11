import React from 'react';

import PropTypes from 'prop-types';

import Entries from '../Entries';
import SearchPreloader from '../Preloaders/SearchPreloader';
import EntriesError from '../Entries/EntriesError';
import EntityTitle from '../EntityTitle';

import NoticeModal from '../Modals/NoticeModal';
import ErrorModal from '../Modals/ErrorModal';
import ConfirmModal from '../Modals/ConfirmModal';
import ViewModal from '../Modals/ViewModal';

import Paper from '@material-ui/core/Paper';

import { withState as filterWithState } from '../Filters';

import PaginateLinks from '../PaginateLinks';

/**
 * Common abstract page
 */
class Common extends React.Component {
    constructor(props) {
        super(props);

        // Link to node which contain List component
        this.listWrapper = null;
        this.setListWrapperRef = this.setListWrapperRef.bind(this);

        const entriesType = this.getEntriesType();
    }

    /**
     * When page is rendering, output pagination,
     * filters, entries list and search preloader.
     * 
     * @return void
     */
    render() {
        const { location } = this.props;

        const entriesType = this.getEntriesType();

        return (
            <React.Fragment>
                {(() => {
                    const titleVariant =  this.getPageTitleVariant();

                    if(!titleVariant || titleVariant === 'primary') {
                        return <EntityTitle type={ entriesType } />;
                    }
                })()}

                <div className="content__fragment content__filter-area">
                    {(() => {
                        const title =  this.getPageTitle();
                        const titleVariant =  this.getPageTitleVariant();

                        if(title) {
                            const className = "page__title" + (
                                titleVariant ? " page__title_variant_" + titleVariant : ""
                            );

                            return <h2 className={className}>{title}</h2>;
                        }
                    })()}

                    {(() => {
                        const Filter = this.getStatefulFilter();

                        if(Filter) {
                            return Filter;
                        }
                    })()}
                </div>
                
                <div className="content__fragment">
                    <SearchPreloader type={entriesType}> </SearchPreloader>
                    
                    { this.getPageContent() }

                    <PaginateLinks location={location} type={entriesType} />
                </div>
            </React.Fragment>
        );
    }

    getActions() {
        return null;
    }

    getPageContent() {
        const entriesType = this.getEntriesType();
        
        return this.getEntriesListFor({ 
                entriesType: entriesType, 
                actionButtons: this.getActions() 
            });
    }

    getPageTitle() {
        return null;
    }

    getPageTitleVariant() {
        return null;
    }

    /**
     * Access params is a object of params which will be
     * passed in List component for `load` action. In other words,
     * you can add request params for API here.
     *
     * By default null.
     * 
     * @return null
     */
    getActionParams() {
        return null;
    }

    /**
     * Create and return List component with passed params.
     * 
     * @param  entriesType String
     * @param  isClearRequired Boolean
     * @param  isPaginated Boolean
     * @return JSX
     */
    getEntriesListFor({ entriesType, isClearRequired = false, isPaginated = true, actionButtons = null }) {
        return <Entries.List 
            entriesType={entriesType}
            isClearRequired={isClearRequired}
            isPaginated={isPaginated}
            actionParams={this.getActionParams()}
            actionButtons={actionButtons}
        />;
    }

    /**
     * Some types of modals should be in every page.
     * This function return array of three required messaging modals.
     * 
     * @return Array
     */
    getMessagingModals() {
        return [
            <NoticeModal key="notice-modal" modalClass="modal_type_notice" />,
            <ConfirmModal key="confirm-modal" modalClass="modal_type_confirm" />,
            <ErrorModal key="error-modal" modalClass="modal_type_error" />,
            <ViewModal key="view-modal" modalClass="modal_type_view" />
        ];
    }

    /**
     * Returns filter class for current page
     * 
     * @return Object | null
     */
    getFilter() {
        return null;
    }

    /**
     * Returns filter with state
     * 
     * @return Object | null
     */
    getStatefulFilter() {
        const Filter = this.getFilter();

        if(Filter) {
            const Current = {
                Stateful: filterWithState(Filter)
            };

            return <Current.Stateful {...this.props} />;
        }
        
        return null;
    }

    setListWrapperRef(element) {
        this.listWrapper = element;
    }
}

// Prop Types
Common.propTypes = {
    location: PropTypes.object.isRequired,
};

export default Common;