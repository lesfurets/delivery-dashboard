function createModelForFilters() {
    var filtersConfig = [];
    if (RAW_DATA_COL.FILTERS != null) {
        for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
            filtersConfig.push({
                id: ID_FILTER + ID_SEPARATOR + index,
                filterType: RAW_DATA_COL.FILTERS[index].filterType,
                columnIndex: TASK_INDEX_FILTER_FIRST + index
            });
        }
    }
    return filtersConfig;
}

function createModelForChart() {
    var chatsConfig = [];
    if (RAW_DATA_COL.FILTERS != null) {
        RAW_DATA_COL.FILTERS.forEach(function(filter, index) {
            if(filter.filterType == 'CategoryFilter') {
                chatsConfig.push({
                    id:  ID_CHART + ID_SEPARATOR + index,
                    filterType:  'PieChart',
                    columnIndex: TASK_INDEX_FILTER_FIRST + index,
                    label: filter.label
                });
            }
        });
    }
    return chatsConfig;
}