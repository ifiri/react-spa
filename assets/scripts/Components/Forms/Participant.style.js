import React from 'react';
import styled from 'react-emotion'

const AvatarBlock = styled('div')`
    width: 100%;
    position: relative;
    .participant-avatar {
        width: 160px;
        height: 160px;
        background-color: #f2f4f8;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-image: ${props => props.avatar ? 'url('+props.avatar+')' : 'url(dist/images/icons/ic-profile.svg)'};
        background-size: ${props => props.avatar ? 'cover' : 'initial'};
        margin: 0 auto;
        background-position: center center;
        pointer-events: none;
    }
    .participant-avatar-button {
        width: 120px;
        height: auto;
        display: block;
        margin: 0 auto;
        border-radius: 4px;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.22);
        background-color: #3098d4;
        cursor: pointer;
        padding: 12px 15px 10px 15px;
        margin-top: -20px;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.1px;
        text-align: center;
        color: #ffffff;
        text-transform: uppercase;
        pointer-events: none;
    }
    .participant-upload {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 229px;
        width: 160px;
        height: 190px;
        cursor: pointer;
    }
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
    span {
        pointer-events: none;
    }
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

export { AvatarBlock, InputWrapper, SelectWrapper, Subtitle, TwoColumns, ThreeColumns };