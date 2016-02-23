/***************************
 *     Charts Factory
 **************************/

function buildDataTable(elementId) {
    return new google.visualization.ChartWrapper({
        'chartType': 'Table',
        'containerId': elementId,
        'options': {
            width: '100%'
        }
    });
}

function buildTasksListTable(elementId) {
    var tasksListTable = buildDataTable(elementId);
    tasksListTable.setOption('height', '100%');
    tasksListTable.setOption('showRowNumber', true);
    setTaskSelectListener(tasksListTable);
    return tasksListTable;
}

function buildCumulativeFlowChart(config) {
    return new google.visualization.ChartWrapper({
        'chartType': 'AreaChart',
        'containerId': config.id,
        'options': {
            'animation': {
                'startup': true
            },
            'height': config.height,
            'chartArea': {
                'width': '90%',
                'height': '100%'
            },
            'hAxis': {
                'textPosition': 'in'
            },
            'vAxis': {
                'title': 'Number of tasks',
                'textPosition': 'in',
                'gridlines': {count: 4}
            },
            'legend': {
                'position': 'in'
            }
        }
    });
}

function buildTasksDurationColumnChart(config) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ColumnChart',
        'containerId': config.id,
        'view': {'columns': config.columns},
        'options': {
            'isStacked': true,
            'hAxis': {
                'title': 'Jira Tickets',
                'textPosition': 'none'
            },
            'vAxis': {
                'title': 'Duration (days)',
                'textPosition': 'in'
            },
            'legend': {
                'position': 'in'
            },
            'chartArea': {
                'width': '90%',
                'height': '100%'
            }
        }
    });
    setTaskSelectListener(durationChart);
    return durationChart;
}

function buildTasksDurationScatterChart(config) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ScatterChart',
        'containerId': config.id,
        'view': {'columns': config.columns},
        'options': {
            'height': 400,
            'hAxis': {
                'title': 'Dates',
                'textPosition': 'out'
            },
            'vAxis': {
                'title': 'Duration (days)',
                'textPosition': 'in'
            },
            'legend': {
                'position': 'in'
            },
            'chartArea': {
                'width': '90%',
                'height': '80%'
            },
            series: {
                0: {labelInLegend: 'Tasks'},
                1: {pointSize: 0, visibleInLegend: false},
                2: {pointSize: 0, visibleInLegend: false},
                3: {pointSize: 0, visibleInLegend: false}
            },
            trendlines: {
                1: {labelInLegend: 'Average', visibleInLegend: true, opacity: 0.4, color: 'green'},
                2: {labelInLegend: '50%', visibleInLegend: true, opacity: 0.4, color: 'orange'},
                3: {labelInLegend: '90%', visibleInLegend: true, opacity: 0.4, color: 'red'}
            },
        }
    });
    setTaskSelectListener(durationChart);
    return durationChart;
}

function buildFilter(controlType, containerId, filterColumnIndex) {
    var filter = new google.visualization.ControlWrapper({
        'controlType': controlType,
        'containerId': containerId,
        'options': {
            'filterColumnIndex': filterColumnIndex,
        },
    });
    return filter;
}

function buildRangeFilter(elementId) {
    return new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': elementId,
        'options': {
            'filterColumnIndex': 0,
            'ui': {
                'chartType': 'AreaChart',
                'chartOptions': {
                    'height': 100,
                    'chartArea': {
                        'width': '90%'
                    }
                }
            },
        },
    });
}

/***************************
 *     Event Manager
 **************************/

function setTaskSelectListener(element) {
    google.visualization.events.addListener(element, 'select', function () {
        var rowNumber = element.getChart().getSelection()[0].row;
        var data = element.getDataTable();
        window.open('http://jira.lan.courtanet.net/browse/' + data.getValue(rowNumber, DURATION_INDEX_STATIC_PROJECT) + '-' + data.getValue(rowNumber, DURATION_INDEX_STATIC_REF), '_blank');
    });
}

/***************************
 * ExtractDashboard
 **************************/

function buildTimePeriodDashboard(config) {
    var areaChart = buildCumulativeFlowChart(config.cumulativeFlowChart);
    limitDashboardPeriod(areaChart, config.date.start, config.date.end);
    return areaChart;
}

function limitDashboardPeriod(areaChart, firstDay, lastDay) {
    areaChart.setOption('hAxis.viewWindow.min', firstDay);
    areaChart.setOption('hAxis.viewWindow.max', lastDay);
    return areaChart;
}

/***************************
 * CumulativFlowDashboard
 **************************/

function buildCumulativFlowDashboard(config) {
    var areaChart = buildCumulativeFlowChart(config.cumulativeFlowChart);
    var chartRangeFilter = buildRangeFilter(config.rangeFilter);
    var dashboard = new google.visualization.Dashboard(document.getElementById(config.dashboard));
    dashboard.bind([chartRangeFilter], areaChart);
    return dashboard;
}

/***************************
 * TasksDurationDashboard
 **************************/

function buildFilteredDashboard(config, chart, filterListener) {
    var filters = [];
    for (var index = 0; index < config.taskFilters.length; index++) {
        var filterConfig = config.taskFilters[index];
        filters.push(buildFilter(filterConfig.filterType, filterConfig.id, filterConfig.columnIndex));
    }
    google.visualization.events.addListener(chart, 'ready', filterListener);
    var dashboard = new google.visualization.Dashboard(document.getElementById(config.dashboard));
    dashboard.bind(filters, [chart]);
    return dashboard;
}