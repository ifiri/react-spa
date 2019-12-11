import * as ActionTypes from '../Constants/entriesActions';
import { reload } from '../Actions/EntriesActions';

// Initial state for every entry type.
// I decide use more obvious way instead empty initial state.
let entryState = {
    items: null,
    sort: {},
    page: 1,

    isSortingRequired: true,
    isLoadPerformed: false,
    isLoadStarted: false,
    isSearching: false,

    filter: null,
    error: null,

    loadParams: {},
};

const initialState = {
    'clients':              { ...entryState },
    'company':              { ...entryState },
    'company/departments':  { ...entryState },
    'department':           { ...entryState }, 
    'meetups':              { ...entryState },
    'meetup':               { ...entryState },
    'meetup/sections':      { ...entryState },

    'events':               { ...entryState },
    'participants':         { ...entryState },
    'works':                { ...entryState },
    'work':                 { ...entryState },
    'nominations':          { ...entryState },
    'nomination':           { ...entryState },
    'nominees':             { ...entryState },
    'nominee':              { ...entryState },
    'media/photos':         { ...entryState },
    'media/videos':         { ...entryState },

    'information':          { ...entryState },
    'information/contacts': { ...entryState },

    'entry': null,

    'isLoading': 0,
    'error': null,

    'selected': []
};

export default function entries(state = initialState, action) {
    let passedState = {};

    // type is entries type
    // uniq is unique id of entry
    const { type, uniq, entry, entries = null } = action.payload || {};

    switch(action.type) {
        case ActionTypes.ENTRIES_LOAD_START:
            passedState.isLoading = _increaseLoadingCount(state);
            passedState[type] = {
                ...state[type],

                isLoadStarted: true,
            };

            break;

        /**
         * When load is started, set loading count.
         * If loading count already exists, increate it by one
         */
        case ActionTypes.ENTRY_LOAD_START:
            passedState.isLoading = _increaseLoadingCount(state);

            break;

        /**
         * After successful loading, decrease loading count
         * and copy loaded items into state. Also set load flag to true
         */
        case ActionTypes.ENTRIES_LOAD_SUCCESS:
            passedState[type] = {
                ...state[type],
                items: entries.slice ? entries.slice(0) : entries,
                isLoadStarted: false,
                isLoadPerformed: true,
            };

            passedState.isLoading = _decreaseLoadingCount(state);

            break;

        /**
         * After failed loading, decrease loading count
         * and set error and loading states to true
         */
        case ActionTypes.ENTRIES_LOAD_FAILED:
            passedState.isLoading = _decreaseLoadingCount(state);
            passedState[type] = {
                ...state[type],

                isLoadPerformed: true,

                error: true
            };
            break;

        /**
         * Just replace entries in state by sorted entries
         */
        case ActionTypes.ENTRIES_SORT:
            const { order, orderBy } = action.payload;

            passedState[type] = {
                ...state[type],

                items: entries && (
                    entries.slice ? entries.slice(0) : entries
                ),

                sort: {
                    orderBy: orderBy,
                    order: order
                },

                isSortingRequired: false
            };

            break;

        /**
         * On every page change clear selected
         */
        case ActionTypes.ENTRIES_CHANGE_PAGE:
            const { page } = action.payload;

            passedState[type] = {
                ...state[type],

                page: page
            };

            passedState.selected = [];

            break;

        /**
         * Just reset state for this entry type
         */
        case ActionTypes.ENTRIES_CLEAR:
            passedState[type] = { ...entryState };
            
            break;

        /**
         * On select just push passed entry into selected array
         */
        case ActionTypes.ENTRY_SELECT:
            passedState = {...state};
            passedState.selected.push(entry);
            
            break;

        /**
         * On deselect, we need entry uniq.
         * If uniq was passed, find entry in selected entries 
         * by its uniq, and if entry found, remove it
         */
        case ActionTypes.ENTRY_DESELECT:
            const entryUniq = entry._uniq || null;

            passedState = {...state};

            if(entryUniq) {
                const selected = state.selected;

                const entryIndexByUniq = selected.findIndex(element => {
                    if(element._uniq && element._uniq === parseInt(entryUniq)) {
                        return element;
                    }
                });

                passedState.selected = state.selected.slice();
                passedState.selected.splice(entryIndexByUniq , 1);
            }
            
            break;

        case ActionTypes.ENTRY_DESELECT_ALL:
            passedState = {
                ...state,

                selected: []
            };
            
            break;

        /**
         * On update, find entry by passed uniq. If found,
         * replace finded entry by passed entry in state.
         */
        case ActionTypes.ENTRY_UPDATE_SUCCESS:
            if(uniq) {
                let entryIndexByUniq = -1;

                if(state[type].items) {
                    if(Array.isArray(state[type].items)) {
                        // Search entry by uniq...
                        entryIndexByUniq = _getEntryIndex(state, type, uniq);
                    } else if(typeof state[type].items === 'object') {
                        // Just get entry object
                        entryIndexByUniq = 0;
                    }
                }
                
                passedState[type] = { 
                    ...state[type],
                };

                // If entry is found
                if(~entryIndexByUniq) {
                    let items = null;

                    if(type === 'nominees') {
                        const nominee = {};

                        nominee.title = entry.additonalProperties.nomination_title;
                        nominee.place = entry.place;
                        nominee.id = entry.id;
                        // nominee.participants = entry.work.users;

                        passedState[type].items[entryIndexByUniq] = {
                            ...state[type].items[entryIndexByUniq],

                            ...nominee,
                        };
                    } else if(type === 'meetup') {
                        if(state['meetups'].items) {
                            const indexInMeetups = state['meetups'].items.findIndex(element => {
                                if(element.meetup.id && parseInt(element.meetup.id) === parseInt(entry.id)) {
                                    return element;
                                }
                            });

                            if(indexInMeetups) {
                                state['meetups'].items[indexInMeetups] = {
                                    ...state['meetups'].items[indexInMeetups],

                                    meetup: entry,
                                    pincode: entry.pincode
                                };
                            }
                        }

                        items = {
                            meetup: entry,
                            pincode: entry.pincode
                        };
                    } else {
                        passedState[type].items[entryIndexByUniq] = {
                            ...state[type].items[entryIndexByUniq],

                            ...entry,
                        };
                    }

                    passedState[type].items = items || (
                        state[type].items.slice && state[type].items.slice()
                    ) || state[type].items;
                    passedState[type].isSortingRequired = true;
                }
            }

            break;

        case ActionTypes.ENTRY_DELETE_START:
            //
            break;

        /**
         * Find entry by uniq, if found, delete it from items
         */
        case ActionTypes.ENTRY_DELETE_SUCCESS:
            if(uniq) {
                const entryIndexByUniq = state[type].items.findIndex(element => {
                    if(element._uniq && element._uniq === parseInt(uniq)) {
                        return element;
                    }
                });

                const selectedIndexByUniq = state.selected.findIndex(element => {
                    if(element._uniq && element._uniq === parseInt(uniq)) {
                        return element;
                    }
                });

                const items = state[type].items.slice();
                const selected = state.selected;

                items.splice(entryIndexByUniq, 1);
                selected.splice(selectedIndexByUniq, 1);

                passedState.selected = selected;
                passedState[type] = { 
                    ...state[type],

                    items: items,
                };
            }

            break;

        case ActionTypes.ENTRY_DELETE_FAILED:
            //
            break;

        /**
         * Find entry by uniq, if found, clear logo field
         */
        case ActionTypes.LOGO_DELETE_SUCCESS:
            if(uniq) {
                const entryIndexByUniq = state[type].items.findIndex(element => {
                    if(element._uniq && element._uniq === parseInt(uniq)) {
                        return element;
                    }
                });

                const items = state[type].items.slice();
                delete items[entryIndexByUniq].logo;

                passedState[type] = { 
                    ...state[type],

                    items: items,
                };
            }

            break;

        /**
         * If passed entry exists, push it into state.
         * Also after create entry should be sorted again,
         * so clear sorting flag.
         */
        case ActionTypes.ENTRY_CREATE_SUCCESS:
            passedState[type] = {
                ...entryState,

                items: (state[type].items && state[type].items.slice()) || [],

                isSortingRequired: true,
            };

            if(entry) {
                if(type === 'nominees') {
                    const nominee = {};

                    nominee.title = entry.additonalProperties.nomination_title;
                    nominee.place = entry.place;
                    nominee.id = entry.id;
                    // nominee.participants = entry.work && entry.work.users;
                    nominee._uniq = entry._uniq;

                    passedState[type].items.push(nominee);
                } else {
                    passedState[type].items.push(entry);
                }
            }

            break;

        case ActionTypes.ENTRY_CREATE_FAILED:
            //
            break;

        /**
         * Just replace entries by passed ones
         */
        case ActionTypes.ENTRIES_FILL:
            passedState[type] = {
                ...state[type],

                items: entries.slice(),
                isSortingRequired: true,
            };

            break;

        /**
         * Tricky. First, copy in new state initial entry state,
         * then set flags from current state. Second, store current items
         * to special property. We need it for restore if search will failed.
         */
        case ActionTypes.ENTRIES_SEARCH_START:
            const { filterData } = action.payload;

            passedState[type] = {
                ...entryState,

                isSearching: true,

                isSortingRequired: state[type].isSortingRequired,
                isLoadPerformed: state[type].isLoadPerformed,

                items: state[type].items,
                filter: filterData,

                // Store for future
                oldItems: state[type].items,
            };
            break;

        /**
         * If search was success, set new items and flags
         */
        case ActionTypes.ENTRIES_SEARCH_SUCCESS:
            passedState[type] = {
                ...entryState,
                items: entries.slice(),
                filter: state[type].filter,

                isSearching: false,

                isSortingRequired: true,
                isLoadPerformed: state[type].isLoadPerformed,
            };
            break;

        /**
         * If search was failed, restore old items from state and set flags
         */
        case ActionTypes.ENTRIES_SEARCH_FAILED:
            passedState[type] = {
                ...entryState,

                // Restore
                items: state[type].oldItems || null,
                filter: state[type].filter,

                isSearching: false,

                isSortingRequired: false,
                isLoadPerformed: state[type].isLoadPerformed,
            };
            break;
    }

    return { ...state, ...passedState };
}

/**
 * Decreasing loading count property by one, but if loading count
 * equals zero, do nothing.
 * 
 * @param  state Object
 * @return Integer
 */
function _decreaseLoadingCount(state) {
    return state.isLoading - 1 >= 0 ? state.isLoading - 1 : 0;
}

/**
 * Increment loading count proerty
 * 
 * @param  state Object
 * @return Integer
 */
function _increaseLoadingCount(state) {
    return state.isLoading + 1;
}

function _getEntryIndex(state, type, value, field = '_uniq') {
    let entryIndexByUniq = state[type].items.findIndex(element => {
        if(element[field] && parseInt(element[field]) === parseInt(value)) {
            return element;
        }
    });

    return entryIndexByUniq || -1;
};