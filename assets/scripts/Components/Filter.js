import Item from './Filters/Elements/Item';
import Label from './Filters/Elements/Label';
import Actions from './Filters/Elements/Actions';
import Wrapper from './Filters/Elements/Wrapper';
import Select from './Filters/Elements/Select';

/**
 * This object is a wrapper for all filter-related components.
 * Its a filter elements, and some special blocks like Info or Results.
 * @type {Object}
 */
const Filter = {
    Item: Item,
    Label: Label,
    Actions: Actions,
    Wrapper: Wrapper,

    Select: Select,
 };

export default Filter;