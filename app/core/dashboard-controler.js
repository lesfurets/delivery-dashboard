function initApp() {
    currentDashboards.forEach(function (element) {
        element.initWidgets();
    })
    loadRawData(currentDashboards);
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

        dataConsumer.forEach(function (consumer) {
            consumer.loadData(inputData);
            consumer.refresh();
        });

        drawCharts();
        window.onresize = function () {
            dataConsumer.forEach(function (consumer) {
                consumer.refresh();
            });
        };
    }
}

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