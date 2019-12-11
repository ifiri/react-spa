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
const BottomButtons = styled('div')`
    display: flex;
    > button {
        min-width: 144px;
        height: 40px;
        border-radius: 4px;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.22);
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.1px;
        text-align: center;
        color: #ffffff;
        text-transform: uppercase;
        padding-top: 3px;
        cursor: pointer;
        margin-left: 16px;
        &.auto-margin {
            margin-left: auto;
        }
        &.remove-button{
            border: solid 2px #e62b27;
            color: #e62b27;
            box-shadow: none;
            margin-left: 0;
        }
        &.well-done {
            text-transform: none;
            color: rgb(54, 155, 0);
            box-shadow: none;
        }
    }
`

export { Title, InputWrapper, BottomButtons };