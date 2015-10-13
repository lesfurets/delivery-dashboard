function GlobalDurationDashboard() {
    var tasksDurationDashboard;
    var tasksDurationColumnChart;
    var tasksDurationStatsTable;

    var rawData;
    var durationData;

    this.initWidgets = function () {
        tasksDurationStatsTable = buildTasksDurationTable();
        tasksDurationColumnChart = buildTasksDurationColumnChart();
        tasksDurationDashboard = buildTasksDurationDashboard(tasksDurationColumnChart, updateTable);
    };

    this.loadData = function (data) {
        rawData = data;
        durationData = computeDurationData(data);
    };

    this.refresh = function () {
        if (durationData != null) {
            tasksDurationDashboard.draw(durationData);
            updateTableWithData(durationData);
        }
    };

    updateTable = function () {
        updateTableWithData(tasksDurationColumnChart.getDataTable())
    };

    updateTableWithData = function (inputData) {
        tasksDurationStatsTable.setDataTable(computeDurationGroupedData(inputData, 10));
        tasksDurationStatsTable.draw();
    };

}