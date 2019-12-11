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
const SelectWrapper = styled('div')`
    position: relative;
    border-radius: 4px;
    border: solid 1px #dfe1e8;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.79;
    letter-spacing: 0.1px;
    color: #3b3f48;
    padding: 10px 40px 10px 15px;
    min-height: 47px;
    select {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
    &:after {
        content:'';
        position: absolute;
        top: 18px;
        right: 9px;
        width: 13px;
        height: 7px;
        background-image: url(dist/images/icons/ic-dropdown.svg);
        background-repear: no-repeat;
        background-size: cover;
    }
    &.curator-select {
        &:after {
            top: 28px;
        }
    }
`
const Subtitle = styled('div')`
    font-size: 21px;
    line-height: 1.33;
    color: #454b60;
`
const TwoColumns = styled('div')`
    display: flex;
    > * {
        width: calc((100% - 9px)/2);
        margin-left: 9px;
        &:first-child{
            margin-left: 0;
        }
    }
`
const ThreeColumns = styled('div')`
    display: flex;
    > * {
        width: calc((100% - 9px - 9px)/3);
        margin-left: 9px;
        &:first-child{
            margin-left: 0;
        }
    }
`
const CuratorInfo = styled('div')`
    display: flex;
    min-height: 42px;
    .curator-avatar,
    .place-avatar {
        width: 40px;
        height: 40px;
        background-color: #f2f4f8;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;

    }
    .place-avatar {
        border-radius: 0;
        background-color: transparent;
        background-size: contain;
    }
    > div:last-child {
        margin-top: -3px;
        margin-left: 15px;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.79;
        letter-spacing: 0.1px;
        color: #3b3f48;
        span {
            color: #8a96a0;
            display: block;
            margin-top: -5px;
        }
        &.no-curator {
            margin-top: 8px;
        }
    }

    .place-title {
        display: flex;
        margin: auto 0px auto 15px !important;
        font-weight: bold !important;
    }
`;

export { Title, InputWrapper, SelectWrapper, Subtitle, TwoColumns, ThreeColumns, CuratorInfo };