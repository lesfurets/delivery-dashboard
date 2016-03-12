function initApp() {
    parseUrl()
    currentDashboards.forEach(function (element) {
        element.initWidgets();
    })
    loadRawData(currentDashboards);
}

function loadRawData(dataConsumer) {
    var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/" + RAW_DATA_URL + "/gviz/tq?sheet=RawData&headers=1");
    var handler = new QueryResponseHandler(dataConsumer);
    query.send(handler.handleResponse);
}

// Completing spreadsheed data with jira if possible
function QueryResponseHandler(dataConsumer) {
    this.handleResponse = function (response) {
        var inputData = response.getDataTable();

        if(typeof JIRA_DATA !== 'undefined'){
            //http://jira.lan.courtanet.net/rest/api/2/search?jql=Workstream=Traffic&fields=id,key,summary&startAt=0&maxResults=5000
            $.getJSON("../resources/"+JIRA_DATA, function (data) {
                var completedData = new google.visualization.DataView(inputData);
                var completedDataStruct = Array.apply(null, {length: inputData.getNumberOfColumns()}).map(Number.call, Number);
                completedDataStruct.push(createJiraColumn(data));
                completedData.setColumns(completedDataStruct);

                setUpCustomers(dataConsumer, completedData);
            });
        } else {
            setUpCustomers(dataConsumer, inputData);
        }
    }
}

// Dispatch data to all dashboards
function setUpCustomers(dataConsumer, dataWithStatistics) {
    dataConsumer.forEach(function (consumer) {
        consumer.loadData(dataWithStatistics);
        consumer.refresh();
    });

    window.onresize = function () {
        dataConsumer.forEach(function (consumer) {
            consumer.refresh();
        });
    };
}

// Manage tab changes, load if required the target tab and load data
$(document).on('ready', function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab

        currentDashboards = [];
        for (var index = 0; index < allDashboards.length; index++) {
            var dashboard = allDashboards[index];
            if (target == dashboard.tab) {
                if (!dashboard.controller.isInitialized()) {
                    dashboard.controller.initWidgets();
                }
                currentDashboards.push(dashboard.controller);
            }
        }
        loadRawData(currentDashboards);
    });
});

// Find the related line in jira-data and extrat field
function createJiraColumn(data) {
    return {
        type: 'string', label: "Summary",
        calc: function (table, row) {
            var jiraRef = table.getValue(row, RAW_DATA_COL.PROJECT) + '-' + table.getValue(row, RAW_DATA_COL.REF);
            var issue = data.issues.filter(new FilterOnId(jiraRef).filter)[0];
            return issue != null ? issue.fields.summary : "";
        }
    };
}

function FilterOnId(taskkey) {
    this.filter = function (obj) {
        return obj.key == taskkey;
    };
}