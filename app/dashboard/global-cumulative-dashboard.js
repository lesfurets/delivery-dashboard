function GlobalCumulativeDashboard() {
    var cumulativFlowDashboard;

    var rawData;
    var eventData;

    this.initWidgets = function () {
        cumulativFlowDashboard = buildCumulativFlowDashboard();
    };

    this.loadData = function (data) {
        rawData = data;
        eventData = eventData = computeEventData(data);
    };

    this.refresh = function () {
        if (eventData != null) {
            cumulativFlowDashboard.draw(eventData);
        }
    };

}