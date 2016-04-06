google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});
var containerToLoad = 0;
var allDashboards = [];
var currentDashboards = [];

// Requesting the load of all elements (element="<element_template>")
google.setOnLoadCallback(function () {
    completeConfig();
    containerToLoad = $("a[element]").size();
    $("a[element]").each(function (index) {
        $(".tab-content").append($("<div>")
            .attr('id', $(this).attr("href").replace("#", ""))
            .addClass("tab-pane fade in")
            //.addClass(index == 0 ? "active" : "")
            .load($(this).attr("element")));
    });
});

// Wait for all elements to be loaded before initializing the app
function registerDashboard(tabId, dashboard) {
    allDashboards.push({tab: "#" + tabId, controller: dashboard});
    containerToLoad--;
    if (containerToLoad == 0) {
        initApp()
    }
}

// Completing configs
function completeConfig() {
    RAW_DATA_COL.EVENTS.forEach(function (element) {
        element.dataType = DATA_DATE;
        element.filterType = FILTER_DATE
    });
}
