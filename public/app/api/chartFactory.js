import { ID_TASK_LIST } from './definition'
import { TASK_INDEX_STATIC_REFERENCE, TASK_INDEX_FILTER_FIRST } from './taskData'

export const buildDataTable = function(elementId) {
    return new google.visualization.ChartWrapper({
        'chartType': 'Table',
        'containerId': elementId,
        'options': {
            width: '100%'
        }
    });
}

export const buildTasksListTable = function(elementId) {
    var tasksListTable = buildDataTable(elementId);
    tasksListTable.setOption('height', '100%');
    tasksListTable.setOption('showRowNumber', true);
    setTaskSelectListener(tasksListTable);
    return tasksListTable;
}

export const buildCumulativeFlowChart = function (elementId, height) {
    return new google.visualization.ChartWrapper({
        'chartType': 'AreaChart',
        'containerId': elementId,
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
 * TasksDurationDashboard
 **************************/

export const buildDurationColumnChart = function(elementId, columns) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ColumnChart',
        'containerId': elementId,
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

export const buildDurationScatterChart = function(elementId, columns) {
    var durationChart = new google.visualization.ChartWrapper({
        'chartType': 'ScatterChart',
        'containerId': elementId,
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

export const buildFilters =  function() {
    var filters = [];
    for (var index = 0; index < RAW_DATA_COL.FILTERS.length; index++) {
        filters.push(buildFilter("filter_" + index, RAW_DATA_COL.FILTERS[index].filterType, TASK_INDEX_FILTER_FIRST + index));
    }
    return filters;
}

export const buildFilteredDashboard = function(elementId, charts, filters, filterListener) {
    google.visualization.events.addListener(charts, 'ready', filterListener);
    var dashboard = new google.visualization.Dashboard(document.getElementById(elementId));
    dashboard.bind(filters, charts);
    return dashboard;
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
 *     Mock
 **************************/

export const buildSimpleCharts = function() {
    var charts = [];
    RAW_DATA_COL.FILTERS.forEach(function(filter, index) {
        if(filter.filterType == 'CategoryFilter') {
            charts.push(buildSimpleChart("category_" + index, "PieChart", filter.label));
        }
    });
    return charts;
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

/***************************
 * ExtractDashboard
 **************************/

export const buildTimePeriodDashboard = function(elementId, startDate, endDate) {
    var areaChart = buildCumulativeFlowChart(elementId, 600);
    limitDashboardPeriod(areaChart, startDate, endDate);
    return areaChart;
}

export const limitDashboardPeriod = function(areaChart, firstDay, lastDay) {
    areaChart.setOption('hAxis.viewWindow.min', firstDay);
    areaChart.setOption('hAxis.viewWindow.max', lastDay);
    return areaChart;
}

//function buildSimpleChart(elementId, chartType, title) {
//    return new google.visualization.ChartWrapper({
//        'chartType': chartType,
//        'containerId': elementId,
//        'options': {
//            'width': 400,
//            'height': 400,
//            'pieSliceText': 'label',
//            'legend': 'none',
//            'title' : title
//        }
//    });
//}

/***************************
 *         Unused
 **************************/

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
 * CumulativFlowDashboard
 **************************/

function buildCumulativFlowDashboard(viewId) {
    var areaChart = buildCumulativeFlowChart(viewId + ID_AREA_CHART, 400);
    var chartRangeFilter = buildRangeFilter(viewId + ID_RANGE_FILTER);
    var dashboard = new google.visualization.Dashboard(document.getElementById(viewId));
    dashboard.bind([chartRangeFilter], areaChart);
    return dashboard;
}