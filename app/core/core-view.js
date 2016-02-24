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