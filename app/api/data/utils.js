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
