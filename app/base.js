google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});

var globalCumulativeDashboard = new GlobalCumulativeDashboard(globalCumulativeFlowDashboardConfig);
var globalDurationDashboard = new GlobalDurationDashboard(globalDurationDashboardConfig);
var lastMonthDashboard = new TimePeriodDashboard(lastMonthDashboardConfig);
var currentMonthDashboard = new TimePeriodDashboard(currentMonthDashboardConfig);

var allDashboard = [globalCumulativeDashboard, globalDurationDashboard, lastMonthDashboard, currentMonthDashboard];
var currentDashboards = [];

google.setOnLoadCallback(initApp);

function initApp() {
    for (var i = 0; i < allDashboard.length; i++) {
        allDashboard[i].initWidgets();
    }
    loadRawData([globalCumulativeDashboard, globalDurationDashboard]);
}

function reloadRawData() {
    loadRawData(currentDashboards);
}

function loadRawData(dataConsumer) {
    var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/" + RAW_DATA_URL + "/gviz/tq?sheet=RawData&headers=1");
    var handler = new QueryResponseHandler(dataConsumer);
    query.send(handler.handleResponse);
}

function QueryResponseHandler(dataConsumer) {
    this.handleResponse = function (response) {
        var inputData = response.getDataTable();

        for (var i = 0; i < dataConsumer.length; i++) {
            dataConsumer[i].loadData(inputData);
        }

        var drawCharts = function () {
            currentDashboards = dataConsumer;
            for (var i = 0; i < dataConsumer.length; i++) {
                dataConsumer[i].refresh();
            }
        };

        drawCharts();
        window.onresize = drawCharts;
    }
}

$(document).on('ready', function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab
        if (target == "#tab-global-view") {
            loadRawData([globalCumulativeDashboard, globalDurationDashboard]);
        }
        else if (target == "#tab_last_month_view") {
            loadRawData([lastMonthDashboard]);
        }
        else if (target == "#tab_current_month_view") {
            loadRawData([currentMonthDashboard]);
        }
        else if (target == "#tab_tasks_manager") {
            currentDashboards = [];
            var iframe = $('iframe');
            if (iframe.attr('src') == "") {
                iframe.attr('src', function () {
                    return 'https://docs.google.com/spreadsheets/d/' + RAW_DATA_URL + '/edit?usp=sharing&single=true&gid=0&range=A1%3AE4&output=html';
                });
            }
        }
    });
});

