export const columnBuilder = function(type, label, calc) {
    return {type: type, label: label, calc: calc};
}

export const constantColumnBuilder = function(type, label, value) {
    return {
        type: type, label: label, calc: function () {
            return value;
        }
    };
}

export const aggregatorBuilder = function(column, type, aggregation) {
    return {column: column, type: type, aggregation: aggregation};
}
