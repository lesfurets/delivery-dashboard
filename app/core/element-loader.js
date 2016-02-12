google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});
var containerToLoad = 0;
var allDashboards = [];
var currentDashboards = [];

// Requesting the load of all elements (element="<element_template>")
google.setOnLoadCallback(function () {
    containerToLoad = $(".element-container").size();
    $(".element-container").each(function (index) {
        $(this).load($(this).attr("element"));
    });
});

// Wait for all elements to be loaded before initializing the app
function registerDashboard(tabId, dashboard, isDefault) {
    allDashboards.push({tab: tabId, controller: dashboard});
    containerToLoad--;
    if (containerToLoad == 0) {
        initApp()
    }
}