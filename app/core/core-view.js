/***************************
 *     Filter Generation
 **************************/

function generateFiltersModelFromConfig(filterIdPrefix,isDurationData) {
    var filtersConfig = [];
    if (RAW_DATA_COL.FILTERS != null) {
        for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
            var filterId = filterIdPrefix + "_" + index;
            var filterType = RAW_DATA_COL.FILTERS[index].filterType;

            filtersConfig.push({
                id: filterId,
                filterType: filterType,
                columnIndex: isDurationData ? DURATION_INDEX_FILTER_FIRST + index : DISTRIBUTION_INDEX_FILTER_FIRST + index
            });
        }
    }
    return filtersConfig;
}

function generateFiltersDom(containerId, filtersConfig) {
    var rangeFilterContainer = containerId + "_" + "range";
    var categoryFilterContainer = containerId + "_" + "category";
    $("#" + containerId)
        .append($('<div>').attr('id', rangeFilterContainer).addClass("col-md-7 text-center"))
        .append($('<div>').attr('id', categoryFilterContainer).addClass("col-md-5 text-center"));
    for (var index = 0; index < filtersConfig.length; index++) {

        var filterContainer = filtersConfig[index].filterType == 'CategoryFilter' ?
            categoryFilterContainer : rangeFilterContainer;

        $("#" + filterContainer).append($('<div>').attr('id', filtersConfig[index].id));
    }
    return filtersConfig;
}

function generateToggleFilter(viewId, dashboard) {
    if(REPORT_CONFIG.projection.length < 2){
        return;
    }
    var choice1Id = viewId + "_" + "choice_1";
    var choice2Id = viewId + "_" + "choice_2";
    var widgetId = viewId + "_" + "widget";
    $("#" + viewId + ID_SWITCH)
        .append($('<div>').attr('id', choice1Id).addClass("switch-label").text(REPORT_CONFIG.projection[0].filterLabel))
        .append($('<div>').attr('id', widgetId).addClass("switch-widget"))
        .append($('<div>').attr('id', choice2Id).addClass("switch-label").text(REPORT_CONFIG.projection[0].filterLabel));

    //Manage the switch
    $('#' + choice1Id).click(function () {
        $("#" + viewId + ID_SWITCH).removeClass("switched");
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST);
    });
    $('#' + choice2Id).click(function () {
        $("#" + viewId + ID_SWITCH).addClass("switched");
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST + 1);
    });
    $('#' + widgetId).click(function () {
        $("#" + viewId + ID_SWITCH).toggleClass("switched");
        var filterIndex = $("#" + viewId + ID_SWITCH).hasClass("switched") ? 1 : 0;
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST + (REPORT_CONFIG.projection[filterIndex].position));
    });
}

/***************************
 *     Chart Generation
 **************************/

function generateChartModelFromConfig(chartPrefix) {
    var chatsConfig = [];
    if (RAW_DATA_COL.FILTERS != null) {
        for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
            var filter = RAW_DATA_COL.FILTERS[index];
            if(filter.filterType == 'CategoryFilter') {
                chatsConfig.push({
                    id: chartPrefix + "_chart_" + index,
                    filterType:  'PieChart',
                    columnIndex: DISTRIBUTION_INDEX_FILTER_FIRST + index,
                    label: filter.label
                });
            }
        }
    }
    return chatsConfig;
}

function generateChartDom(containerId, chartsConfig) {
    var containerSelector = "#" + containerId + '_dashboard';
    for (var index = 0; index < chartsConfig.length; index++) {
        $(containerSelector).append($('<div>')
            .attr('id', chartsConfig[index].id)
            .addClass("col-md-4"));
    }
}

/***************************
 *     Title Suffix
 **************************/

var setTitleSuffix = function (viewId, numberOfRows) {
    var plural = numberOfRows > 1 ? "s" : "";
    $("#" + viewId  + ID_TITLE_SUFFIX).text(" - " + numberOfRows + " task" + plural);
};

/***************************
 *   Dashboard Elements
 **************************/

var generateDashboardElementsDom = function (viewId, suffixList) {
    for (var index = 0; index < suffixList.length; index++) {
        $("#" + viewId + ID_BASHBOARD).append($('<div>').attr('id', viewId + suffixList[index]));
    }
};

/***************************
 *     Task List
 **************************/

var generateTaskListDom = function (viewId) {
    $("#" + viewId)
        .append($('<div>')
            .attr('id', viewId + ID_TASK_LIST_MODAL)
            .attr('role', "dialog")
            .addClass("modal ticket-list fade")
            .append($('<div>').addClass("modal-dialog")
                .append($('<div>').addClass("modal-content")
                    .append($('<div>').addClass("modal-header")
                        .append($('<button>')
                            .attr('type', "button")
                            .attr('data-dismiss', "modal")
                            .addClass("close").html("&times;"))
                        .append($('<h4>')
                            .addClass("modal-title")
                            .text("Tasks list")))
                    .append($('<div>').addClass("modal-body")
                        .append($('<div>')
                            .attr('id', viewId + ID_TASK_LIST)
                            .addClass("col-md-12")))
                    .append($('<div>').addClass("modal-footer")
                        .append($('<button>')
                            .attr('type', "button")
                            .attr('data-dismiss', "modal")
                            .addClass("btn btn-default")
                            .text("Close"))))));
};

/***************************
 *     Month Selector
 **************************/
var generateMonthSelectorDom = function (viewId, dashboard) {
    $("#" + viewId + ID_TIME_SELECTOR).addClass("dropdown")
        .append($("<button>")
            .attr('id', viewId + ID_MONTH_SELECTOR_LABEL)
            .attr('type', "button")
            .attr('data-toggle', "dropdown")
            .addClass("btn btn-default dropdown-toggle")
            .append($("<span>").addClass("caret")))
        .append($("<ul>")
            .attr('id', viewId + ID_MONTH_SELECTOR_LIST)
            .attr('aria-labelledby', "month_dropdown")
            .addClass("dropdown-menu"));

    var startDate = new Date(REPORT_CONFIG.first_entry);
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 15);

    var setDropDownValue = function (date) {
        $("#" + viewId + ID_MONTH_SELECTOR_LABEL).text((date.getFullYear() + " " + date.getMonthLabel() + " ")).append($('<span>').attr('class', 'caret'));
    }

    var test = 0;
    setDropDownValue(currentDate);
    // Initializing Month Picker
    while (startDate < currentDate) {
        test++
        // We can't use simple functions because they would all be closures that reference the same variable currentDate.
        var monthLink = $('<a>').text(currentDate.getFullYear() + " " + currentDate.getMonthLabel()).attr('href', '#').on('click', changeDate(new Date(currentDate)));
        $('#' + viewId + ID_MONTH_SELECTOR_LIST).append($('<li>').append(monthLink));
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    function changeDate(date) {
        date.setDate(1);
        return function(){
            setDropDownValue(date);
            dashboard.resetDates(date, new Date(date.getFullYear(), date.getMonth() + 1, 0))
        }
    }
};


