import * as ActionTypes from '../Constants/routerActions';
import { deselectAll } from './EntriesActions';

/**
 * Dispatching when route is changing.
 * Deselect all entries and dispatch action to reducer.
 * 
 * @param  route String
 * @return Object
 */
function routeChange(match) {
    return dispatch => {
        dispatch(deselectAll());

        return dispatch({
            type: ActionTypes.ROUTE_CHANGE,
            payload: {
                match: match
            }
        });
    };
    
}

export { routeChange };