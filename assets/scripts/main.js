import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route,withRouter } from 'react-router-dom';

import HashRouter from './Components/Routing/HashRouter';

import App from './Components/App';

import store from './store';

class ScrollToTop extends React.Component {
    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        window.scrollTo(0, 0)
      }
    }
  
    render() {
      return this.props.children
    }
}

const ScrollFix = withRouter(ScrollToTop);

// <ScrollFix></ScrollFix>
ReactDOM.render(
    <Provider store={store}>
        <HashRouter store={store}>
            <Route path="/" component={App} />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
)