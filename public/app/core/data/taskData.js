import jsonParser from "../tools/jsonParser";
import {DATA_DATE, DATA_STRING} from "../definition";
import Task from "./Task";

export const TASK_INDEX_STATIC_REFERENCE = 0;
export const TASK_INDEX_STATIC_SYMMARY = 1;
export const TASK_INDEX_STATIC_LAST = TASK_INDEX_STATIC_SYMMARY;

export const TASK_INDEX_EVENTS_FIRST = TASK_INDEX_STATIC_LAST + 1;
export const TASK_INDEX_EVENTS_LAST = TASK_INDEX_STATIC_LAST + RAW_DATA_COL.EVENTS.length;

export const TASK_INDEX_FILTER_FIRST = TASK_INDEX_EVENTS_LAST + 1;
export const TASK_INDEX_FILTER_LAST = TASK_INDEX_EVENTS_LAST + (RAW_DATA_COL.FILTERS == null ? 0 : RAW_DATA_COL.FILTERS.length);

function getJiraValue(jiraData, fieldPath, fieldType) {
    var jiraValue = jsonParser(jiraData, fieldPath);
    if (fieldType != DATA_DATE) {
        return jiraValue;
    }
    return jiraValue == null || jiraValue == "" ? null : new Date(jiraValue + ".00:00");
}

export const parseJiraJson = function (jiraData) {
    let taskList = [];
    jiraData.issues.forEach(function (issue) {
        let task = new Task(getJiraValue(issue, RAW_DATA_COL.KEY), getJiraValue(issue, RAW_DATA_COL.SUMMARY))

        RAW_DATA_COL.EVENTS.forEach((event, index) =>
            task.events.push(getJiraValue(issue, event.jiraField, event.dataType)));


        if (RAW_DATA_COL.FILTERS != null) {
            RAW_DATA_COL.FILTERS.forEach((element) =>
                task.filters.push(getJiraValue(issue, element.jiraField, element.dataType)));
        }

        for (var index = 0; index < task.events.length - 1 && task.events[index] != null && task.events[index + 1] != null; index++) {
            task.durations.push(computeDuration(task.events[index], task.events[index + 1], RAW_DATA_COL.EVENTS[index].correction));
        }

        var firstEventDate = task.events[0];
        var lastEventDate = task.events[task.events.length - 1];
        if (firstEventDate != null && lastEventDate != null) {
            task.cycleTime = computeDuration(firstEventDate, lastEventDate, 0);
        }

        taskList.push(task);
    });

    return taskList;
}

function computeDuration(startDate, endDate, correction) {
    return startDate.getWorkDaysUntil(endDate == null ? new Date() : endDate) + correction;
}

export const buildTaskTable = function (taskList) {
    var taskData = new google.visualization.DataTable();

    // Defining table structure
    taskData.addColumn(DATA_STRING, "Key");
    taskData.addColumn(DATA_STRING, "Summary");
    RAW_DATA_COL.EVENTS.forEach(function (element) {
        taskData.addColumn(element.dataType, element.label);
    });
    if (RAW_DATA_COL.FILTERS != null) {
        RAW_DATA_COL.FILTERS.forEach(function (element) {
            taskData.addColumn(element.dataType, element.label);
        });
    }

    // Adding jira data in the table
    taskList.forEach(function (task) {
        var row = [];
        row.push(task.key);
        row.push(task.summary);
        task.events.forEach((event) => row.push(event));
        task.filters.forEach((filter) => row.push(filter));
        taskData.addRow(row);
    });

    return taskData;
}

export const filterTaskData = function (inputData, expression) {
    var filteredData = new google.visualization.DataView(inputData)

    for (var index = 0; index < inputData.getNumberOfRows(); index++) {
        if (inputData.getValue(index, TASK_INDEX_STATIC_REFERENCE).indexOf(expression) == -1) {
            console.log(index);
            filteredData.hideRows([index]);
        }
    }

    return filteredData;
}

export const filterReleasedAfter = function (inputData, fromDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: TASK_INDEX_EVENTS_LAST,
        minValue: fromDate
    }]));
    return view;
}

export const filterReleasedBefore = function (inputData, toDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: TASK_INDEX_EVENTS_LAST,
        maxValue: toDate
    }]));
    return view;
}

export const filterCreatedBefore = function (inputData, toDate) {
    var view = new google.visualization.DataView(inputData);
    view.setRows(view.getFilteredRows([{
        column: TASK_INDEX_EVENTS_FIRST,
        maxValue: toDate
    }]));
    return view;
}

function columnBuilder(type, label, calc) {
    return {type: type, label: label, calc: calc};
}

function constantColumnBuilder(type, label, value) {
    return {
        type: type, label: label, calc: function () {
            return value;
        }
    };
}

function aggregatorBuilder(column, type, aggregation) {
    return {column: column, type: type, aggregation: aggregation};
}