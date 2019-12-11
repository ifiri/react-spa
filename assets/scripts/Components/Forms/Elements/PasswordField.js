import React from 'react';

import TextInput from './TextInput';

/**
 * Component extending text input for password fields.
 */
export default class PasswordField extends TextInput {
    getFieldType() {
        return 'password';
    }
}