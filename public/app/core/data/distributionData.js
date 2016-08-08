export const computeDistribution = function (taskList, index) {
    var statsJson = taskList
        .map((task) => task.filters[index])
        .reduce((counter, item) => {
            counter[item] = counter.hasOwnProperty(item) ? counter[item] + 1 : 1;
            return counter;
        }, {});

    let statArray = [["Item", "Count"]];
    Object.keys(statsJson).forEach((key) => statArray.push([key, statsJson[key]]));

    return statArray;
}