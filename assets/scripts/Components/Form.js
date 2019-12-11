import Wrapper from './Forms/Elements/Wrapper';
import Header from './Forms/Elements/Header';
import Footer from './Forms/Elements/Footer';

import Row from './Forms/Elements/Row';
import Column from './Forms/Elements/Column';

import Select from './Forms/Elements/Select';
import TextInput from './Forms/Elements/TextInput';
import EmailInput from './Forms/Elements/EmailInput';
import TextArea from './Forms/Elements/TextArea';
import TextValue from './Forms/Elements/TextValue';
import HiddenInput from './Forms/Elements/HiddenInput';
import PasswordField from './Forms/Elements/PasswordField';
import Radio from './Forms/Elements/Radio';
import Toggle from './Forms/Elements/Toggle';

import FileSelect from './Forms/Components/FileSelect';
import Datepicker from './Forms/Components/Datepicker';

import Submit from './Forms/Elements/Submit';

/**
 * This object is a wrapper for all form-related components.
 * Its a form elements, like Row or Label, input components,
 * which can be used in forms, like Text or Select, and some
 * form sections, like Header and Footer.
 * 
 * @type Object
 */
const Form = {
    Wrapper: Wrapper,
    Row: Row,
    Column: Column,
    Header: Header,
    Footer: Footer,

    Text: TextInput,
    Email: EmailInput,
    TextArea: TextArea,
    TextValue: TextValue,
    Hidden: HiddenInput,
    Password: PasswordField,
    Radio: Radio,
    Toggle: Toggle,
    Select: Select,
    File: FileSelect,
    Datepicker: Datepicker,

    Submit: Submit,
 };

export default Form;