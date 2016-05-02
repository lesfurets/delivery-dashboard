function TaskManagerJira(viewId) {
    var tasksListTable;
    var rawData;
    var initialized = false;


    this.initWidgets = function () {
        tasksListTable = buildTasksListTable(viewId);
        initialized = true;
    };

    this.loadData = function (data) {
        rawData = data;
    };

    this.refresh = function () {
        tasksListTable.setDataTable(rawData);
        tasksListTable.draw();
    };

    this.isInitialized = function () {
        return initialized;
    };

    registerDashboard(viewId, this);
}