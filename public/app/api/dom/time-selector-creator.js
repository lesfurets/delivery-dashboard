/***************************
 *     Month Selector
 **************************/

var createDomForMonthSelector = function (viewId, dashboard) {
    var startDate = new Date(REPORT_CONFIG.first_entry);
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 15);
    currentDate.setDate(1);

    dashboard.setDates(new Date(currentDate));

    // Creating Dom structure for bootstrap Dropdown
    $("#" + viewId + ID_TIME_SELECTOR).addClass("dropdown")
        .append($("<button>")
            .attr('id', viewId + ID_MONTH_SELECTOR_LABEL)
            .attr('type', "button")
            .attr('data-toggle', "dropdown")
            .addClass("btn btn-default dropdown-toggle")
            .append($("<span>").addClass("caret")))
        .append($("<ul>")
            .attr('id', viewId + ID_MONTH_SELECTOR_LIST)
            .attr('aria-labelledby', "month_dropdown")
            .addClass("dropdown-menu"));

    // Populating with the lists of values
    setDropDownValue(currentDate);
    while (startDate < currentDate) {
        // We can't use simple functions because they would all be closures that reference the same variable
        // currentDate.
        var monthLink = $('<a>').text(currentDate.getFullYear() + " " + currentDate.getMonthLabel()).attr('href', '#').on('click', changeDate(new Date(currentDate)));
        $('#' + viewId + ID_MONTH_SELECTOR_LIST).append($('<li>').append(monthLink));
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    function changeDate(date) {
        date.setDate(1);
        return function(){
            setDropDownValue(date);
            dashboard.resetDates(date)
        }
    }

    function setDropDownValue(date) {
        $("#" + viewId + ID_MONTH_SELECTOR_LABEL).text((date.getFullYear() + " " + date.getMonthLabel() + " ")).append($('<span>').attr('class', 'caret'));
    }
};

/***************************
 *     Period Selector
 **************************/

var createDomForPeriodSelector = function (viewId, dashboard) {
    var startDate = new Date(REPORT_CONFIG.first_entry);
    var endPeriod = new Date();
    endPeriod.setDate(endPeriod.getDate() - 15);
    var startPeriod = new Date(endPeriod.getFullYear(), endPeriod.getMonth() - 2, endPeriod.getDate());

    dashboard.setDates(startPeriod, endPeriod)

    // Creating Dom structure for selector
    $("#" + viewId + ID_TIME_SELECTOR)
        .append($("<input>")
            .attr('type', "text")
            .attr('name', "daterange"));

    // Selector configuration
    $("#" + viewId + ID_TIME_SELECTOR +' input[name="daterange"]').daterangepicker({
        startDate: startPeriod.formatDDMMYYYY(),
        endDate: endPeriod.formatDDMMYYYY(),
        minDate: startDate.formatDDMMYYYY(),
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function(start, end, label) {
        dashboard.resetDates(start.toDate(), end.toDate());
    });
};


