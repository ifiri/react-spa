import { 
    createStore, 
    applyMiddleware 
} from 'redux';

import logger from 'redux-logger'
import thunk from 'redux-thunk';

import reducer from './Reducers';

function getStore(initialStore) {
    const store = createStore(
        reducer,
        initialStore,
        applyMiddleware(thunk, logger)
    );

    return store;
}

export default getStore();