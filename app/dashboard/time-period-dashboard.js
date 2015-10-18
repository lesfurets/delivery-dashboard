function TimePeriodDashboard(config) {
    var cumulativeFlowGraph;
    var durationStatsTable;
    var tasksListTable;

    var rawData;
    var durationStats;

    this.initWidgets = function () {
        cumulativeFlowGraph = buildTimePeriodDashboard(config);
        durationStatsTable = buildDataTable(config.durationStats);
        tasksListTable = buildTasksListTable(config.tasksList);
    };

    this.loadData = function (data) {
        rawData = filterLastMonth(data, config.date.start);
        durationStats = computeDurationGroupedData(computeDurationData(data), 1);
    };

    this.refresh = function () {
        if (rawData != null) {
            setTitleSuffix(rawData.getNumberOfRows());

            cumulativeFlowGraph.setDataTable(computeEventData(rawData));
            cumulativeFlowGraph.draw();

            durationStatsTable.setDataTable(computeDurationGroupedData(computeDurationData(rawData), 0));
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