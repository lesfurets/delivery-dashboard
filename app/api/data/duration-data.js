/***************************
 *  Duration Data
 **************************/

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
    return function getQuartile(values) {
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
