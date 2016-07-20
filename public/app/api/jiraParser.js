import jsonParser from '../api/jsonParser'

var DATA_DATE = "date";
var DATA_STRING = "string";
var DATA_NUMBER = "number";

var FILTER_CATEGORY = "CategoryFilter";
var FILTER_DATE = "DateRangeFilter";

function completeConfig() {
    RAW_DATA_COL.EVENTS.forEach(function (element) {
        element.dataType = DATA_DATE;
        element.filterType = FILTER_DATE
    });
}

function getJiraValue(jiraData, fieldPath, fieldType){
    var jiraValue = jsonParser(jiraData, fieldPath);
    if (fieldType != DATA_DATE){
        return jiraValue;
    }
    return jiraValue == null || jiraValue == "" ? null : new Date(jiraValue+".00:00");
}

export default function(jiraData) {
    var taskData = new google.visualization.DataTable();
    completeConfig();

    // Defining table structure
    taskData.addColumn(DATA_STRING, "Key");
    taskData.addColumn(DATA_STRING, "Summary");
    RAW_DATA_COL.EVENTS.forEach(function (element) {
        taskData.addColumn(element.dataType, element.label);
    });
    if(RAW_DATA_COL.FILTERS != null){
        RAW_DATA_COL.FILTERS.forEach(function (element) {
            taskData.addColumn(element.dataType, element.label);
        });
    }

    // Adding jira data in the table
    jiraData.issues.forEach(function (issue) {
        var row =[];
        row.push(getJiraValue(issue, RAW_DATA_COL.KEY));
        row.push(getJiraValue(issue, RAW_DATA_COL.SUMMARY));
        RAW_DATA_COL.EVENTS.forEach(function (element) {
            row.push(getJiraValue(issue, element.jiraField, element.dataType));
        });
        if(RAW_DATA_COL.FILTERS != null){
            RAW_DATA_COL.FILTERS.forEach(function (element) {
                row.push(getJiraValue(issue, element.jiraField, element.dataType));
            });
        }
        taskData.addRow(row);
    });

    return taskData;
}