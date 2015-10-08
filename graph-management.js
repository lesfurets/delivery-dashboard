// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});

var eventData;
var durationData;

var extractData;



var extract_dashboard;
var cumulativFlowDashboard;
var tasksDurationTable;
var tasksDurationColumnChart;
var tasksDurationDashboard;

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(loadWidgets);
google.setOnLoadCallback(loadRawData);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function loadWidgets() {
  cumulativFlowDashboard = buildCumulativFlowDashboard();
  tasksDurationTable = buildTasksDurationTable();
  tasksDurationColumnChart = buildTasksDurationColumnChart();
  tasksDurationDashboard = buildTasksDurationDashboard(tasksDurationColumnChart, updateTable);
  extract_dashboard = buildExtractDashboard();
}

function loadRawData() {
  var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/14-OdukK3LA9KNa0u-6T0Xl6qgQYmzoFSipIWV0UuEfA/gviz/tq?sheet=RawData&headers=1");
  query.send(handleQueryRawDataQueryResponse);
}

function handleQueryRawDataQueryResponse(response) {
  var inputData = response.getDataTable();
  eventData = computeEventData(inputData);
  durationData = computeDurationData(inputData);
  extractData = filterLastMonth(inputData);
  initExtractHeader(extractData);
  initDurationsStats(extractData);
  drawCharts();
  window.onload = drawCharts;
  window.onresize = drawCharts;
}

function drawCharts() {
  if (eventData != null) {
    cumulativFlowDashboard.draw(eventData);
  }
  if (durationData != null) {
    tasksDurationDashboard.draw(durationData);
    updateTableWithData(durationData);
  }
  if (extractData != null) {
    extract_dashboard.setDataTable(computeEventData(extractData));
    extract_dashboard.draw();
    var table = new google.visualization.Table(document.getElementById('extract_ticket_list'));

    google.visualization.events.addListener(table, 'select', function () {
      var rowNumber = table.getSelection()[0].row;
      window.open('http://jira.lan.courtanet.net/browse/' + extractData.getValue(rowNumber, 0) + '-' + extractData.getValue(rowNumber, 1), '_blank');
    });

    table.draw(extractData, {showRowNumber: true});
  }
}

Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
} 

function initExtractHeader(inputData){
  $("#week_count").text(new Date().getWeek());
  var ticketsNb = inputData.getNumberOfRows()
  var units =  ticketsNb > 1 ? "s" : "";
  $("#tickets_count").text(ticketsNb + " ticket" + units);
}

function initDurationsStats(inputData){
  var durations = computeDurationGroupedData(computeDurationData(inputData),1);
  var table = new google.visualization.Table(document.getElementById('export_duration_details_table'));
  table.draw(durations, {showRowNumber: false, width: '100%', height: '100%'});
}

/***************************
 * ExtractDashboard
 **************************/

function buildExtractDashboard() {
  var ref_date_max = new Date();
  var ref_date_min = new Date(ref_date_max.getTime());
  ref_date_min.setMonth(ref_date_min.getMonth() - 1);
  ref_date_max = addDays(ref_date_max, -  9);

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
            'min': ref_date_min,
            'max': ref_date_max
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
  dashboard.setContainerId('extract_cumulativ_chart');
  dashboard.setOption('height',624);
  return dashboard;
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
      },
    }
  });
}

function updateTable() {
  updateTableWithData(tasksDurationColumnChart.getDataTable())
};

function updateTableWithData(inputData) {
  tasksDurationTable.setDataTable(computeDurationGroupedData(inputData,10));
  tasksDurationTable.draw();
};