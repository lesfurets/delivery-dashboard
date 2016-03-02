function CumulativeDashboard(config) {
    var cumulativFlowDashboard;
    var tasksListTable;

    var rawData;
    var eventData;

    var initialized = false;

    this.initWidgets = function () {
        cumulativFlowDashboard = buildCumulativFlowDashboard(config);
        tasksListTable = buildTasksListTable(config.tasksList);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        eventData = computeEventData(data);
    };

    this.refresh = function () {
        if (eventData != null) {
            setTitleSuffix(rawData.getNumberOfRows());

            cumulativFlowDashboard.draw(eventData);

            tasksListTable.setDataTable(rawData)
            tasksListTable.draw();
        }
    };

    var setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix).text(" - " + numberOfRows + " task" + plural);
    };

    this.isInitialized = function () {
        return initialized;
    };

}