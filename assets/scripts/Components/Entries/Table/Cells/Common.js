import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';

import SortTrigger from '../../../SortTrigger';

import Sorter from '../../../../UserInterface/Sorter';
import ConfigRepository from '../../../../Config/Repository';
import DateUtils from '../../../../Date/RFCDateEntity';

import UserEntity from '../../../../User/Entity';

/**
 * Common cell. Just stores default methods and return default cell values.
 */
class Common extends React.Component {
    constructor(props) {
        super(props);

        // Cell alias, its uniq ID
        this.alias = this.props.alias || null;
        this.appState = this.props.state;
        this.entriesType = this.props.entriesType;

        // If cell is heading, i.e. TH
        this.isHeading = this.props.isHeading || false;

        // Entry of current row
        this.entry = this.props.entry || null;
    }

    /**
     * Update entry after component update
     */
    componentDidUpdate() {
        this.entry = this.props.entry || null;
    }

    isCellContentShouldBeWrapped() {
        return true;
    }

    render() {
        const attributes = this.getCellAttributes();
        const caption = this.getHeadingCellValue();

        attributes.classes = {};

        return (
            <TableCell component="div" variant="body" {...attributes}>
                {(() => {
                    if(this.isCellContentShouldBeWrapped()) {
                        return <div class="entries__cell-content">
                            { this.getCommonCellValue() }
                        </div>;
                    }

                    return this.getCommonCellValue();
                })()}

                {(() => {
                    if(!caption) {
                        return null;
                    }

                    return <div class="entries__cell-caption">
                        { this.getHeadingCellValue() }
                    </div>;
                })()}
            </TableCell>
        );
    }

    /**
     * Get classname and determine, check cell or not
     * 
     * @return Object
     */
    getCellAttributes() {
        const isCheck = this.isCurrentCellCheck();
        const classes = this.getCellClasses();

        const attributes = this.props.attributes || {};
        attributes.className = classes.join(' ');

        if(isCheck) {
            attributes['data-check'] = 'trigger';
        }

        return attributes;
    }

    /**
     * Return cell alias. If cell is check and user is not admin,
     * return separator instead.
     * 
     * @return String
     */
    getCellAlias() {
        const User = new UserEntity();

        let alias = this.alias;

        if(!User.isAdmin()) {
            if(alias === 'check') {
                alias = 'separator';
            }
        }

        return alias;
    }

    /**
     * Returns cell value for heading cell.
     * Usually this is title and sort trigger.
     * 
     * @return JSX | null
     */
    getHeadingCellValue() {
        const cellParams = this.getCellParams();
        const alias = this.getCellAlias();
        const { orderBy } = this.getSortParameters();

        // return null if cell params is empty or not found
        if(!cellParams) {
            return null;
        }

        return cellParams.title;

        // Раскомментируй, и будет сортировка
        // 
        // let cellValue = null;
        // cellValue = this.getSortTrigger({
        //     title: cellParams.title,
        //     orderBy: cellParams.field || alias,
        //     isActive: false
        // });

        // // If user have sorting in current cell
        // if(cellParams.field === orderBy) {
        //     cellValue = this.getSortTrigger({
        //         title: cellParams.title,
        //         orderBy: cellParams.field || alias,
        //         isActive: true
        //     });
        // }

        // return cellValue;
    }

    /**
     * Returns cell value for non-heading cells.
     * 
     * @return JSX
     */
    getCommonCellValue() {
        const cellParams = this.getCellParams();
        const alias = this.getCellAlias();

        const cellValue = this.getDefaultCellValue();

        return cellValue;
    }

    /**
     * Returns raw cell value from entry.
     * 
     * @return String | null
     */
    getDefaultCellValue() {
        const cellParams = this.getCellParams();

        const fieldBy = cellParams.field;

        if(fieldBy) {
            const parts = fieldBy.split('.');

            let currentStack = this.entry;
            for(const index in parts) {
                currentStack = (currentStack && parts[index] in currentStack) ? currentStack[parts[index]] : null;
            }

            return currentStack;
        }

        return null;
    }

    /**
     * Determine what current cell have type `check` or not
     * 
     * @return Boolean
     */
    isCurrentCellCheck() {
        const { 
            alias = null
        } = this.props;

        return alias === 'check';
    }

    /**
     * Builds and returns cell classname by his alias and params
     * 
     * @return Object
     */
    getCellClasses() {
        const { 
            alias = null, 
            isHeading = false 
        } = this.props;

        let classes = ['entries__cell'];

        if(alias) {
            classes.push('entries__' + alias);
        }

        if(isHeading) {
            classes.push('entries__cell_heading');
        }

        return classes;
    }

    /**
     * Returns cell params from config repository.
     * 
     * @return Object
     */
    getCellParams() {
        const path = 'pages.' + this.entriesType + '.cells.' + this.alias;
        const cell = ConfigRepository.get(path);

        return cell;
    }

    /**
     * Returns unique entry ID. Usually this is uniq of entry,
     * but if in config there is `keyField` property, this is field value.
     * 
     * @return Mixed
     */
    getEntryKey() {
        const path = 'pages.' + this.entriesType;
        const page = ConfigRepository.get(path);

        if(page.keyField) {
            return this.entry[page.keyField] || null;
        }

        return this.entry._uniq || null;
    }

    /**
     * Just returns SortTrigger component
     * 
     * @param  title String
     * @param  orderBy String
     * @param  isActive Boolean
     * @return JSX
     */
    getSortTrigger({ title, orderBy, isActive = false }) {
        const { order } = this.getSortParameters();

        return <SortTrigger 
            isActive={isActive} 
            order={order} 
            orderBy={orderBy}
            title={title}
            onClick={this.props.onSortTriggerClick}
        />;
    }

    /**
     * Get sort parameters for current entries type from Sorter Instance
     * 
     * @return Object
     */
    getSortParameters() {
        const SorterInstance = new Sorter(this.entriesType);

        return SorterInstance.getSortParameters(this.appState);
    }
}

// Prop Types
Common.propTypes = {
    alias: PropTypes.string,
    entriesType: PropTypes.string.isRequired,
    isHeading: PropTypes.bool,
    entry: PropTypes.object,
    attributes: PropTypes.object,

    state: PropTypes.object.isRequired,
};

export default Common;