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
        $("#" + viewId + ID_DASHBOARD).append($('<div>').attr('id', viewId + suffixList[index]));
    }
};

/***************************
 *     Filter Generation
 **************************/

function generateFiltersDom(viewId, filtersConfig) {
    $("#" + viewId + ID_FILTERS).addClass("row")
        .append($('<div>').attr('id', viewId + ID_FILTERS_RANGE).addClass("col-md-7 text-center"))
        .append($('<div>').attr('id', viewId + ID_FILTERS_CATEGORY).addClass("col-md-5 text-center"));
    for (var index = 0; index < filtersConfig.length; index++) {

        var containerSuffix = filtersConfig[index].filterType == 'CategoryFilter' ?
            ID_FILTERS_CATEGORY :  ID_FILTERS_RANGE;

        $("#" + viewId + containerSuffix).append($('<div>').attr('id', viewId + filtersConfig[index].id));
    }
    return filtersConfig;
}

/***************************
 *     Chart Generation
 **************************/

function generateChartDom(viewId, chartsConfig) {
    var containerSelector = "#" + viewId + ID_DASHBOARD;
    for (var index = 0; index < chartsConfig.length; index++) {
        $(containerSelector).append($('<div>')
            .attr('id', viewId + chartsConfig[index].id)
            .addClass("col-md-4"));
    }
}

