import jsonParser from '../api/jsonParser'

let RAW_DATA_COL = {
    KEY: ["key"],
    SUMMARY: ["fields", "summary"],
    EVENTS: [
        {jiraField: ["fields", "customfield_11729"], label: 'Backlog', correction: -1},
        {jiraField: ["fields", "customfield_11730"], label: 'Analysis', correction: -0.5},
        {jiraField: ["fields", "customfield_11731"], label: 'Development', correction: -0.5},
        {jiraField: ["fields", "customfield_11732"], label: 'Ready To Release', correction: -1},
        {jiraField: ["fields", "fixVersions", 0, "releaseDate"], label: 'Released', correction: -1}
    ],
    FILTERS: [
        {jiraField: ["fields", "issuetype", "name"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Type'},
        {jiraField: ["fields", "customfield_10621","value"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Effort'},
        {jiraField: ["fields", "customfield_11010","value"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Value'},
        {jiraField: ["fields", "project","key"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Project'},
        {jiraField: ["fields", "customfield_11729"], dataType: "date", filterType: 'DateRangeFilter', label: 'Creation'},
        {jiraField: ["fields", "fixVersions", 0, "releaseDate"], dataType: "date", filterType: 'DateRangeFilter', label: 'Release'},
        {jiraField: ["fields", "fixVersions", 0, "name"], dataType: "string" , filterType: 'CategoryFilter', label: 'Version'},
        {jiraField: ["fields", "assignee", "key"], dataType: "string" , filterType: 'CategoryFilter', label: 'Assignee'}
    ]
};


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