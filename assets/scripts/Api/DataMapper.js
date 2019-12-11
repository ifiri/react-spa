import RFCDateEntity from '../Date/RFCDateEntity';
import CommonUtils from '../Utils/Common';

import * as ContactTypes from '../Constants/contacts';

/**
 * This class map input form data, turn it to API format.
 * For every endpoint there is method, if no method there,
 * data stay unchanged.
 */
export default class DataMapper {
    /**
     * Entry point to mapper class
     * 
     * @param  data Object Data for mapping
     * @param  apiAlias Request type
     * @param  type String Data type, just flag
     * @param  lastResponse Data from last response
     * @return Object
     */
    mapDataFor(data, apiAlias, type = null, lastResponse = null, commonResponse = null, method = 'POST') {
        // bank/clients => BankClients
        const mapMethod = 'mapDataFor' + apiAlias.toLowerCase().replace(/\b([\w\d]+?)\b/gi, word => {
            const firstLetter = word[0];

            return firstLetter.toUpperCase() + word.slice(1);
        }).replace(/[\/_]/g, '');

        if(type === 'load') {
            return null;
        }

        if(this[mapMethod]) {
            const mapped = this[mapMethod](data, type, method, lastResponse, commonResponse);

            return mapped;
        }

        return data;
    }

    mapDataForLogin(data) {
        // let mapped = {
        //     username: data.login,
        //     password: data.password
        // }

        return data;
    }

    mapDataForCompany(data, type) {
        let mapped = {};
        if(type === 'upload') {
            mapped = {
                ...data
            };

            delete mapped.video_url;
            delete mapped.video_preview;
        }

        if(type === 'chunkuploader/init') {
            if(!data.file) {
                return null;
            }

            return {
                company_id: data.id,
                file: data.file
            };
        }

        if(type === 'chunkuploader/upload') {
            if(!data.blob) {
                return null;
            }

            return {
                file: data.blob
            };
        }

        return data;
    }

    mapDataForMeetups(data, type) {
        if(type === 'logo') {
            if(!data.file) {
                return null;
            }
            
            return {
                file: data.file,
            };
        }

        const mapped = {
            ...data
        };
        
        // const StartDateEntity = new RFCDateEntity(mapped.start_date, '+06:00');
        // const EndDateEntity = new RFCDateEntity(mapped.end_date, '+06:00');

        // mapped.startDate = StartDateEntity.getDateInRFCFormat();
        // mapped.endDate = EndDateEntity.getDateInRFCFormat();

        delete mapped.start_date;
        delete mapped.end_date;
        delete mapped.file;

        return mapped;
    }

    mapDataForInformation(data, type) {
        if(type === 'file') {
            if(!data.file) {
                return null;
            }
            
            return {
                files: data.file
            };
        }

        const mapped = {
            ...data
        };
        
        delete mapped.file;

        return mapped;
    }

    mapDataForMeetup(data, type) {
        return this.mapDataForMeetups(data, type);
    }

    mapDataForMeetupSections(data, type) {
        if(type === 'delete') {
            return {};
        }

        if(type === 'load') {
            return null;
        }

        // data.event = {
        //     id: parseInt(data.meetup)
        // };
        data.event_id = parseInt(data.meetup);

        delete data.meetup;

        return data;
    }

    mapDataForEvents(data, type) {
        const mapped = {
            ...data
        };

        if(type === 'delete') {
            return {};
        }

        // const startDate = data.date.trim() + ' ' + data.start_time.trim();
        // const endDate = data.date.trim() + ' ' + data.end_time.trim();

        // const StartDateEntity = new RFCDateEntity(startDate, '+06:00');
        // const EndDateEntity = new RFCDateEntity(endDate, '+06:00');
        
        // mapped.startDate = StartDateEntity.getDateInRFCFormat();
        // mapped.endDate = EndDateEntity.getDateInRFCFormat();

        // delete mapped.start_time;
        // delete mapped.end_time;
        // delete mapped.date;

        if(mapped.meetup) {
            mapped.meetup_id = parseInt(mapped.meetup);

            delete mapped.meetup;
        }

        return mapped;
    }

    mapDataForParticipants(data, type) {
        if(type === 'delete') {
            return {};
        }

        if(type === 'avatar') {
            if(!data.avatar) {
                return null;
            }

            return {
                file: data.avatar,
                // x: 10,
                // y: 10,
                // width: 150,
                // height: 150
            };
        }

        const mapped = {
            ...data
        };

        mapped.work = {
            id: mapped.work_id
        };
        mapped.department = {
            id: mapped.departament_id
        };
        mapped.section = {
            id: mapped.section_id
        };
        mapped.sirname = data.surname;

        delete mapped.photo_original_url;
        delete mapped.crop_data;
        delete mapped.department_id;
        delete mapped.section_id;
        delete mapped.work_id;
        delete mapped.surname;

        return mapped;
    }

    mapDataForWorks(data, type) {
        if(type === 'delete') {
            return {};
        }

        const temporary_users = data.users;
        const mapped = {
            ...data
        };

        mapped.users = [];
        for(let i in temporary_users) {
            mapped.users.push({
                'id': temporary_users[i]
            });
        }

        mapped.section = {
            'id': data.section_id
        };

        delete mapped.section_id;

        return mapped;
    }

    mapDataForNominations(data, type) {
        if(type === 'delete') {
            return {};
        }

        const mapped = {
            ...data
        };

        mapped.section = {
            id: parseInt(mapped.section)
        };

        return mapped;
    }

    mapDataForNominees(data, type, method) {
        if(type === 'delete') {
            return {};
        }

        if(type === 'common' && method === 'GET') {
            return null;
        }

        const mapped = {
            ...data
        };

        // mapped.nomination = {
        //     id: parseInt(mapped.nomination_id),
        // };
        // mapped.work = {
        //     id: parseInt(mapped.work_id),
        // };
        // delete mapped.work_id;
        // delete mapped.nomination_id;

        return mapped;
    }

    mapDataForMediaPhotos(data,type) {
        if (type === 'common'){
            // return data
        }
        // return {
        //     file: data.file
        // };
        // return {
        //     file: data.file,
        //     x: 10,
        //     y: 10,
        //     width: 150,
        //     height: 150
        // };
        const format = {
            files: data.file,
            ...data
        }

        delete format.file;

        return format;
    }

    mapDataForMediaVideos(data, type, method, lastResponse) {
        if (type === 'common'){
            console.log('::: RESPOOOOOOONSE');
            console.log(lastResponse);

            if(!lastResponse) {
                return null;
            }

            return {
                event_id: data.event_id,
                title: data.title,
                description: data.description,
                id: lastResponse && lastResponse.id,
            };
        }

        if(type === 'chunkuploader/init') {
            if(!data.file) {
                return null;
            }

            return {
                file: data.file,
                event_id: data.event_id,
                // title: data.title,
                // description: data.description,
            };
        }

        if(type === 'chunkuploader/upload') {
            if(!data.blob) {
                return null;
            }

            return {
                blob: data.blob
            };
        }

        return {
            ...data,
            files: data.file
        };
    }
}