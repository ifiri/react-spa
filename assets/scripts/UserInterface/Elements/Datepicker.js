/**
 * Logic for Datepicker component. Using Flatpickr library
 */
export default class Datepicker {
    constructor() {
        this.datepickers = [];
    }

    /**
     * Let add datepicker to init
     *
     * @param datepicker Object
     * @return void
     */
    addDatepicker(datepicker) {
        this.datepickers.push(datepicker);
    }

    /**
     * Create Flatpickr instances for all datepickers
     * 
     * @return void
     */
    init() {
        const datepickers = this.datepickers;

        for(const datepicker of datepickers) {
            this.createDatepicker(datepicker);
        }
    }

    /**
     * Create Flatpickr instance for passed datepicker node
     * with passed params and initial date.
     * 
     * @param  datepicker Object
     * @param  params Object
     * @param  initialDate String
     * @return {[type]}
     */
    createDatepicker(datepicker, params = {}, initialDate = null) {
        let mode = datepicker.getAttribute('data-datepicker') || 'datetime';
        let range = datepicker.getAttribute('data-datepicker-range');
        let relatedSelector = datepicker.getAttribute('data-datepicker-related') || null;
        let relatedDatepicker = null;

        // If initial date is not set, get date from datepicker input, 
        // in other case set null
        initialDate = initialDate || (
            datepicker.value ? datepicker.value.trim() : null
        );

        const options = {
            time_24hr: true,
            allowInput: true,
            dateFormat: 'Y-m-d',
            locale: {
                rangeSeparator: ' — '
            },
            onChange: function(selectedDates, dateStr, instance) {
                let config = instance.config;

                if(config.mode !== 'time') {
                    return false;
                }

                let last_selected_date = instance._lastSelectedDate|| selectedDates[0];
                let direction = null;

                if(last_selected_date.getTime() < selectedDates[0].getTime()) {
                    direction = 'increase';
                } else if(last_selected_date.getTime() > selectedDates[0].getTime()) {
                    direction = 'decrease';
                }

                instance._lastSelectedDate = new Date(selectedDates[0].getTime());

                if(!direction && config.minDate) {
                    if(last_selected_date.getTime() === config.minDate.getTime()) {
                        instance.setDate('23:59', false, 'H:i');
                    } else if(last_selected_date.getHours() === config.minDate.getHours()) {
                        instance.setDate(last_selected_date.getHours() + ':00', false, config.dateFormat);
                        instance._lastSelectedDate.setMinutes(0);
                    }
                }
            },
            appendTo: datepicker.closest('.datepicker'),
        };

        // Set range mode
        if(range) {
            options.mode = 'range';
        }

        // Set only date mode
        if(mode === 'date') {
            options.enableTime = false;
            options.dateFormat = "Y-m-d";
        }

        // Set datetime mode
        if(mode === 'datetime') {
            options.enableTime = true;
            options.dateFormat = "Y-m-d H:i";
        }

        // Set only time mode
        if(mode === 'time') {
            options.enableTime = true;
            options.noCalendar = true;
            options.dateFormat = "H:i";
        }

        // If passed params exists, its override default options above
        if(Object.keys(params).length) {
            for(let param_name in params) {
                let param_value = params[param_name];

                options[param_name] = param_value;
            }
        }

        // Related datepicker is a datepicker which bind with current.
        // If in current datepicker changed time, in related datepicker 
        // changing min date or some other settings
        if(relatedSelector) {
            const self = this;

            relatedDatepicker = document.querySelector(relatedSelector);

            // Bind minimal date of related datepicker to selected date of current
            options['onChange'] = function(selectedDates, dateStr, instance) {
                self.createDatepicker(relatedDatepicker, {
                    minDate: selectedDates[0]
                });
            };

            options['onReady'] = function(selectedDates, dateStr, instance) {
                if(Array.isArray(selectedDates) && selectedDates[0]) {
                    self.createDatepicker(relatedDatepicker, {
                        minDate: selectedDates[0]
                    });
                }
            };
        }

        // Instantiate Flatpickr with all stuff
        const instance = flatpickr(datepicker, options);

        // In initial date is not empty, set
        if(initialDate && instance.setDate) {
            instance.setDate(initialDate);
        }
    }
}