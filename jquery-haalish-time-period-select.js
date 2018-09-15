(function ($) {
    "use strict";
    $.fn.haalishTimePeriodSelect = function (options) {
        var opts = $.extend({}, $.fn.haalishTimePeriodSelect.defaults, options);

        if (options) {
            opts.locale = $.extend({}, $.fn.haalishTimePeriodSelect.defaults.locale, options.locale);
        }

        if (opts.hourSlot !== 1 && opts.hourSlot !== 0.5 && opts.hourSlot !== 0.25) {
            opts.hourSlot = 1;
        }

        var dayCount = moment(opts.endDate).diff(moment(opts.startDate), "day");
        var hourCount = opts.endHour - opts.startHour;

        if (opts.hourSlot === 0.5) {
            hourCount *= 2;
        } else if (opts.hourSlot === 0.25) {
            hourCount *= 4;
        }

        var periodsTable = "<table class='periods-table'>";

        for (var hourIndex = 0; hourIndex < hourCount; hourIndex++) {
            periodsTable += "<tr>";

            for (var dayIndex = 0; dayIndex < dayCount; dayIndex++) {
                var startTime = opts.startHour + (hourIndex * opts.hourSlot);
                var endTime = opts.startHour + opts.hourSlot + (hourIndex * opts.hourSlot);
                var startDate = moment(opts.startDate).add(dayIndex, "day");
                var startNumberDate = numberToDate(startDate, startTime);
                var endNumberDate = numberToDate(startDate, endTime);
                var timeTitle = moment(startNumberDate).format("dddd, HH:mm") + " - " + moment(endNumberDate).format("HH:mm");

                periodsTable += "<td data-date='" + startNumberDate + "' title='" + timeTitle + "'></td>";
            }

            periodsTable += "</tr>";
        }

        periodsTable += "</table>";

        this.addClass("haalish");
        this.html(periodsTable);
        this.append("<input style='display: none;' name='" + this.attr("id") + "-value' />");

        selectEventInit(this);
    }

    $.fn.haalishTimePeriodSelect.defaults = {
        startDate: new Date(),
        endDate: moment(new Date()).add(15, "days").toDate(),
        startHour: 8,
        endHour: 18,
        hourSlot: 1
    };

    $.fn.haalishTimePeriodSelect.defaults.locale = {
        applyLabel: "Apply",
        cancelLabel: "Cancel"
    };

    function numberToDate(date, number) {
        var time = moment.utc(number * 3600 * 1000);

        date.set({
            hour: time.get("hour"),
            minute: time.get("minute"),
            second: 0
        });

        return date.toDate();
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

            $("input[name='" + haalish.attr("id") + "-value']").val(getJsonValue());
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
        var dateArray = [];
        $(".periods-table").find(".selected").each(function (i, e) {
            dateArray.push($(e).data("date"));
        });

        return JSON.stringify(dateArray);
    }
})(jQuery);


