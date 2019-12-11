import React from 'react';

import LoginForm from '../Forms/Login';

/**
 * Login page. There are no dynamic entries, just login form.
 * So we don't extend Common Page.
 */
export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.rootElement = document.getElementById('root');
    }

    /**
     * Add special styling for current page
     */
    componentDidMount() {
        this.rootElement.classList.add('app_page_auth');
    }

    /**
     * Remove special styling for current page
     */
    componentWillUnmount() {
        this.rootElement.classList.remove('app_page_auth');
    }

    render() {
        return <LoginForm {...this.props} />;
    }
}