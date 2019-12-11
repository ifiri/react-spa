import LocalStorage from '../Storages/Local';
import ConfigRepository from '../Config/Repository';

/**
 * Sorting class. Usually working with entries lists.
 */
export default class Sorter {
    /**
     * To new instance of sorter necessary to pass entries type,
     * because sort settings stored in local storage.
     * 
     * @param  type String
     * @return void
     */
    constructor(type) {
        this.type = type;

        // Storage that will using for set / get sort settings
        this.Storage = new LocalStorage();
    }

    /**
     * Entry point. Sorting passed list. List should be array or 
     * inherit `sort` method. OrderBy is a property in `list`.
     * Order can be `asc` or `desc` in lowercase.
     *
     * List changing by reference, this method returns nothing.
     * 
     * @param  list Array
     * @param  orderBy String
     * @param  order String
     * @return void
     */
    sort(list, orderBy, order) {
        const sortingFunction = this.getSortingFunctionBy(order, orderBy);

        list.sort(sortingFunction);
    }

    /**
     * Returns relevant sotring function based on `order` param.
     * 
     * @param  order String
     * @param  orderBy String
     * @return Function
     */
    getSortingFunctionBy(order, orderBy) {
        const field = this.getFieldNameByCell(orderBy);
        const sortFunction = order === 'asc' ? this._sortByDesc : this._sortByAsc;
        
        return sortFunction.bind(this, orderBy);
    }

    /**
     * Returns field associated with cell by cell alias.
     * This association setting up in config, `cells` sections.
     * If no field found, return cell alias.
     * 
     * @param  cellAlias String
     * @return String
     */
    getFieldNameByCell(cellAlias) {
        const entriesType = this.type;
        
        const cell = ConfigRepository.get('pages.' + entriesType + '.cells.' + cellAlias);

        if(cell && cell.field) {
            return cell.field;
        }

        return cellAlias;
    }

    /**
     * Get order from passed state.
     * If in state there isn't this property, check storage,
     * then defaults.
     *
     * IMPORTANT this function returns FLIPPED order.
     * 
     * @param  state Object
     * @return String
     */
    getOrder(state) {
        const entriesType = this.type;

        const sortParams = state[entriesType].sort;
        const storedSort = this.getStoredSort(entriesType);

        let order = sortParams.order || (
            storedSort ? storedSort.order : this.getDefaultOrder()
        );

        return this.flipOrder(order);
    }

    /**
     * Get orderBy from passed state.
     * If in state there isn't this property, check storage,
     * then defaults.
     * 
     * @param  state Object
     * @return String
     */
    getOrderBy(state) {
        const entriesType = this.type;

        const sortParams = state[entriesType].sort;
        const storedSort = this.getStoredSort(entriesType);

        return sortParams.orderBy || (
            storedSort ? storedSort.orderBy : this.getDefaultOrderBy()
        );
    }

    /**
     * Returns actial sort paratemers. If all is saved in storage,
     * just return it, if no, return default parameters instead non-existing.
     * State is necessary param, and parameters in state have highest priority.
     * So if in state there are sort params, it will be returned.
     * 
     * @param  state Object
     * @return Object
     */
    getSortParameters(state) {
        const entriesType = this.type;

        const sortParams = state[entriesType].sort;
        const storedSort = this.getStoredSort(entriesType);

        // If no order in state, check storage, then default
        let order = sortParams.order || (
            storedSort ? storedSort.order : this.getDefaultOrder()
        );

        // If no orderBy in state, check storage, then default
        let orderBy = sortParams.orderBy || (
            storedSort ? storedSort.orderBy : this.getDefaultOrderBy()
        );

        return {
            order: order,
            orderBy: orderBy
        };
    }

    /**
     * Change `desc` to `asc` and vice versa.
     * 
     * @param  order String
     * @return String
     */
    flipOrder(order) {
        switch(order) {
            case 'desc':
                order = 'asc';
                break;

            case 'asc':
                order = 'desc';
                break;
        }

        return order;
    }

    /**
     * Returns saves sort settings from storage.
     * If no saved, returns null.
     * 
     * @return Object | null
     */
    getStoredSort() {
        const entriesType = this.type;

        let storedSort = this.Storage.getFromStore('sort.' + entriesType);

        if(storedSort) {
            storedSort = storedSort.split(':');

            return {
                order: storedSort[0],
                orderBy: storedSort[1]
            }
        }
        
        return null;
    }

    /**
     * Save sort settings in storage.
     * 
     * @param  orderBy String
     * @param  order String
     * @return void
     */
    storeSort(orderBy, order) {
        const entriesType = this.type;

        this.Storage.store('sort.' + entriesType, order +':'+ orderBy);
    }

    /**
     * Returns default order. This is `desc`.
     * 
     * @return String
     */
    getDefaultOrder() {
        return 'desc';
    }

    /**
     * Returns default order by. This is `uniq`.
     * 
     * @return String
     */
    getDefaultOrderBy() {
        return '_uniq';
    }

    /**
     * Function for sorting list by `field` ascendantically.
     * 
     * @param  field String 
     * @param  a Mixed
     * @param  b Mixed
     * @return Integer
     */
    _sortByAsc(field, _a, _b) {
        let result = 0;

        const { a, b } = this._getSortingObjects(field, _a, _b);

        if(a < b) {
            result = 1;
        } else if(a > b) {
            result = -1;
        }

        return result;
    }

    /**
     * Function for sorting list by `field` descendantically.
     * 
     * @param  field String 
     * @param  a Mixed
     * @param  b Mixed
     * @return Integer
     */
    _sortByDesc(field, _a, _b) {
        let result = 0;

        const { a, b } = this._getSortingObjects(field, _a, _b);

        if(a < b) {
            result = -1;
        } else if(a > b) {
            result = 1;
        }

        return result;
    }

    _getSortingObjects(field, a, b) {
        const fieldsParts = field.split('.');

        let currentA = a;
        let currentB = b;
        for(const index in fieldsParts) {
            const part = fieldsParts[index];

            if(!(part in currentA) || !(part in currentB)) {
                currentA = null;
                currentB = null;

                break;
            }

            currentA = currentA[part];
            currentB = currentB[part];
        }

        currentA = currentA || '';
        currentB = currentB || '';

        return {
            a: currentA,
            b: currentB,
        };
    }
}