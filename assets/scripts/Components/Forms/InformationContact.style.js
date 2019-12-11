import React from 'react';
import styled from 'react-emotion';

const Title = styled('div')`
    font-size: 25px;
    color: #3b3f48;
`
const InputWrapper = styled('div')`
    label {
        display: block;
        font-size: 15px;
        line-height: 1.8;
        color: #8a96a0;
        margin-bottom: 4px;
    }
    input {
        width: 100%;
        min-height: 47px;
        border-radius: 4px;
        border: solid 1px #dfe1e8;
        padding: 10px 15px;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.79;
        letter-spacing: 0.1px;
        color: #3b3f48;
        &::placeholder {
            color: #8a96a0;
            font-weight: normal;
        }
        outline: none;
    }
    textarea {
        width: 100%;
        min-height: 47px;
        border-radius: 4px;
        border: solid 1px #dfe1e8;
        padding: 10px 15px;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.79;
        letter-spacing: 0.1px;
        color: #3b3f48;
        &::placeholder {
            color: #8a96a0;
            font-weight: normal;
        }
        outline: none;
    }
`

export { Title, InputWrapper };