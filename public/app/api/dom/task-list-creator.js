/***************************
 *     Task List
 **************************/

var createDomForTaskList = function (viewId) {
    // Creating Dom structure for bootstrap Modal
    $("#" + viewId)
        .append($('<div>')
            .attr('id', viewId + ID_TASK_LIST_MODAL)
            .attr('role', "dialog")
            .addClass("modal ticket-list fade")
            .append($('<div>').addClass("modal-dialog")
                .append($('<div>').addClass("modal-content")
                    .append($('<div>').addClass("modal-header")
                        .append($('<button>')
                            .attr('type', "button")
                            .attr('data-dismiss', "modal")
                            .addClass("close").html("&times;"))
                        .append($('<h4>')
                            .addClass("modal-title")
                            .text("Tasks list")))
                    .append($('<div>').addClass("modal-body")
                        .append($('<div>')
                            .attr('id', viewId + ID_TASK_LIST)
                            .addClass("col-md-12")))
                    .append($('<div>').addClass("modal-footer")
                        .append($('<button>')
                            .attr('type', "button")
                            .attr('data-dismiss', "modal")
                            .addClass("btn btn-default")
                            .text("Close"))))));
};


