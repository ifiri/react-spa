import CommonUtils from '../Utils/Common';
import RequestExecuter from '../Api/RequestExecuter';

/**
 * Base wrapper for executing all API actions.
 * Creates RequestExecuter instance, prepare all params,
 * toggle submit button if it's required.
 * 
 * @param  action String
 * @param  type String
 * @param  params Object
 * @return Promise
 */
function doAction(action, type, {
    body = null,
    query = null, 
    map = null,
    uniq = null, 
    form = null,
    button = null,
    headers = null,
} = {}) {

    const RequestExecuterInstance = new RequestExecuter();

    let submitButton = button || null;
    if(form) {
        submitButton = form.querySelector('[type="submit"]');
    }

    if(submitButton) {
        CommonUtils.toggleSubmitButton(submitButton);
    }

    return RequestExecuterInstance.doRequestBy(type, {
        action: action,
        body: body,
        query: query,
        map: map,
        form: form,
        headers: headers,
    }).then(response => {
        if(submitButton) {
            CommonUtils.toggleSubmitButton(submitButton);

            if(submitButton.disabled) {
                setTimeout(() => {
                    CommonUtils.toggleSubmitButton(submitButton);
                }, 250);
            }
        }

        return response;
    }).catch(error => {
        if(submitButton) {
            CommonUtils.toggleSubmitButton(submitButton);

            if(submitButton.disabled) {
                setTimeout(() => {
                    CommonUtils.toggleSubmitButton(submitButton);
                }, 250);
            }
        }

        throw error;
    });
}

export { doAction };