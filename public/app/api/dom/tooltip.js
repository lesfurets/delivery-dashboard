var durationTooltipGenerator = function(table, row) {
    var html = [];
    html.push("<h4>" + table.getValue(row, TASK_INDEX_STATIC_REFERENCE) + "</h4>");
    html.push("<p>" + table.getValue(row, TASK_INDEX_STATIC_SYMMARY) + "</p>");

    html.push("<p>");
    RAW_DATA_COL.EVENTS.forEach(function (element, index) {
        html.push("<i>" + table.getColumnLabel(DURATION_INDEX_DURATION_FIRST + index) + "</i>" + " : "
            + table.getValue(row, DURATION_INDEX_DURATION_FIRST + index) + "<br>");
    });
    html.push("</p>");

    return "<div class='chart-tooltip'>" + html.join("") + "</div>";
};