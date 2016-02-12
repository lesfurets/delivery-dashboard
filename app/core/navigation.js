// Reading url to selecting to the tab to display (format: base_url#<tab_id>)
var requestedUrl = document.location.toString();
if (requestedUrl.match('#')) {
    $(document).ready(function () {
        $('.navbar .dropdown-menu a[href=#' + requestedUrl.split('#')[1] + ']').tab('show');
    });
}

// Changing url to fit the displayed tab
$(document).on('ready', function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");
        var currentUrl = document.location.toString();
        var baseUrl = currentUrl.match('#') ? url.split('#')[0] : currentUrl;
        document.location = baseUrl + target;
    });
});