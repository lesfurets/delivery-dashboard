function GlobalCumulativeDashboard(config) {
    var cumulativFlowDashboard;
    var tasksListTable;

    var rawData;
    var eventData;

    this.initWidgets = function () {
        cumulativFlowDashboard = buildCumulativFlowDashboard(config);
        tasksListTable = buildTasksListTable(config.tasksList);
    };

    this.loadData = function (data) {
        rawData = data;
        eventData = eventData = computeEventData(data);
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
        $("#" + config.titleSuffix.id).text(" - " + numberOfRows + " task" + plural);
    };


}