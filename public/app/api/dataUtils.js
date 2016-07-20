function filterReleasedBefore(inputData, fromDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: TASK_INDEX_EVENTS_LAST,
        minValue: fromDate
    }]));
    return view;
}

function filterReleasedAfter(inputData, toDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: TASK_INDEX_EVENTS_LAST,
        maxValue: toDate
    }]));
    return view;
}

function filterCreatedAfter(inputData, toDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: TASK_INDEX_EVENTS_FIRST,
        maxValue: toDate
    }]));
    return view;
}

export const columnBuilder = function(type, label, calc) {
    return {type: type, label: label, calc: calc};
}

export const constantColumnBuilder = function(type, label, value) {
    return {
        type: type, label: label, calc: function () {
            return value;
        }
    };
}

export const aggregatorBuilder = function(column, type, aggregation) {
    return {column: column, type: type, aggregation: aggregation};
}
