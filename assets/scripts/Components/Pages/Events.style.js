import React from 'react';

import styled from 'react-emotion';

const Wrapper = styled('div')`
    .events-list {
        > div {
            border-radius: 6px;
            box-shadow: 0 6px 9px 0 rgba(144, 164, 183, 0.22);
            background-color: #ffffff;
            margin-top: 40px;
            padding: 29px 0 32px 0;
            &:first-child {
                margin-top: 0;
            }
            .event-title {
                font-size: 25px;
                color: #455a64;
                margin-left: 40px;
                span {
                    text-transform: capitalize;
                }
            }
            .event-table {
                margin-top: 36px;
                > div {
                    display: flex;
                    padding-left: 40px;
                    &.titles-row {
                        font-size: 12px;
                        line-height: 2.08;
                        letter-spacing: 0.1px;
                        color: #8a96a0;
                        margin-bottom: 13px;
                    }
                    &.regular-row {
                        padding: 12px 32px 12px 40px;
                        font-size: 14px;
                        &:hover {
                            background-color: #f2f4f8;
                        }
                        > div {
                            &:first-child {
                                font-weight: bold;
                                color: #005b9b;
                                display: flex;
                                justify-content: center;
                                flex-direction: column;
                            }
                            &:nth-child(2) {
                                font-size: 15px;
                                font-weight: bold;
                                color: #3b3f48;
                                display: flex;
                                justify-content: center;
                                flex-direction: column;
                            }
                            &:nth-child(3) {
                                font-size: 14px;
                                color: #737a92;
                                display: flex;
                                justify-content: center;
                                flex-direction: column;
                            }
                            &:last-child {
                                > div {
                                    width: 10px;
                                    height: 16px;
                                    cursor: pointer;
                                    background-image: url(dist/images/icons/ic-details.svg);
                                    background-repeat: no-repeat;
                                    background-size: cover;
                                }
                            }
                        }
                    }
                    > div {
                        &:first-child {
                            width: 110px;
                        }
                        &:nth-child(2) {
                            width: 320px;
                            margin-left: 50px;
                        }
                        &:nth-child(3) {
                            width: 500px;
                            margin-left: 40px;
                        }
                        &:nth-child(4) {
                            margin-left: auto;
                            width: 10px;
                            display: flex;
                            justify-content: center;
                            flex-direction: column;
                        }
                    }
                }
            }
        }
    }
`
const Title = styled('div')`
    font-size: 25px;
    margin-right: auto;
    color: #455a64;
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

export {Button,Title,Wrapper};