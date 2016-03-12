/***************************
 *  Distribution Data
 **************************/

var DISTRIBUTION_INDEX_STATIC_REF = 0;
var DISTRIBUTION_INDEX_STATIC_COUNT = 2;
var DISTRIBUTION_INDEX_STATIC_EVENT_LAST = 3;
var DISTRIBUTION_INDEX_STATIC_LAST = DISTRIBUTION_INDEX_STATIC_EVENT_LAST;

var DISTRIBUTION_INDEX_FILTER_FIRST = DISTRIBUTION_INDEX_STATIC_LAST + 1;
var DISTRIBUTION_INDEX_FILTER_LAST = DISTRIBUTION_INDEX_STATIC_LAST + (RAW_DATA_COL.FILTERS == null ? 0 : RAW_DATA_COL.FILTERS.length);

function computeDistributionData(inputData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Jira Ref');
    data.addColumn({type: 'string', role: 'tooltip'}, 'Tooltip');
    data.addColumn('number', "");
    data.addColumn('date', inputData.getColumnLabel(RAW_DATA_COL.EVENTS[RAW_DATA_COL.EVENTS.length - 1].columnIndex));
    if (RAW_DATA_COL.FILTERS != null) {
        RAW_DATA_COL.FILTERS.forEach(function (filter) {
            data.addColumn(inputData.getColumnType(filter.columnIndex), inputData.getColumnLabel(filter.columnIndex));
        });
    }

    // Parsing events data to compute distribution data
    for (var i = 0; i < inputData.getNumberOfRows(); i++) {
        var row = [];
        row.push(inputData.getValue(i, RAW_DATA_COL.PROJECT) + '-' + inputData.getValue(i, RAW_DATA_COL.REF));
        row.push(inputData.getValue(i, RAW_DATA_COL.PROJECT) + '-' + inputData.getValue(i, RAW_DATA_COL.REF));
        row.push(0);
        row.push(inputData.getValue(i, RAW_DATA_COL.EVENTS[RAW_DATA_COL.EVENTS.length - 1].columnIndex));
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

