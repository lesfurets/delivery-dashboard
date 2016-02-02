google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});
var containerToLoad = 0;
google.setOnLoadCallback(function () {
    containerToLoad = $(".element-container").size();
    $(".element-container").each(function (index) {
        $(this).load($(this).attr("element"));
    });
});

var allDashboards = [];
var currentDashboards = [];

function registerDashboard(tabId,dashboard,isDefault){
    allDashboards.push({ tab:tabId , controller: dashboard});
    if(isDefault) {
        currentDashboards.push(dashboard);
    }
    containerToLoad--;
    if(containerToLoad == 0){
        initApp()
    }
}

function initApp() {
    currentDashboards.forEach(function (element) { element.initWidgets(); })
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

        dataConsumer.forEach(function (consumer) { consumer.loadData(inputData); });

        var drawCharts = function () {
            dataConsumer.forEach(function (consumer) { consumer.refresh(); });
        };

        drawCharts();
        window.onresize = drawCharts;
    }
}

$(document).on('ready', function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href") // activated tab

        currentDashboards = [];
        for (var index = 0; index < allDashboards.length; index++) {
            var dashboard = allDashboards[index];
            if(target == dashboard.tab){
                if(!dashboard.controller.isInitialized()){
                    dashboard.controller.initWidgets();
                }
                currentDashboards.push(dashboard.controller);
            }
        }
        loadRawData(currentDashboards);
    });
});

