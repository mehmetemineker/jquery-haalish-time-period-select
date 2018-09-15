(function ($) {
    "use strict";
    $.fn.haalishTimePeriodSelect = function (options) {
        var opts = $.extend({}, $.fn.haalishTimePeriodSelect.defaults, options);

        if (options) {
            opts.locale = $.extend({}, $.fn.haalishTimePeriodSelect.defaults.locale, options.locale);
        }

        var momentStartDate = moment(opts.startDate);
        var momentEndDate = moment(opts.endDate);
        var dayCount = momentEndDate.diff(momentStartDate, "day");
        var hourCount = opts.endHour - opts.startHour;

        var periodsTable = "<table class='periods-table'>";

        for (var dayIndex = 0; dayIndex < hourCount; dayIndex++) {
            periodsTable += "<tr>";

            for (var hourIndex = 0; hourIndex < dayCount; hourIndex++) {


                var timeTitle = (numberToHourFormat(opts.startHour + dayIndex)) + " - " +
                    (numberToHourFormat(opts.startHour + dayIndex + 1));

                periodsTable += "<td title='" + timeTitle + "'></td>";
            }

            periodsTable += "</tr>";
        }

        periodsTable += "</table>";

        this.addClass("haalish");
        this.html(periodsTable);
    }

    $.fn.haalishTimePeriodSelect.defaults = {
        startDate: new Date(),
        endDate: moment(new Date()).add(15, 'days').toDate(),
        startHour: 8,
        endHour: 18
    };

    $.fn.haalishTimePeriodSelect.defaults.locale = {
        applyLabel: "Apply",
        cancelLabel: "Cancel"
    };

    function numberToHourFormat(number) {
        return moment(number, 'HH').format('HH:mm')
    }
})(jQuery);


