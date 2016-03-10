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

var generateMonthSelectorDom = function (viewId) {
    $("#" + viewId + ID_TIME_SELECTOR)
// Initializing Month Picker
    while (startDate < currentDate) {
        $('#monthSelector').append($('<option>').text(currentDate.getFullYear() + " " + currentDate.getMonthLabel()).attr('value', currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1)));
        $('#month_dropdown_list').append($('<li>').append($('<a>').text(currentDate.getFullYear() + " " + currentDate.getMonthLabel()).attr('onClick', 'changeDate(\'' + currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + '\');').attr('href', '#')));
        currentDate.setMonth(currentDate.getMonth() - 1);
    }
};


