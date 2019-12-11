import React from 'react';

import styled from 'react-emotion';

const Wrapper = styled('div')`
    
`
const Title = styled('div')`
    font-size: 25px;
    color: #455a64;
    margin-right: auto;
`
const Button = styled('button')`
    border-radius: 4px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.22);
    background-color: #369b00;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.1px;
    padding: 8px 22px;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    cursor: pointer;
    outline: none;
    &:hover {
        background-color: #246800;
    }
`
const BorderWrapper = styled('div')`
    border-top: 1px solid #dfe1e8;
    > div {
        padding: 15px;
        background-color: #fbfbfb;
        margin: 0 auto;
        font-size: 14px;
        line-height: 1.79;
        letter-spacing: 0.1px;
        color: rgba(115, 122, 146, 0.6);
        margin-top: -28px;
    }
`
const MediaWrapper = styled('div')`
    display: flex;
    flex-wrap: wrap;
    min-height: 270px;
    > div {
        margin-left: 32px;
        width: calc((100% - 96px)/4);
        height: 269px;
        border-radius: 4px;
        box-shadow: 0 6px 9px 0 rgba(144, 164, 183, 0.22);
        background-color: #ffffff;
        margin-bottom: 32px;
        position: relative;
        &:first-child {
            margin-left: 0;
        }
        &:nth-child(4n + 1){
            margin-left: 0;
        }
        > div {
            &:first-child {
                width: 100%;
                height: 190px;
                background-repeat: no-repeat;
                background-size: cover;
            }
            &:last-child {
                padding: 13px 25px 15px 15px;
                font-size: 15px;
                font-weight: bold;
                line-height: 1.8;
                color: #3b3f48;
                span {
                    font-size: 14px;
                    line-height: 1.79;
                    letter-spacing: 0.1px;
                    color: #737a92;
                    font-weight: normal;
                    margin-top: -2px;
                }
            }
            &.video-button {
                position: absolute;
                top: 0;
                width: 100%;
                height: 190px;
                background-color: rgba(0, 91, 155, 0.4);
                background-image: url(dist/images/icons/play-button.svg);
                background-repeat: no-repeat;
                background-position: center center;
                cursor: pointer;
            }
        }
    }
`

export { Wrapper, Title, Button, BorderWrapper, MediaWrapper };