import UserEntity from '../User/Entity';

import Auth from '../User/Auth';
import CommonUtils from '../Utils/Common';

import * as ActionTypes from '../Constants/authActions';
import { modalOpening } from './ModalsActions';

import { doAction } from './';

/**
 * Check if user already logged in on application layer
 * In depth, just check local storage
 * 
 * @return Promise
 */
function authCheck() {
    return dispatch => {
        return new Promise((resolve, reject) => {
            const AuthInstance = new Auth();

            if(AuthInstance.check()) {
                resolve();
            } else {
                reject();
            }
            
        }).then(() => {
            return dispatch({
                type: ActionTypes.USER_AUTH_CHECK_SUCCESS,
                payload: {
                    isLoggedIn: true,
                    isCheckPerforming: false,
                }
            });
        }).catch(() => {
            return dispatch({
                type: ActionTypes.USER_AUTH_CHECK_FAILED,
                payload: {
                    isLoggedIn: false,
                    isCheckPerforming: false,
                }
            });
        });
    };
}

/**
 * Auth action. Doing authorisation by login and password
 * 
 * @param  login String
 * @param  password String
 * @return Promise
 */
function auth(login, password) {
    return dispatch => {
        return doAction(
            null, 'login', {
                body: {
                    login: login,
                    password: password
                }
            }
        ).then(response => {
            const AuthInstance = new Auth();
            AuthInstance.logUserInWith(response.token);

            // After successful authentification, check user rolw
            // dispatch(checkStart());
            // dispatch(roleCheck()).then(response => {
            //     dispatch(checkStop());
            // }).catch(error => {
            //     dispatch(checkStop());
            // });

            // If user have correct access level, finish him
            return dispatch({
                type: ActionTypes.USER_AUTH_SUCCESS,
                payload: {
                    isLoggedIn: true
                }
            });
            
        }).catch(error => {
            dispatch({
                type: ActionTypes.USER_AUTH_FAILED,
                payload: {
                    error: error
                }
            });

            // dispatch(logout());

            throw error;
        });
    }
}

/**
 * Logout action
 * 
 * @return Promise
 */
function logout() {
    return dispatch => {
        return doAction(
            null, 'logout', {
                body: {}
            }
        ).then(response => {
            const AuthInstance = new Auth();
            AuthInstance.logout();

            dispatch({
                type: ActionTypes.USER_LOGOUT_SUCCESS,
                payload: {}
            });

            return response;
        }).catch(error => {
            const AuthInstance = new Auth();
            AuthInstance.logout();
            
            dispatch({
                type: ActionTypes.USER_LOGOUT_FAILED,
                payload: {
                    error: error
                }
            });

            throw error;
        });
    }
}

/**
 * Let user set his new password on confirm page
 * 
 * @param  form Object
 * @param  token String
 * @return Promise
 */
function passwordSet(form, token) {
    /**
     * If password setting was success
     * 
     * @return Object
     */
    const passwordSetSuccess = () => {
        return {
            type: ActionTypes.USER_PASSWORD_SET_SUCCESS,
            payload: {}
        }
    };

    /**
     * If password setting was failed
     *
     * @param  error Object
     * @return Object
     */
    const passwordSetFailed = error => {
        return {
            type: ActionTypes.USER_PASSWORD_SET_FAILED,
            payload: {
                error: error
            }
        }
    };

    return dispatch => {
        // First, check token, if non-existing, throw error
        if(!token) {
            return new Promise((resolve, reject) => {
                reject();
            }).catch(() => {
                const error = new Error('Отсутствует токен');

                dispatch(passwordSetFailed(error));

                throw error;
            });
        }

        // Second, get request body and compare passwords
        // If passwords is different, throw an error
        const body = CommonUtils.objectify(form);
        if(body.new_password && body.new_password_check) {
            if(body.new_password !== body.new_password_check) {
                return new Promise((resolve, reject) => {
                    reject();
                }).catch(() => {
                    const error = new Error('Пароли не совпадают');

                    dispatch(passwordSetFailed(error));

                    throw error;
                });
            }
        } else {
            return new Promise((resolve, reject) => {
                reject();
            }).catch(() => {
                const error = new Error('Укажите пароль и подтверждение пароля');

                dispatch(passwordSetFailed(error));

                throw error;
            });
        }

        // And third, do password setting request
        return doAction(
            null, 'confirm', {
                form: form,
                body: {
                    ...body,

                    token: token
                }
            }
        ).then(response => {
            return response;
        }).then(() => {
            dispatch(modalOpening('success-password-set-modal'));

            return dispatch(passwordSetSuccess());
        }).catch(error => {
            dispatch(passwordSetFailed(error));

            throw error;
        });
    }
}

/**
 * Password reset action for PMP users (bank clients)
 * Button is required because password resetting is separated
 * from form
 * 
 * @param  entryType String
 * @param  button Object
 * @param  params Object
 * @return Promise
 */
function passwordReset(entryType, params) {
    return dispatch => {
        return doAction(
            ActionTypes.USER_PASSWORD_RESET, entryType, params
        ).then(response => {
            dispatch(modalOpening('success-password-reset-modal'));
            dispatch({
                type: ActionTypes.USER_PASSWORD_RESET_SUCCESS,
                payload: {
                    entry: response
                }
            });

            return response;
        }).catch(error => {
            dispatch({
                type: ActionTypes.USER_PASSWORD_RESET_FAILED,
                payload: {
                    error: error
                }
            });

            throw error;
        });
    }
}

/**
 * Setting new error to state
 * 
 * @param  error Object
 */
function setError(error) {
    return {
        type: ActionTypes.SET_ERROR,
        payload: {
            error
        }
    };
}

export { 
    auth, 
    logout,
    authCheck,
    passwordSet,
    passwordReset,
    setError,
};