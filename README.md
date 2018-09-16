# jquery-haalish-time-period-select
Jquery Haalish Time Period Select - Weekly Schedule Board - Hours Selector

![Screenshot](https://github.com/mehmetemineker/jquery-haalish-time-period-select.js/blob/master/haalish-time-period-select.gif)

# How to use

Include Jquery and MomentJs libraries in the project. Then add jquery-haalish-time-period-select.js.

https://jquery.com/ and https://momentjs.com/

**Html head**

    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
    <script type="text/javascript" src="jquery-haalish-time-period-select.js"></script>

**haalishTimePeriodSelect call**

    <script type="text/javascript">
        $(document).ready(function () {
            $("#time-period-select").haalishTimePeriodSelect({
		        startDate: new Date(),
		        endDate: moment(new Date()).add(15, "days").toDate(),
		        startHour: 8,
		        endHour: 18,
		        hourSlot: 1
            });
        });
    </script>

**Html body**

    <body>
        <div class="container">
            <h1>Haalish Time Period Select</h1>
            <form method="post">
                <div id="time-period-select"></div>
                <button type="submit">Submit</button>
            </form>
        </div>
    </body>
