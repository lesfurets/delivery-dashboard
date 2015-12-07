function filterLastMonth(inputData, fromDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: RAW_DATA_COL.EVENTS[RAW_DATA_COL.EVENTS.length - 1].columnIndex,
        minValue: fromDate
    }]));
    return view;
}

function computeEventData(inputData) {
    var data = builtEventDataStructure(inputData);
    for (var i = 0; i < inputData.getNumberOfRows(); i++) {
        var statusNumber = RAW_DATA_COL.EVENTS.length;
        for (var statusIndex = 0; statusIndex < statusNumber; statusIndex++) {
            var row = Array.apply(null, {length: statusNumber}).map(function(value, index){return index == statusIndex ? 1 : 0});
            row.unshift(inputData.getValue(i, RAW_DATA_COL.EVENTS[statusIndex].columnIndex));
            data.addRow(row);
        }
    }
    var eventData = google.visualization.data.group(data, [{ column: 0, type: 'date'}],
        Array.apply(null, {length: statusNumber}).map(function(value, index){
            return { column: index + 1, aggregation: google.visualization.data.sum, type : 'number' }
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

var DURATION_DATA_STATUS_OFFSET = 7;
var DURATION_DATA_FILTER_OFFSET = DURATION_DATA_STATUS_OFFSET + RAW_DATA_COL.EVENTS.length;
var DURATION_DATA_END_OFFSET = DURATION_DATA_FILTER_OFFSET + (RAW_DATA_COL.FILTERS == null ? 0 : RAW_DATA_COL.FILTERS.length);
var DURATION_DATA_CYCLE_TIME = DURATION_DATA_FILTER_OFFSET - 1;
var DURATION_DATA_GROUP_ALL = 5;
var DURATION_DATA_COUNT = 4;

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
        RAW_DATA_COL.FILTERS.forEach(function (filter) { data.addColumn(inputData.getColumnType(filter.columnIndex), inputData.getColumnLabel(filter.columnIndex)); });
    }

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
        for (var index = 0; index < RAW_DATA_COL.EVENTS.length - 1; index++) {
            row.push(durations[index].getWorkDaysUntil(durations[index + 1]) + RAW_DATA_COL.EVENTS[index].correction);
        }
        row.push(durations[0].getWorkDaysUntil(durations[durations.length - 1]));
        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach(function (filter) { row.push(inputData.getValue(i, filter.columnIndex)) })
        }

        data.addRow(row);
    }

    // Aggregate the previous view to calculate the average. This table should be a single table that looks like:
    // [['', AVERAGE]], so you can get the Average with .getValue(0,1)
    var group = google.visualization.data.group(data, [5], [{
        column: DURATION_DATA_CYCLE_TIME,
        id: 'avg',
        label: 'average',
        aggregation: google.visualization.data.avg,
        'type': 'number'
    }]);

    // Create a DataView where the third column is the average.
    var dataAvg = new google.visualization.DataView(data);
    var dataAvgStruct = Array.apply(null, {length: DURATION_DATA_END_OFFSET}).map(function(value, index){return index});
    dataAvgStruct.push({
        type: 'number',
        label: 'average',
        calc: function (dt, row) {
            return group.getValue(0, 1);
        }
    })
    dataAvg.setColumns(dataAvgStruct);

    return dataAvg;
}

function computeDurationGroupedData(inputData, groupBy) {
    var columns = Array.apply(null, {length: RAW_DATA_COL.EVENTS.length}).map(function (value, index) {
        return { column: DURATION_DATA_STATUS_OFFSET + index, aggregation: google.visualization.data.avg, type: 'number'}
    });
    columns.unshift({ column: DURATION_DATA_COUNT, aggregation: google.visualization.data.sum, type: 'number'});
    var data = google.visualization.data.group(inputData, [groupBy], columns);

    var formatter = new google.visualization.NumberFormat({suffix: ' day(s)'});
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length; index++) {
        formatter.format(data, 2 + index);
    }
    return data
}

