import {TASK_INDEX_FILTER_LAST} from "./taskData";
import {DATA_STRING} from "../definition";
import durationTooltip from "../tools/tooltip";
import {columnBuilder} from "./dataUtils";

export const computeDurations = function (taskList) {
    let header = ["Key"]
    for (let i = 0; i < RAW_DATA_COL.EVENTS.length - 1; i++) {
        header.push(RAW_DATA_COL.EVENTS[i].label);
    }

    let data = taskList.map((task) => {
        let line = new Array(RAW_DATA_COL.EVENTS.length);
        line[0] = task.key;
        task.durations.forEach((duration, index) => line[index + 1] = duration);
        return line;
    })

    data.unshift(header);

    return data;
}

// Adding statistics
// To have tendlines to show specific values (average, 50% and 90% lines), we only need to display 2 points
// in a new serie and to draw a trendline between them.
// That's why we are addind 3 columns at the end of the DataView.
// We feel these columns with the required value only if date is min date or max date (to have our points at
// the edge of the chart).
// ╔═══════╦═════════╦═════╦════════════╦═════════╗
// ║ Date  ║ Project ║ Ref ║ Cycle Time ║ Average ║
// ╠═══════╬═════════╬═════╬════════════╬═════════╣
// ║ 01/01 ║ TEST    ║   1 ║         16 ║      19 ║
// ║ 01/02 ║ TEST    ║   2 ║         18 ║         ║ ╗
// ║ 01/03 ║ TEST    ║   2 ║         18 ║         ║ ║> We Don't need to fill the value as we need 2 points
// ║ 01/04 ║ TEST    ║   3 ║         20 ║         ║ ╝
// ║ 01/05 ║ TEST    ║   4 ║         22 ║      19 ║
// ╚════════════════════════════════════╩═════════╝
//                    V                      V
//               Actual Data             Statistics
// We will then add new data series with these columns defining point size to 2 and adding a linear trend line.

export const computeDurationByDate = function (taskList) {
    let data = taskList.map((task, index) => {
        let line = new Array(6);
        line[0] = task.key;
        line[1] = task.cycleTime;
        line[2] = typeof MAP_SCATTER_DOT != "undefined" ? MAP_SCATTER_DOT(task) : 'point { size: 3; shape-type: circle; fill-color: #a52714; }';
        return line;
    })


    if(data.length > 0){

        let avg = data.reduce((acc, line) => acc + line[1],0) / data.length;

        let sortedData = data.map(line => line[1]).sort((a, b) => a - b);
        let pct90 = sortedData[Math.floor(data.length * 0.9)];
        let pct75 = sortedData[Math.floor(data.length * 0.75)];

        data[0][3] = avg;
        data[0][4] = pct75;
        data[0][5] = pct90;
        var lastLine = data.length-1;
        data[lastLine][3] = avg;
        data[lastLine][4] = pct75;
        data[lastLine][5] = pct90;

    }

    data.unshift(["Creation", "Cycle Time",{'type': 'string', 'role': 'style'}, "AVG", "75%", "90%"]);

    return data;
}

export const DURATION_INDEX_STATIC_FIRST = TASK_INDEX_FILTER_LAST + 1;
export const DURATION_INDEX_STATIC_GROUP_ALL = DURATION_INDEX_STATIC_FIRST;
export const DURATION_INDEX_STATIC_COUNT = DURATION_INDEX_STATIC_GROUP_ALL + 1;
export const DURATION_INDEX_STATIC_LAST = DURATION_INDEX_STATIC_COUNT;

export const DURATION_INDEX_DURATION_FIRST = DURATION_INDEX_STATIC_LAST + 1;

function tooltipColumnBuilder() {
    var tooltipColumn = columnBuilder(DATA_STRING, "Tooltip", durationTooltip);
    tooltipColumn.role = "tooltip";
    tooltipColumn.p = {'html': true};
    return tooltipColumn;

}

export const computeCycleTimeDistribution = function (taskList) {
  let accumulator = taskList.reduce((accumulator, task) => {
      if(typeof accumulator[task.cycleTime] !== "undefined"){
        accumulator[task.cycleTime]++;
        return accumulator;
      } else {
        accumulator[task.cycleTime]=1;
        return accumulator;
      }
    },{});

  var distribution = [];
  for(var x in accumulator){
    distribution.push([parseInt(x), accumulator[x]]);
  }

  distribution.unshift(["Cycle Time","Count"]);

  return distribution;
}