function ReportDashboard(config) {
    var cumulativeFlowGraph;
    var durationStatsTable;
    var tasksListTable;

    var rawData;
    var filteredData;

    var initialized = false;

    var startDate;
    var endDate;
    var reduceColumn = DURATION_INDEX_FILTER_FIRST + REPORT_CONFIG.projection[0].position;

    registerDashboard(config.id, this);

    this.initWidgets = function () {
        if(config.selector == CONFIG_MONTH_SELECTOR) {
            generateMonthSelectorDom(config.id, this)
        }
        if(config.selector == CONFIG_PERIOD_SELECTOR) {
            generatePeriodSelectorDom(config.id, this)
        }
        generateToggleFilter(config.id, this);
        generateTaskListDom(config.id);

        console.log("Build dashboard "+startDate + " --- " + endDate);
        cumulativeFlowGraph = buildTimePeriodDashboard(config.id, startDate, endDate);
        durationStatsTable = buildDataTable(config.id + ID_DURATION_STATS);
        tasksListTable = buildTasksListTable(config.id);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        this.filterData();
    };

    this.filterData = function () {
        filteredData = filterCreatedAfter(filterReleasedBefore(rawData, startDate), endDate);
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

    this.setDates = function (firstDay, lastDate) {
        startDate = firstDay;
        endDate = lastDate !=  null ? lastDate : new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
    }

    this.resetDates = function (firstDay, lastDate) {
        this.setDates(firstDay, lastDate);
        limitDashboardPeriod(cumulativeFlowGraph, startDate, endDate);
        this.filterData();
        this.refresh();
    }

    this.resetReduce = function (column) {
        reduceColumn = column;
        this.refresh();
    }

}