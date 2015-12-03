function DurationDashboard(config) {
    var tasksDurationDashboard;
    var tasksDurationColumnChart;
    var tasksDurationScatterChart;
    var tasksDurationStatsTable;
    var tasksListTable;

    var rawData;
    var durationData;

    var initialized = false;

    this.initWidgets = function () {
        tasksDurationColumnChart = buildTasksDurationColumnChart(config.durationColumnChart);
        tasksDurationScatterChart = buildTasksDurationScatterChart(config.durationScatterChart);
        tasksDurationDashboard = buildFilteredDashboard(config, tasksDurationColumnChart, tasksDurationScatterChart, updateTable);
        tasksDurationStatsTable = buildDataTable(config.durationStats);
        tasksListTable = buildTasksListTable(config.tasksList);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        durationData = computeDurationData(data);
    };

    this.refresh = function () {
        if (durationData != null) {
            tasksDurationDashboard.draw(durationData);
            updateTable();
        }
    };

    var setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix.id).text(" - " + numberOfRows + " task" + plural);
    };

    var updateTable = function () {
        var durationChartData = tasksDurationColumnChart.getDataTable();
        var dataToDisplay = durationChartData != null ? durationChartData : durationData;

        if (dataToDisplay != null) {
            setTitleSuffix(dataToDisplay.getNumberOfRows());

            tasksListTable.setDataTable(dataToDisplay);
            tasksListTable.draw();

            tasksDurationStatsTable.setDataTable(computeDurationGroupedData(dataToDisplay, RAW_DATA_COL.EVENTS.length + 5));
            tasksDurationStatsTable.draw();
        }
    };

    this.isInitialized = function () {
        return initialized;
    };

}