function DurationDashboard(viewId) {
    var tasksDurationDashboard;
    var tasksDurationColumnChart;
    var tasksDurationScatterChart;
    var tasksDurationStatsTable;
    var tasksListTable;

    var rawData;
    var durationData;

    var initialized = false;

    registerDashboard('#' + viewId, this);

    this.initWidgets = function () {
        var filtersConfig = generateFiltersModelFromConfig(DURATION_INDEX_FILTER_FIRST);
        filtersConfig.unshift({
            id:  "_max_cycle_time",
            filterType: 'NumberRangeFilter',
            columnIndex: DURATION_INDEX_DURATION_CYCLE_TIME
        });

        generateTaskListDom(viewId);
        generateDashboardElementsDom(viewId, [ID_FILTERS, ID_DURATION_STATS, ID_COLUMN_CHART, ID_SCATTER_CHART]);
        generateFiltersDom(viewId, filtersConfig);

        // Defining columns that should be displayed on Bar Chart depending on Events in Config (duration Nb = events
        // Nb -1)
        var durationsColumns = [2];
        for (var i = 0; i < RAW_DATA_COL.EVENTS.length - 1; i++) {
            durationsColumns.push(DURATION_INDEX_DURATION_FIRST + i);
        }
        tasksDurationColumnChart = buildTasksDurationColumnChart(viewId, durationsColumns);
        tasksDurationScatterChart = buildTasksDurationScatterChart(viewId, [DURATION_INDEX_STATIC_LAST, DURATION_INDEX_DURATION_LAST, DURATION_INDEX_STATITICS_AVERAGE, DURATION_INDEX_STATITICS_50PCT, DURATION_INDEX_STATITICS_90PCT]);
        tasksDurationDashboard = buildFilteredDashboard(viewId, tasksDurationColumnChart, buildFilters(viewId, filtersConfig), updateTable);
        tasksDurationStatsTable = buildDurationStatsTable(viewId);
        tasksListTable = buildTasksListTable(viewId);
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

    var updateTable = function () {
        var durationChartData = tasksDurationColumnChart.getDataTable();
        var dataToDisplay = durationChartData != null ? durationChartData : durationData;

        if (dataToDisplay != null) {
            setTitleSuffix(viewId, dataToDisplay.getNumberOfRows());

            tasksDurationScatterChart.setDataTable(computeDurationStats(dataToDisplay));
            tasksDurationScatterChart.draw();

            tasksListTable.setDataTable(dataToDisplay);
            tasksListTable.draw();

            tasksDurationStatsTable.setDataTable(groupDurationDataBy(dataToDisplay, DURATION_INDEX_STATIC_GROUP_ALL));
            tasksDurationStatsTable.draw();
        }
    };

    this.isInitialized = function () {
        return initialized;
    };

}