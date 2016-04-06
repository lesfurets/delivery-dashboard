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
    if (typeof JIRA_DATA != null) {
        var jiraUrl = "/rest/api/2/search?jql=" + JIRA_DATA.jql + "&fields=" + JIRA_DATA.fields + "&startAt=0&maxResults=5000";
        $.getJSON(jiraUrl, function (jiraData) {
            setUpConsumer(dataConsumer, jiraToTaskData(jiraData));
        });
    } else {
        var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/" + RAW_DATA_URL + "/gviz/tq?sheet=RawData&headers=1");
        var handler = new DriveResponseHandler(dataConsumer);
        query.send(handler.handleResponse);
    }
}

// building data with jira
function DriveResponseHandler(dataConsumer) {
    this.handleResponse = function (response) {
        var driveData = response.getDataTable();

        if (typeof JIRA_DATA != null) {
            var jiraUrl = "/rest/api/2/search?jql=" + JIRA_DATA.jql + "&fields=" + JIRA_DATA.fields + "&startAt=0&maxResults=5000";
            $.getJSON(jiraUrl, function (jiraData) {
                setUpConsumer(dataConsumer, driveToTaskData(driveData, jiraData));
            });
        } else {
            setUpConsumer(dataConsumer, driveToTaskData(driveData));
        }
    }
}

// Completing spreadsheed data with jira if possible
function DriveResponseHandler(dataConsumer) {
    this.handleResponse = function (response) {
        var driveData = response.getDataTable();

        if (typeof JIRA_DATA != null) {
            var jiraUrl = "/rest/api/2/search?jql=" + JIRA_DATA.jql + "&fields=" + JIRA_DATA.fields + "&startAt=0&maxResults=5000";
            $.getJSON(jiraUrl, function (jiraData) {
                setUpConsumer(dataConsumer, driveToTaskData(driveData, jiraData));
            });
        } else {
            setUpConsumer(dataConsumer, driveToTaskData(driveData));
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