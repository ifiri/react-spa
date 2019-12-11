import React from 'react';

import styled from 'react-emotion';

const Wrapper = styled('div')`
    .meetups-list {
        > .meetup-row {
            &:hover {
                text-decoration: none !important;
            }
            background-color: #fff;
            width: 100%;
            padding: 16px 21px;
            border-radius: 4px;
            box-shadow: 0 6px 9px 0 rgba(144, 164, 183, 0.22);
            display: flex;
            margin-top: 16px;
            &:first-child {
                margin-top: 0;
            }
            > div {

                margin-left: 28px;
                &:first-child {
                    margin-left: 0;
                }
                &:last-child {
                    margin-left: auto;
                    > div {
                        padding:0 !important;
                        > svg {
                            margin-right: 0 !important;
                        }
                    }
                }
            }
            .meetup-avatar {
                width: 50px;
                height: 50px;
                background-color: #f2f4f8;
                border-radius: 50%;
                background-repeat: no-repeat;
                background-position: center center;
            }
            .meetup-cell {
                &.meetup-title{width: 480px;}
                &.meetup-type{width: 147px;}
                &.meetup-dates{width: 232px;}
                > div {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: inherit;
                    &:first-child {
                        font-size: 15px;
                        font-weight: bold;
                        line-height: 1.8;
                        color: #3b3f48;
                    }
                    &:last-child {
                        font-size: 14px;
                        line-height: 1.79;
                        letter-spacing: 0.1px;
                        color: #737a92;
                    }
                }
            }
            .right-corner {
                width: 10px;
                height: 16px;
                cursor: pointer;
                background-image: url(dist/images/icons/ic-details.svg);
                background-repeat: no-repeat;
                background-size: cover;
                margin-top: 17px;
            }
        }
    }
`
const Title = styled('div')`
    font-size: 25px;
    color: #455a64;
`
const ItemsCount = styled('div')`
    font-size: 20px;
    font-weight: 500;
    color: #8a96a0;
    width: 100%;
    text-align: center;
    margin-top: 40px;
`
const SelectWrapper = styled('div')`
    border-radius: 4.3px;
    box-shadow: 0 6px 9px 0 rgba(144, 164, 183, 0.22);
    background-color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.8;
    color: #3b3f48;
    padding: 8px 30px 8px 42px;
    position: relative;
    min-width: 186px;
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
        top: 16.5px;
        right: 15px;
        width: 13px;
        height: 7px;
        background-image: url(dist/images/icons/ic-dropdown.svg);
        background-repear: no-repeat;
        background-size: cover;
    }
    &.type {
        &:before {
            content: '';
            position: absolute;
            top: 11.6px;
            left: 14px;
            width: 14.4px;
            height: 16px;
            background-image: url(dist/images/icons/type-ic.svg);
            background-repeat: no-repeat;
            background-size: cover;
        }
    }
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
    &:hover {
        background-color: #246800;
    }
`

export { Wrapper, Title, ItemsCount, SelectWrapper, Button };