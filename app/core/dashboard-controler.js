function initApp() {
    parseUrl()
    currentDashboards.forEach(function (element) {
        if (!element.isInitialized()) {
            element.initWidgets();
        }
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
        var driveData = response.getDataTable();

        if(typeof JIRA_DATA !== 'undefined'){
            //http://jira.lan.courtanet.net/rest/api/2/search?jql=Workstream=Traffic&fields=id,key,summary&startAt=0&maxResults=5000
            $.getJSON("../resources/"+JIRA_DATA, function (jiraData) {
                setUpConsumer(dataConsumer, computeTaskData(driveData, jiraData));
            });
        } else {
            setUpConsumer(dataConsumer, computeTaskData(driveData));
        }
    }
}

// Dispatch data to all dashboards
function setUpConsumer(dataConsumer, dataWithStatistics) {
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