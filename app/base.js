var TASK_INDEX_STATIC_REFERENCE = 0;
var TASK_INDEX_STATIC_SYMMARY = 1;
var TASK_INDEX_STATIC_LAST = TASK_INDEX_STATIC_SYMMARY;

var TASK_INDEX_EVENTS_FIRST = TASK_INDEX_STATIC_LAST + 1;
var TASK_INDEX_EVENTS_LAST = TASK_INDEX_STATIC_LAST + RAW_DATA_COL.EVENTS.length;

var TASK_INDEX_FILTER_FIRST = TASK_INDEX_EVENTS_LAST + 1;
var TASK_INDEX_FILTER_LAST = TASK_INDEX_EVENTS_LAST + (RAW_DATA_COL.FILTERS == null ? 0 : RAW_DATA_COL.FILTERS.length);


var DURATION_INDEX_STATIC_FIRST = TASK_INDEX_FILTER_LAST + 1;
var DURATION_INDEX_STATIC_GROUP_ALL = DURATION_INDEX_STATIC_FIRST;
var DURATION_INDEX_STATIC_COUNT = DURATION_INDEX_STATIC_GROUP_ALL + 1;
var DURATION_INDEX_STATIC_LAST = DURATION_INDEX_STATIC_COUNT;

var DURATION_INDEX_DURATION_FIRST = DURATION_INDEX_STATIC_LAST + 1;
var DURATION_INDEX_DURATION_CYCLE_TIME = DURATION_INDEX_STATIC_LAST + RAW_DATA_COL.EVENTS.length;
var DURATION_INDEX_DURATION_LAST = DURATION_INDEX_DURATION_CYCLE_TIME;

var DURATION_INDEX_STATITICS_FIRST = DURATION_INDEX_DURATION_LAST + 1;
var DURATION_INDEX_STATITICS_AVERAGE = DURATION_INDEX_STATITICS_FIRST;
var DURATION_INDEX_STATITICS_50PCT = DURATION_INDEX_STATITICS_FIRST + 1;
var DURATION_INDEX_STATITICS_90PCT = DURATION_INDEX_STATITICS_FIRST + 2;

var DISTRIBUTION_INDEX_STATIC_GROUP_ALL = TASK_INDEX_FILTER_LAST + 1;;function filterReleasedBefore(inputData, fromDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: RAW_DATA_COL.EVENTS[RAW_DATA_COL.EVENTS.length - 1].columnIndex,
        minValue: fromDate
    }]));
    return view;
}

function filterReleasedAfter(inputData, toDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: RAW_DATA_COL.EVENTS[RAW_DATA_COL.EVENTS.length - 1].columnIndex,
        maxValue: toDate
    }]));
    return view;
}

function filterCreatedAfter(inputData, toDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: RAW_DATA_COL.EVENTS[0].columnIndex,
        maxValue: toDate
    }]));
    return view;
}

function columnBuilder(type, label, calc) {
    return {type: type, label: label, calc: calc};
}

function constantColumnBuilder(type, label, value) {
    return {
        type: type, label: label, calc: function () {
            return value;
        }
    };
}

function aggregatorBuilder(column, type, aggregation) {
    return {column: column, type: type, aggregation: aggregation};
}
;/***************************
 *  Distribution Data
 **************************/

function computeDistributionData(inputData) {
    var distributionDataStruct = Array.apply(null, {length: inputData.getNumberOfColumns()}).map(Number.call, Number);
    distributionDataStruct.push(constantColumnBuilder("number", "value", 0));

    var distributionData = new google.visualization.DataView(inputData);
    distributionData.setColumns(distributionDataStruct);

    return distributionData.toDataTable();
}

;/***************************
 *  Duration Data
 **************************/

function computeDurationData(inputData) {
    var durationDataStruct = Array.apply(null, {length: inputData.getNumberOfColumns()}).map(Number.call, Number);
    durationDataStruct.push(constantColumnBuilder("string", "", "Selection"));
    durationDataStruct.push(constantColumnBuilder("number", "Count", 1));
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length - 1; index++) {
        var element = RAW_DATA_COL.EVENTS[index];
        var eventIndex = TASK_INDEX_EVENTS_FIRST + index;
        durationDataStruct.push(durationColumnBuilder(element.status, eventIndex, eventIndex + 1, element.correction));
    }
    durationDataStruct.push(durationColumnBuilder("Cycle Time", TASK_INDEX_EVENTS_FIRST, TASK_INDEX_EVENTS_LAST, 0));

    var durationData = new google.visualization.DataView(inputData);
    durationData.setColumns(durationDataStruct);

    return durationData.toDataTable();
}

function durationColumnBuilder(label, firstEventIndex, lastEventIndex, correction) {
    return columnBuilder('number', label, function (table, row) {
        return table.getValue(row, firstEventIndex).getWorkDaysUntil(table.getValue(row, lastEventIndex)) + correction;
    });
}

function computeDurationStats(inputData) {
    // Using group method to find Avg, 50% and 90% values
    var group = google.visualization.data.group(inputData, [DURATION_INDEX_STATIC_GROUP_ALL], [
        createAggregationColumn(google.visualization.data.avg),
        createAggregationColumn(getQuartileFunction(0.75)),
        createAggregationColumn(getQuartileFunction(0.9))]);

    // Adding statistics
    // To have tendlines to show specific values (average, 50% and 90% lines), we only need to display 2 points
    // in a new serie and to draw a trendline between them.
    // That's why we are addind 3 columns at the end of the DataView.
    // We feel these columns with the required value only if date is min date or max date (to have our points at
    // the edge of the chart).
    // ╔═══════╦═════════╦═════╦════════════╦═════════╗
    // ║ Date  ║ Project ║ Ref ║ Cycle Time ║ Average ║
    // ╠═══════╬═════════╬═════╬════════════╬═════════╣
    // ║ 01/01 ║ TEST    ║   1 ║         16 ║      19 ║
    // ║ 01/02 ║ TEST    ║   2 ║         18 ║         ║ ╗
    // ║ 01/03 ║ TEST    ║   2 ║         18 ║         ║ ║> We Don't need to fill the value as we need 2 points
    // ║ 01/04 ║ TEST    ║   3 ║         20 ║         ║ ╝
    // ║ 01/05 ║ TEST    ║   4 ║         22 ║      19 ║
    // ╚════════════════════════════════════╩═════════╝
    //                    V                      V
    //               Actual Data             Statistics
    // We will then add new data series with these columns defining point size to 2 and adding a linear trend line.

    var minDate = inputData.getColumnRange(TASK_INDEX_EVENTS_FIRST).min
    var maxDate = inputData.getColumnRange(TASK_INDEX_EVENTS_LAST).max

    // Creating a structure [0, 1, 2 ... inputData.size] to keep all original columns
    var dataStatisticsStruct = Array.apply(null, {length: inputData.getNumberOfColumns()}).map(Number.call, Number);
    // Adding new columns, setting satistics data only on edge dates
    dataStatisticsStruct.push(statColumnBuilder(minDate, maxDate, 'Average', group.getValue(0, 1)));
    dataStatisticsStruct.push(statColumnBuilder(minDate, maxDate, '75%', group.getValue(0, 2)));
    dataStatisticsStruct.push(statColumnBuilder(minDate, maxDate, '90%', group.getValue(0, 3)));

    var dataWithStatistics = new google.visualization.DataView(inputData);
    dataWithStatistics.setColumns(dataStatisticsStruct);

    return dataWithStatistics;
}

function statColumnBuilder(minDate, maxDate, label, value) {
    return columnBuilder('number', label, function (table, row) {
        return table.getValue(row, TASK_INDEX_EVENTS_FIRST) == minDate
        || table.getValue(row, TASK_INDEX_EVENTS_LAST) == maxDate ? value : null;
    });
}

function createAggregationColumn(aggregationFunction) {
    return {
        column: DURATION_INDEX_DURATION_CYCLE_TIME,
        aggregation: aggregationFunction,
        'type': 'number'
    };
}

function getQuartileFunction(ration) {
    return function getQuartile(values) {
        return values.sort(function (a, b) {
            return a - b;
        })[Math.floor(values.length * ration)];
    }
}

function groupDurationDataBy(inputData, groupBy) {
    var columns = [];
    RAW_DATA_COL.EVENTS.forEach(function(element, index) {
        columns.push(aggregatorBuilder(DURATION_INDEX_DURATION_FIRST + index, 'number', google.visualization.data.avg));
    });
    columns.unshift(aggregatorBuilder(DURATION_INDEX_STATIC_COUNT, 'number', google.visualization.data.count));

    var data = google.visualization.data.group(inputData, [groupBy], columns);

    var formatter = new google.visualization.NumberFormat({suffix: ' day(s)'});
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length; index++) {
        formatter.format(data, 2 + index);
    }
    return data
};/***************************
 *  Event Data
 **************************/

// We need one column with the date and as many columns with counters as there are events.
// We want to mark the number tasks moving to a special state every days
// So these lines :
// ╔═══════╦═════════╦═════════╦═════════╗
// ║ Ref   ║ Event 1 ║ Event 2 ║ Event 3 ║
// ╠═══════╬═════════╬═════════╬═════════╣
// ║Task 1 ║ 01/01   ║ 01/02   ║ 01/03   ║
// ║Task 2 ║ 01/01   ║ 01/04   ║ 01/04   ║
// ╚═══════╩═════════╩═════════╩═════════╝
// Should lead to this table :
// ╔═══════╦═════════╦═════════╦═════════╗
// ║ Date  ║ Event 1 ║ Event 2 ║ Event 3 ║
// ╠═══════╬═════════╬═════════╬═════════╣
// ║ 01/01 ║       2 ║       0 ║       0 ║
// ║ 01/02 ║       0 ║       1 ║       0 ║
// ║ 01/03 ║       0 ║       0 ║       1 ║
// ║ 01/04 ║       0 ║       1 ║       1 ║
// ╚═══════╩═════════╩═════════╩═════════╝
// Then we build a cumulative table
// ╔═══════╦═════════╦═════════╦═════════╗
// ║ Date  ║ Event 1 ║ Event 2 ║ Event 3 ║
// ╠═══════╬═════════╬═════════╬═════════╣
// ║ 01/01 ║       2 ║       0 ║       0 ║
// ║ 01/02 ║       2 ║       1 ║       0 ║
// ║ 01/03 ║       2 ║       2 ║       1 ║
// ║ 01/04 ║       2 ║       2 ║       2 ║
// ╚═══════╩═════════╩═════════╩═════════╝
function computeEventData(inputData) {
    // Count the number of events at each day
    var eventsNb = RAW_DATA_COL.EVENTS.length;
    var eventsByDateMap = {};
    for (var index = 0; index < inputData.getNumberOfRows(); index++) {
        for (var eventIndex = 0; eventIndex < eventsNb; eventIndex++) {
            var eventDate = inputData.getValue(index, TASK_INDEX_EVENTS_FIRST + eventIndex).formatYYYYMMDD();
            if (!(eventDate in eventsByDateMap)) {
                eventsByDateMap[eventDate] = Array.apply(null, {length: eventsNb}).map(Number.prototype.valueOf, 0);
            }
            eventsByDateMap[eventDate][eventIndex]++;
        }
    }

    // Order by date and add in a table with a cumulative count
    var cumulativeData = new google.visualization.DataTable();
    cumulativeData.addColumn('date', "EventDate");
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length; index++) {
        cumulativeData.addColumn('number', inputData.getColumnLabel(TASK_INDEX_EVENTS_FIRST + index));
    }

    Object.keys(eventsByDateMap).sort().forEach(function(dateString,dateIndex) {
        var row =[new Date(dateString)];
        eventsByDateMap[dateString].forEach(function(counter, counterIndex) {
            row.push((dateIndex == 0) ? counter : counter + cumulativeData.getValue(dateIndex - 1, counterIndex + 1));
        })
        cumulativeData.addRow(row);
    });

    return cumulativeData;
}

;/***************************
 *  Tasks Data
 **************************/

function computeTaskData(driveData, jiraData) {
    // Listing all reference
    var taskRefs = [];
    for (var i = 0; i < driveData.getNumberOfRows(); i++) {
        taskRefs.push(driveData.getValue(i, RAW_DATA_COL.PROJECT) + '-' + driveData.getValue(i, RAW_DATA_COL.REF));
    }

    // Filtering Jira data
    var jiraDataMap = {};
    jiraData.issues.filter(new filterOnId(taskRefs).filter).forEach(function(element) {
        jiraDataMap[element.key] = element;
    });

    // Building the structure of the taskData
    var completedDataStruct = []
    completedDataStruct.push(columnBuilder('string', 'Ref', calcRefValue));
    completedDataStruct.push(jiraColumnBuilder(jiraDataMap));
    RAW_DATA_COL.EVENTS.forEach(function(element) {
        completedDataStruct.push(element.columnIndex);
    });
    RAW_DATA_COL.FILTERS.forEach(function(element) {
        completedDataStruct.push(element.columnIndex);
    });

    var completedData = new google.visualization.DataView(driveData);
    completedData.setColumns(completedDataStruct);

    return completedData.toDataTable();
}

function calcRefValue(table, row) {
    return table.getValue(row, RAW_DATA_COL.PROJECT) + '-' + table.getValue(row, RAW_DATA_COL.REF);
}

// Find the related line in jira-data and extrat field
function jiraColumnBuilder(jiraDataMap) {
    return columnBuilder('string', 'Ref', function(table, row) {
        var issue = jiraDataMap[calcRefValue(table,row)];
        return issue != null ? issue.fields.summary : "";
    });
}

function filterOnId(taskRefs) {
    this.filter = function (obj) {
        return taskRefs.includes(obj.key);
    };
};var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

Date.prototype.getMonthLabel = function () {
    return monthNames[this.getMonth()];
}

Date.prototype.formatDDMMYYYY = function () {
    var dd = this.getDate();
    dd = dd < 10 ? '0' + dd : dd;
    var mm = this.getMonth() + 1; //January is 0!
    mm = mm < 10 ? '0' + mm : mm;
    var yyyy = this.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
};

Date.prototype.formatYYYYMMDD = function () {
    var dd = this.getDate();
    dd = dd < 10 ? '0' + dd : dd;
    var mm = this.getMonth() + 1; //January is 0!
    mm = mm < 10 ? '0' + mm : mm;
    var yyyy = this.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
};

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

Date.prototype.getWorkDaysUntil = function (date) {
    return getWorkDaysBetween(this, date);
};

Date.prototype.getWorkDaysSince = function (date) {
    return getWorkDaysBetween(date, this);
};

function getWorkDaysBetween(dDate1, dDate2) {         // input given as Date objects

    var iWeeks, iDateDiff, iAdjust = 0;

    if (dDate2 < dDate1) return -1;                 // error code if dates transposed

    var iWeekday1 = dDate1.getDay();                // day of week
    var iWeekday2 = dDate2.getDay();

    iWeekday1 = (iWeekday1 == 0) ? 7 : iWeekday1;   // change Sunday from 0 to 7
    iWeekday2 = (iWeekday2 == 0) ? 7 : iWeekday2;

    if ((iWeekday1 > 5) && (iWeekday2 > 5)) iAdjust = 1;  // adjustment if both days on weekend

    iWeekday1 = (iWeekday1 > 5) ? 5 : iWeekday1;    // only count weekdays
    iWeekday2 = (iWeekday2 > 5) ? 5 : iWeekday2;

    // calculate differnece in weeks (1000mS * 60sec * 60min * 24hrs * 7 days = 604800000)
    iWeeks = Math.floor((dDate2.getTime() - dDate1.getTime()) / 604800000)

    if (iWeekday1 <= iWeekday2) {
        iDateDiff = (iWeeks * 5) + (iWeekday2 - iWeekday1)
    } else {
        iDateDiff = ((iWeeks + 1) * 5) - (iWeekday1 - iWeekday2)
    }

    iDateDiff -= iAdjust                            // take into account both days on weekend

    return (iDateDiff + 1);                         // add 1 because dates are inclusive

};/***************************
 *     Title Suffix
 **************************/

var setTitleSuffix = function (viewId, numberOfRows) {
    var plural = numberOfRows > 1 ? "s" : "";
    $("#" + viewId  + ID_TITLE_SUFFIX).text(" - " + numberOfRows + " task" + plural);
};

/***************************
 *   Dashboard Elements
 **************************/

var generateDashboardElementsDom = function (viewId, suffixList) {
    for (var index = 0; index < suffixList.length; index++) {
        $("#" + viewId + ID_DASHBOARD).append($('<div>').attr('id', viewId + suffixList[index]));
    }
};

/***************************
 *     Filter Generation
 **************************/

function generateFiltersDom(viewId, filtersConfig) {
    $("#" + viewId + ID_FILTERS)
        .append($('<div>').attr('id', viewId + ID_FILTERS_RANGE).addClass("col-md-7 text-center"))
        .append($('<div>').attr('id', viewId + ID_FILTERS_CATEGORY).addClass("col-md-5 text-center"));
    for (var index = 0; index < filtersConfig.length; index++) {

        var containerSuffix = filtersConfig[index].filterType == 'CategoryFilter' ?
            ID_FILTERS_CATEGORY :  ID_FILTERS_RANGE;

        $("#" + viewId + containerSuffix).append($('<div>').attr('id', viewId + filtersConfig[index].id));
    }
    return filtersConfig;
}

/***************************
 *     Chart Generation
 **************************/

function generateChartDom(viewId, chartsConfig) {
    var containerSelector = "#" + viewId + ID_DASHBOARD;
    for (var index = 0; index < chartsConfig.length; index++) {
        $(containerSelector).append($('<div>')
            .attr('id', viewId + chartsConfig[index].id)
            .addClass("col-md-4"));
    }
}

;function createModelForFilters() {
    var filtersConfig = [];
    if (RAW_DATA_COL.FILTERS != null) {
        for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
            filtersConfig.push({
                id: ID_FILTER + ID_SEPARATOR + index,
                filterType: RAW_DATA_COL.FILTERS[index].filterType,
                columnIndex: TASK_INDEX_FILTER_FIRST + index
            });
        }
    }
    return filtersConfig;
}

function createModelForChart() {
    var chatsConfig = [];
    if (RAW_DATA_COL.FILTERS != null) {
        RAW_DATA_COL.FILTERS.forEach(function(filter, index) {
            if(filter.filterType == 'CategoryFilter') {
                chatsConfig.push({
                    id:  ID_CHART + ID_SEPARATOR + index,
                    filterType:  'PieChart',
                    columnIndex: TASK_INDEX_FILTER_FIRST + index,
                    label: filter.label
                });
            }
        });
    }
    return chatsConfig;
};/***************************
 *     Task List
 **************************/

var createDomForTaskList = function (viewId) {
    // Creating Dom structure for bootstrap Modal
    $("#" + viewId)
        .append($('<div>')
            .attr('id', viewId + ID_TASK_LIST_MODAL)
            .attr('role', "dialog")
            .addClass("modal ticket-list fade")
            .append($('<div>').addClass("modal-dialog")
                .append($('<div>').addClass("modal-content")
                    .append($('<div>').addClass("modal-header")
                        .append($('<button>')
                            .attr('type', "button")
                            .attr('data-dismiss', "modal")
                            .addClass("close").html("&times;"))
                        .append($('<h4>')
                            .addClass("modal-title")
                            .text("Tasks list")))
                    .append($('<div>').addClass("modal-body")
                        .append($('<div>')
                            .attr('id', viewId + ID_TASK_LIST)
                            .addClass("col-md-12")))
                    .append($('<div>').addClass("modal-footer")
                        .append($('<button>')
                            .attr('type', "button")
                            .attr('data-dismiss', "modal")
                            .addClass("btn btn-default")
                            .text("Close"))))));
};


;/***************************
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


;/***************************
 *     Toggle Filter
 **************************/

function generateToggleFilter(viewId, dashboard) {
    if(REPORT_CONFIG.projection.length < 2){
        return;
    }
    var choice1Id = viewId + "_" + "choice_1";
    var choice2Id = viewId + "_" + "choice_2";
    var widgetId = viewId + "_" + "widget";
    $("#" + viewId + ID_SWITCH)
        .append($('<div>').attr('id', choice1Id).addClass("switch-label").text(REPORT_CONFIG.projection[0].filterLabel))
        .append($('<div>').attr('id', widgetId).addClass("switch-widget"))
        .append($('<div>').attr('id', choice2Id).addClass("switch-label").text(REPORT_CONFIG.projection[1].filterLabel));

    //Manage the switch
    $('#' + choice1Id).click(function () {
        $("#" + viewId + ID_SWITCH).removeClass("switched");
        dashboard.resetReduce(TASK_INDEX_FILTER_FIRST);
    });
    $('#' + choice2Id).click(function () {
        $("#" + viewId + ID_SWITCH).addClass("switched");
        dashboard.resetReduce(TASK_INDEX_FILTER_FIRST + 1);
    });
    $('#' + widgetId).click(function () {
        $("#" + viewId + ID_SWITCH).toggleClass("switched");
        var filterIndex = $("#" + viewId + ID_SWITCH).hasClass("switched") ? 1 : 0;
        dashboard.resetReduce(TASK_INDEX_FILTER_FIRST + (REPORT_CONFIG.projection[filterIndex].position));
    });
}
;/***************************
 *     Charts Factory
 **************************/

function buildDataTable(viewId) {
    return new google.visualization.ChartWrapper({
        'chartType': 'Table',
        'containerId': viewId,
        'options': {
            width: '100%'
        }
    });
}

function buildDurationStatsTable(viewId) {
    return buildDataTable(viewId + ID_DURATION_STATS);
}

function buildTasksListTable(viewId) {
    var tasksListTable = buildDataTable(viewId + ID_TASK_LIST);
    tasksListTable.setOption('height', '100%');
    tasksListTable.setOption('showRowNumber', true);
    setTaskSelectListener(tasksListTable);
    return tasksListTable;
}

function buildCumulativeFlowChart(viewId, height) {
    return new google.visualization.ChartWrapper({
        'chartType': 'AreaChart',
        'containerId': viewId,
        'options': {
            'animation': {
                'startup': true
            },
            'height': height,
            'chartArea': {
                'width': '90%',
                'height': '100%'
            },
            'hAxis': {
                'textPosition': 'in'
            },
            'vAxis': {
                'title': 'Number of tasks',
                'textPosition': 'in',
                'gridlines': {count: 4}
            },
            'legend': {
                'position': 'in'
            }
        }
    });
}

function buildTasksDurationColumnChart(viewId, columns) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ColumnChart',
        'containerId': viewId + ID_COLUMN_CHART,
        'view': {'columns': columns},
        'options': {
            'isStacked': true,
            'hAxis': {
                'title': 'Jira Tickets',
                'textPosition': 'none'
            },
            'vAxis': {
                'title': 'Duration (days)',
                'textPosition': 'in'
            },
            'legend': {
                'position': 'in'
            },
            'chartArea': {
                'width': '90%',
                'height': '100%'
            }
        }
    });
    setTaskSelectListener(durationChart);
    return durationChart;
}

function buildTasksDurationScatterChart(viewId, columns) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ScatterChart',
        'containerId': viewId + ID_SCATTER_CHART,
        'view': {'columns': columns},
        'options': {
            'height': 400,
            'hAxis': {
                'title': 'Dates',
                'textPosition': 'out'
            },
            'vAxis': {
                'title': 'Duration (days)',
                'textPosition': 'in'
            },
            'legend': {
                'position': 'in'
            },
            'chartArea': {
                'width': '90%',
                'height': '80%'
            },
            series: {
                0: {labelInLegend: 'Tasks'},
                1: {pointSize: 0, visibleInLegend: false},
                2: {pointSize: 0, visibleInLegend: false},
                3: {pointSize: 0, visibleInLegend: false}
            },
            trendlines: {
                1: {labelInLegend: 'Average', visibleInLegend: true, opacity: 0.4, color: 'green'},
                2: {labelInLegend: '75%', visibleInLegend: true, opacity: 0.4, color: 'orange'},
                3: {labelInLegend: '90%', visibleInLegend: true, opacity: 0.4, color: 'red'}
            },
        }
    });
    setTaskSelectListener(durationChart);
    return durationChart;
}

function buildRangeFilter(elementId) {
    return new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': elementId,
        'options': {
            'filterColumnIndex': 0,
            'ui': {
                'chartType': 'AreaChart',
                'chartOptions': {
                    'height': 100,
                    'chartArea': {
                        'width': '90%'
                    }
                }
            },
        },
    });
}

function buildSimpleChart(elementId, chartType, title) {
    return new google.visualization.ChartWrapper({
        'chartType': chartType,
        'containerId': elementId,
        'options': {
            'width': 400,
            'height': 400,
            'pieSliceText': 'label',
            'legend': 'none',
            'title' : title
        }
    });
}

function buildFilter(containerId, controlType, filterColumnIndex) {
    var filter = new google.visualization.ControlWrapper({
        'controlType': controlType,
        'containerId': containerId,
        'options': {
            'filterColumnIndex': filterColumnIndex,
        }
    });
    return filter;
}

/***************************
 *     Event Manager
 **************************/

function setTaskSelectListener(element) {
    google.visualization.events.addListener(element, 'select', function () {
        var rowNumber = element.getChart().getSelection()[0].row;
        var data = element.getDataTable();
        window.open('http://jira.lan.courtanet.net/browse/' + data.getValue(rowNumber, DURATION_INDEX_STATIC_PROJECT) + '-' + data.getValue(rowNumber, DURATION_INDEX_STATIC_REF), '_blank');
    });
}

/***************************
 * ExtractDashboard
 **************************/

function buildTimePeriodDashboard(viewId, startDate, endDate) {
    var areaChart = buildCumulativeFlowChart(viewId + ID_AREA_CHART, 600);
    limitDashboardPeriod(areaChart, startDate, endDate);
    return areaChart;
}

function limitDashboardPeriod(areaChart, firstDay, lastDay) {
    areaChart.setOption('hAxis.viewWindow.min', firstDay);
    areaChart.setOption('hAxis.viewWindow.max', lastDay);
    return areaChart;
}

/***************************
 * CumulativFlowDashboard
 **************************/

function buildCumulativFlowDashboard(viewId) {
    var areaChart = buildCumulativeFlowChart(viewId + ID_AREA_CHART, 400);
    var chartRangeFilter = buildRangeFilter(viewId + ID_RANGE_FILTER);
    var dashboard = new google.visualization.Dashboard(document.getElementById(viewId));
    dashboard.bind([chartRangeFilter], areaChart);
    return dashboard;
}

/***************************
 * TasksDurationDashboard
 **************************/

function buildFilters(viewId, filtersConfig) {
    var filters = [];
    for (var index = 0; index < filtersConfig.length; index++) {
        var filterConfig = filtersConfig[index];
        filters.push(buildFilter(viewId + filterConfig.id, filterConfig.filterType, filterConfig.columnIndex));
    }
    return filters;
}

function buildSimpleCharts(viewId, chartsConfig) {
    var charts = [];
    for (var index = 0; index < chartsConfig.length; index++) {
        var chartConfig = chartsConfig[index];
        charts.push(buildSimpleChart(viewId + chartConfig.id, chartConfig.filterType, chartConfig.label));
    }
    return charts;
}

function buildFilteredDashboard(viewId, charts, filters, filterListener) {
    google.visualization.events.addListener(charts, 'ready', filterListener);
    var dashboard = new google.visualization.Dashboard(document.getElementById(viewId + ID_DASHBOARD));
    dashboard.bind(filters, charts);
    return dashboard;
};function CumulativeDashboard(viewId) {
    var cumulativeFlowDashboard;
    var tasksListTable;

    var rawData;
    var eventData;

    var initialized = false;

    registerDashboard(viewId, this);

    this.initWidgets = function () {
        generateDashboardElementsDom(viewId, [ID_AREA_CHART, ID_RANGE_FILTER])
        createDomForTaskList(viewId);

        cumulativeFlowDashboard = buildCumulativFlowDashboard(viewId);
        tasksListTable = buildTasksListTable(viewId);

        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        eventData = computeEventData(data);
    };

    this.refresh = function () {
        if (eventData != null) {
            setTitleSuffix(viewId, rawData.getNumberOfRows());

            cumulativeFlowDashboard.draw(eventData);

            tasksListTable.setDataTable(rawData);
            tasksListTable.draw();
        }
    };

    this.isInitialized = function () {
        return initialized;
    };

};function DistributionDashboard(viewId) {
    var timeDistributionChart
    var distributionDashboard;
    var tasksListTable;
    var taskChart;
    var charts;

    var rawData;
    var distributionData;

    var initialized = false;

    registerDashboard(viewId, this);

    this.initWidgets = function () {
        var taskFilters = createModelForFilters();
        taskChart = createModelForChart()

        generateDashboardElementsDom(viewId, [ID_FILTERS, ID_SCATTER_CHART]);
        //generateDashboardElementsDom(viewId, [ID_SCATTER_CHART]);
        generateFiltersDom(viewId, taskFilters);
        generateChartDom(viewId, taskChart);
        createDomForTaskList(viewId);

        charts = buildSimpleCharts(viewId, taskChart);
        timeDistributionChart = buildTasksDurationScatterChart(viewId ,[TASK_INDEX_EVENTS_LAST, DISTRIBUTION_INDEX_STATIC_GROUP_ALL]);
        distributionDashboard = buildFilteredDashboard(viewId, timeDistributionChart, buildFilters(viewId, taskFilters), updateTable);
        tasksListTable = buildTasksListTable(viewId);

        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        distributionData = computeDistributionData(data);
    };

    this.refresh = function () {
        if (distributionData != null) {
            distributionDashboard.draw(distributionData);
            updateTable();
        }
    };

    var updateTable = function () {
        var durationChartData = timeDistributionChart.getDataTable();
        var dataToDisplay = durationChartData != null ? durationChartData : distributionData;

        if (dataToDisplay != null) {
            setTitleSuffix(viewId, dataToDisplay.getNumberOfRows());

            for(var i=0; i< charts.length; i++){
                var group = google.visualization.data.group(dataToDisplay, [taskChart[i].columnIndex], [{
                    column: 1,
                    aggregation: google.visualization.data.count,
                    'type': 'number'
                }]);

                charts[i].setDataTable(group);
                charts[i].draw();
            }

            tasksListTable.setDataTable(dataToDisplay)
            tasksListTable.draw();
        }
    };

    this.isInitialized = function () {
        return initialized;
    };

};function DurationDashboard(viewId) {
    var tasksDurationDashboard;
    var tasksDurationColumnChart;
    var tasksDurationScatterChart;
    var tasksDurationStatsTable;
    var tasksListTable;

    var rawData;
    var durationData;

    var initialized = false;

    registerDashboard(viewId, this);

    this.initWidgets = function () {
        var filtersConfig = createModelForFilters();
        filtersConfig.unshift({
            id:  "_max_cycle_time",
            filterType: 'NumberRangeFilter',
            columnIndex: DURATION_INDEX_DURATION_CYCLE_TIME
        });

        generateDashboardElementsDom(viewId, [ID_FILTERS, ID_DURATION_STATS, ID_COLUMN_CHART, ID_SCATTER_CHART]);
        generateFiltersDom(viewId, filtersConfig);
        createDomForTaskList(viewId);

        // Defining columns that should be displayed on Bar Chart depending on Events in Config (duration Nb = events
        // Nb -1)
        var durationsColumns = [TASK_INDEX_STATIC_REFERENCE];
        for (var i = 0; i < RAW_DATA_COL.EVENTS.length - 1; i++) {
            durationsColumns.push(DURATION_INDEX_DURATION_FIRST + i);
        }
        tasksDurationColumnChart = buildTasksDurationColumnChart(viewId, durationsColumns);
        tasksDurationScatterChart = buildTasksDurationScatterChart(viewId, [TASK_INDEX_EVENTS_LAST, DURATION_INDEX_DURATION_LAST, DURATION_INDEX_STATITICS_AVERAGE, DURATION_INDEX_STATITICS_50PCT, DURATION_INDEX_STATITICS_90PCT]);
        tasksDurationDashboard = buildFilteredDashboard(viewId, tasksDurationColumnChart, buildFilters(viewId, filtersConfig), updateTable);
        tasksDurationStatsTable = buildDurationStatsTable(viewId);
        tasksListTable = buildTasksListTable(viewId);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        durationData = computeDurationData(data);
    };

    this.refresh = function () {
        if (durationData != null) {
            tasksDurationDashboard.draw(durationData);
            updateTable();
        }
    };

    var updateTable = function () {
        var durationChartData = tasksDurationColumnChart.getDataTable();
        var dataToDisplay = durationChartData != null ? durationChartData : durationData;

        if (dataToDisplay != null) {
            setTitleSuffix(viewId, dataToDisplay.getNumberOfRows());

            tasksDurationScatterChart.setDataTable(computeDurationStats(dataToDisplay));
            tasksDurationScatterChart.draw();

            tasksListTable.setDataTable(dataToDisplay);
            tasksListTable.draw();

            tasksDurationStatsTable.setDataTable(groupDurationDataBy(dataToDisplay, DURATION_INDEX_STATIC_GROUP_ALL));
            tasksDurationStatsTable.draw();
        }
    };

    this.isInitialized = function () {
        return initialized;
    };

};function ReportDashboard(config) {
    var cumulativeFlowGraph;
    var durationStatsTable;
    var tasksListTable;

    var rawData;
    var filteredData;

    var initialized = false;

    var startDate;
    var endDate;
    var reduceColumn = TASK_INDEX_FILTER_FIRST + REPORT_CONFIG.projection[0].position;

    registerDashboard(config.id, this);

    this.initWidgets = function () {
        if(config.selector == CONFIG_MONTH_SELECTOR) {
            createDomForMonthSelector(config.id, this)
        }
        if(config.selector == CONFIG_PERIOD_SELECTOR) {
            createDomForPeriodSelector(config.id, this)
        }
        generateToggleFilter(config.id, this);
        createDomForTaskList(config.id);

        cumulativeFlowGraph = buildTimePeriodDashboard(config.id, startDate, endDate);
        durationStatsTable = buildDurationStatsTable(config.id);
        tasksListTable = buildTasksListTable(config.id);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        this.filterData();
    };

    this.filterData = function () {
        filteredData = filterCreatedAfter(filterReleasedBefore(rawData, startDate), endDate);
    };

    this.refresh = function () {
        if (filteredData != null) {
            setTitleSuffix(config.id, filteredData.getNumberOfRows());

            cumulativeFlowGraph.setDataTable(computeEventData(filteredData));
            cumulativeFlowGraph.draw();

            durationStatsTable.setDataTable(groupDurationDataBy(computeDurationData(filterReleasedAfter(filteredData, endDate)), reduceColumn));
            durationStatsTable.draw();

            tasksListTable.setDataTable(filteredData)
            tasksListTable.draw();
        }
    };

    this.isInitialized = function () {
        return initialized;
    };

    this.setDates = function (firstDay, lastDate) {
        startDate = firstDay;
        endDate = lastDate !=  null ? lastDate : new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
    }

    this.resetDates = function (firstDay, lastDate) {
        this.setDates(firstDay, lastDate);
        limitDashboardPeriod(cumulativeFlowGraph, startDate, endDate);
        this.filterData();
        this.refresh();
    }

    this.resetReduce = function (column) {
        reduceColumn = column;
        this.refresh();
    }

};function TaskManager(viewId) {
    var initialized = false;

    registerDashboard(viewId, this);

    this.initWidgets = function () {
        var iframe = $('iframe');
        if (iframe.attr('src') == "") {
            iframe.attr('src', function () {
                return 'https://docs.google.com/spreadsheets/d/' + RAW_DATA_URL + '/edit?usp=sharing&single=true&gid=0&range=A1%3AE4&output=html';
            });
        }
        initialized = true;
    };

    this.isInitialized = function () {
        return initialized;
    };

    this.loadData = function (data) {
    };

    this.refresh = function () {
    };

};google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});
var containerToLoad = 0;
var allDashboards = [];
var currentDashboards = [];

// Requesting the load of all elements (element="<element_template>")
google.setOnLoadCallback(function () {
    containerToLoad = $("a[element]").size();
    $("a[element]").each(function (index) {
        $(".tab-content").append($("<div>")
            .attr('id', $(this).attr("href").replace("#", ""))
            .addClass("tab-pane fade in")
            //.addClass(index == 0 ? "active" : "")
            .load($(this).attr("element")));
    });
});

// Wait for all elements to be loaded before initializing the app
function registerDashboard(tabId, dashboard) {
    allDashboards.push({tab: "#" + tabId, controller: dashboard});
    containerToLoad--;
    if (containerToLoad == 0) {
        initApp()
    }
};ID_SEPARATOR = "_";
ID_TITLE_SUFFIX = ID_SEPARATOR + "title_suffix";
ID_DASHBOARD = ID_SEPARATOR + "dashboard";
ID_TASK_LIST = ID_SEPARATOR + 'tasks_list';
ID_TASK_LIST_MODAL = ID_SEPARATOR + 'tasks_list_modal';
ID_CHART = ID_SEPARATOR + 'chart';
ID_AREA_CHART = ID_SEPARATOR + 'area_chart';
ID_COLUMN_CHART = ID_SEPARATOR + 'column_chart';
ID_SCATTER_CHART = ID_SEPARATOR + 'scatter_chart';
ID_RANGE_FILTER = ID_SEPARATOR + 'range_filter';
ID_FILTER = ID_SEPARATOR + 'filter';
ID_FILTERS = ID_SEPARATOR + 'filters';
ID_FILTERS_RANGE = ID_SEPARATOR + ID_FILTERS + ID_SEPARATOR + 'range';
ID_FILTERS_CATEGORY = ID_SEPARATOR + ID_FILTERS + ID_SEPARATOR + 'category';
ID_SWITCH = ID_SEPARATOR + 'switch';
ID_TIME_SELECTOR = ID_SEPARATOR + 'time_selector';
ID_MONTH_SELECTOR_LABEL = ID_SEPARATOR + 'month_selector_label';
ID_MONTH_SELECTOR_LIST = ID_SEPARATOR + 'month_selector_list';
ID_DURATION_STATS = ID_SEPARATOR + 'duration_stats';

CONFIG_MONTH_SELECTOR = "month_selector";
CONFIG_PERIOD_SELECTOR = "pediod_selector";;function initApp() {
    parseUrl()
    currentDashboards.forEach(function (element) {
        if (!element.isInitialized()) {
            element.initWidgets();
        }
    })
    loadRawData(currentDashboards);
}

function loadRawData(dataConsumer) {
    var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/" + RAW_DATA_URL + "/gviz/tq?sheet=RawData&headers=1");
    var handler = new QueryResponseHandler(dataConsumer);
    query.send(handler.handleResponse);
}

// Completing spreadsheed data with jira if possible
function QueryResponseHandler(dataConsumer) {
    this.handleResponse = function (response) {
        var driveData = response.getDataTable();

        if(typeof JIRA_DATA !== 'undefined'){
            //http://jira.lan.courtanet.net/rest/api/2/search?jql=Workstream=Traffic&fields=id,key,summary&startAt=0&maxResults=5000
            $.getJSON("../resources/"+JIRA_DATA, function (jiraData) {
                setUpConsumer(dataConsumer, computeTaskData(driveData, jiraData));
            });
        } else {
            setUpConsumer(dataConsumer, computeTaskData(driveData));
        }
    }
}

// Dispatch data to all dashboards
function setUpConsumer(dataConsumer, dataWithStatistics) {
    dataConsumer.forEach(function (consumer) {
        consumer.loadData(dataWithStatistics);
        consumer.refresh();
    });

    window.onresize = function () {
        dataConsumer.forEach(function (consumer) {
            consumer.refresh();
        });
    };
}

// Manage tab changes, load if required the target tab and load data
$(document).on('ready', function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab

        currentDashboards = [];
        for (var index = 0; index < allDashboards.length; index++) {
            var dashboard = allDashboards[index];
            if (target == dashboard.tab) {
                if (!dashboard.controller.isInitialized()) {
                    dashboard.controller.initWidgets();
                }
                currentDashboards.push(dashboard.controller);
            }
        }
        loadRawData(currentDashboards);
    });
});;// Reading url to selecting to the tab to display (format: base_url#<tab_id>)
function parseUrl() {
    var requestedUrl = document.location.toString();
    if (requestedUrl.match('#')) {
        $(document).ready(function () {
            $('.navbar a[href=#' + requestedUrl.split('#')[1] + ']').tab('show');
        });
    } else {
        $(document).ready(function () {
            $('.navbar a[data-toggle=tab]:first').tab('show');
        });
    }
};

// Changing url to fit the displayed tab
$(document).on('ready', function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        var currentUrl = document.location.toString();
        var baseUrl = currentUrl.match('#') ? currentUrl.split('#')[0] : currentUrl;
        document.location = baseUrl + target;
    });
});