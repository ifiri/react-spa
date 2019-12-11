import RequestEntity from './RequestEntity';

import ConfigRepository from '../Config/Repository';

/**
 * Factory class for creating request entities
 */
export default class RequestFactory {
    createRequestsBy(alias, params) {
        const action = params.action;
        const requestPath = 'api.' + alias + (action? '.' + action : '');

        const requestData = ConfigRepository.get(requestPath) || {};

        let requests = [];

        // If we have chained request
        if(requestData.length) {
            for(const index in requestData) {
                requests.push(
                    this.createRequestWith(alias, requestData[index], params)
                );
            }
        } else {
            requests.push(
                this.createRequestWith(alias, requestData, params)
            );
        }

        return requests;
    }

    createRequestWith(alias, data, params) {
        const Request = new RequestEntity(alias, data, params);

        return Request;
    }
}