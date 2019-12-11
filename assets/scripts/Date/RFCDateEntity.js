/**
 * Wrapper for native Date object.
 * This class works with dates as with strings,
 * due to date bugs in Chrome 35-40 versions.
 */
export default class RFCDateEntity {
    constructor(datestring, timezone = '+00:00') {
        this.datestring = datestring;
        this.timezone = timezone;
    }

    /**
     * Format datestring to human readable format and returns it
     * 
     * @return String
     */
    getReadableDate() {
        const date = new Date(Date.parse(this.datestring));

        return this.formatDate(date);
    }

    /**
     * Format datestring to human readable format and returns it
     * 
     * @return String
     */
    getReadableDate2() {
        const date = new Date(Date.parse(this.datestring));

        return this.formatDate(date, ['date']).trim(' ');
    }

    /**
     * Format datestring to human readable format and returns it
     * 
     * @return String
     */
    getReadableTime() {
        const date = new Date(Date.parse(this.datestring));

        return this.formatDate(date, ['time']).trim(' ');
    }

    /**
     * Format date in strict accordance with RFC3339,
     * and returns it. If timestamp was passed,
     * returns date with this timestamp, in other case
     * UTC will be used.
     * 
     * @return String
     */
    getDateInRFCFormat() {
        let timestamp = Date.parse(this.datestring);
        let date = new Date(timestamp);

        // Determine date format
        let formatParts = {
            'date': [
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate()
            ],

            'time': [
                date.getHours(), 
                date.getMinutes(),
                date.getSeconds()
            ]
        };

        // Walk on format parts and build formatted datestring
        let utcDatestring = '';
        for(let type in formatParts) {
            let part = formatParts[type];

            for(let y in part) {
                let piece = part[y];

                // Add leading zeros
                if(piece < 10) {
                    piece = '0' + piece;
                }

                utcDatestring += piece;

                if(type === 'date') {
                    utcDatestring += '-';    
                } else if(type === 'time') {
                    utcDatestring += ':';
                }
            }

            utcDatestring = utcDatestring.slice(0, -1);
            utcDatestring += 'T';
        }

        utcDatestring = utcDatestring.slice(0, -1);

        // Set timezone
        if(!this.timezone) {
            utcDatestring += 'Z';
        } else {
            utcDatestring += this.timezone;
        }

        return utcDatestring;
    }

    /**
     * Format date to readable form.
     *
     * @param  date Object
     * @return String
     */
    formatDate(date, requiredParts = ['date', 'time'], isSecond = true) {
        const timezone = this.timezone;
        const offset = date.getTimezoneOffset();

        date.setTime(date.getTime() + parseInt(timezone) * 60 * 60 * 1000);

        let formatParts = {
            'date': [
                date.getUTCFullYear(),
                date.getUTCMonth() + 1,
                date.getUTCDate()
            ],

            'time': [
                date.getUTCHours(), 
                date.getUTCMinutes()
            ]
        };

        let datestring = '';
        for(let type in formatParts) {
            if(!~requiredParts.indexOf(type)) {
                continue;
            }

            let part = formatParts[type];

            for(let y in part) {
                let piece = part[y];

                if(piece < 10) {
                    piece = '0' + piece;
                }

                datestring += piece;

                if(type === 'date') {
                    datestring += '-';    
                } else if(type === 'time') {
                    datestring += ':';
                }
            }

            datestring = datestring.slice(0, -1);
            datestring += ' ';
        }

        return datestring;
    }
}