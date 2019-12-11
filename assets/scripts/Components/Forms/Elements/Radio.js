import React from 'react';

import RadioGroup from '@material-ui/core/RadioGroup';
import RadioButton from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

import PropTypes from 'prop-types';

/**
 * Form radio.
 */
class Radio extends React.Component {
    state = {
        value: null,
      };

      handleChange = event => {
        this.setState({ value: event.target.value });
      };

    componentDidMount() {
        const { value = null } = this.props;

        this.setState({ value: value });
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.value != this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }

    render() {
        const { type = 'stacked' } = this.props;

        const className = 'form__field form__field_type_radio radio' + ' radio_type_' + type;

        return <div className={className}>{ this.getChoicesLayouts() }</div>;
    }

    getChoicesLayouts() {
        const { choices = {}, name, isRequired = false, value = null, label = null } = this.props;

        const layouts = [];
        for(const choiceValue in choices) {
            const choiceTitle = choices[choiceValue];

            const attributes = {
                name: name,
                // defaultValue: choiceValue,
            };

            if(value == choiceValue) {
                attributes.checked = true;
            }

            if(isRequired && !layouts.length) {
                attributes.required = true;
            }

            layouts.push(this.getLayoutFor({
                title: choiceTitle,
                value: choiceValue
            }, attributes));
        }

        return (<React.Fragment>
            <FormLabel>{label}</FormLabel>
            <RadioGroup 
                key={'_gr' + value}
                value={this.state.value ? "" + this.state.value : "" + value}
                name={name}
                onChange={this.handleChange}
              >
                {layouts}
            </RadioGroup>
        </React.Fragment>);
    }

    getLayoutFor(choice, attributes) {
        const type = this.getFieldType();

        return <FormControlLabel key={'_radio_' + choice.value} value={"" + choice.value} control={<RadioButton />} label={ choice.title } />

        // return <label className="radio__label" key={choice.value}>
        //     <input   {...attributes} />
        //     <span className="radio__caption">{ choice.title }</span>
        // </label>;
    }

    getFieldType() {
        return 'radio';
    }
}

// Prop Types
Radio.propTypes = {
    name: PropTypes.string.isRequired, 
    id: PropTypes.string, 
    
    title: PropTypes.string, 
    isRequired: PropTypes.bool,
    isDisabled: PropTypes.bool,

    choices: PropTypes.object.isRequired,
};

export default Radio;