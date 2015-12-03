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

function computeDurationData(inputData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', inputData.getColumnLabel(RAW_DATA_COL.PROJECT));
    data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.REF));
    data.addColumn('string', 'Jira Ref');
    data.addColumn({type: 'string', role: 'tooltip'}, 'Tooltip');
    data.addColumn('date', inputData.getColumnLabel(RAW_DATA_COL.EVENTS[RAW_DATA_COL.EVENTS.length - 1].columnIndex));
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length - 1; index++) {
        data.addColumn('number', RAW_DATA_COL.EVENTS[index].status);
    }
    data.addColumn('number', "Cycle Time");
    data.addColumn('number', "Tasks");
    data.addColumn('string', "");
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
        row.push(durations[durations.length - 1]);
        for (var index = 0; index < RAW_DATA_COL.EVENTS.length - 1; index++) {
            row.push(durations[index].getWorkDaysUntil(durations[index + 1]) + RAW_DATA_COL.EVENTS[index].correction);
        }
        row.push(durations[0].getWorkDaysUntil(durations[durations.length - 1]));
        row.push(1);
        row.push('Selection');
        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach(function (filter) { row.push(inputData.getValue(i, filter.columnIndex)) })
        }

        data.addRow(row);
    }
    return data;
}

function computeDurationGroupedData(inputData, groupBy) {
    var columns = Array.apply(null, {length: RAW_DATA_COL.EVENTS.length}).map(function (value, index) {
        return { column: 4 + index, aggregation: google.visualization.data.avg, type: 'number'}
    });
    columns.unshift({ column: 4 + RAW_DATA_COL.EVENTS.length, aggregation: google.visualization.data.sum, type: 'number'});
    var data = google.visualization.data.group(inputData, [groupBy], columns);

    var formatter = new google.visualization.NumberFormat({suffix: ' day(s)'});
    for (var index = 0; index < RAW_DATA_COL.EVENTS.length; index++) {
        formatter.format(data, 2 + index);
    }
    return data
}

