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
    cumulativeChart: 'last_month_extract_cumulative_chart',
    durationStats: 'last_month_duration_stats',
    tasksList: 'last_month_tasks_list'
};

var currentMonthDashboardConfig = {
    date: {
        start: oneMonthAgo,
        end: today,
    },
    titleSuffix: {
        id: 'current_month_title_suffix',
        value: "(" + oneMonthAgo.formatDDMMYYYY() + " - " + today.formatDDMMYYYY() + ")"
    },
    cumulativeChart: 'current_month_extract_cumulative_chart',
    durationStats: 'current_month_duration_stats',
    tasksList: 'current_month_tasks_list'
};
