/***************************
 *  Duration Data
 **************************/

function computeDurationData(inputData) {
    var durationDataStruct = Array.apply(null, {length: inputData.getNumberOfColumns()}).map(Number.call, Number);
    durationDataStruct.push(constantColumnBuilder("string", "", "Selection"));
    durationDataStruct.push(constantColumnBuilder("number", "Count", 1));
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length - 1; index++) {
        var element = RAW_DATA_COL.EVENTS[index];
        var eventIndex = TASK_INDEX_EVENTS_FIRST + index;
        durationDataStruct.push(durationColumnBuilder(element.label, eventIndex, eventIndex + 1, element.correction));
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
}