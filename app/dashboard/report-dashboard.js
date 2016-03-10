function ReportDashboard(config) {
    var cumulativeFlowGraph;
    var durationStatsTable;
    var tasksListTable;

    var rawDara;
    var filteredData;

    var initialized = false;

    var startDate = config.date.start;
    var endDate = config.date.end;
    var reduceColumn = DURATION_INDEX_FILTER_FIRST + REPORT_CONFIG.projection[0].position;


    this.initWidgets = function () {
        if(config.selector == CONFIG_MONTH_SELECTOR) {
            generateMonthSelectorDom(config.id, this)
        }
        if(config.selector == CONFIG_PERIOD_SELECTOR) {
            generatePeriodSelectorDom(config.id, this)
        }
        generateToggleFilter(config.id, this);
        generateTaskListDom(config.id);

        cumulativeFlowGraph = buildTimePeriodDashboard(config.id, config.date.start, config.date.end);
        durationStatsTable = buildDataTable(config.id + ID_DURATION_STATS);
        tasksListTable = buildTasksListTable(config.id);
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
            setTitleSuffix(config.id, filteredData.getNumberOfRows());

            cumulativeFlowGraph.setDataTable(computeEventData(filteredData));
            cumulativeFlowGraph.draw();

            durationStatsTable.setDataTable(groupDurationDataBy(computeDurationData(filterReleasedAfter(filteredData, endDate)), reduceColumn));
            durationStatsTable.draw();

            tasksListTable.setDataTable(filteredData)
            tasksListTable.draw();
        }
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