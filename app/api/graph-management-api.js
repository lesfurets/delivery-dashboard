
/***************************
 * ExtractDashboard
 **************************/

function buildExtractDashboard(config) {
  var ref_date_max = new Date();
  var ref_date_min = new Date(ref_date_max.getTime());
  ref_date_min.setMonth(ref_date_min.getMonth() - 1);
  ref_date_max = addDays(ref_date_max, -  9);
  //ref_date_min = new Date(2015,8,1);
  //ref_date_max = new Date(2015,8,29);

  var dashboard = new google.visualization.ChartWrapper({
    'chartType': 'AreaChart',
    'view': {'columns': [0, 1, 2, 3, 4]},
    'options': {
      'chartArea': {
        'width': '90%',
        'height': '100%'
      },
      'hAxis': {
        'textPosition': 'in',
         'viewWindow': {
           'min': config.date.start,
           'max': config.date.end
          }
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
  dashboard.setContainerId(config.cumulativeChart);
  dashboard.setOption('height',624);
  return dashboard;
}

function buildDataTable(elementId) {
  return new google.visualization.Table(document.getElementById(elementId));
}

function buildTicketsTable(elementId) {
  var table = buildDataTable(elementId);
  google.visualization.events.addListener(table, 'select', function () {
    var rowNumber = table.getSelection()[0].row;
    window.open('http://jira.lan.courtanet.net/browse/' + rawData.getValue(rowNumber, 0) + '-' + rawData.getValue(rowNumber, 1), '_blank');
  });
  return table;
}
/***************************
 * CumulativFlowDashboard
 **************************/

function buildCumulativFlowDashboard() {
  var areaChart = new google.visualization.ChartWrapper({
    'chartType': 'AreaChart',
    'containerId': 'raw_data_cumulative_flow_area_chart_div',
    'view': {'columns': [0, 1, 2, 3, 4]},
    'options': {
      'height': 400,
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
        'gridlines': {count: 4},
      },
      'legend': {
        'position': 'in'
      }
    }
  });

  var chartRangeFilter = new google.visualization.ControlWrapper({
    'controlType': 'ChartRangeFilter',
    'containerId': 'raw_data_cumulative_flow_chart_range_filter_div',
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

  var dashboard = new google.visualization.Dashboard(document.getElementById('raw_data_cumulative_flow_dashboard_div'));
  dashboard.bind([chartRangeFilter], areaChart);

  return dashboard;
}

/***************************
 * TasksDurationDashboard
 **************************/

function buildTasksDurationDashboard(columnChart, filterListener) {
  var projectFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'raw_data_duration_project_filter_div',
    'options': {
      'filterColumnLabel': 'Project',
    },
  });

  var effortFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'raw_data_duration_effort_filter_div',
    'options': {
      'filterColumnLabel': 'Effort',
    },
  });

  var valueFilter = new google.visualization.ControlWrapper({
    'controlType': 'CategoryFilter',
    'containerId': 'raw_data_duration_value_filter_div',
    'options': {
      'filterColumnLabel': 'Value',
    },
  });

  var dateRangeFilter = new google.visualization.ControlWrapper({
    'controlType': 'DateRangeFilter',
    'containerId': 'raw_data_duration_date_range_filter_div',
    'options': {
      'filterColumnLabel': 'Release',
        'width': '90%',
    },
  });

  google.visualization.events.addListener(columnChart, 'select', function () {
    var rowNumber = columnChart.getChart().getSelection()[0].row;
    window.open('http://jira.lan.courtanet.net/browse/' + durationData.getValue(rowNumber, 0), '_blank');
  });

  var dashboard = new google.visualization.Dashboard(document.getElementById('raw_data_duration_dashboard_div'));
  dashboard.bind([effortFilter, valueFilter, dateRangeFilter, projectFilter], columnChart);

  google.visualization.events.addListener(effortFilter, 'statechange', filterListener);
  google.visualization.events.addListener(valueFilter, 'statechange', filterListener);
  google.visualization.events.addListener(projectFilter, 'statechange', filterListener);
  google.visualization.events.addListener(dateRangeFilter, 'statechange', filterListener);

  return dashboard;
}

function buildTasksDurationTable(){
  return new google.visualization.ChartWrapper({
    'chartType': 'Table',
    'containerId': 'raw_data_duration_table_div',
    'options': {
        width: '90%'
    }
  });
}

function buildTasksDurationColumnChart(){
  return new google.visualization.ChartWrapper({
    'chartType': 'ColumnChart',
    'containerId': 'raw_data_duration_column_chart_div',
    'view': {'columns': [0, 5, 6, 7]},
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
}