import { TASK_INDEX_FILTER_LAST } from './taskData'
import { constantColumnBuilder } from './dataUtils'

export const DISTRIBUTION_INDEX_STATIC_GROUP_ALL = TASK_INDEX_FILTER_LAST + 1;

export const computeDistributionData = function(inputData) {
    var distributionDataStruct = Array.apply(null, {length: inputData.getNumberOfColumns()}).map(Number.call, Number);
    distributionDataStruct.push(constantColumnBuilder("number", "value", 0));

    var distributionData = new google.visualization.DataView(inputData);
    distributionData.setColumns(distributionDataStruct);

    return distributionData.toDataTable();
}

