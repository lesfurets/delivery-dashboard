function ReportDashboard(config) {
    var cumulativeFlowGraph;
    var durationStatsTable;
    var tasksListTable;

    var rawDara;
    var filteredData;

    var initialized = false;

    var startDate = config.date.start;
    var endDate = config.date.end;
    var reduceColumn = DURATION_DATA_FILTER_OFFSET;

    this.initWidgets = function () {
        cumulativeFlowGraph = buildTimePeriodDashboard(config);
        durationStatsTable = buildDataTable(config.durationStats);
        tasksListTable = buildTasksListTable(config.tasksList);
        initialized = true;
    };

    this.loadData = function (data) {
        rawDara = data;
        this.filterData();
    };

    this.filterData = function () {
        filteredData = filterCreatedAfter(filterReleasedBefore(rawDara, startDate), endDate);
    };

    this.refresh = function () {
        if (filteredData != null) {
            setTitleSuffix(filteredData.getNumberOfRows());

            cumulativeFlowGraph.setDataTable(computeEventData(filteredData));
            cumulativeFlowGraph.draw();

            durationStatsTable.setDataTable(computeDurationGroupedData(computeDurationData(filterReleasedAfter(filteredData, endDate)), reduceColumn));
            durationStatsTable.draw();

            tasksListTable.setDataTable(filteredData)
            tasksListTable.draw();
        }
    };

    var setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix.id).text(" - " + numberOfRows + " task" + plural);
    };

    this.isInitialized = function () {
        return initialized;
    };

    this.resetDates = function (firstDay, lastDate) {
        startDate = firstDay;
        endDate = lastDate;
        limitDashboardPeriod(cumulativeFlowGraph, startDate, endDate);
        this.filterData();
        this.refresh();
    }

    this.resetReduce = function (column) {
        reduceColumn = column;
        this.refresh();
    }

}