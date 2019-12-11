import React from 'react';

import styled from 'react-emotion';

const Wrapper = styled('div')`
    width: 1050px;
    margin: 0 auto;
    display: flex;
    margin-top: 64px;
`
const MainBlock = styled('div')`
    width: 640px;
    height: 860px;
    border-radius: 4px;
    box-shadow: 0 6px 9px 0 rgba(144, 164, 183, 0.22);
    background-color: #ffffff;
    padding: 28px 30px 28px 28px;
`
const Title = styled('div')`
    font-size: 25px;
    color: #3b3f48;
`

const Sections = styled('div')`
    width: 370px;
    border-radius: 4px;
    box-shadow: 0 6px 9px 0 rgba(144, 164, 183, 0.22);
    background-color: #ffffff;
    padding: 27px 29px 41px 31px;
    max-height: 860px;
    ul {
        margin:0;
        padding:0;
        list-style:none;
        margin-top: 27px;
        max-height: 635px;
        overflow-y: scroll;
        li {
            cursor: pointer;
            font-size: 14px;
            line-height: 1.79;
            letter-spacing: 0.1px;
            border-bottom: 1px solid #f2f4f8;
            color: #3b3f48;
            padding: 8px 20px 4px 0;
            position: relative;
            &:last-child {
                border-bottom: none;
            }
            &:after {
                content: '';
                position: absolute;
                right: 5px;
                top: 8px;
                width: 9.9px;
                height: 16px;
                background-repeat: no-repeat;
                background-size: cover;
                background-image: url(dist/images/icons/ic-details.svg);
            }
        }
    }
`


export {Sections,Title,MainBlock,Wrapper};