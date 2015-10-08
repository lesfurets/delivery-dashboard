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

function filterLastMonth(inputData){
  var ref_date_max = new Date();
  var ref_date_min = new Date(ref_date_max.getTime());
  ref_date_min.setMonth(ref_date_min.getMonth() - 1);

  var view = new google.visualization.DataView(inputData);
  view.setRows(view.getFilteredRows([{
    column: RAW_DATA.RELEASE,
    minValue: ref_date_min
  }]));
  return view;
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

function computeDurationGroupedData(inputData, groupBy){
    var data = google.visualization.data.group(inputData, [groupBy], [{
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

function addDays(startDate,numberOfDays){
    var returnDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()+numberOfDays,
                startDate.getHours(),
                startDate.getMinutes(),
                startDate.getSeconds());
    return returnDate;
  }