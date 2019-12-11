import ConfigRepository from '../Config/Repository';
import CommonUtils from '../Utils/Common';
import DataMapper from '../Api/DataMapper';

import AuthError from '../Exceptions/AuthError';

import RequestFactory from './RequestFactory';

/**
 * Core class. Execute requests and request chains.
 * Also creating requests in Factory by passed data.
 */
export default class RequestExecuter {
    constructor() {
        // Current request index in chain
        this.requestIndex = 0;

        // All requests that should to be executed
        this.requests = [];

        // Response that should to be returned
        this.finalResponse = null;
    }

    /**
     * Entry point. With alias and params,
     * creating and executing requests.
     */
    doRequestBy(alias, params = {}) {
        const RequestFactoryInstance = new RequestFactory();

        this.requests = RequestFactoryInstance.createRequestsBy(alias, params);

        // console.log(this.requests);

        return this.executeChain();
    }

    applyMiddlewareTo(request) {
        if(request && request.middleware && typeof request.middleware === 'function') {
            const Middleware = new request.middleware(request, this);

            return Middleware.apply();
        }

        return request;
    }

    /**
     * All requests is chain. Even if in chain only one request,
     * this is a chain, one-segment-chain, yes. So all requests
     * executed by this wrapper method.
     *
     * First, mix request with last response, if required.
     * Second, check if request body is array. If so, it means,
     * we should split request in chain to multiple requests. Walk on
     * request body, create new Request Entities and pass it to `execute` function.
     * Third, check there is next request or not. If yes, pass it to `execute`,
     * if not, return final response.
     *
     * Final response is response from request with `common` type. 
     * Type of the request you can check in config. If no type provided,
     * request will be common by default.
     * 
     * @param  request Object
     * @param  lastResponse Object | null
     * @return Object
     */
    executeChain(request, lastResponse = null) {
        request = request || this.getNextRequest();
        request.mixWithLastResponse(lastResponse, this.finalResponse);

        request = this.applyMiddlewareTo(request);

        // If request body is array, we need split it to multiple requests
        if(request.body && request.body.length) {
            const RequestFactoryInstance = new RequestFactory();

            const responses = [];
            for(const index in request.body) {
                const CurrentRequest = RequestFactoryInstance.createRequestWith(
                    request.alias, 
                    request.data, 
                    request.params
                );
                CurrentRequest.setBody(request.body[index]);

                // Execute request
                const promise = this.execute(CurrentRequest).then(response => {
                    const NextRequest = this.getNextRequest();

                    // Check for next request and recursively execute it
                    if(NextRequest) {
                        return this.executeChain(NextRequest, response);
                    }

                    return response;
                });

                // Add response to responses
                responses.push(promise);
            }

            // If final response there is, return it, if no, return last response
            return this.finalResponse || responses[responses.length - 1];
        }

        // If request body is object or just empty, pass it to execute
        const promise = this.execute(request).then(response => {
            const NextRequest = this.getNextRequest();

            // console.log(':: next request');
            // console.log(NextRequest);

            // Create final response from common response, if 
            // in respons is not an array
            if((request.type && request.type !== 'common') && request.type) {
                if(!this.finalResponse) {
                    this.finalResponse = {
                        responses: {}
                    };
                }

                this.finalResponse.responses[request.type] = response;
            } else {
                if(typeof response === 'object' && !('length' in response)) {
                    if(!this.finalResponse) {
                        this.finalResponse = {
                            ...response,

                            responses: {}
                        };
                    } else {
                        this.finalResponse = {
                            ... this.finalResponse,

                            ...response
                        }
                    }
                }
            }

            // Check for next request and for request type
            if(NextRequest) {
                // IF request type is common or no request type, set final response
                if(request.type === 'common' || !request.type) {
                    if(!this.finalResponse) {
                        this.finalResponse = response;
                        this.finalResponse.responses = {};
                    } else {
                        this.finalResponse = {
                            ...this.finalResponse,

                            ...response
                        };
                    }
                }

                // Pass next request to execute recursively
                return this.executeChain(NextRequest, response);
            }

            // Return final response
            return this.finalResponse || response;
        });

        return promise;
    }

    /**
     * Working horse for executing requests.
     * Work with API directively and return resolved
     * or rejected promises. Also can throw an errors.
     * 
     * @param  request Object
     * @return Promise
     */
    execute(request) {
        console.log(':: executed');
        console.log(request);
        // Return rejected promise if incorrect request was passed
        // Chain can broke here
        if(this.isRequestIncorrect(request)) {
            return new Promise((resolve, reject) => {
                reject();
            });
        }

        console.log('asdasdalkdakljdlkjdslkjdaslkjdsalkjdasljkdsa');

        // Fill all params up
        const endpoint = request.getEndpoint();
        const requestParams = request.getRequestParams();

        // We need resolve promise without any result, because we saving request chain
        if(request.type !== 'delete' && requestParams.method === 'POST' && !requestParams.body) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        }

        // Doing requests
        return fetch(endpoint, requestParams).then(response => {
            // Check response statuses
            const error = this.throwErrorBy(response.status || 500);

            if(error) {
                throw  error;
            }
            
            return response.text();

        }).then(response => {
            if(response) {
                response = JSON.parse(response);
            }

            if(request.onComplete) {
                request.onComplete(response);
            }

            return response;
        })
        .catch(error => {
            // Internal browser fetch errors. Throws, f.e., 
            // when no connection or host is not exists.
            if(error instanceof TypeError) {
                throw new Error('Не удается подключиться к серверу');
            }

            throw error;
        });
    }

    /**
     * If next request there is, return it, in other case return null
     * 
     * @return Object | nuull
     */
    getNextRequest() {
        const nextIndex = this.requestIndex;
        const nextRequest = this.requests[nextIndex];

        if(nextRequest) {
            this.requestIndex = nextIndex + 1;

            return nextRequest;
        }

        return null;
    }

    /**
     * Check for some necessary properties which should be in every request
     * 
     * @param  request Object
     * @return Boolean
     */
    isRequestIncorrect(request) {
        return !request || !request.endpoint || (
            (!request.body || (
                typeof request.body.length !== 'undefined' && request.body.length === 0
            )) 
            && 
            (
                request.method === 'POST'
            )
        );
    }

    /**
     * Check passed status and return related error
     * 
     * @param  status Integer
     * @return Error | void
     */
    throwErrorBy(status) {
        switch(status) {
            // Unathorized
            case 401:
                return new AuthError('Неправильный логин или пароль');

                break;

            // Forbidden
            case 403:
                return new AuthError('Вы не авторизованы!');

                break;

            // Method not allowed / Not found
            case 405:
            case 404:
                return new Error('Ошибка подключения к серверу. Обратитесь к администратору');

                break;

            // Error
            case 400:
            case 500:
                return new Error('Произошла какая-то ошибка. Возможно, сервер не отвечает, или вы ввели данные некорректно. Проверьте вводимую информацию и попробуйте еще раз.');

                break;
        }
    }
}