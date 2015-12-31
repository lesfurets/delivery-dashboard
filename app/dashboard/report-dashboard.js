function ReportDashboard(config) {
    var cumulativeFlowGraph;
    var durationStatsTable;
    var tasksListTable;

    var rawData;

    var initialized = false;

    this.initWidgets = function () {
        cumulativeFlowGraph = buildTimePeriodDashboard(config);
        durationStatsTable = buildDataTable(config.durationStats);
        tasksListTable = buildTasksListTable(config.tasksList);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = filterLastMonth(data, config.date.start);
    };

    this.refresh = function () {
        if (rawData != null) {
            setTitleSuffix(rawData.getNumberOfRows());

            cumulativeFlowGraph.setDataTable(computeEventData(rawData));
            cumulativeFlowGraph.draw();

            durationStatsTable.setDataTable(computeDurationGroupedData(computeDurationData(rawData), DURATION_DATA_FILTER_OFFSET));
            durationStatsTable.draw();

            tasksListTable.setDataTable(rawData)
            tasksListTable.draw();
        }
    };

    var setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix.id).text(" - " + config.titleSuffix.value + " - " + numberOfRows + " task" + plural);
    };

    this.isInitialized = function () {
        return initialized;
    };

}