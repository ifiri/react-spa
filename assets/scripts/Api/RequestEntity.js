import ConfigRepository from '../Config/Repository';
import CommonUtils from '../Utils/Common';
import DataMapper from '../Api/DataMapper';
import LocalStorage from '../Storages/Local';

/**
 * Stores itself all request data and request-related methods.
 * Request Executer working with this class.
 */
export default class RequestEntity {
    /**
     * For creating request entity we should pass params and request data.
     * 
     * @param  alias String
     * @param  requestData Object
     * @param  params Object
     * @return void
     */
    constructor(alias, requestData, params) {
        this.alias = alias;
        this.params = params;

        this.canExecuting = true;
        
        // console.log('::: PARMAS');
        // console.log(requestData);
        // console.log(params);

        this.data = { ...requestData };

        // Make data accessible
        for(const name in requestData) {
            this[name] = requestData[name] || null;
        }

        // Make params accessible
        for(const paramName in params) {
            const paramValue = params[paramName];

            if(!paramValue) {
                continue;
            }

            switch(paramName) {
                case 'query':
                    this.query = CommonUtils.serialize(params.query || {});
                    break;

                case 'form':
                    this.body = this.body ? (
                        params.body ? this.body : CommonUtils.objectify(params.form)
                    ) : CommonUtils.objectify(params.form);
                    break;

                case 'body':
                    this.body = params.body ? params.body : (
                        this.data.body || null
                    );  
                    break;

                case 'headers':
                    if(this.headers) {
                        this.headers = {
                            ...this.headers,
                            ...paramValue,
                        };
                    } else {
                        this.headers = paramValue;
                    }
                    break;

                default:
                    this[paramName] = paramValue;
                    break;
            }
        }

        this.lastResponse = null;
        this.currentResponse = null;
    }

    /**
     * Mix request body with last response result.
     * Useful, when in body there are values with placeholders,
     * f.e. if we need mix entry ID after createon for upload logo.
     * 
     * @param  lastResponse Object | null
     * @return void
     */
    mixWithLastResponse(lastResponse = null, commonResponse = null) {
        this.body = this.mapRequestBody(this.body, this.alias, this.type, lastResponse, commonResponse);

        this.lastResponse = lastResponse;
        this.currentResponse = commonResponse;
    }

    /**
     * Morph request body to API format, if required.
     * 
     * @param  body Object | null
     * @param  alias String
     * @param  type String
     * @param  lastResponse Object | null
     * @return Object | null
     */
    mapRequestBody(body, alias, type, lastResponse, commonResponse) {
        if(body) {
            const DataMapperInstance = new DataMapper();
            
            body = DataMapperInstance.mapDataFor(body, alias, type, lastResponse, commonResponse, this.method);
        }

        return body;
    }

    /**
     * Returns fullqualified endpoint for current request.
     * 
     * @return String
     */
    getEndpoint() {
        if(!this.endpoint) {
            return null;
        }

        const endpoint = this.endpoint;
        const apiServer = ConfigRepository.get('api.common.server');
        const apiAddress = ConfigRepository.get('api.common.address');

        let endpointParts = [];
        if(apiServer) {
            let fullqualifiedEndpoint = null;

            endpointParts.push(apiServer);
            if(apiAddress) {
                endpointParts.push(apiAddress);
            }
            endpointParts.push(endpoint);

            fullqualifiedEndpoint = endpointParts.join('/');

            // Replace placeholders
            if(this.lastResponse) {
                this.map = this.syncMapWithLastResponse(this.map, this.lastResponse);
            }

            if(this.method === 'GET' && this.query) {
                fullqualifiedEndpoint += '?' + this.query;
            }

            fullqualifiedEndpoint = this.replacePlaceholdersFor(fullqualifiedEndpoint, this.map);
            return fullqualifiedEndpoint;
        }

        return null;
    }

    /**
     * Returns prepared and correct request params for
     * current request.
     * 
     * @return Object
     */
    getRequestParams() {
        const allowedParams = ['headers', 'method', 'mode', 'credentials', 'body'];

        let params = {};
        for(const index in allowedParams) {
            const paramName = allowedParams[index];
            const defaultValue = ConfigRepository.get('api.common.' + paramName);

            const paramValue = this[paramName] || defaultValue;

            if(paramValue) {
                if(paramName === 'headers') {
                    paramValue = this.getHeadersFor(this);
                } else if(paramName === 'body') {
                    paramValue = this.formatRequestBodyIn(this.body, params);
                }

                params[paramName] = paramValue;
            }
        }

        return params;
    }

    /**
     * Returns correct and prepared headers object for current request.
     * Check if headers need to be changed and change it if required.
     * 
     * @param  request Object
     * @return Object
     */
    getHeadersFor(request) {
        const defaultHeaders = ConfigRepository.get('api.common.headers') || {};

        let headers = this.buildHeaders(request);

        // Return, if empty headers was passed
        // It means all headers should be added by browser
        if(request.headers && !Object.keys(request.headers).length) {
            return headers;
        }

        // Otherwise add defaults if required
        for(const headerAlias in defaultHeaders) {
            const headerValue = defaultHeaders[headerAlias];

            if(!headers.has(headerAlias)) {
                if(headerAlias === 'X_Authorize_Token') {
                    const Storage = new LocalStorage;

                    headerValue = Storage.getFromStore('token');
                }

                headers.set(headerAlias, headerValue);
            }
        }

        // console.log(':: HEDARES');
        // console.dir(headers);
        // console.dir(this.headers);

        return headers;
    }

    /**
     * Build and return headers based on passed in request headers.
     * 
     * @param  request Object
     * @return Object
     */
    buildHeaders(request) {
        let RequestHeaders = new Headers();
        const additionalHeaders = this.headers || {};

        if(request.headers && typeof request.headers === 'object') {
            let requiredHeaders = request.headers;

            for(const header in requiredHeaders) {
                RequestHeaders.append(header, requiredHeaders[header]);
            }

            // for(const additionalHeader in additionalHeaders) {
            //     RequestHeaders.append(additionalHeader, additionalHeaders[additionalHeader]);
            // }
        }

        return RequestHeaders;
    }

    /**
     * Check for header `Content-Type` and morph body into required format.
     * F.e., to JSON if this is `application/json`, or into formdata, etc.
     * 
     * @param  body Object
     * @param  requestParams Object
     * @return Objject
     */
    formatRequestBodyIn(body, requestParams) {
        const { method, headers } = requestParams;

        if(body && headers && (method === 'POST' || method === 'DELETE')) {
            const contentType = headers.get('Content-Type');

            // If server waiting for applicateion/json...
            if(contentType === 'application/json') {
                if(body.length === 0) {
                    body = null;
                } else {
                    body = JSON.stringify(body);
                }
            }

            // console.log('ContentType is ' + contentType);
            // for(const head of headers.entries()) {
                // console.log(head);
            // }

            // If server waiting for formdata...
            let formDataLength = 0;
            if(contentType === 'multipart/form-data') {
                const data = new FormData();

                if(typeof body === 'object') {
                    for(const paramName in body) {
                        const paramValue = body[paramName];

                        if(paramValue) {
                            // console.log('!!!');
                            // console.log(paramValue);
                            if(Array.isArray(paramValue)) {
                                for(const piece in paramValue) {
                                    data.append(paramName + '[]', paramValue[piece]);
                                }

                                formDataLength++;

                                continue;
                            }

                            data.append(paramName, paramValue);

                            formDataLength++;
                        }
                    }
                }

                // Remove `Content-Type`, because browser should
                // add this header based on `body` natively
                headers.delete('Content-Type');

                if(formDataLength) {
                    body = data;
                } else {
                    body = null;
                }
            }
        }

        return body;
    }

    /**
     * Mix request map with last response. Useful when in map
     * there are some placeholders.
     * 
     * @param  map Object
     * @param  lastResponse Object | null
     * @return Object
     */
    syncMapWithLastResponse(map, lastResponse) {
        if(typeof map !== 'object' || !map) {
            return map;
        }

        let syncronizedMap = {};
        for(const alias in map) {
            const value = String(map[alias]);

            if(!value.replace) {
                continue;
            }

            // find matches
            syncronizedMap[alias] = value.replace(/%(\w+)%/g, (match, group) => {
                if(lastResponse && group in lastResponse) {
                    return lastResponse[group];
                }

                return match;
            });
        }
        
        return syncronizedMap;
    }

    /**
     * Replacing placeholders in endpoint with properties in request data
     * 
     * @param  endpoint String
     * @param  data Object
     * @return String
     */
    replacePlaceholdersFor(endpoint, data) {

        const resolvedEndpoint = endpoint.replace(/%(\w+)%/g, (match, group) => {
            if(data && group in data) {
                if(typeof data[group] === 'function') {
                    return data[group]();
                }
                
                return data[group];
            }

            return match;
        });

        return resolvedEndpoint;
    }

    setBody(body) {
        this.body = body;
        this.data.body = body;
    }
}