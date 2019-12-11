import * as ActionTypes from './Constants/entriesActions';
import * as ContactTypes from './Constants/contacts';
import * as RequestMiddlewares from './Api/Middlewares';

const CONFIG = {
    // Config for API. All endpoints, request parameters stored here.
    api: {
        // Common config. Only default parameters.
        common: {
            // type protocol://server-address<:port>, without trailing slash
            server: 'http://transneft.dhabits.ru:8080',

            // type address for endpoints, without trailing slashes
            // if address equals to server, leave this field empty
            address: 'admin',

            // default headers for every request to server
            // if in request passing empty `headers` object,
            // no one headers will used
            headers: {
                'Content-Type': 'application/json',
                'X_Authorize_Token': '%token%',
            },

            method: 'POST',
            mode: 'cors',
            // credentials: 'include'
        },

        // Requests config. Map of all request by its aliases
        // All requests separated by actions
        login: {
            endpoint: 'v1/auth',
            headers: {
                X_Authorize_Token: null
            }
        },

        logout: {
            endpoint: 'v1/logout'
        },

        company: {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/company/%company%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: [
                {
                    endpoint: 'v1/company',
                    type: 'common'
                },

                {
                    endpoint: 'v1/company/blob/init',
                    type: 'chunkuploader/init',
                    progressbar: 'company',
                    middleware: RequestMiddlewares.ChunkUploader
                },
                {
                    endpoint: 'v1/company/blob/upload/%video%/%current%',
                    type: 'chunkuploader/upload',
                    progressbar: 'company',
                    offset: 0,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    middleware: RequestMiddlewares.ChunkUploader
                }
            ],
        },

        'company/departments': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/departament',
                method: 'GET'
            },

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/departament',
                    type: 'common'
                },
                {
                    endpoint: 'v1/departament',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_UPDATE_START]: {
                endpoint: 'v1/departament/update/%departament%',
            },

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/departament/delete/%departament%',
                    type: 'delete'
                },
            ],
        },

        meetups: {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/events',
                method: 'GET'
            },

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/events',
                    type: 'common'
                },

                {
                    endpoint: 'v1/events/upload/%meetup%',
                    type: 'logo',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                },

                {
                    endpoint: 'v1/events',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_UPDATE_START]: {
                endpoint: 'v1/user',
            },

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/events/delete/%meetup%',
                    type: 'delete'
                },
                {
                    endpoint: 'v1/events',
                    method: 'GET',
                    type: 'load'
                }
            ],
        },

        meetup: {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/events/%meetup%',
                method: 'GET'
            },

            // [ActionTypes.ENTRY_CREATE_START]: [
            //     {
            //         endpoint: 'v1/events'
            //     },
            // ],

            // [ActionTypes.ENTRY_DELETE_START]: [
            //     {
            //         endpoint: 'v1/events/delete/%meetup%',
            //         type: 'delete'
            //     },
            // ],

            [ActionTypes.ENTRY_UPDATE_START]: [
                {
                    endpoint: 'v1/events/%meetup%/update',
                    type: 'common'
                },

                {
                    endpoint: 'v1/events/upload/%meetup%',
                    type: 'logo',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                },
            ],
        },

        'meetup/sections': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/sections/event/%meetup%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: {
                endpoint: 'v1/sections',
            },

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/sections/%section%/delete/',
                    type: 'delete'
                },
            ],

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/sections',
                    type: 'common'
                },
                {
                    endpoint: 'v1/sections/event/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ]
        },

        'events': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/events/%meetup%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: {
                endpoint: 'v1/activities/%event%/update',
            },

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/activities/create',
                    type: 'common'
                },

                {
                    endpoint: 'v1/events/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/activities/%event%/delete',
                    type: 'delete'
                },
            ],
        },

        'participants': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/participants/%meetup%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: [
                {
                    endpoint: 'v1/participants',
                    type: 'common'
                },

                {
                    endpoint: 'v1/participants/%participant%/upload',
                    type: 'avatar',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                },
            ],

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/participants',
                    type: 'common'
                },

                {
                    endpoint: 'v1/participants/%participant%/upload',
                    type: 'avatar',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                },

                {
                    endpoint: 'v1/participants/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/participants/%participant%/delete',
                    type: 'delete'
                },
            ],
        },

        'works': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/works/%meetup%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: [
                {
                    endpoint: 'v1/works/%work%/update',
                    type: 'common'
                },
            ],

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/works',
                    type: 'common'
                },
                {
                    endpoint: 'v1/works/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/works/%work%/delete',
                    type: 'delete'
                },
            ],
        },

        'work': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/works/%work%/view',
                method: 'GET'
            },
        },

        'nominations': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/nominations/%meetup%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: [
                {
                    endpoint: 'v1/nominations',
                    type: 'common'
                },
            ],

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/nominations',
                    type: 'common'
                },
                {
                    endpoint: 'v1/nominations/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/nominations/%nomination%/delete',
                    type: 'delete'
                },
            ],
        },

        'nomination': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/nominations/%nomination%/view',
                method: 'GET'
            },
        },

        'nominees': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/nominations/%meetup%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: [
                {
                    endpoint: 'v1/nominations/nominees',
                    type: 'common'
                },
            ],

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/nominations/nominees',
                },
                {
                    endpoint: 'v1/nominations/nominees/%nominee%',
                    method: 'GET',
                    type: 'common'
                },
                {
                    endpoint: 'v1/nominations/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/nominations/nominees/%nominee%/delete',
                    type: 'delete'
                },
            ],
        },

        'nominee': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/nominations/nominees/%nominee%',
                method: 'GET'
            },
        },

        'information': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'events/%meetup%/information',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: [
                {
                    endpoint: 'events/%meetup%/information/%information%/update',
                    type: 'common'
                },

                {
                    endpoint: 'events/%meetup%/information/%information%/photos',
                    type: 'file',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                },
            ],

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'events/%meetup%/information/create',
                    type: 'common'
                },

                {
                    endpoint: 'events/%meetup%/information/%information%/photos',
                    type: 'file',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                },

                {
                    endpoint: 'events/%meetup%/information',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'events/%meetup%/information/%information%/delete',
                    type: 'delete'
                },
            ],
        },

        'information/contacts': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'events/%meetup%/contacts',
                method: 'GET'
            },

            [ActionTypes.ENTRY_UPDATE_START]: {
                endpoint: 'events/%meetup%/contacts/%contact%/update',
            },

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'events/%meetup%/contacts/create',
                    type: 'common'
                },
                {
                    endpoint: 'events/%meetup%/contacts',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'events/%meetup%/contacts/%contact%/delete',
                    type: 'delete'
                },
            ],
        },

        'media/photos': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/media/%meetup%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/media/photos/%meetup%',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    type: 'common'
                },
                {
                    endpoint: 'v1/media/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/media/delete/%media%/photo',
                    type: 'delete'
                },
                {
                    endpoint: 'v1/media/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_UPDATE_START]: {
                endpoint: 'v1/media/update/photo',
                type: 'common'
            },
        },

        'media/videos': {
            [ActionTypes.ENTRIES_LOAD_START]: {
                endpoint: 'v1/media/%meetup%',
                method: 'GET'
            },

            [ActionTypes.ENTRY_CREATE_START]: [
                {
                    endpoint: 'v1/media/blob/init',
                    type: 'chunkuploader/init',
                    progressbar: 'media',
                    middleware: RequestMiddlewares.ChunkUploader
                },
                {
                    endpoint: 'v1/media/blob/upload/%video%/%current%',
                    type: 'chunkuploader/upload',
                    progressbar: 'media',
                    offset: 2,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    middleware: RequestMiddlewares.ChunkUploader
                },
                {
                    endpoint: 'v1/media/update/video',
                    type: 'common'
                },
                {
                    endpoint: 'v1/media/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_DELETE_START]: [
                {
                    endpoint: 'v1/media/delete/%media%/video',
                    type: 'delete'
                },
                {
                    endpoint: 'v1/media/%meetup%',
                    method: 'GET',
                    type: 'load'
                }
            ],

            [ActionTypes.ENTRY_UPDATE_START]: {
                endpoint: 'v1/media/update/video',
                type: 'common'
            },
        },
    },

    // Routes map. Here we map routes to Page Components.
    // Every component should be in the bunch of sub-components of Page component.
    // In other words, Page.Clients, Page.Component.
    routes: {
        ROLE_ADMIN: {
            '/company': {
                'component': 'Company',
                'title': 'Информация о компании',
            },

            '/events': {
                'component': 'Meetups',

                'title': 'Мероприятия',

                'exact': true,

                'routes': {
                    '/events/:id/activities': {
                        'component': 'Events',
                        'title': 'Программа',
                    },
                    '/events/:id/participants': {
                        'component': 'Participants',
                        'title': 'Участники',
                    },
                    '/events/:id/works': {
                        'component': 'Works',
                        'title': 'Доклады',
                    },
                    '/events/:id/nominees': {
                        'component': 'Nominees',
                        'title': 'Результаты',
                    },
                    '/events/:id/media': {
                        'component': 'Media',
                        'title': 'Медиа',
                    },

                    '/events/:id/information': {
                        'component': 'Information',
                        'title': 'Полезное',
                    },

                    '/events/:id': {
                        'component': 'Meetup',
                        'title': 'Информация',

                        'exact': true,

                        'order': 1,
                    },
                },
            },
        },

        // all
        ROLE_GUEST: {
            // ...
        }
    },

    // Config for every sub-component of Page.
    // Here are possible change cells in table, and modals.
    pages: {
        meetups: {
            cells: {
                // 'check': {
                //     title: '',

                //     type: 'check'
                // },

                'logo': {
                    title: 'Лого',
                    field: 'event.imageLink',
                    type: 'image'
                },
                'title': {
                    title: 'Название',
                    field: 'event.title'
                },
                'description' : {
                    title: 'Описание',
                    field: 'event.description',
                    type: 'UnwrappedDescription'
                },
                'type': {
                    title: 'Тип',
                    field: 'event.type',

                    type: 'meetup/type'
                },
                'start-date': {
                    title: 'Начало',
                    field: 'event.start_date',
                    type: 'date'
                },
                'end-date': {
                    title: 'Конец',
                    field: 'event.end_date',
                    type: 'date'
                },
                'code': {
                    title: 'Код',
                    field: 'pincode'
                },
                'corner': {
                    title: '',
                    type: 'corner'
                },
            },

            modals: {
                // row: 'manage-client-modal'
            },

            redirects: {
                row: 'events/%event.id%'
            }
        },

        'company/departments': {
            cells: {
                'title': {
                    title: 'Название',
                    field: 'title'
                },
                'description' : {
                    title: 'Описание',
                    field: 'description',
                    type: 'UnwrappedDescription'
                },

                'actions': {
                    title: '',
                    data: ['ManageDepartment'],
                    type: 'actions'
                }
            },

            modals: {
                // row: 'manage-client-modal'
            },
        },

        'meetup/sections': {
            cells: {
                'title': {
                    title: 'Название',
                    field: 'title'
                },
                'description' : {
                    title: 'Описание',
                    field: 'description',
                    type: 'UnwrappedDescription'
                },

                'actions': {
                    title: '',
                    data: ['ManageMeetupSection'],
                    type: 'actions'
                }
            },

            modals: {
                // row: 'manage-client-modal'
            },
        },

        'events': {
            cells: {
                'title': {
                    title: 'Название',
                    field: 'title'
                },
                'description' : {
                    title: 'Описание',
                    field: 'description',
                    type: 'UnwrappedDescription'
                },

                'type' : {
                    title: 'Тип',
                    field: 'type',

                    type: 'event/type'
                },
                'start-date' : {
                    title: 'Начало',
                    field: 'startDate',

                    type: 'date'
                },
                'end-date' : {
                    title: 'Окончание',
                    field: 'endDate',

                    type: 'date'
                },
                'curator' : {
                    title: 'Куратор',
                    field: 'curator',

                    type: 'curator'
                },

                'actions': {
                    title: '',
                    data: ['ManageEvent'],
                    type: 'actions'
                }
            },

            modals: {
                // row: 'manage-client-modal'
            },
        },

        'participants': {
            cells: {
                'color' : {
                    title: '',
                    field: 'type',

                    type: 'participant/color'
                },

                'photo': {
                    title: 'Аватар',
                    field: 'photoSmallUrl',

                    type: 'rounded'
                },
                'fullname' : {
                    title: 'ФИО',
                    field: 'fio',
                },

                'type' : {
                    title: 'Тип',
                    field: 'type',

                    type: 'participants/type'
                },
                'department' : {
                    title: 'ОСТ',
                    field: 'department.title',
                },
                'position' : {
                    title: 'Должность',
                    field: 'position',
                },

                'actions': {
                    title: '',
                    data: ['ManageParticipant'],
                    type: 'actions'
                }
            },

            modals: {
                // row: 'manage-client-modal'
            },
        },

        'works': {
            cells: {
                'title' : {
                    title: 'Название',
                    field: 'title',
                },
                'description' : {
                    title: 'Аннотация',
                    field: 'description',
                    type: 'UnwrappedDescription'
                },
                'authors' : {
                    title: 'Авторы',
                    field: 'users',

                    type: 'works/authors'
                },

                'actions': {
                    title: '',
                    data: ['ManageWork'],
                    type: 'actions'
                }
            },

            modals: {
                // row: 'manage-client-modal'
            },
        },

        'nominations': {
            cells: {
                'title' : {
                    title: 'Название',
                    field: 'title',
                },
                'description' : {
                    title: 'Описание',
                    field: 'description',
                    type: 'UnwrappedDescription'
                },

                'actions': {
                    title: '',
                    data: ['ManageNomination'],
                    type: 'actions'
                }
            },

            modals: {
                // row: 'manage-client-modal'
            },
        },

        'nominees': {
            cells: {
                'author' : {
                    title: 'Участник',
                    field: 'participants',

                    type: 'nominees/authors'
                },
                'title' : {
                    title: 'Номинация',
                    field: 'title',
                },

                'place' : {
                    title: 'Место',
                    field: 'place',
                },

                'actions': {
                    title: '',
                    data: ['ManageNominee'],
                    type: 'actions'
                }
            },

            modals: {
                // row: 'manage-client-modal'
            },
        },

        'media': {
            cells: {
                

            },

            modals: {
                // row: 'manage-client-modal'
            },
        },
    },

    entities: {
        contacts: {
            types: {
                [ContactTypes.CONTACT_PHONE]: 'phone',
                [ContactTypes.CONTACT_EMAIL]: 'email',
                [ContactTypes.CONTACT_WEB]: 'web'
            }
        }
    }
};

export default CONFIG;