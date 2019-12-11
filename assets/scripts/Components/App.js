import React from 'react';

import AuthGuard from './Auth/AuthGuard';
import Main from './Main';
import Header from './Header/Header';

/**
 * One of critical system core classes. This class is a root of the app,
 * in render method just return Header and Main components, wrapped in AuthGuard.
 */
export default class App extends React.Component {
    render() {
        return (
            <AuthGuard>
                <Header key="header" />
                <Main />
            </AuthGuard>
        );
    }
}