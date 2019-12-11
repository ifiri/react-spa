import { combineReducers } from 'redux';

import auth from './auth';
import entries from './entries';
import router from './router';
import modals from './modals';

const appReducer = combineReducers({
    auth, entries, router, modals
});

function rootReducer(state, action) {
    // Reset all application state to default after user logout
    if (action.type === 'USER_LOGOUT_SUCCESS' || action.type === 'USER_LOGOUT_FAILED') {
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;