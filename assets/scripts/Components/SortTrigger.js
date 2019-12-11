import React from 'react';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

/**
 * Sorting button in tables heading cells.
 */
export default class SortTrigger extends React.Component {
    render() {
        const { onClick } = this.props;
        const attributes = this.getAttributes();

        return (
            <span {...attributes}>
                { this.getTriggerLayout() }
            </span>
        );
    }

    /**
     * Builds and returns attributes array. Attributes based on passed props.
     * 
     * @return Object
     */
    getAttributes() {
        const { isActive = false, order, orderBy } = this.props;

        let attributes = {
            // 'className': 'sort__trigger',
            'data-sort-by': orderBy
        };

        if(isActive) {
            attributes['data-sort-order'] = order;
            // attributes['data-sort-active'] = true;
        }

        return attributes;
    }

    /**
     * Returns a clickable layout with icon or,
     * if `isActive` prop is false, just cell title.
     * 
     * @return JSX
     */
    getTriggerLayout() {
        const { isActive = false, title, order, orderBy } = this.props;
        const { onClick } = this.props;

        const activeLayout = (
            <>
                <Tooltip
                    title="Sort"
                    placement={1 ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                >
                    <TableSortLabel
                        active={isActive}
                        direction={order}
                        onClick={onClick}
                    >
                        {title}
                    </TableSortLabel>
                </Tooltip>
            </>
        );

        return activeLayout;

        return isActive ? activeLayout : title;
    }
}