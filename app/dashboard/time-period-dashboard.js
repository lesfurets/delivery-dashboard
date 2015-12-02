function TimePeriodDashboard(config) {
    var cumulativeFlowGraph;
    var durationStatsTable;
    var tasksListTable;

    var rawData;

    this.initWidgets = function () {
        cumulativeFlowGraph = buildTimePeriodDashboard(config);
        durationStatsTable = buildDataTable(config.durationStats);
        tasksListTable = buildTasksListTable(config.tasksList);
    };

    this.loadData = function (data) {
        rawData = filterLastMonth(data, config.date.start);
    };

    this.refresh = function () {
        if (rawData != null) {
            setTitleSuffix(rawData.getNumberOfRows());

            cumulativeFlowGraph.setDataTable(computeEventData(rawData));
            cumulativeFlowGraph.draw();

            durationStatsTable.setDataTable(computeDurationGroupedData(computeDurationData(rawData), RAW_DATA_COL.EVENTS.length + 6));
            durationStatsTable.draw();

            tasksListTable.setDataTable(rawData)
            tasksListTable.draw();
        }
    };

    var setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix.id).text(" - " + config.titleSuffix.value + " - " + numberOfRows + " task" + plural);
    };

}