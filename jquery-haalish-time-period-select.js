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

                periodsTable += "<td data-index-x='" + hourIndex + "' data-index-y='" + dayIndex + "' title='" + timeTitle + "'></td>";
            }

            periodsTable += "</tr>";
        }

        periodsTable += "</table>";


        this.addClass("haalish");
        this.html(periodsTable);

        selectEventLoad(this);
    }

    $.fn.haalishTimePeriodSelect.defaults = {
        startDate: new Date(),
        endDate: moment(new Date()).add(15, 'days').toDate(),
        startHour: 8,
        endHour: 18,
        onSelectStart: function (e) { }
    };

    $.fn.haalishTimePeriodSelect.defaults.locale = {
        applyLabel: "Apply",
        cancelLabel: "Cancel"
    };

    function numberToHourFormat(number) {
        return moment(number, 'HH').format('HH:mm')
    }

    function selectEventLoad(haalish) {
        var table = $(haalish).find("table.periods-table");
        var isMouseDown = false;
        var startRowIndex = null;
        var startCellIndex = null;

        $('.haalish').unbind("mousedown");
        $('.haalish').unbind("mouseup");
        $('.haalish').unbind("mouseover");
        $('.haalish').unbind("selectstart");

        $('.haalish').on("mousedown", ".periods-table td", function (e) {
            isMouseDown = true;

            var cell = $(this);

            cell.addClass("new-selected");
            startCellIndex = cell.index();
            startRowIndex = cell.parent().index();

            // if (options.onSelectStart !== undefined) {
            //     options.onSelectStart(e);
            // }
        });

        $('.haalish').on("mouseup", ".periods-table td", function (e) {
            isMouseDown = false;

            table.find(".new-selected").addClass("selected").removeClass("new-selected");
        });

        $(".haalish").on("mouseover", ".periods-table", function (e) {
            if (!isMouseDown) return;

            if ($(e.target).is("td")) {
                table.find(".new-selected").removeClass("new-selected");
                selectTo(table, $(e.target), startRowIndex, startCellIndex);
            }
        });

        $(".haalish").bind("selectstart", function () {
            return false;
        });
    }

    // Reference: https://stackoverflow.com/a/2014097
    function selectTo(table, cell, startRowIndex, startCellIndex) {
        var row = cell.parent();
        var cellIndex = cell.index();
        var rowIndex = row.index();

        var rowStart, rowEnd, cellStart, cellEnd;

        if (rowIndex < startRowIndex) {
            rowStart = rowIndex;
            rowEnd = startRowIndex;
        } else {
            rowStart = startRowIndex;
            rowEnd = rowIndex;
        }

        if (cellIndex < startCellIndex) {
            cellStart = cellIndex;
            cellEnd = startCellIndex;
        } else {
            cellStart = startCellIndex;
            cellEnd = cellIndex;
        }

        for (var i = rowStart; i <= rowEnd; i++) {
            var rowCells = table.find("tr").eq(i).find("td");
            for (var j = cellStart; j <= cellEnd; j++) {
                rowCells.eq(j).addClass("new-selected");
            }
        }
    }
})(jQuery);


