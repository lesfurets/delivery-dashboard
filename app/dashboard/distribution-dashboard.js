function DistributionDashboard(config) {
    var timeDistributionChart
    var distributionDashboard;
    var tasksListTable;
    var taskFilters;
    var filters;
    var taskChart;
    var charts;

    var rawData;
    var distributionData;

    var initialized = false;

    this.initWidgets = function () {
        taskFilters = generateFiltersModelFromConfig(config.taskFilter,false);
        generateFiltersDom(config.taskFilter, taskFilters);
        filters = buildFilters(taskFilters);

        taskChart = generateChartModelFromConfig()
        generateChartDom(config.dashboardPrefix, taskChart);
        charts = buildSimpleCharts(taskChart);

        timeDistributionChart = buildTasksDurationScatterChart(config.durationScatterChart);

        distributionDashboard = buildFilteredDashboard(config, timeDistributionChart, filters, updateTable);

        tasksListTable = buildTasksListTable(config.dashboardPrefix + '_tasks_list');

        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        distributionData = computeDistributionData(data);
    };

    this.refresh = function () {
        if (distributionData != null) {
            distributionDashboard.draw(distributionData);
            updateTable();
        }
    };

    var updateTable = function () {
        var durationChartData = timeDistributionChart.getDataTable();
        var dataToDisplay = durationChartData != null ? durationChartData : distributionData;

        if (dataToDisplay != null) {
            setTitleSuffix(dataToDisplay.getNumberOfRows());


            for(var i=0; i< charts.length; i++){
                var group = google.visualization.data.group(dataToDisplay, [taskChart[i].columnIndex], [{
                    column: 1,
                    aggregation: google.visualization.data.count,
                    'type': 'number'
                }]);

                charts[i].setDataTable(group);
                charts[i].draw();
            }

            tasksListTable.setDataTable(dataToDisplay)
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