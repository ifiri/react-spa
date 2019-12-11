/**
 * Some helper functions for work with pagination
 */
export default class Pagination {
    /**
     * Returns items per page count
     * 
     * @return Integer
     */
    static getItemsPerPage() {
        return 99999;
    }

    /**
     * Transform `next` and `prev` to page numbers
     * based by current page
     * 
     * @param  pageAlias String
     * @param  currentPage Integer
     * @return Integer
     */
    static getCorrectPageNumber(pageAlias, currentPage) {
        let page = pageAlias;
        
        switch(pageAlias) {
            case 'next':
                page = currentPage + 1;
                break;

            case 'prev':
                page = currentPage - 1;
                break;
        }

        return parseInt(page);
    }

    /**
     * Returns last page number
     * 
     * @param  entries Array
     * @return Integer
     */
    static getPagesCount(entries) {
        const itemsPerPage = Pagination.getItemsPerPage();

        if(!entries || !entries.length) {
            return 1;
        }

        return Math.ceil(entries.length / itemsPerPage);
    }

    /**
     * Returns entries which in range of current page
     * 
     * @param  entries Array
     * @param  page Integer
     * @return Array
     */
    static getEntriesByPage(entries, page) {
        const itemsPerPage = Pagination.getItemsPerPage();
        const startFrom = itemsPerPage * (page - 1);

        let entriesByPage = entries.slice(startFrom, startFrom + itemsPerPage);

        return entriesByPage;
    }

    /**
     * Returns current page number from passed state
     * 
     * @param  state Object
     * @param  entriesType String
     * @return Integer
     */
    static getCurrentPage(state, entriesType) {
        const page = state[entriesType] ? +state[entriesType].page : null;

        return parseInt(page) || 1;
    }
}