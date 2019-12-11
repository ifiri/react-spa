import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PaginationUtils from '../Utils/Pagination';

import * as entriesActions from '../Actions/EntriesActions';

/**
 * This component represent pagination by entries.
 */
class PaginateLinks extends React.Component {
    constructor(props) {
        super(props);

        // Count of showing links around hidden ones
        this.CORNERS_SIZE = 2;

        // Count of links around current active link
        this.MIDDLE_SIDES_SIZE = 1;

        // Classes
        this.LINK_CLASS = 'pagination__link';
        this.LINK_CLASS_ACTIVE = 'pagination__link_active';
        this.SEPARATOR_CLASS = 'pagination__separator';

        // Flags
        this.separators = [];

        // Listeners
        this.paginateLinkClick = this.paginateLinkClick.bind(this);
    }

    /**
     * Print pagination layout.
     */
    render() {
        const { type } = this.props;
        const entries = this.getAllEntries(type);

        const pagesCount = PaginationUtils.getPagesCount(entries);

        // No layout when no pages
        if(pagesCount === 1) {
            return null;
        }
               
        return <div className="pagination">{ this.getPaginateLinks() }</div>;
    }

    /**
     * Builds and returns pagination links layouts.
     * 
     * @return Array
     */
    getPaginateLinks() {
        let links = [];

        const { state, type } = this.props;
        const entries = this.getAllEntries(type);

        const pagesCount = PaginationUtils.getPagesCount(entries);
        const currentPage = PaginationUtils.getCurrentPage(state, type);

        // Count of visible links which should showing around plus one active
        const middleAreaLength = this.MIDDLE_SIDES_SIZE * 2 + 1;

        // Where should end first bunch of vislble links...
        let left_corner_end = this.CORNERS_SIZE;

        // ...and where should begin the last one
        let right_corner_start = pagesCount - this.CORNERS_SIZE;

        // Add all links and separators
        for (let page = 1; page <= pagesCount; page++) {

            // Increase left counter end if currentPage too small for separator
            // but already bigger than left counter end
            if(currentPage >= left_corner_end && currentPage <= left_corner_end + middleAreaLength) {
                left_corner_end++;
            }

            // When first link already printed, but last one while not
            if(page === 1 || page === pagesCount) {
                // continue;
            }

            // If length between current page and first one more than middle length
            // In other words, if we can put separator...
            if(currentPage >= 1 + middleAreaLength) {

                // ...after first link
                if(page <= currentPage - middleAreaLength + 1) {
                    links = this.addSeparatorTo(links, 'left');
                    
                    continue;
                }

                // ...before last one
                if(page >= currentPage + this.CORNERS_SIZE) {
                    links = this.addSeparatorTo(links, 'right');
                    
                    continue;
                }
            } else { 
                // If current page in begin or in the end of bunch of pages
                // In this case, we can put separator in a middle
                if(page > left_corner_end && page < right_corner_start + 1) {
                    links = this.addSeparatorTo(links, 'middle');

                    continue;
                }
            }

            // Add common pagination link
            links.push(this.getPageLink(page, currentPage, pagesCount));
        }

        links.unshift(this.getPrevLink(currentPage));
        links.push(this.getNextLink(currentPage, pagesCount));

        return links;
    }

    /**
     * Adds separator (three dots) to a desired place in links.
     * Place can be `left`, `middle` or `right`.
     * 
     * @param links Array 
     * @param place String
     */
    addSeparatorTo(links, place) {
        if(!this.isSeparatorExists(place)) {
            const separator = this.getSeparator(place);

            links.push(separator);

            this.separators.push(place);
        }

        return links;
    }

    /**
     * If separator already added in desired place, returns true.
     * 
     * @param  place String
     * @return Boolean
     */
    isSeparatorExists(place) {
        return this.separators.indexOf(place);
    }

    /**
     * Creates link to previous page, if user at this moment CAN goes back
     * 
     * @param  currentPage Integer
     * @return JSX
     */
    getPrevLink(currentPage) {
        let layout;

        if(currentPage === 1) {
            layout = <span key="prev" className="pagination__prev pagination__prev_disabled">&laquo;</span>;
        } else {
            layout = <a key="prev" className="pagination__prev" href="#" data-page="prev" onClick={this.paginateLinkClick}>&laquo;</a>;
        }

        return layout;
    }

    /**
     * Creates link to previous page, if user at this moment NOT on last page
     * 
     * @param  currentPage Integer
     * @param  pagesCount Integer
     * @return JSX
     */
    getNextLink(currentPage, pagesCount) {
        let layout;

        if(currentPage === pagesCount) {
            layout = <span key="next" className="pagination__next pagination__next_disabled">&raquo;</span>;
        } else {
            layout = <a key="next" className="pagination__next" href="#" data-page="next" onClick={this.paginateLinkClick}>&raquo;</a>;
        }

        return layout;
    }

    /**
     * Create common number link to every page.
     * Page is passed page from cycle, currentPage is a page from state.
     * 
     * @param  page Integer
     * @param  currentPage Integer
     * @param  pagesCount Integer
     * @return JSX
     */
    getPageLink(page, currentPage, pagesCount) {
        let linkClasses = [this.LINK_CLASS];

        if(page === currentPage) {
            linkClasses.push(this.LINK_CLASS_ACTIVE);
        }

        return <a key={'link' + page} className={linkClasses.join(' ')} href="#" data-page={page} onClick={this.paginateLinkClick}>{page}</a>;
    }

    /**
     * Returns separator layout with passed unique key.
     * 
     * @param  key String
     * @return JSX
     */
    getSeparator(key) {
        return <span key={key} className={this.SEPARATOR_CLASS}>...</span>;
    }

    /**
     * Handle clicks by paginate links. Dispatch `changePage` action.
     * 
     * @param  event Object
     * @return void
     */
    paginateLinkClick(event) {
        const element = event.target;

        if(element.dataset.page) {
            const { type } = this.props;
            const pageAlias = element.dataset.page;
            const currentPage = PaginationUtils.getCurrentPage(this.props.state, type);

            const page = PaginationUtils.getCorrectPageNumber(pageAlias, currentPage);

            this.props.actions.changePage(type, page);
        }

        event.preventDefault();
    }

    /**
     * Returns all entries from state.
     * 
     * @param  type String
     * @return Array
     */
    getAllEntries(type) {
        const entries = this.props.state[type].items ? this.props.state[type].items : null;

        return entries;
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(PaginateLinks);