import * as ActionTypes from '../Constants/modalsActions';

const initialState = {
    modals: {}
};

export default function modals(state = initialState, action = {}) {
    let newState = {};
    let passedState = {};

    const modalID = action.payload ? (
        action.payload.modal || null
    ) : null;

    switch(action.type) {
        /**
         * If modal ID already exists in state, just change his status.
         * In other case create for new modal initial state.
         */
        case ActionTypes.MODAL_OPENING:
            const { entry = null } = action.payload;
            if(modalID) {
                if(!state.modals[modalID]) {
                    const newModals = {};
                    newModals[modalID] = 'opening';

                    passedState = {
                        modals: {...state.modals, ...newModals}
                    };
                } else {
                    passedState = { ...state };
                    passedState.modals[modalID] = 'opening';
                }

                passedState.modals[modalID + '.' + 'data'] = entry;
            }
            break;

        case ActionTypes.MODAL_OPENED:
            if(modalID && state.modals[modalID]) {
                passedState = { ...state };
                passedState.modals[modalID] = 'opened';
            }
            break;

        case ActionTypes.MODAL_CLOSING:
            if(modalID && state.modals[modalID]) {
                passedState = { ...state };
                passedState.modals[modalID] = 'closing';
            }
            break;

        case ActionTypes.MODAL_CLOSED:
            if(modalID && state.modals[modalID]) {
                passedState = { ...state };
                passedState.modals[modalID] = 'closed';
                delete passedState.modals[modalID + '.' + 'data'];
            }
            break;
    }

    newState = { ...state, ...passedState };

    return newState;
}