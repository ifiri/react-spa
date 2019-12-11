import * as ActionTypes from '../Constants/modalsActions';
import { MODAL_ANIMATION_SPEED } from '../Constants/modals';

/**
 * Action for opening modal. Entry is modal data.
 * 
 * @param  modalID String
 * @param  entry Object
 * @return Object
 */
function modalOpening(modalID, entry) {
    document.body.classList.add('page_state_modal-open');
    
    return dispatch => {
        dispatch({
            type: ActionTypes.MODAL_OPENING,
            payload: {
                modal: modalID,
                entry: entry
            }
        });

        setTimeout(() => {
            dispatch({
                type: ActionTypes.MODAL_OPENED,
                payload: {
                    modal: modalID
                }
            });
        }, MODAL_ANIMATION_SPEED); // modal animation duration
    }
}

/**
 * Action for closing modal.
 * 
 * @param  modalID String
 * @return Object
 */
function modalClosing(modalID) {
    return dispatch => {
        const modals = document.querySelectorAll('.modal.modal_opened');

        dispatch({
            type: ActionTypes.MODAL_CLOSING,
            payload: {
                modal: modalID
            }
        });

        setTimeout(() => {
            if(modals.length === 1) {
                document.body.classList.remove('page_state_modal-open');
            }

            dispatch({
                type: ActionTypes.MODAL_CLOSED,
                payload: {
                    modal: modalID
                }
            });
        }, MODAL_ANIMATION_SPEED); // modal animation duration
    }
}

/**
 * Action for closing all modals
 * 
 * @return Object
 */
function closeAll() {
    return dispatch => {
        const modals = document.querySelectorAll('.modal.modal_opened');

        for(const modal of modals) {
            const modalID = modal.getAttribute('id') || null;

            if(!modalID) {
                continue;
            }

            dispatch({
                type: ActionTypes.MODAL_CLOSING,
                payload: {
                    modal: modalID
                }
            });

            setTimeout(() => {
                dispatch({
                    type: ActionTypes.MODAL_CLOSED,
                    payload: {
                        modal: modalID
                    }
                });
            }, MODAL_ANIMATION_SPEED); // modal animation duration
        }

        setTimeout(() => {
            document.body.classList.remove('page_state_modal-open');
        }, MODAL_ANIMATION_SPEED); // modal animation duration
    }
}

export { 
    modalOpening, 
    modalClosing, 
    closeAll 
};