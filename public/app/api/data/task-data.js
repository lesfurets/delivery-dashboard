/***************************
 *  Tasks Data From Jira
 **************************/

function jiraToTaskData(jiraData) {
    var taskData = new google.visualization.DataTable();

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

function getJiraValue(jiraData, fieldPath, fieldType){
    var jiraValue = getJsonData(jiraData, fieldPath);
    if (fieldType != DATA_DATE){
        return jiraValue;
    }
    return jiraValue == null || jiraValue == "" ? null : new Date(jiraValue+".00:00");
}

/***************************
 *  Tasks Data From Drive
 **************************/

function driveToTaskData(driveData, jiraData) {
    // Listing all reference
    var taskRefs = [];
    for (var i = 0; i < driveData.getNumberOfRows(); i++) {
        taskRefs.push(calcRefValue(driveData, i));
    }

    // Filtering Jira data
    var jiraDataMap = {};
    if(jiraData != null){
        jiraData.issues.filter(new filterOnId(taskRefs).filter).forEach(function (element) {
            jiraDataMap[element.key] = element;
        });
    }

    // Building the structure of the taskData
    var completedDataStruct = []
    completedDataStruct.push(columnBuilder('string', 'Ref', calcRefValue));
    completedDataStruct.push(jiraColumnBuilder(jiraDataMap, "Summary", ["fields", "summary"], DATA_STRING));
    RAW_DATA_COL.EVENTS.forEach(function (element) {
        completedDataStruct.push(taskColumnBuilder(element, jiraDataMap));
    });
    if(RAW_DATA_COL.FILTERS != null){
        RAW_DATA_COL.FILTERS.forEach(function (element) {
            completedDataStruct.push(taskColumnBuilder(element, jiraDataMap));
        });
    }


    var completedData = new google.visualization.DataView(driveData);
    completedData.setColumns(completedDataStruct);

    return completedData.toDataTable();
}

function calcRefValue(table, row) {
    return table.getValue(row, RAW_DATA_COL.PROJECT) + '-' + table.getValue(row, RAW_DATA_COL.REF);
}

// Get data from source defined in config drive/jira
function taskColumnBuilder(element, jiraDataMap) {
    return (typeof element.jiraField == 'undefined') ? driveColumnBuilder(element.label,element.columnIndex, element.dataType) :
        jiraColumnBuilder(jiraDataMap, element.label, element.jiraField, element.dataType);
}

// Find the related line in jira-data and extrat field
function jiraColumnBuilder(jiraDataMap, columnLabel, fields, type) {
    return columnBuilder(type, columnLabel, function (table, row) {
        var jiraValue = getJsonData(jiraDataMap[calcRefValue(table, row)], fields);
        return type == DATA_DATE ? new Date(jiraValue+".00:00") : jiraValue;
    });
}

// Find the related line in jira-data and extrat field
function driveColumnBuilder(columnLabel, column, type) {
    return columnBuilder(type, columnLabel, function (table, row) {
        return table.getValue(row,column)
    });
}

// Recursively parse json to find required field [lvl1,lvl2,...]
function getJsonData(jsonObject, fields, index) {
    index = index != null ? index : 0;
    if (jsonObject == null) {
        return "";
    }
    var fieldValue = jsonObject[fields[index]];
    if (index == fields.length - 1) {
        return typeof fieldValue !== 'undefined' ? fieldValue : "";
    } else {
        return getJsonData(fieldValue, fields, ++index)
    }
}

function filterOnId(taskRefs) {
    this.filter = function (obj) {
        return taskRefs.includes(obj.key);
    };
}