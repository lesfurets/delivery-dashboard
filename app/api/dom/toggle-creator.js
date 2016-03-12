/***************************
 *     Toggle Filter
 **************************/

function generateToggleFilter(viewId, dashboard) {
    if(REPORT_CONFIG.projection.length < 2){
        return;
    }
    var choice1Id = viewId + "_" + "choice_1";
    var choice2Id = viewId + "_" + "choice_2";
    var widgetId = viewId + "_" + "widget";
    $("#" + viewId + ID_SWITCH)
        .append($('<div>').attr('id', choice1Id).addClass("switch-label").text(REPORT_CONFIG.projection[0].filterLabel))
        .append($('<div>').attr('id', widgetId).addClass("switch-widget"))
        .append($('<div>').attr('id', choice2Id).addClass("switch-label").text(REPORT_CONFIG.projection[1].filterLabel));

    //Manage the switch
    $('#' + choice1Id).click(function () {
        $("#" + viewId + ID_SWITCH).removeClass("switched");
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST);
    });
    $('#' + choice2Id).click(function () {
        $("#" + viewId + ID_SWITCH).addClass("switched");
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST + 1);
    });
    $('#' + widgetId).click(function () {
        $("#" + viewId + ID_SWITCH).toggleClass("switched");
        var filterIndex = $("#" + viewId + ID_SWITCH).hasClass("switched") ? 1 : 0;
        dashboard.resetReduce(DURATION_INDEX_FILTER_FIRST + (REPORT_CONFIG.projection[filterIndex].position));
    });
}
