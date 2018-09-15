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
        this.append("<input name='selected-" + this.attr("id") + "' />");

        selectEventInit(this);
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

    function selectEventInit(haalish) {
        var table = $(haalish).find("table.periods-table");
        var isMouseDown = false;
        var isSelected = false;
        var startRowIndex = null;
        var startCellIndex = null;

        $('.haalish').unbind("mousedown");
        $('.haalish').unbind("mouseup");
        $('.haalish').unbind("mouseover");
        $('.haalish').unbind("selectstart");

        $('.haalish').on("mousedown", ".periods-table td", function (e) {
            if (e.which !== 1) return false;

            isMouseDown = true;

            var cell = $(this);
            isSelected = cell.hasClass("selected");

            if (isSelected) {
                cell.addClass("remove-selected").removeClass("selected");
            } else {
                cell.addClass("new-selected");
            }

            startCellIndex = cell.index();
            startRowIndex = cell.parent().index();
        });

        $(".haalish").on("mouseover", ".periods-table", function (e) {
            if (!isMouseDown) return;

            if ($(e.target).is("td")) {
                if (isSelected) {
                    table.find(".remove-selected").removeClass("remove-selected").addClass("selected");
                } else {
                    table.find(".new-selected").removeClass("new-selected");
                }

                selectTo(table, $(e.target), startRowIndex, startCellIndex, isSelected);
            }
        });

        $(".haalish").bind("selectstart", function () {
            return false;
        });

        $(document).mouseup(function () {
            isMouseDown = false;

            table.find(".new-selected").addClass("selected").removeClass("new-selected");
            table.find(".remove-selected").removeClass("remove-selected");
        });
    }

    // Reference: https://stackoverflow.com/a/31876373
    function selectTo(table, cell, startRowIndex, startCellIndex, isSelected) {
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
                if (isSelected) {
                    if (rowCells.eq(j).hasClass("selected")) {
                        rowCells.eq(j).addClass("remove-selected")
                    }
                    rowCells.eq(j).removeClass("selected");
                } else {
                    rowCells.eq(j).addClass("new-selected");
                }
            }
        }
    }

    function getJsonValue() {

    }
})(jQuery);


