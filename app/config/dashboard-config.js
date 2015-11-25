var today = new Date();
var oneWeekAgo = new Date(today.getTime());
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
var oneMonthAgo = new Date(today.getTime());
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 2);

var month1FirstDay = new Date(today.getTime());
month1FirstDay.setDate(1);
month1FirstDay.setMonth(month1FirstDay.getMonth() - 1);
var month1LastDay = new Date(today.getTime());
month1LastDay.setDate(0);

var month2FirstDay = new Date(today.getTime());
month2FirstDay.setDate(1);
month2FirstDay.setMonth(month2FirstDay.getMonth() - 2);
var month2LastDay = new Date(today.getTime());
month2LastDay.setMonth(month2LastDay.getMonth() - 1);
month2LastDay.setDate(0);

var month3FirstDay = new Date(today.getTime());
month3FirstDay.setDate(1);
month3FirstDay.setMonth(month3FirstDay.getMonth() - 3);
var month3LastDay = new Date(today.getTime());
month3LastDay.setMonth(month3LastDay.getMonth() - 2);
month3LastDay.setDate(0);

var filtersConfig = [];
if (RAW_DATA_COL.FILTERS != null) {
    for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
        filtersConfig.push({
            id: "global_task_duration_filter_" + (index + 1),
            filterType: RAW_DATA_COL.FILTERS[index].filterType,
            columnIndex: 11 + index
        });
    }
}

var month1DashboardConfig = {
    date: {
        start: month1FirstDay,
        end: month1LastDay,
    },
    titleSuffix: {
        id: 'month_1_title_suffix',
        value: month1FirstDay.getMonthLabel()
    },
    cumulativeFlowChart: {
        id: 'month_1_extract_cumulative_chart',
        height: 600
    },
    durationStats: 'month_1_duration_stats',
    tasksList: 'month_1_tasks_list'
};

var month2DashboardConfig = {
    date: {
        start: month2FirstDay,
        end: month2LastDay,
    },
    titleSuffix: {
        id: 'month_2_title_suffix',
        value: month2FirstDay.getMonthLabel()
    },
    cumulativeFlowChart: {
        id: 'month_2_extract_cumulative_chart',
        height: 600
    },
    durationStats: 'month_2_duration_stats',
    tasksList: 'month_2_tasks_list'
};

var month3DashboardConfig = {
    date: {
        start: month3FirstDay,
        end: month3LastDay,
    },
    titleSuffix: {
        id: 'month_3_title_suffix',
        value: month3FirstDay.getMonthLabel()
    },
    cumulativeFlowChart: {
        id: 'month_3_extract_cumulative_chart',
        height: 600
    },
    durationStats: 'month_3_duration_stats',
    tasksList: 'month_3_tasks_list'
};

var currentMonthDashboardConfig = {
    date: {
        start: oneMonthAgo,
        end: oneWeekAgo,
    },
    titleSuffix: {
        id: 'current_month_title_suffix',
        value: "(" + oneMonthAgo.formatDDMMYYYY() + " - " + oneWeekAgo.formatDDMMYYYY() + ")"
    },
    cumulativeFlowChart: {
        id: 'current_month_extract_cumulative_chart',
        height: 600
    },
    durationStats: 'current_month_duration_stats',
    tasksList: 'current_month_tasks_list'
};

var globalCumulativeFlowDashboardConfig = {
    titleSuffix: {
        id: 'global_culumative_flow_title_suffix',
    },
    dashboard: 'global_cumulative_flow_dashboard_div',
    cumulativeFlowChart: {
        id: 'global_cumulative_flow_area_chart_div',
        height: 400
    },
    rangeFilter: 'global_cumulative_flow_chart_range_filter_div',
    tasksList: 'global_cumulative_flow_tasks_list'
};

var globalDurationDashboardConfig = {
    titleSuffix: {
        id: 'global_duration_title_suffix'
    },
    dashboard: 'global_duration_dashboard_div',
    durationColumnChart: {
        id: 'global_duration_column_chart_div'
    },
    durationScatterChart: {
        id: 'global_duration_scatter_chart_div'
    },
    durationStats: 'global_task_duration_stats',
    taskFilters: filtersConfig,
    tasksList: 'global_task_duration_tasks_list'
};