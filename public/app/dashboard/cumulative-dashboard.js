function CumulativeDashboard(viewId) {
    var cumulativeFlowDashboard;
    var tasksListTable;

    var rawData;
    var eventData;

    var initialized = false;

    registerDashboard(viewId, this);

    this.initWidgets = function () {
        generateDashboardElementsDom(viewId, [ID_AREA_CHART, ID_RANGE_FILTER])
        createDomForTaskList(viewId);

        cumulativeFlowDashboard = buildCumulativFlowDashboard(viewId);
        tasksListTable = buildTasksListTable(viewId);

        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
        eventData = computeEventData(data);
    };

    this.refresh = function () {
        if (eventData != null) {
            setTitleSuffix(viewId, rawData.getNumberOfRows());

            cumulativeFlowDashboard.draw(eventData);

            tasksListTable.setDataTable(rawData);
            tasksListTable.draw();
        }
    };

    this.isInitialized = function () {
        return initialized;
    };

}