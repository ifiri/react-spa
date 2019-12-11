import * as ActionTypes from '../Constants/authActions';

const initialState = {
    // Is user logged in for this session
    isLoggedIn: false,

    // User role
    accessLevel: null,

    // Current auth error
    error: null,

    // Is user access rights check completed
    checkCompleted: true,

    // Is user auth check in process
    isCheckPerforming: true,
};

export default function auth(state = initialState, action) {
    let newState = {};
    let passedState = {};

    switch(action.type) {
        case ActionTypes.SET_ERROR:
            passedState = { error:action.payload.error };
            
            break;

        case ActionTypes.USER_PASSWORD_RESET_SUCCESS:

            break;

        case ActionTypes.USER_AUTH_SUCCESS:
            passedState = { isLoggedIn: action.payload.isLoggedIn };

            break;

        case ActionTypes.USER_AUTH_FAILED:
        case ActionTypes.USER_PASSWORD_SET_FAILED:
            passedState = { error: action.payload.error };

            break;

        case ActionTypes.USER_AUTH_CHECK_SUCCESS:
            passedState = { 
                ...action.payload
            };

            break;

        case ActionTypes.USER_AUTH_CHECK_FAILED:
            passedState = { 
                ...action.payload
            };

            break;

        case ActionTypes.USER_ROLE_CHECK_SUCCESS:
        case ActionTypes.USER_ROLE_CHECK_FAILED:
            passedState = { 
                ...action.payload
            };

            break;

        case ActionTypes.USER_LOGOUT_SUCCESS:
            passedState = { 
                isLoggedIn: false,
                isCheckPerforming: false
            };

            break;

        case ActionTypes.USER_LOGOUT_FAILED:
            passedState = { 
                error: action.payload.error,

                isCheckPerforming: false
            };

            break;

        case ActionTypes.USER_CHECK_START:
            passedState = { 
                isCheckPerforming: true 
            };

            break;

        case ActionTypes.USER_CHECK_STOP:
            passedState = {
                isCheckPerforming: false 
            };

            break;
    }

    newState = { ...state, ...passedState };

    return newState;
}