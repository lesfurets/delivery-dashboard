/***************************
 *     Filter Generation
 **************************/

function generateFiltersModelFromConfig(filterIdPrefix) {
    var filtersConfig = [];
    if (RAW_DATA_COL.FILTERS != null) {
        for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
            var filterId = filterIdPrefix + "_" + index;
            var filterType = RAW_DATA_COL.FILTERS[index].filterType;

            filtersConfig.push({
                id: filterId,
                filterType: filterType,
                columnIndex: DURATION_INDEX_FILTER_FIRST + index
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

function generateToggleFilter(containerId, dashboard) {
    var choice1Id = containerId + "_" + "choice_1";
    var choice2Id = containerId + "_" + "choice_2";
    var widgetId = containerId + "_" + "switch";
    $("#" + containerId)
        .append($('<div>').attr('id', choice1Id).addClass("switch-label").text("Type"))
        .append($('<div>').attr('id', widgetId).addClass("switch-widget"))
        .append($('<div>').attr('id', choice2Id).addClass("switch-label").text("Effort"));

    //Manage the switch
    $('#' + choice1Id).click(function () {
        $("#" + containerId).removeClass("switched");
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST);
    });
    $('#' + choice2Id).click(function () {
        $("#" + containerId).addClass("switched");
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST + 1);
    });
    $('#' + widgetId).click(function () {
        $("#" + containerId).toggleClass("switched");
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST + ($("#" + containerId).hasClass("switched") ? 1 : 0));
    });
}