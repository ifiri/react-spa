import React from 'react';
import styled from 'react-emotion';

const Wrapper = styled('div')`
    width: 480px;
    min-height: 500px;
    border-radius: 4px;
    box-shadow: 0 6px 9px 0 rgba(144, 164, 183, 0.22);
    background-color: #ffffff;
    padding: 0 59px 51px 61px;
    img {
        margin: 0 auto;
        margin-top: 51px;
        display: block;
    }
    .sublogo {
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: #737a92;
        margin: 0 auto;
        margin-top: 8px;
        width: 296px;
    }
    button {
        border-radius: 4px;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.22);
        background-color: #005b9b;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.1px;
        text-align: center;
        color: #ffffff;
        text-transform: uppercase;
        padding: 9px;
        margin-top: 40px;
        width: 100%;
        cursor: pointer;
    }
`
const InputWrapper = styled('div')`
    label {
        display: block;
        font-size: 15px;
        line-height: 1.8;
        color: #3b3f48;
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
`

export { Wrapper, InputWrapper };