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
        taskFilters = generateFiltersModelFromConfigOld(config.taskFilter,false);
        generateFiltersDomOld(config.taskFilter, taskFilters);
        filters = buildFiltersOld(taskFilters);

        taskChart = generateChartModelFromConfig()
        generateChartDom(config.id, taskChart);
        charts = buildSimpleCharts(taskChart);

        timeDistributionChart = buildTasksDurationScatterChart(config.durationScatterChart);

        distributionDashboard = buildFilteredDashboard(config.id, timeDistributionChart, filters, updateTable);

        tasksListTable = buildTasksListTable(config.id);

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
            setTitleSuffix(config.id, dataToDisplay.getNumberOfRows());

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

    this.isInitialized = function () {
        return initialized;
    };

}