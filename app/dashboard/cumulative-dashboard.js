function CumulativeDashboard(config) {
    var cumulativeFlowDashboard;
    var tasksListTable;

    var rawData;
    var eventData;

    var initialized = false;

    this.initWidgets = function () {
        cumulativeFlowDashboard = buildCumulativFlowDashboard(config);
        tasksListTable = buildTasksListTable(config.tasksList);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        eventData = computeEventData(data);
    };

    this.refresh = function () {
        if (eventData != null) {
            setTitleSuffix(config.id, rawData.getNumberOfRows());

            cumulativeFlowDashboard.draw(eventData);

            tasksListTable.setDataTable(rawData)
            tasksListTable.draw();
        }
    };

    this.isInitialized = function () {
        return initialized;
    };

}