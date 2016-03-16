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
    jiraData.issues.filter(new filterOnId(taskRefs).filter).forEach(function(element) {
        jiraDataMap[element.key] = element;
    });

    // Building the structure of the taskData
    var completedDataStruct = []
    completedDataStruct.push(columnBuilder('string', 'Ref', calcRefValue));
    completedDataStruct.push(jiraColumnBuilder(jiraDataMap));
    RAW_DATA_COL.EVENTS.forEach(function(element) {
        completedDataStruct.push(element.columnIndex);
    });
    RAW_DATA_COL.FILTERS.forEach(function(element) {
        completedDataStruct.push(element.columnIndex);
    });

    var completedData = new google.visualization.DataView(driveData);
    completedData.setColumns(completedDataStruct);

    return completedData.toDataTable();
}

function calcRefValue(table, row) {
    return table.getValue(row, RAW_DATA_COL.PROJECT) + '-' + table.getValue(row, RAW_DATA_COL.REF);
}

// Find the related line in jira-data and extrat field
function jiraColumnBuilder(jiraDataMap) {
    return columnBuilder('string', 'Ref', function(table, row) {
        var issue = jiraDataMap[calcRefValue(table,row)];
        return issue != null ? issue.fields.summary : "";
    });
}

function filterOnId(taskRefs) {
    this.filter = function (obj) {
        return taskRefs.includes(obj.key);
    };
}