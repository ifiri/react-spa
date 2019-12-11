import * as ActionTypes from '../Constants/routerActions';

const initialState = {
    currentRoute: null,
    lastRoute: null
};

export default function router(state = initialState, action) {
    let newState = {};
    let passedState = {};

    switch(action.type) {
        case ActionTypes.ROUTE_CHANGE:
            passedState = {
                currentRoute: { ...action.payload.match },
            };

            if(state.currentRoute) {
                passedState.lastRoute = { ...state.currentRoute };
            }

            break;
    }

    newState = { ...state, ...passedState };

    return newState;
}