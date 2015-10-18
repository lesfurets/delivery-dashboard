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
        'view': {'columns': [0, 1, 2, 3, 4]},
        'options': {
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
        'view': {'columns': [2, 6, 7, 8]},
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

function buildFilter(controlType, containerId, filterColumnLabel, filterListener) {
    var filter = new google.visualization.ControlWrapper({
        'controlType': controlType,
        'containerId': containerId,
        'options': {
            'filterColumnLabel': filterColumnLabel,
        },
    });
    google.visualization.events.addListener(filter, 'statechange', filterListener);
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
                },
                'chartView': {
                    'columns': [0, 1, 2, 3, 4]
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
        window.open('http://jira.lan.courtanet.net/browse/' + data.getValue(rowNumber, 0) + '-' + data.getValue(rowNumber, 1), '_blank');
    });
}

/***************************
 * ExtractDashboard
 **************************/

function buildTimePeriodDashboard(config) {
    var areaChart = buildCumulativeFlowChart(config.cumulativeFlowChart);
    areaChart.setOption('hAxis.viewWindow.min', config.date.start);
    areaChart.setOption('hAxis.viewWindow.max', config.date.end);
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

function buildTasksDurationDashboard(config, columnChart, filterListener) {
    var projectFilter = buildFilter('CategoryFilter', config.projectFilter, 'Project', filterListener);
    var effortFilter = buildFilter('CategoryFilter', config.effortFilter, 'Effort', filterListener);
    var valueFilter = buildFilter('CategoryFilter', config.valueFilter, 'Value', filterListener);
    var dateRangeFilter = buildFilter('DateRangeFilter', config.dateRangeFilter, 'Release', filterListener);
    var dashboard = new google.visualization.Dashboard(document.getElementById(config.dashboard));
    dashboard.bind([effortFilter, valueFilter, dateRangeFilter, projectFilter], columnChart);
    return dashboard;
}