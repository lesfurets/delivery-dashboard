function filterReleasedBefore(inputData, fromDate) {
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

function computeEventData(inputData) {
    var data = builtEventDataStructure(inputData);
    for (var i = 0; i < inputData.getNumberOfRows(); i++) {
        var statusNumber = RAW_DATA_COL.EVENTS.length;
        for (var statusIndex = 0; statusIndex < statusNumber; statusIndex++) {
            var row = Array.apply(null, {length: statusNumber}).map(function (value, index) {
                return index == statusIndex ? 1 : 0
            });
            row.unshift(inputData.getValue(i, RAW_DATA_COL.EVENTS[statusIndex].columnIndex));
            data.addRow(row);
        }
    }
    var eventData = google.visualization.data.group(data, [{column: 0, type: 'date'}],
        Array.apply(null, {length: statusNumber}).map(function (value, index) {
            return {column: index + 1, aggregation: google.visualization.data.sum, type: 'number'}
        }));
    var cumulativEventData = builtEventDataStructure(inputData);
    for (var i = 0; i < eventData.getNumberOfRows(); i++) {
        var row = Array.apply(null, {length: statusNumber}).map(function (value, index) {
            return (i == 0) ? eventData.getValue(i, index + 1) : eventData.getValue(i, index + 1) + cumulativEventData.getValue(i - 1, index + 1)
        });
        row.unshift(eventData.getValue(i, 0));
        cumulativEventData.addRow(row);
    }
    return cumulativEventData;
}

function builtEventDataStructure(inputData) {
    var data = new google.visualization.DataTable();
    data.addColumn('date', "EventDate");
    if (RAW_DATA_COL.EVENTS != null) {
        for (var index = 0; index < RAW_DATA_COL.EVENTS.length; index++) {
            data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.EVENTS[index].columnIndex));
        }
    }
    return data;
}

var DURATION_INDEX_STATIC_PROJECT = 0;
var DURATION_INDEX_STATIC_REF = 1;
var DURATION_INDEX_STATIC_COUNT = 4;
var DURATION_INDEX_STATIC_GROUP_ALL = 5;
var DURATION_INDEX_STATIC_EVENT_LAST = 6;
var DURATION_INDEX_STATIC_LAST = DURATION_INDEX_STATIC_EVENT_LAST;

var DURATION_INDEX_DURATION_FIRST = DURATION_INDEX_STATIC_LAST + 1;
var DURATION_INDEX_DURATION_LAST = DURATION_INDEX_STATIC_LAST + RAW_DATA_COL.EVENTS.length;
var DURATION_INDEX_DURATION_CYCLE_TIME = DURATION_INDEX_DURATION_LAST;

var DURATION_INDEX_FILTER_FIRST = DURATION_INDEX_DURATION_LAST + 1;
var DURATION_INDEX_FILTER_LAST = DURATION_INDEX_DURATION_LAST + (RAW_DATA_COL.FILTERS == null ? 0 : RAW_DATA_COL.FILTERS.length);


var DURATION_INDEX_STATITICS_FIRST = DURATION_INDEX_FILTER_LAST + 1;
var DURATION_INDEX_STATITICS_AVERAGE = DURATION_INDEX_STATITICS_FIRST;
var DURATION_INDEX_STATITICS_50PCT = DURATION_INDEX_STATITICS_FIRST + 1;
var DURATION_INDEX_STATITICS_90PCT = DURATION_INDEX_STATITICS_FIRST + 2;

function computeDurationData(inputData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', inputData.getColumnLabel(RAW_DATA_COL.PROJECT));
    data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.REF));
    data.addColumn('string', 'Jira Ref');
    data.addColumn({type: 'string', role: 'tooltip'}, 'Tooltip');
    data.addColumn('number', "Tasks");
    data.addColumn('string', "");
    data.addColumn('date', inputData.getColumnLabel(RAW_DATA_COL.EVENTS[RAW_DATA_COL.EVENTS.length - 1].columnIndex));
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length - 1; index++) {
        data.addColumn('number', RAW_DATA_COL.EVENTS[index].status);
    }
    data.addColumn('number', "Cycle Time");
    if (RAW_DATA_COL.FILTERS != null) {
        RAW_DATA_COL.FILTERS.forEach(function (filter) {
            data.addColumn(inputData.getColumnType(filter.columnIndex), inputData.getColumnLabel(filter.columnIndex));
        });
    }

    // Parsing events data to compute duration data
    for (var i = 0; i < inputData.getNumberOfRows(); i++) {
        var durations = Array.apply(null, {length: RAW_DATA_COL.EVENTS.length}).map(function (value, index) {
            return inputData.getValue(i, RAW_DATA_COL.EVENTS[index].columnIndex);
        });

        var row = [];
        row.push(inputData.getValue(i, RAW_DATA_COL.PROJECT));
        row.push(inputData.getValue(i, RAW_DATA_COL.REF));
        row.push(inputData.getValue(i, RAW_DATA_COL.PROJECT) + '-' + inputData.getValue(i, RAW_DATA_COL.REF));
        row.push(inputData.getValue(i, RAW_DATA_COL.PROJECT) + '-' + inputData.getValue(i, RAW_DATA_COL.REF));
        row.push(1);
        row.push('Selection');
        row.push(durations[durations.length - 1]);
        // Compute durations (in work days) and applying correction from config
        for (var index = 0; index < RAW_DATA_COL.EVENTS.length - 1; index++) {
            row.push(durations[index].getWorkDaysUntil(durations[index + 1]) + RAW_DATA_COL.EVENTS[index].correction);
        }
        // Compute full cycle time
        row.push(durations[0].getWorkDaysUntil(durations[durations.length - 1]));
        // Adding data to allow filtering
        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach(function (filter) {
                row.push(inputData.getValue(i, filter.columnIndex))
            })
        }

        data.addRow(row);
    }

    return data;
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
    // | Date  | Project | Ref | Cycle Time | Average |
    // |-------|---------|-----|------------|---------|
    // | 01/01 | TEST    |   1 |         16 |      19 |
    // | 01/02 | TEST    |   2 |         18 |         | ╗
    // | 01/03 | TEST    |   2 |         18 |         | ║> Don't need to feel the value as we want to draw a line
    // | 01/04 | TEST    |   3 |         20 |         | ╝
    // | 01/05 | TEST    |   4 |         22 |      19 |
    // ╚════════════════════════════════════╩═════════╝
    //                    V                      V
    //               Actual Data             Statistics
    // We will then add new data series with these columns defining point size to 2 and adding a linear trend line.

    var minDate = inputData.getColumnRange(DURATION_INDEX_STATIC_EVENT_LAST).min
    var maxDate = inputData.getColumnRange(DURATION_INDEX_STATIC_EVENT_LAST).max

    // Creating a structure [0, 1, 2 ... inputData.size] to keep all original columns
    var dataStatisticsStruct = Array.apply(null, {length: inputData.getNumberOfColumns()}).map(Number.call, Number);
    // Adding new columns, setting satistics data only on edge dates
    dataStatisticsStruct.push(createStatColumn(minDate, maxDate, 'Average', group.getValue(0, 1)));
    dataStatisticsStruct.push(createStatColumn(minDate, maxDate, '75%', group.getValue(0, 2)));
    dataStatisticsStruct.push(createStatColumn(minDate, maxDate, '90%', group.getValue(0, 3)));

    var dataWithStatistics = new google.visualization.DataView(inputData);
    dataWithStatistics.setColumns(dataStatisticsStruct);

    return dataWithStatistics;
}

function createStatColumn(minDate, maxDate, label, value) {
    return {
        type: 'number', label: label,
        calc: function (table, row) {
            return table.getValue(row, DURATION_INDEX_STATIC_EVENT_LAST) == minDate
            || table.getValue(row, DURATION_INDEX_STATIC_EVENT_LAST) == maxDate ? value : null;
        }
    };
}

function createAggregationColumn(aggregationFunction) {
    return {
        column: DURATION_INDEX_DURATION_CYCLE_TIME,
        aggregation: aggregationFunction,
        'type': 'number'
    };
}

function integerSorter(a,b) {
    return a - b;
}

function getQuartileFunction(ration){
    return function count(values) {
        return values.sort(integerSorter)[Math.floor(values.length * ration)];
    }
}

function groupDurationDataBy(inputData, groupBy) {
    var columns = Array.apply(null, {length: RAW_DATA_COL.EVENTS.length}).map(function (value, index) {
        return {column: DURATION_INDEX_DURATION_FIRST + index, aggregation: google.visualization.data.avg, type: 'number'}
    });
    columns.unshift({column: DURATION_INDEX_STATIC_COUNT, aggregation: google.visualization.data.sum, type: 'number'});
    var data = google.visualization.data.group(inputData, [groupBy], columns);

    var formatter = new google.visualization.NumberFormat({suffix: ' day(s)'});
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length; index++) {
        formatter.format(data, 2 + index);
    }
    return data
}

;var monthNames = ["January", "February", "March", "April", "May", "June",
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
 *     Charts Factory
 **************************/

function buildDataTable(elementId) {
    return new google.visualization.ChartWrapper({
        'chartType': 'Table',
        'containerId': elementId,
        'options': {
            width: '100%'
        }
    });
}

function buildTasksListTable(elementId) {
    var tasksListTable = buildDataTable(elementId);
    tasksListTable.setOption('height', '100%');
    tasksListTable.setOption('showRowNumber', true);
    setTaskSelectListener(tasksListTable);
    return tasksListTable;
}

function buildCumulativeFlowChart(config) {
    return new google.visualization.ChartWrapper({
        'chartType': 'AreaChart',
        'containerId': config.id,
        'options': {
            'animation': {
                'startup': true
            },
            'height': config.height,
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

function buildTasksDurationColumnChart(config) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ColumnChart',
        'containerId': config.id,
        'view': {'columns': config.columns},
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

function buildTasksDurationScatterChart(config) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ScatterChart',
        'containerId': config.id,
        'view': {'columns': config.columns},
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

function buildFilter(controlType, containerId, filterColumnIndex) {
    var filter = new google.visualization.ControlWrapper({
        'controlType': controlType,
        'containerId': containerId,
        'options': {
            'filterColumnIndex': filterColumnIndex,
        },
    });
    return filter;
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

function buildTimePeriodDashboard(config) {
    var areaChart = buildCumulativeFlowChart(config.cumulativeFlowChart);
    limitDashboardPeriod(areaChart, config.date.start, config.date.end);
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

function buildCumulativFlowDashboard(config) {
    var areaChart = buildCumulativeFlowChart(config.cumulativeFlowChart);
    var chartRangeFilter = buildRangeFilter(config.rangeFilter);
    var dashboard = new google.visualization.Dashboard(document.getElementById(config.dashboard));
    dashboard.bind([chartRangeFilter], areaChart);
    return dashboard;
}

/***************************
 * TasksDurationDashboard
 **************************/

function buildFilteredDashboard(config, chart, filterListener) {
    var filters = [];
    for (var index = 0; index < config.taskFilters.length; index++) {
        var filterConfig = config.taskFilters[index];
        filters.push(buildFilter(filterConfig.filterType, filterConfig.id, filterConfig.columnIndex));
    }
    google.visualization.events.addListener(chart, 'ready', filterListener);
    var dashboard = new google.visualization.Dashboard(document.getElementById(config.dashboard));
    dashboard.bind(filters, [chart]);
    return dashboard;
};function CumulativeDashboard(config) {
    var cumulativFlowDashboard;
    var tasksListTable;

    var rawData;
    var eventData;

    var initialized = false;

    this.initWidgets = function () {
        cumulativFlowDashboard = buildCumulativFlowDashboard(config);
        tasksListTable = buildTasksListTable(config.tasksList);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        eventData = computeEventData(data);
    };

    this.refresh = function () {
        if (eventData != null) {
            setTitleSuffix(rawData.getNumberOfRows());

            cumulativFlowDashboard.draw(eventData);

            tasksListTable.setDataTable(rawData)
            tasksListTable.draw();
        }
    };

    var setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix.id).text(" - " + numberOfRows + " task" + plural);
    };

    this.isInitialized = function () {
        return initialized;
    };

};function DurationDashboard(config) {
    var tasksDurationDashboard;
    var tasksDurationColumnChart;
    var tasksDurationScatterChart;
    var tasksDurationStatsTable;
    var tasksListTable;

    var rawData;
    var durationData;

    var initialized = false;

    this.initWidgets = function () {
        tasksDurationColumnChart = buildTasksDurationColumnChart(config.durationColumnChart);
        tasksDurationScatterChart = buildTasksDurationScatterChart(config.durationScatterChart);
        tasksDurationDashboard = buildFilteredDashboard(config, tasksDurationColumnChart, updateTable);
        tasksDurationStatsTable = buildDataTable(config.durationStats);
        tasksListTable = buildTasksListTable(config.tasksList);
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

    var setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix.id).text(" - " + numberOfRows + " task" + plural);
    };

    var updateTable = function () {
        var durationChartData = tasksDurationColumnChart.getDataTable();
        var dataToDisplay = durationChartData != null ? durationChartData : durationData;

        if (dataToDisplay != null) {
            setTitleSuffix(dataToDisplay.getNumberOfRows());

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

    var rawDara;
    var filteredData;

    var initialized = false;

    var startDate = config.date.start;
    var endDate = config.date.end;
    var reduceColumn = DURATION_INDEX_FILTER_FIRST;

    this.initWidgets = function () {
        cumulativeFlowGraph = buildTimePeriodDashboard(config);
        durationStatsTable = buildDataTable(config.durationStats);
        tasksListTable = buildTasksListTable(config.tasksList);
        initialized = true;
    };

    this.loadData = function (data) {
        rawDara = data;
        this.filterData();
    };

    this.filterData = function () {
        filteredData = filterCreatedAfter(filterReleasedBefore(rawDara, startDate), endDate);
    };

    this.refresh = function () {
        if (filteredData != null) {
            setTitleSuffix(filteredData.getNumberOfRows());

            cumulativeFlowGraph.setDataTable(computeEventData(filteredData));
            cumulativeFlowGraph.draw();

            durationStatsTable.setDataTable(groupDurationDataBy(computeDurationData(filterReleasedAfter(filteredData, endDate)), reduceColumn));
            durationStatsTable.draw();

            tasksListTable.setDataTable(filteredData)
            tasksListTable.draw();
        }
    };

    var setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix.id).text(" - " + numberOfRows + " task" + plural);
    };

    this.isInitialized = function () {
        return initialized;
    };

    this.resetDates = function (firstDay, lastDate) {
        startDate = firstDay;
        endDate = lastDate;
        limitDashboardPeriod(cumulativeFlowGraph, startDate, endDate);
        this.filterData();
        this.refresh();
    }

    this.resetReduce = function (column) {
        reduceColumn = column;
        this.refresh();
    }

};function TaskManager() {
    var initialized = false;

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

    this.loadData = function (data) { };

    this.refresh = function () { };

    var setTitleSuffix = function (numberOfRows) { };

};google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});
var containerToLoad = 0;
var allDashboards = [];
var currentDashboards = [];

// Requesting the load of all elements (element="<element_template>")
google.setOnLoadCallback(function () {
    containerToLoad = $(".element-container").size();
    $(".element-container").each(function (index) {
        $(this).load($(this).attr("element"));
    });
});

// Wait for all elements to be loaded before initializing the app
function registerDashboard(tabId, dashboard, isDefault) {
    allDashboards.push({tab: tabId, controller: dashboard});
    containerToLoad--;
    if (containerToLoad == 0) {
        initApp()
    }
};function generateFiltersModelFromConfig(filterIdPrefix) {
    var filtersConfig = [];
    if (RAW_DATA_COL.FILTERS != null) {
        for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
            var filterId = filterIdPrefix + "_" + index;
            var filterType = RAW_DATA_COL.FILTERS[index].filterType;

            filtersConfig.push({
                id: filterId,
                filterType: filterType,
                columnIndex: DURATION_INDEX_FILTER_FIRST + index
            });
        }
    }
    return filtersConfig;
}

function generateFiltersDom(containerId, filtersConfig) {
    var rangeFilterContainer = containerId + "_" + "range";
    var categoryFilterContainer = containerId + "_" + "category";
    $("#" + containerId)
        .append($('<div>').attr('id', rangeFilterContainer).addClass("col-md-7 text-center"))
        .append($('<div>').attr('id', categoryFilterContainer).addClass("col-md-5 text-center"));
    for (var index = 0; index < filtersConfig.length; index++) {

        var filterContainer = filtersConfig[index].filterType == 'CategoryFilter' ?
        categoryFilterContainer : rangeFilterContainer;

        $("#" + filterContainer).append($('<div>').attr('id', filtersConfig[index].id));
    }
    return filtersConfig;
};function initApp() {
    currentDashboards.forEach(function (element) {
        element.initWidgets();
    })
    loadRawData(currentDashboards);
}

function reloadRawData() {
    loadRawData(currentDashboards);
}

function loadRawData(dataConsumer) {
    var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/" + RAW_DATA_URL + "/gviz/tq?sheet=RawData&headers=1");
    var handler = new QueryResponseHandler(dataConsumer);
    query.send(handler.handleResponse);
}

// Dispatch data to all dashboards
function QueryResponseHandler(dataConsumer) {
    this.handleResponse = function (response) {
        var inputData = response.getDataTable();

        dataConsumer.forEach(function (consumer) {
            consumer.loadData(inputData);
            consumer.refresh();
        });

        window.onresize = function () {
            dataConsumer.forEach(function (consumer) {
                consumer.refresh();
            });
        };
    }
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
var requestedUrl = document.location.toString();
if (requestedUrl.match('#')) {
    $(document).ready(function () {
        $('.navbar .dropdown-menu a[href=#' + requestedUrl.split('#')[1] + ']').tab('show');
    });
} else {
    $(document).ready(function () {
        $('.navbar .dropdown-menu a[href=#tab-global-flow-view]').tab('show');
    });
}

// Changing url to fit the displayed tab
$(document).on('ready', function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        var currentUrl = document.location.toString();
        var baseUrl = currentUrl.match('#') ? currentUrl.split('#')[0] : currentUrl;
        document.location = baseUrl + target;
    });
});