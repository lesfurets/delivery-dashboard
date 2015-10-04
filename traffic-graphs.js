// Load the Visualization API and the piechart package.
google.load('visualization', '1.0', {'packages': ['controls', 'corechart', 'table']});

var eventData;
var cumulativFlowDashboard;
var durationData;
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
}

function loadRawData() {
  var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/14-OdukK3LA9KNa0u-6T0Xl6qgQYmzoFSipIWV0UuEfA/gviz/tq?sheet=RawData&headers=1");
  query.send(handleQueryRawDataQueryResponse);
}

function handleQueryRawDataQueryResponse(response) {
  var inputData = response.getDataTable();
  eventData = computeEventData(inputData);
  durationData = computeDurationData(inputData);
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
  tasksDurationTable.setDataTable(computeDurationGroupedData(inputData));
  tasksDurationTable.draw();
};

/***************************
 *       ComputeData
 **************************/

var RAW_DATA = {
  PROJECT: 0,
  REF: 1,
  EFFORT: 2,
  VALUE: 3,
  CREATION: 4,
  ANALYSIS: 5,
  DEVELOPMENT: 6,
  RELEASE: 7
}

function computeEventData(inputData) {
  var data = builtEventDataStructure(inputData);
  for (var i = 0; i < inputData.getNumberOfRows(); i++) {
    data.addRow([inputData.getValue(i, RAW_DATA.CREATION), 1, 0, 0, 0]);
    data.addRow([inputData.getValue(i, RAW_DATA.ANALYSIS), 0, 1, 0, 0]);
    data.addRow([inputData.getValue(i, RAW_DATA.DEVELOPMENT), 0, 0, 1, 0]);
    data.addRow([inputData.getValue(i, RAW_DATA.RELEASE), 0, 0, 0, 1]);
  }
  var eventData = google.visualization.data.group(data, [{
    column: 0,
    type: 'date'
  }], [{
    column: 1,
    aggregation: google.visualization.data.sum,
    type: 'number'
  }, {
    column: 2,
    aggregation: google.visualization.data.sum,
    type: 'number'
  }, {
    column: 3,
    aggregation: google.visualization.data.sum,
    type: 'number'
  }, {
    column: 4,
    aggregation: google.visualization.data.sum,
    type: 'number'
  }]);
  var cumulativEventData = builtEventDataStructure(inputData);
  for (var i = 0; i < eventData.getNumberOfRows(); i++) {
    cumulativEventData.addRow([eventData.getValue(i, 0),
      cumputeCumulativeValue(i, 1, eventData, cumulativEventData),
      cumputeCumulativeValue(i, 2, eventData, cumulativEventData),
      cumputeCumulativeValue(i, 3, eventData, cumulativEventData),
      cumputeCumulativeValue(i, 4, eventData, cumulativEventData)]);
  }
  return cumulativEventData;
}

function builtEventDataStructure(inputData) {
  var data = new google.visualization.DataTable();
  data.addColumn('date', "EventDate");
  data.addColumn('number', inputData.getColumnLabel(RAW_DATA.CREATION));
  data.addColumn('number', inputData.getColumnLabel(RAW_DATA.ANALYSIS));
  data.addColumn('number', inputData.getColumnLabel(RAW_DATA.DEVELOPMENT));
  data.addColumn('number', inputData.getColumnLabel(RAW_DATA.RELEASE));
  return data;
}

function cumputeCumulativeValue(rowIndex, columnIndex, inputData, cumulativData) {
  return (rowIndex == 0) ? inputData.getValue(rowIndex, columnIndex) : inputData.getValue(rowIndex, columnIndex) + cumulativData.getValue(rowIndex - 1, columnIndex);
}

function computeDurationData(inputData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', "Tasks");
    data.addColumn('string', "Project");
    data.addColumn('date', 'Release');
    data.addColumn('string', inputData.getColumnLabel(RAW_DATA.EFFORT));
    data.addColumn('string', inputData.getColumnLabel(RAW_DATA.VALUE));
    data.addColumn('number', "Backlog");
    data.addColumn('number', "Analysis");
    data.addColumn('number', "Development");
    data.addColumn('number', "Total");
    data.addColumn('number', "Tasks");
    data.addColumn('string', "");
    for (var i = 0; i < inputData.getNumberOfRows(); i++) {
        var backlogDuration = duration(inputData, i, RAW_DATA.CREATION, RAW_DATA.ANALYSIS);
        var analysisDuration = (duration(inputData, i, RAW_DATA.ANALYSIS, RAW_DATA.DEVELOPMENT) + 0.5);
        var developmentDuration = (duration(inputData, i, RAW_DATA.DEVELOPMENT, RAW_DATA.RELEASE) + 0.5);
        data.addRow([inputData.getValue(i, RAW_DATA.PROJECT) + '-' + inputData.getValue(i, RAW_DATA.REF),
            inputData.getValue(i, RAW_DATA.PROJECT),
            inputData.getValue(i, RAW_DATA.RELEASE),
            inputData.getValue(i, RAW_DATA.EFFORT),
            inputData.getValue(i, RAW_DATA.VALUE),
            backlogDuration,
            analysisDuration,
            developmentDuration,
            backlogDuration + analysisDuration + developmentDuration,
            1,
            'Selection']);
    }
    return data;
}

function computeDurationGroupedData(inputData){
    var data = google.visualization.data.group(inputData, [10], [{
          column: 9,
          aggregation: google.visualization.data.sum,
          type: 'number'
      },{
          column: 5,
          aggregation: google.visualization.data.avg,
          type: 'number'
      }, {
          column: 6,
          aggregation: google.visualization.data.avg,
          type: 'number'
      }, {
          column: 7,
          aggregation: google.visualization.data.avg,
          type: 'number'
      }, {
          column: 8,
          aggregation: google.visualization.data.avg,
          type: 'number'
      }]);
    var formatter = new google.visualization.NumberFormat({suffix: ' day(s)'});
    formatter.format(data, 2);
    formatter.format(data, 3);
    formatter.format(data, 4);
    formatter.format(data, 5);
    return data
}

function duration(data, row, from, to) {
  return (data.getValue(row, to) - data.getValue(row, from)) / (1000 * 60 * 60 * 24);
}