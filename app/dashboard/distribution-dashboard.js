function DistributionDashboard(viewId) {
    var timeDistributionChart
    var distributionDashboard;
    var tasksListTable;
    var taskChart;
    var charts;

    var rawData;
    var distributionData;

    var initialized = false;

    registerDashboard(viewId, this);

    this.initWidgets = function () {
        var taskFilters = generateFiltersModelFromConfig(DISTRIBUTION_INDEX_FILTER_FIRST);
        taskChart = generateChartModelFromConfig()

        generateDashboardElementsDom(viewId, [ID_FILTERS, ID_SCATTER_CHART]);
        generateFiltersDom(viewId, taskFilters);
        generateChartDom(viewId, taskChart);
        generateTaskListDom(viewId);

        charts = buildSimpleCharts(viewId, taskChart);
        timeDistributionChart = buildTasksDurationScatterChart(viewId ,[DISTRIBUTION_INDEX_STATIC_EVENT_LAST, DISTRIBUTION_INDEX_STATIC_COUNT]);
        distributionDashboard = buildFilteredDashboard(viewId, timeDistributionChart, buildFilters(viewId, taskFilters), updateTable);
        tasksListTable = buildTasksListTable(viewId);

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
            setTitleSuffix(viewId, dataToDisplay.getNumberOfRows());

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