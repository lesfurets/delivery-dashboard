function GlobalDurationDashboard(config) {
    var tasksDurationDashboard;
    var tasksDurationColumnChart;
    var tasksDurationStatsTable;
    var tasksListTable;

    var rawData;
    var durationData;

    this.initWidgets = function () {
        tasksDurationColumnChart = buildTasksDurationColumnChart(config.durationColumnChart);
        tasksDurationDashboard = buildTasksDurationDashboard(config, tasksDurationColumnChart, updateTable);
        tasksDurationStatsTable = buildDataTable(config.durationStats);
        tasksListTable = buildTasksListTable(config.tasksList);
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

            tasksDurationStatsTable.setDataTable(computeDurationGroupedData(dataToDisplay, 11));
            tasksDurationStatsTable.draw();
        }
    };

}