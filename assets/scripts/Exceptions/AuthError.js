/**
 * Custom error for auth exceptions
 */
export default class AuthError extends Error {
    constructor(message, previous) {
        super(message);

        this.message = message;
        this.previous = previous;

        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthError);
        } else {
            this.stack = (new Error()).stack;
        }
    }
}