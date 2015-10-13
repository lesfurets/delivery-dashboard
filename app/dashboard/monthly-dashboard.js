function TimePeriodDashboard(config) {
    var cumulativeFlowGraph;
    var durationStatsTable;
    var ticketsTable;

    var rawData;
    var durationStats;

    this.initWidgets = function () {
        cumulativeFlowGraph = buildExtractDashboard(config);
        durationStatsTable = buildDataTable(config.durationStats);
        ticketsTable = buildTicketsTable(config.tasksList);
    };

    this.loadData = function (data) {
        rawData = filterLastMonth(data, config.date.start);
        durationStats = computeDurationGroupedData(computeDurationData(data), 1);
    };

    this.setTitleSuffix = function (numberOfRows) {
        var plural = numberOfRows > 1 ? "s" : "";
        $("#" + config.titleSuffix.id).text(" - " + config.titleSuffix.value + " - " + numberOfRows + " ticket" + plural);
    };

    this.refresh = function () {
        if (rawData != null) {
            this.setTitleSuffix(rawData.getNumberOfRows());

            cumulativeFlowGraph.setDataTable(computeEventData(rawData));
            cumulativeFlowGraph.draw();

            durationStatsTable.draw(computeDurationGroupedData(computeDurationData(rawData), 1), {
                width: '100%',
                height: '100%'
            });

            ticketsTable.draw(rawData, {showRowNumber: true});
        }
    };
}