/***************************
 *  Event Data
 **************************/

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

