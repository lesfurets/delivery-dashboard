import jsonParser from "../tools/jsonParser";
import {DATA_DATE, DATA_STRING} from "../definition";
import Task from "./Task";

export const TASK_INDEX_STATIC_REFERENCE = 0;
export const TASK_INDEX_STATIC_SYMMARY = 1;
export const TASK_INDEX_STATIC_LAST = TASK_INDEX_STATIC_SYMMARY;

export const TASK_INDEX_EVENTS_LAST = TASK_INDEX_STATIC_LAST + RAW_DATA_COL.EVENTS.length;

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

export const csvExport = (tasks) => {
  var csvContent = "data:text/csv;charset=utf-8,";

  let headerCsv = "\"Key\",\"Summary\",\"";
  headerCsv += RAW_DATA_COL.EVENTS.map((element) => element.label).join("\",\"") + "\",\"";
  headerCsv += RAW_DATA_COL.FILTERS.map((element) => element.label).join("\",\"") + "\"\n";

  console.log(headerCsv);

  csvContent += headerCsv;

  tasks.forEach(function (task, index) {
    let taskCsv = "\"" + task.key + "\",\"" + task.summary + "\",\"";
    taskCsv += task.events.map(event => event instanceof Date ? event.formatYYYYMMDD() : "").join("\",\"") + "\",\"";
    taskCsv += task.filters.map(filter => filter instanceof Date ? filter.formatYYYYMMDD() : filter).join("\",\"");
    csvContent += index < tasks.length ? taskCsv + "\"\n" : taskCsv + "\"";
  });

  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}