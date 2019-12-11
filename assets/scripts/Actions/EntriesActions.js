import Sorter from '../UserInterface/Sorter';
import CommonUtils from '../Utils/Common';

import AuthError from '../Exceptions/AuthError';

import * as ActionTypes from '../Constants/entriesActions';
import { logout, setError } from './AuthActions';
import { modalOpening, closeAll as closeAllModals } from './ModalsActions';

import { doAction } from './';

/**
 * Action for load entries
 * 
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function load(type, params) {
    return (dispatch, getState) => {
        const state = getState();

        // If entries already started to download, return
        if(state.entries[type] && state.entries[type].isLoadStarted) {
            return false;
        }

        dispatch({
            type: ActionTypes.ENTRIES_LOAD_START,
            payload: {
                type: type,
            }
        });

        return doAction(ActionTypes.ENTRIES_LOAD_START, type, params)
        .then(entries => {

            switch(type) {
                case 'meetup/sections':
                    if(entries) {
                        const sections = [];
                        for(const sectionGroup of entries) {
                            const section = sectionGroup;
                            sections.push(section);
                        }

                        entries = sections;
                    }

                    break;

                case 'events':
                    const events = entries.event && entries.event.activities;
                    
                    entries = events;
                    break;

                case 'nominees':
                    const nominees = [];
                    const bunch = entries.response;

                    const nominations2 = bunch.nominations || [];
                    const nominees2 = bunch.nominants || [];
                    const users = bunch.users || [];
                    const works = bunch.works || [];

                    for(const i in nominees2) {
                        const nominee = nominees2[i];

                        // Если для Конференции
                        if(nominee.work_id) {
                            const userId = nominee.user_id;
                            const workId = nominee.work_id;
                            const nominationId = nominee.nomination_id;

                            const userIndex = users.findIndex(element => {
                                if(element.id && parseInt(element.id) === parseInt(userId)) {
                                    return element;
                                }
                            });
                            const user = users[userIndex];

                            const workIndex = works.findIndex(element => {
                                if(element.id && parseInt(element.id) === parseInt(workId)) {
                                    return element;
                                }
                            });
                            const work = works[workIndex];

                            const nominationIndex = nominations2.findIndex(element => {
                                if(element.id && parseInt(element.id) === parseInt(nominationId)) {
                                    return element;
                                }
                            });
                            const nomination = nominations2[nominationIndex];

                            nominees.push({
                                'id': nominee.id,
                                'title': nomination && nomination.title,
                                'place': nominee.place,
                                'participant': user,
                                'work': work,
                                'nomination': nomination,
                            });
                        } else { // Если для конкурса
                            const userId = nominee.user_id;
                            const departmentId = nominee.department_id;
                            const nominationId = nominee.nomination_id;

                            const nominationIndex = nominations2.findIndex(element => {
                                if(element.id && parseInt(element.id) === parseInt(nominationId)) {
                                    return element;
                                }
                            });
                            const nomination = nominations2[nominationIndex];

                            const userIndex = users.findIndex(element => {
                                if(element.id && parseInt(element.id) === parseInt(userId)) {
                                    return element;
                                }
                            });
                            const user = users[userIndex];

                            nominees.push({
                                'id': nominee.id,
                                'title': nomination.title,
                                'place': nominee.place,
                                'participant': user,
                                'nomination': nomination,
                                'departmentId': departmentId,
                                'type': userId ? 2 : 1,
                            });
                        }
                    }

                    console.log(nominees);

                    entries = nominees;

                    break;

                case 'nominations':
                    const nominations = [];

                    for(let index in entries) {
                        const nomination = entries[index];
                        let currentNominations = nomination.nominations;

                        for(let i in currentNominations) {
                            let nomination2 = currentNominations[i];

                            nominations.push({
                                'id': nomination2.id,
                                'title': nomination2.title,
                                'description': nomination2.description,
                                'section_id': nomination2.section && nomination2.section.id,
                            });
                        }
                    }

                    entries = nominations;

                    break;

                case 'media/photos':
                    entries = entries.photos || [];
                    break;

                case 'media/videos':
                    entries = entries.videos || [];
                    break;
            }

            if('length' in entries && entries.slice) {
                // Add uniqid to every entry. Uniqid is very important
                entries = _postprocessEntries(entries, type);
            } else if(typeof entries === 'object') {
                entries = _postprocessEntry(entries, []);
            }

            return dispatch({
                type: ActionTypes.ENTRIES_LOAD_SUCCESS,
                payload: {
                    type: type,
                    entries: entries
                }
            });
        }).catch(error => {
            // If we have auth error, logout
            if(error instanceof AuthError) {
                return dispatch(logout(error));
            } else {
                return dispatch(setError(error));
            }

            dispatch({
                type: ActionTypes.ENTRIES_LOAD_FAILED,
                payload: {
                    type: type,
                    error: error
                }
            });

            throw error;
        });
    }
}

/**
 * Sorting entries by passed `orderBy` field and `order` order
 * 
 * @param  entriesType String
 * @param  orderBy String
 * @param  order String
 * @return Promise
 */
function sort(entriesType, orderBy, order) {
    return (dispatch, getState) => {
        const state = getState();
        const entries = state.entries[entriesType].items || null;

        // Sorting
        if(entries) {
            const SorterInstance = new Sorter(entriesType);

            SorterInstance.sort(entries, orderBy, order);
            SorterInstance.storeSort(orderBy, order);
        }

        // Pass sorted entries to state
        return dispatch({
            type: ActionTypes.ENTRIES_SORT,
            payload: {
                orderBy: orderBy,
                order: order,
                type: entriesType,
                entries: entries
            }
        });
    };
}

/**
 * Update entry
 * 
 * @param  entryType String
 * @param  params Object
 * @return Promise
 */
function update(entryType, params = {}) {
    const { form = null, uniq = null } = params;

    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: ActionTypes.ENTRY_UPDATE_START,
            payload: {
                type: entryType
            }
        });

        return doAction(
            ActionTypes.ENTRY_UPDATE_START, entryType, params
        ).then(entry => {
            // If request successful, get current entries
            const entries = state.entries[entryType] && (
                state.entries[entryType].items || []
            );

            // Add uniqid to updated entry
            entry = _postprocessEntry(entry, entries);
            entry._uniq = uniq;

            dispatch(closeAllModals());
            dispatch({
                type: ActionTypes.ENTRY_UPDATE_SUCCESS,
                payload: {
                    type: entryType,
                    entry: entry,
                    uniq: uniq
                }
            });

            return entry;
        }).catch(error => {
            if(error instanceof AuthError) {
                return dispatch(logout(error));
            }

            dispatch(modalOpening('error-modal', {
                message: error.message
            }));

            dispatch({
                type: ActionTypes.ENTRY_UPDATE_FAILED,
                payload: {
                    type: entryType,
                    error: error
                }
            });

            throw error;
        });
    }
}

/**
 * Deleting entry
 * 
 * @param  entryType Object
 * @param  params Object
 * @return Promise
 */
function deleteEntry(entryType, params = {}) {
    const { uniq = null } = params;

    return dispatch => {
        dispatch({
            type: ActionTypes.ENTRY_DELETE_START,
            payload: {
                type: entryType
            }
        });

        doAction(
            ActionTypes.ENTRY_DELETE_START, entryType, params
        ).then(entry => {
            dispatch(closeAllModals());
            dispatch({
                type: ActionTypes.ENTRY_DELETE_SUCCESS,
                payload: {
                    type: entryType,
                    entry: entry,
                    uniq: uniq
                }
            });

            return entry;
        }).catch(error => {
            if(error instanceof AuthError) {
                return dispatch(logout(error));
            }

            dispatch(modalOpening('error-modal', {
                message: error.message
            }));

            dispatch({
                type: ActionTypes.ENTRY_DELETE_FAILED,
                payload: {
                    type: entryType,
                    error: error
                }
            });

            throw error;
        });
    }
}

/**
 * Deleting logo
 * 
 * @param  entryType String
 * @param  params Object
 * @return Promise
 */
function deleteLogo(entryType, params = {}) {
    const { uniq = null } = params;

    return dispatch => {
        dispatch({
            type: ActionTypes.LOGO_DELETE_START,
            payload: {
                type: entryType
            }
        });

        return doAction(
            ActionTypes.LOGO_DELETE_START, entryType, params
        ).then(entry => {
            dispatch({
                type: ActionTypes.LOGO_DELETE_SUCCESS,
                payload: {
                    type: entryType,
                    entry: entry,
                    uniq: uniq
                }
            });

            return entry;
        }).catch(error => {
            dispatch({
                type: ActionTypes.LOGO_DELETE_FAILED,
                payload: {
                    type: entryType,
                    error: error
                }
            });

            throw error;
        });
    }
}

/**
 * Action for creating new entries
 * 
 * @param  entryType String
 * @param  params Object
 * @return Promise
 */
function create(entryType, params = {}) {
    const { form = null, uniq = null } = params;

    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: ActionTypes.ENTRY_CREATE_START,
            payload: {
                type: entryType
            }
        });

        return doAction(
            ActionTypes.ENTRY_CREATE_START, entryType, params
        ).then(entry => {
            const entries = state.entries[entryType] && (
                state.entries[entryType].items || []
            );

            switch(entryType) {
                case 'meetups':
                    entry = {
                        event: {
                            ...entry,
                        }
                    };

                    break;
            }

            // If entry is created, add uniqid or reset to null
            if(!entry.result) {
                entry = _postprocessEntry(entry, entries);
            } else {
                entry = null;
            }
            
            dispatch(closeAllModals());
            dispatch({
                type: ActionTypes.ENTRY_CREATE_SUCCESS,
                payload: {
                    type: entryType,
                    entry: entry
                }
            });

            return entry;
        }).catch(error => {
            if(error instanceof AuthError) {
                return dispatch(logout(error));
            }

            dispatch(modalOpening('error-modal', {
                message: error.message
            }));

            dispatch({
                type: ActionTypes.ENTRY_CREATE_FAILED,
                payload: {
                    type: entryType,
                    error: error
                }
            });

            throw error;
        });
    }
}

/**
 * Search action
 * 
 * @param  entryType String
 * @param  filter Object
 * @param  params Object
 * @return Promise
 */
function search(entryType, filter, params) {
    return dispatch => {
        const filterData = CommonUtils.objectify(filter);

        dispatch({
            type: ActionTypes.ENTRIES_SEARCH_START,
            payload: {
                type: entryType,
                filterData: filterData
            }
        });

        return doAction(
            ActionTypes.ENTRIES_SEARCH_START, entryType, params
        ).then(entries => {
            // Add uniqids to finded entries
            entries = _postprocessEntries(entries, entryType, filterData);

            dispatch({
                type: ActionTypes.ENTRIES_SEARCH_SUCCESS,
                payload: {
                    type: entryType,
                    entries: entries
                }
            });

            return entries;
        }).catch(error => {
            if(error instanceof AuthError) {
                return dispatch(logout(error));
            }
            
            dispatch({
                type: ActionTypes.ENTRIES_SEARCH_FAILED,
                payload: {
                    type: entryType,
                    error: error
                }
            });

            throw error;
        });
    }
}

/**
 * Just full state by passed entries
 * 
 * @param  entriesType String
 * @param  entries Object
 * @return Promise
 */
function fill(entriesType, entries) {
    // Set uniqid to passed entries
    entries = _postprocessEntries(entries);

    return {
        type: ActionTypes.ENTRIES_FILL,
        payload: {
            type: entriesType,
            entries: entries
        }
    };
}

/**
 * Action for select entry in table
 * 
 * @param  entry Object
 * @param  type String
 * @return Object
 */
function select(entry, type) {
    return {
        type: ActionTypes.ENTRY_SELECT,
        payload: {
            entry: entry,
            type: type
        }
    };
}

/**
 * Action for deselect entry in table
 * 
 * @param  entry Object
 * @param  type String
 * @return Object
 */
function deselect(entry, type) {
    return {
        type: ActionTypes.ENTRY_DESELECT,
        payload: {
            entry: entry,
            type: type
        }
    };
}

/**
 * Action for select all entries in table
 * 
 * @param  type String
 * @return Object
 */
function deselectAll(type) {
    return {
        type: ActionTypes.ENTRY_DESELECT_ALL,
        payload: {
            type: type
        }
    };
}

/**
 * Paginate action for change current page for entries type
 * 
 * @param  entriesType String
 * @param  page Integer
 * @return Object
 */
function changePage(entriesType, page) {
    return {
        type: ActionTypes.ENTRIES_CHANGE_PAGE,
        payload: {
            page: page,
            type: entriesType
        }
    };
}

/**
 * Clear state by passed entries type
 * 
 * @param  entryType String
 * @return Object
 */
function clearEntries(entriesType) {
    return {
        type: ActionTypes.ENTRIES_CLEAR,
        payload: {
            type: entriesType
        }
    };
}

/**
 * After creating or updating entries we should postprocess it.
 * First, we should check for `uniqid` prop, that is very important.
 * Uniqid is inner system `key`, all systems identificate entry by its uniqid.
 * Second, we should manually build entries list for some entries types,
 * f.e., for references. Because we don't have endpoint for references.
 * Third, add `fio` field if we can.
 * 
 * @param  entries Object
 * @param  type String
 * @param  filterData Object | null
 * @return Array
 */
function _postprocessEntries(entries, type, filterData = null) {
    // Update uniqids of passed entries and add fullname field
    let uniq = 0;
    for(const index in entries) {
        const entry = entries[index];
        if(!entry['_uniq']) {
            entry['_uniq'] = ++uniq;
        } else {
            uniq = entry['_uniq'];
        }

        // Clue all name parts into one field
        if(!entry['fio'] && (
            (entry['lastname'] || entry['patronymic']) || entry['name'] || (entry['surname'] || entry['sirname'])
        )) 
        {
            entry['fio'] = [
                (entry['surname'] || entry['sirname']) || '',
                entry['name'] || '',
                entry['patronymic'] || '',
            ].join(' ').trim();
        }
    }

    return entries;
}

/**
 * Similar to `postprocessEntries`, but for one entry.
 * Update uniqid for entry and add fio field, if it is possible.
 * Also add logo for entry after creation.
 * 
 * @param  entry Object
 * @param  entries Array
 * @return Object
 */
function _postprocessEntry(entry, entries = []) {
    if(!entry._uniq) {
        const lastUniq = entries[entries.length - 1] ? entries[entries.length - 1]._uniq : entries.length;

        entry._uniq = lastUniq + 1;
    }
    
    if(!entry['fio'] && (
        entry['lastname'] || entry['name'] || entry['surname']
    )) 
    {
            entry['fio'] = [
            entry['lastname'] || '',
            entry['name'] || '',
            entry['surname'] || '',
        ].join(' ').trim();
    }

    // Set logo after creation
    if(entry.responses) {
        for(const type in entry.responses) {
            if(type === 'logo' && entry.responses[type]) {
                entry.logo = entry.responses[type].result || null;
            }
        }
    }

    return entry;
}


export { 
    fill, 
    load, 
    search,
    select, 
    deselect, 
    deselectAll, 
    sort, 
    changePage, 
    deleteEntry, 
    deleteLogo,
    clearEntries, 
    update, 
    create,
};