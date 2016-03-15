/***************************
 *  Distribution Data
 **************************/

function computeDistributionData(inputData) {
    var distributionDataStruct = Array.apply(null, {length: inputData.getNumberOfColumns()}).map(Number.call, Number);
    distributionDataStruct.push(constantColumnBuilder("number", "value", 0));

    var distributionData = new google.visualization.DataView(inputData);
    distributionData.setColumns(distributionDataStruct);

    return distributionData.toDataTable();
}

