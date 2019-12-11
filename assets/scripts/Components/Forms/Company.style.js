import React from 'react';
import styled from 'react-emotion';


const UploadLine = styled('div')`
    width: 540px;
    margin: 22px auto;
    display: none;
    border-radius: 2px;

    .file-name {
        font-size: 14px;
        line-height: 1.79;
        letter-spacing: 0.1px;
        color: #737a92;
    }

    .all-line {
        height: 7.5px;
        background-color: #e5eaef;
        width: 100%;
        margin-top: 5px;
    }
    
    .ready {
        background: #3ab539;
        width: 0;
        height: 100%;
        border-radius: 2px;
    }
`;
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
    .dropzone {
        width: 100%;
        height: 80px;
        border-radius: 4px;
        border: solid 1px #dfe1e8;
        background-color: #f2f4f8;
        position: relative;
        .dropzone-placeholder {
            position: absolute;
            top: 28px;
            width: 100%;
            text-align: center;
            font-size: 14px;
            line-height: 1.79;
            letter-spacing: 0.1px;
            color: #8a96a0;
        }
    }
`

export {UploadLine, InputWrapper} ;