import { ID_TASK_LIST } from './definition'

function buildDataTable(viewId) {
    return new google.visualization.ChartWrapper({
        'chartType': 'Table',
        'containerId': viewId,
        'options': {
            width: '100%'
        }
    });
}

export const buildTasksListTable = function(viewId) {
    var tasksListTable = buildDataTable(viewId);
    tasksListTable.setOption('height', '100%');
    tasksListTable.setOption('showRowNumber', true);
    setTaskSelectListener(tasksListTable);
    return tasksListTable;
}

export const buildCumulativeFlowChart = function (viewId, height) {
    return new google.visualization.ChartWrapper({
        'chartType': 'AreaChart',
        'containerId': viewId,
        'options': {
            'animation': {
                'startup': true
            },
            'height': height,
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

export const buildRangeFilter = function(elementId) {
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
 *         Unused
 **************************/

function buildDurationStatsTable(viewId) {
    return buildDataTable(viewId + ID_DURATION_STATS);
}

function buildTasksDurationColumnChart(viewId, columns) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ColumnChart',
        'containerId': viewId + ID_COLUMN_CHART,
        'view': {'columns': columns},
        'options': {
            'tooltip': { isHtml: true },
            'height': 400,
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
            },
        }
    });
    setTaskSelectListener(durationChart);
    return durationChart;
}

function buildTasksDurationScatterChart(viewId, columns) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ScatterChart',
        'containerId': viewId + ID_SCATTER_CHART,
        'view': {'columns': columns},
        'options': {
            'tooltip': { isHtml: true },
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
                2: {labelInLegend: '75%', visibleInLegend: true, opacity: 0.4, color: 'orange'},
                3: {labelInLegend: '90%', visibleInLegend: true, opacity: 0.4, color: 'red'}
            }
        }
    });
    setTaskSelectListener(durationChart);
    return durationChart;
}

function buildSimpleChart(elementId, chartType, title) {
    return new google.visualization.ChartWrapper({
        'chartType': chartType,
        'containerId': elementId,
        'options': {
            'width': 400,
            'height': 400,
            'pieSliceText': 'label',
            'legend': 'none',
            'title' : title
        }
    });
}

function buildFilter(containerId, controlType, filterColumnIndex) {
    var filter = new google.visualization.ControlWrapper({
        'controlType': controlType,
        'containerId': containerId,
        'options': {
            'filterColumnIndex': filterColumnIndex,
        }
    });
    return filter;
}

/***************************
 *     Event Manager
 **************************/

function setTaskSelectListener(element) {
    google.visualization.events.addListener(element, 'select', function () {
        var rowNumber = element.getChart().getSelection()[0].row;
        var data = element.getDataTable();
        window.open('http://jira.lan.courtanet.net/browse/' + data.getValue(rowNumber, TASK_INDEX_STATIC_REFERENCE), '_blank');
    });
}

/***************************
 * ExtractDashboard
 **************************/

function buildTimePeriodDashboard(viewId, startDate, endDate) {
    var areaChart = buildCumulativeFlowChart(viewId + ID_AREA_CHART, 600);
    limitDashboardPeriod(areaChart, startDate, endDate);
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

function buildCumulativFlowDashboard(viewId) {
    var areaChart = buildCumulativeFlowChart(viewId + ID_AREA_CHART, 400);
    var chartRangeFilter = buildRangeFilter(viewId + ID_RANGE_FILTER);
    var dashboard = new google.visualization.Dashboard(document.getElementById(viewId));
    dashboard.bind([chartRangeFilter], areaChart);
    return dashboard;
}

/***************************
 * TasksDurationDashboard
 **************************/

function buildFilters(viewId, filtersConfig) {
    var filters = [];
    for (var index = 0; index < filtersConfig.length; index++) {
        var filterConfig = filtersConfig[index];
        filters.push(buildFilter(viewId + filterConfig.id, filterConfig.filterType, filterConfig.columnIndex));
    }
    return filters;
}

function buildSimpleCharts(viewId, chartsConfig) {
    var charts = [];
    for (var index = 0; index < chartsConfig.length; index++) {
        var chartConfig = chartsConfig[index];
        charts.push(buildSimpleChart(viewId + chartConfig.id, chartConfig.filterType, chartConfig.label));
    }
    return charts;
}

function buildFilteredDashboard(viewId, charts, filters, filterListener) {
    google.visualization.events.addListener(charts, 'ready', filterListener);
    var dashboard = new google.visualization.Dashboard(document.getElementById(viewId + ID_DASHBOARD));
    dashboard.bind(filters, charts);
    return dashboard;
}