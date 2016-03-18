/***************************
 *  Tasks Data
 **************************/

function computeTaskData(driveData, jiraData) {
    // Listing all reference
    var taskRefs = [];
    for (var i = 0; i < driveData.getNumberOfRows(); i++) {
        taskRefs.push(driveData.getValue(i, RAW_DATA_COL.PROJECT) + '-' + driveData.getValue(i, RAW_DATA_COL.REF));
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
    completedDataStruct.push(jiraColumnBuilder(jiraDataMap, "Summary", ["fields", "summary"]));
    RAW_DATA_COL.EVENTS.forEach(function (element) {
        completedDataStruct.push(taskDateColumnBuilder(element, jiraDataMap));
    });
    if(RAW_DATA_COL.FILTERS != null){
        RAW_DATA_COL.FILTERS.forEach(function (element) {
            completedDataStruct.push(taskColumnBuilder(element, jiraDataMap));
        });
    }

    var completedData = new google.visualization.DataView(driveData);
    completedData.setColumns(completedDataStruct);

    var colpleteDataTable = completedData.toDataTable();

    //var formatter_short = new google.visualization.DateFormat({formatType: 'short'});
    //formatter_short.format(colpleteDataTable, 15);

    return colpleteDataTable;
}

function calcRefValue(table, row) {
    return table.getValue(row, RAW_DATA_COL.PROJECT) + '-' + table.getValue(row, RAW_DATA_COL.REF);
}

// Find the related line in jira-data and extrat field
function jiraColumnBuilder(jiraDataMap, columnLabel, fields) {
    return columnBuilder('string', columnLabel, function (table, row) {
        return getJsonData(jiraDataMap[calcRefValue(table, row)], fields);
    });
}

// Find the related line in jira-data and extrat field
function jiraDateColumnBuilder(jiraDataMap, columnLabel, fields) {
    return columnBuilder('date', columnLabel, function (table, row) {
        return new Date(getJsonData(jiraDataMap[calcRefValue(table, row)], fields));
    });
}

function taskDateColumnBuilder(element, jiraDataMap) {
    var column;
    if (typeof element.jiraField != 'undefined') {
        column = jiraDateColumnBuilder(jiraDataMap, element.label, element.jiraField);
    } else {
        column = element.columnIndex;
    }
    return column;
}

function taskColumnBuilder(element, jiraDataMap) {
    var column;
    if (typeof element.jiraField != 'undefined') {
        if (element.filterType == 'DateRangeFilter') {
            column = jiraDateColumnBuilder(jiraDataMap, element.label, element.jiraField);
        } else {
            column = jiraColumnBuilder(jiraDataMap, element.label, element.jiraField);
        }
    } else {
        column = element.columnIndex;
    }
    return column;
}

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