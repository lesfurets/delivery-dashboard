import { TASK_INDEX_STATIC_REFERENCE } from '../data/taskData'

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

export const buildDurationColumnChart = function(elementId,duration, columns) {
    var options = {
        'chartType': 'ColumnChart',
        'containerId': elementId,
        'options': {
            'tooltip': { isHtml: true },
            'height': 400,
            'isStacked': true,
            'hAxis': {
                'title': duration ? "Cycle Time" : 'Jira Tickets',
                'textPosition': duration ?  'out' :'none'
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
        }
    };
    if(columns != null){
        options.view = {'columns': columns};
    }
    var durationChart = new google.visualization.ChartWrapper(options);
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
            'hAxis': { textPosition: 'none' },
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
    setTaskSelectListener(durationChart,1);
    return durationChart;
}

export const buildSimpleChart = function (elementId, chartType, title) {
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

function setTaskSelectListener(element, index) {
    google.visualization.events.addListener(element, 'select', function () {
        var rowNumber = element.getChart().getSelection()[0].row;
        var data = element.getDataTable();
        window.open('http://jira.lan.courtanet.net/browse/' + data.getValue(rowNumber, typeof index !== 'undefined' ? index :TASK_INDEX_STATIC_REFERENCE), '_blank');
    });
}