var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

Date.prototype.getMonthLabel = function () {
    return monthNames[this.getMonth()];
}

Date.prototype.formatDDMMYYYY = function () {
    var dd = this.getDate();
    dd = dd < 10 ? '0' + dd : dd;
    var mm = this.getMonth() + 1; //January is 0!
    mm = mm < 10 ? '0' + mm : mm;
    var yyyy = this.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
};

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};


var today = new Date();
var oneWeekAgo = new Date(today.getTime());
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
var oneMonthAgo = new Date(today.getTime());
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

var lastMonthFirstDay = new Date(today.getTime());
lastMonthFirstDay.setDate(1);
lastMonthFirstDay.setMonth(lastMonthFirstDay.getMonth() - 1);
var lastMonthLastDay = new Date(today.getTime());
lastMonthLastDay.setDate(0);

var lastMonthDashboardConfig = {
    date: {
        start: lastMonthFirstDay,
        end: lastMonthLastDay,
    },
    titleSuffix: {
        id: 'last_month_title_suffix',
        value: lastMonthFirstDay.getMonthLabel()
    },
    cumulativeFlowChart: {
        id: 'last_month_extract_cumulative_chart',
        height: 624
    },
    durationStats: 'last_month_duration_stats',
    tasksList: 'last_month_tasks_list'
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
        height: 624
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
    durationStats: 'global_duration_table_div',
    projectFilter: 'global_duration_project_filter_div',
    effortFilter: 'global_duration_effort_filter_div',
    valueFilter: 'global_duration_value_filter_div',
    dateRangeFilter: 'global_duration_date_range_filter_div',
    tasksList: 'global_duration_tasks_list'
};