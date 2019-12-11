import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';


import PropTypes from 'prop-types';

/**
 * Base filter item block. Just wrapper over inputs and selects.
 */
class Item extends React.Component {
    render() {
        const { type = null } = this.props;

        return <div className={"filter__item" + (type ? " filter__item_type_" + type : '')}>
            {this.props.children}
        </div>;
    }
}




// Prop Types
Item.propTypes = {
    type: PropTypes.string,
};

export default Item;