/***************************
 *  Tasks Data
 **************************/

var TASK_INDEX_STATIC_REFERENCE = 0;
var TASK_INDEX_STATIC_SYMMARY = 1;
var TASK_INDEX_STATIC_LAST = TASK_INDEX_STATIC_SYMMARY;

var TASK_INDEX_EVENTS_FIRST = TASK_INDEX_STATIC_LAST + 1;
var TASK_INDEX_EVENTS_LAST = TASK_INDEX_EVENTS_FIRST + RAW_DATA_COL.EVENTS.length;

var TASK_INDEX_FILTER_FIRST = TASK_INDEX_EVENTS_LAST + 1;
var TASK_INDEX_FILTER_LAST = TASK_INDEX_FILTER_FIRST + (RAW_DATA_COL.FILTERS == null ? 0 : RAW_DATA_COL.FILTERS.length);

function computeTaskData(driveData, jiraData) {
    // Listing all reference
    var taskRefs = [];
    for (var i = 0; i < driveData.getNumberOfRows(); i++) {
        taskRefs.push(driveData.getValue(i, RAW_DATA_COL.PROJECT) + '-' + driveData.getValue(i, RAW_DATA_COL.REF));
    }

    // Filtering Jira data
    var jiraDataMap = {};
    jiraData.issues.filter(new filterOnId(taskRefs).filter).forEach(function(element) {
        jiraDataMap[element.key] = element;
    });

    // Building the structure of the taskData
    var completedDataStruct = []
    completedDataStruct.push(refColumnBuilder());
    completedDataStruct.push(jiraColumnBuilder(jiraDataMap));
    RAW_DATA_COL.EVENTS.forEach(function(element) {
        completedDataStruct.push(element.columnIndex);
    });
    RAW_DATA_COL.FILTERS.forEach(function(element) {
        completedDataStruct.push(element.columnIndex);
    });

    var completedData = new google.visualization.DataView(driveData);
    completedData.setColumns(completedDataStruct);

    return completedData;
}

function refColumnBuilder() {
    return {
        type: 'string', label: "Summary",
        calc: function (table, row) {
            return table.getValue(row, RAW_DATA_COL.PROJECT) + '-' + table.getValue(row, RAW_DATA_COL.REF);
        }
    };
}

// Find the related line in jira-data and extrat field
function jiraColumnBuilder(jiraDataMap) {
    return {
        type: 'string', label: "Summary",
        calc: function (table, row) {
            var jiraRef = table.getValue(row, RAW_DATA_COL.PROJECT) + '-' + table.getValue(row, RAW_DATA_COL.REF);
            var issue = jiraDataMap[jiraRef];
            return issue != null ? issue.fields.summary : "";
        }
    };
}

function filterOnId(taskRefs) {
    this.filter = function (obj) {
        return taskRefs.includes(obj.key);
    };
}