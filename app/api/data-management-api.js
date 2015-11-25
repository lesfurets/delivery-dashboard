function filterLastMonth(inputData, fromDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: RAW_DATA_COL.RELEASE,
        minValue: fromDate
    }]));
    return view;
}

function computeEventData(inputData) {
    var data = builtEventDataStructure(inputData);
    for (var i = 0; i < inputData.getNumberOfRows(); i++) {
        data.addRow([inputData.getValue(i, RAW_DATA_COL.CREATION), 1, 0, 0, 0, 0]);
        data.addRow([inputData.getValue(i, RAW_DATA_COL.ANALYSIS), 0, 1, 0, 0, 0]);
        data.addRow([inputData.getValue(i, RAW_DATA_COL.DEVELOPMENT), 0, 0, 1, 0, 0]);
        data.addRow([inputData.getValue(i, RAW_DATA_COL.VALIDATION), 0, 0, 0, 1, 0]);
        data.addRow([inputData.getValue(i, RAW_DATA_COL.RELEASE), 0, 0, 0, 0, 1]);
    }
    var eventData = google.visualization.data.group(data, [{
        column: 0,
        type: 'date'
    }], [{
        column: 1,
        aggregation: google.visualization.data.sum,
        type: 'number'
    }, {
        column: 2,
        aggregation: google.visualization.data.sum,
        type: 'number'
    }, {
        column: 3,
        aggregation: google.visualization.data.sum,
        type: 'number'
    }, {
        column: 4,
        aggregation: google.visualization.data.sum,
        type: 'number'
    }, {
        column: 5,
        aggregation: google.visualization.data.sum,
        type: 'number'
    }]);
    var cumulativEventData = builtEventDataStructure(inputData);
    for (var i = 0; i < eventData.getNumberOfRows(); i++) {
        cumulativEventData.addRow([eventData.getValue(i, 0),
            cumputeCumulativeValue(i, 1, eventData, cumulativEventData),
            cumputeCumulativeValue(i, 2, eventData, cumulativEventData),
            cumputeCumulativeValue(i, 3, eventData, cumulativEventData),
            cumputeCumulativeValue(i, 4, eventData, cumulativEventData),
            cumputeCumulativeValue(i, 5, eventData, cumulativEventData)]);
    }
    return cumulativEventData;
}

function builtEventDataStructure(inputData) {
    var data = new google.visualization.DataTable();
    data.addColumn('date', "EventDate");
    data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.CREATION));
    data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.ANALYSIS));
    data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.DEVELOPMENT));
    data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.VALIDATION));
    data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.RELEASE));
    return data;
}

function cumputeCumulativeValue(rowIndex, columnIndex, inputData, cumulativData) {
    return (rowIndex == 0) ? inputData.getValue(rowIndex, columnIndex) : inputData.getValue(rowIndex, columnIndex) + cumulativData.getValue(rowIndex - 1, columnIndex);
}

function computeDurationData(inputData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', inputData.getColumnLabel(RAW_DATA_COL.PROJECT));
    data.addColumn('number', inputData.getColumnLabel(RAW_DATA_COL.REF));
    data.addColumn('string', 'Jira Ref');
    data.addColumn('date', 'Release');
    data.addColumn('number', "Backlog");
    data.addColumn('number', "Analysis");
    data.addColumn('number', "Development");
    data.addColumn('number', "Ready To Release");
    data.addColumn('number', "Total");
    data.addColumn('number', "Tasks");
    data.addColumn('string', "");
    if (RAW_DATA_COL.FILTERS != null) {
        for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
            data.addColumn(inputData.getColumnType(RAW_DATA_COL.FILTERS[index].columnIndex), inputData.getColumnLabel(RAW_DATA_COL.FILTERS[index].columnIndex));
        }
    }

    for (var i = 0; i < inputData.getNumberOfRows(); i++) {
        var creationDate = inputData.getValue(i, RAW_DATA_COL.CREATION);
        var analysisDate = inputData.getValue(i, RAW_DATA_COL.ANALYSIS);
        var devlopmentDate = inputData.getValue(i, RAW_DATA_COL.DEVELOPMENT);
        var validationDate = inputData.getValue(i, RAW_DATA_COL.VALIDATION);
        var releaseDate = inputData.getValue(i, RAW_DATA_COL.RELEASE);

        var row = [];
        row.push(inputData.getValue(i, RAW_DATA_COL.PROJECT));
        row.push(inputData.getValue(i, RAW_DATA_COL.REF));
        row.push(inputData.getValue(i, RAW_DATA_COL.PROJECT) + '-' + inputData.getValue(i, RAW_DATA_COL.REF));
        row.push(releaseDate);
        row.push(creationDate.getWorkDaysUntil(analysisDate) - 1);
        row.push(analysisDate.getWorkDaysUntil(devlopmentDate) - 0.5);
        row.push(devlopmentDate.getWorkDaysUntil(validationDate) - 0.5);
        row.push(validationDate.getWorkDaysUntil(releaseDate) - 1);
        row.push(creationDate.getWorkDaysUntil(releaseDate));
        row.push(1);
        row.push('Selection');
        if (RAW_DATA_COL.FILTERS != null) {
            for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
                row.push(inputData.getValue(i, RAW_DATA_COL.FILTERS[index].columnIndex));
            }
        }

        data.addRow(row);
    }
    return data;
}

function computeDurationGroupedData(inputData, groupBy) {
    var data = google.visualization.data.group(inputData, [groupBy], [{
        column: 9,
        aggregation: google.visualization.data.sum,
        type: 'number'
    }, {
        column: 4,
        aggregation: google.visualization.data.avg,
        type: 'number'
    }, {
        column: 5,
        aggregation: google.visualization.data.avg,
        type: 'number'
    }, {
        column: 6,
        aggregation: google.visualization.data.avg,
        type: 'number'
    }, {
        column: 7,
        aggregation: google.visualization.data.avg,
        type: 'number'
    }, {
        column: 8,
        aggregation: google.visualization.data.avg,
        type: 'number'
    }]);
    var formatter = new google.visualization.NumberFormat({suffix: ' day(s)'});
    formatter.format(data, 2);
    formatter.format(data, 3);
    formatter.format(data, 4);
    formatter.format(data, 5);
    formatter.format(data, 6);
    return data
}

