// We want to extract all events from a task
// Input :
// ╔═══════╦═════════╦═════════╦═════════╗
// ║ Ref   ║ Event 1 ║ Event 2 ║ Event 3 ║
// ╠═══════╬═════════╬═════════╬═════════╣
// ║Task 1 ║ 01/01   ║ 01/02   ║ 01/03   ║
// ║Task 2 ║ 01/01   ║ 01/04   ║ 01/04   ║
// ╚═══════╩═════════╩═════════╩═════════╝
// Output :
// ╔═══════╦═════════╦═════════╦═════════╗
// ║ Date  ║ Event 1 ║ Event 2 ║ Event 3 ║
// ╠═══════╬═════════╬═════════╬═════════╣
// ║ 01/01 ║       2 ║       0 ║       0 ║
// ║ 01/02 ║       0 ║       1 ║       0 ║
// ║ 01/03 ║       0 ║       0 ║       1 ║
// ║ 01/04 ║       0 ║       1 ║       1 ║
// ╚═══════╩═════════╩═════════╩═════════╝
// Then we build a cumulative table
// ╔═══════╦═════════╦═════════╦═════════╗
// ║ Date  ║ Event 1 ║ Event 2 ║ Event 3 ║
// ╠═══════╬═════════╬═════════╬═════════╣
// ║ 01/01 ║       2 ║       0 ║       0 ║
// ║ 01/02 ║       2 ║       1 ║       0 ║
// ║ 01/03 ║       2 ║       2 ║       1 ║
// ║ 01/04 ║       2 ║       2 ║       2 ║
// ╚═══════╩═════════╩═════════╩═════════╝

export const computeEvent = function (taskList) {
    let statByDateMap = {};
    taskList.forEach((task) => {
        for (var i = 0; i < task.events.length && task.events[i] != null; i++) {
            let fotmatedDate = task.events[i].formatYYYYMMDD();
            if (!(fotmatedDate in statByDateMap)) {
                statByDateMap[fotmatedDate] = new EventCounter(task.events[i]);
            }
            statByDateMap[fotmatedDate].counters[i]++;
        }
    });

    let cumulativeStats = [];
    Object.keys(statByDateMap).sort()
        .map((date) => statByDateMap[date])
        .reduce((a,b,i) => cumulativeStats[i] = b.add(a), new EventCounter());

    let header = ["Date"]
    RAW_DATA_COL.EVENTS.forEach((event) => header.push(event.label));

    let cumulativeArray = [header];
    cumulativeStats.forEach((counter) => cumulativeArray.push(counter.toArray()))

    return cumulativeArray;
}

class EventCounter {
    constructor(date) {
        this.date = date;
        this.counters = Array.apply(null, {length: RAW_DATA_COL.EVENTS.length}).map(Number.prototype.valueOf, 0);
    }

    add(counter) {
        RAW_DATA_COL.EVENTS.forEach((event, index) => this.counters[index] = this.counters[index] + counter.counters[index]);
        return this;
    }

    toArray() {
        let eventArray = [this.date];
        this.counters.forEach((counter) => eventArray.push(counter));
        return eventArray;
    }
}

