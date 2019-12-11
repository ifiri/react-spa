/**
 * Helping functions
 */
export default class Common {
    /**
     * Walk on form elements and return object
     * with all inputs \ selects \ switches values.
     *
     * If ignoreEmpty is false, empty elements will be
     * presented in result object.
     * 
     * @param  form Object
     * @param  ignoreEmpty Boolean
     * @return Object
     */
    static objectify(form, ignoreEmpty = true) {
        let pairs = {};

        const processElement = element => {
            // Out if element disabled
            if(typeof element !== 'object' || element.disabled) {
                return;
            }

            // If HTMLCollection
            if(element.length && !element.type) {
                processElement(element);
                return;
            }

            // Get only named elements
            if(element.name) {
                if(!element.value && ignoreEmpty) {
                    return;
                }

                // Don't stare on unchecked elements
                if(element.type === 'radio' || element.type === 'checkbox') {

                    if(!element.checked) {
                        return;
                    }
                }

                // If element should be presented as array
                if(element.name.slice(-2) === '[]') {
                    const groupName = element.name.slice(0, -2);

                    if(!pairs[groupName]) {
                        pairs[groupName] = [];
                    }

                    pairs[groupName].push(element.value);

                } else {
                    if(element.type === 'file') {
                        pairs[element.name] = element.files[0];

                        return;
                    }

                    pairs[element.name] = element.value;
                }
            }
        };

        
        for(let element of form.elements) {
            // let element = form.elements[index];
            
            processElement(element);
        }

        return pairs;
    }

    /**
     * Turn object into query string.
     * 
     * @param  obj Object
     * @return String
     */
    static serialize(obj) {
        var str = [];

        for(var p in obj) {
            if (obj.hasOwnProperty(p) && obj[p]) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }

        return str.join("&");
    }

    static lockSubmitButton(button) {
        button.dataset.lock = 1;
    }

    /**
     * Toggle submit button states. If button is enabled,
     * add to it loading text and disable it. In other case
     * restore original label and enable.
     * 
     * @param  {[type]}
     * @return {[type]}
     */
    static toggleSubmitButton(button, lock = false) {
        if(!button) {
            return false;
        }

        const currentTime = new Date();

        const originalTitle = button.dataset.originalTitle || button.textContent;
        const newTitle = 'Подождите...';

        if(button.dataset.lock && lock) {
            delete button.dataset.lock;
        }

        if(!('lock' in button.dataset)) {
            const label = button.querySelector('[data-rel="label"]');

            if(button.disabled) {
                const disabledTime = button.dataset.disabledAt;

                if(disabledTime && parseInt(disabledTime) + 250 > currentTime.getTime()) {
                    return;
                }

                button.disabled = false;
                label.textContent = originalTitle;
                button.dataset.disabledAt = '';

                button.dataset.originalTitle = '';
            } else {
                button.disabled = true;
                label.textContent = newTitle;

                button.dataset.disabledAt = currentTime.getTime();
                button.dataset.originalTitle = originalTitle;
            }
        }

        if(lock) {
            button.dataset.lock = 1;
        }

        return true;
    }

    /**
     * Parse query string and returns arguments from it
     * 
     * @param  queryString String
     * @return Array
     */
    static getQueryArgsFrom(queryString) {
        const args = [];

        const argsStartsAt = queryString.lastIndexOf('?');
        if(argsStartsAt !== -1) {
            queryString = queryString.substring(argsStartsAt + 1);
        }

        const queryPairs = queryString.split('&');
        for(const index in queryPairs) {
            const queryPair = queryPairs[index].split('=');

            if(queryPair.length < 2) {
                continue;
            }

            args[queryPair[0]] = queryPair[1];
        }

        return args;
    }

    static removeQueryArgsFrom(string) {
        return string.slice(0, string.lastIndexOf('?'));
    }
}