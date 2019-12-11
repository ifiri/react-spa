import React from 'react';

import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';

import DatepickerUI from '../../../UserInterface/Elements/Datepicker';

/**
 * Datepicker widget component
 */
class Datepicker extends React.Component {
    constructor(props) {
        super(props);

        // Link to datepicker node
        this.datepicker = null;
        this.DatepickerUIInstance = new DatepickerUI();

        this.setDatepickerRef = this.setDatepickerRef.bind(this);
    }

    /**
     * At mount init logic and listeners
     * 
     * @return void
     */
    componentDidMount() {
        const { isDepending = false } = this.props;

        if(!isDepending) {
            this.DatepickerUIInstance.addDatepicker(this.datepicker);
            this.DatepickerUIInstance.init();
        }
    }
    
    render() {
        const attributes = this.getAttributes();
        const inputProps = this.getInputProps();

        return (
            <div className="datepicker">
                <TextField
                    inputRef={this.setDatepickerRef}
                    inputProps={inputProps}
                    margin="normal"
                    
                    {...attributes}
                />
            </div>
        );
    }

    getClassName() {
        return 'form__field form__field_type_input';
    }

    /**
     * Build and return attributes for datepicker input
     * 
     * @return Object
     */
    getAttributes() {
        const { 
            name, 
            value = null, 
            label = null,
            id = '', 
            placeholder = '', 
        } = this.props;

        let attributes = {
            name: name,
            placeholder: placeholder,
            type: 'text',
            className: this.getClassName(),
            id: id,

            key: '_datepicker' + id
        };

        if(label) {
            attributes.label = label;
        }

        return attributes;
    }

    getInputProps() {
        const {
            value = null, 

            relatedTo = null ,
            mode = 'date',
            id = '', 
        } = this.props;

        let attributes = {
            key: '_dateinput' + id
        };

        if(value) {
            attributes.defaultValue = value;
            attributes.key = value + attributes.key;
        }

        if(relatedTo) {
            attributes['data-datepicker-related'] = relatedTo;
        }

        if(mode) {
            attributes['data-datepicker'] = mode;
        }

        return attributes;
    }

    setDatepickerRef(element) {
        this.datepicker = element;
    }
}

// Prop Types
Datepicker.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    id: PropTypes.string, 
    placeholder: PropTypes.string, 
    relatedTo: PropTypes.string
};

export default Datepicker;