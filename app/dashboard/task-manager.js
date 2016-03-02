function TaskManager() {
    var initialized = false;

    this.initWidgets = function () {
        var iframe = $('iframe');
        if (iframe.attr('src') == "") {
            iframe.attr('src', function () {
                return 'https://docs.google.com/spreadsheets/d/' + RAW_DATA_URL + '/edit?usp=sharing&single=true&gid=0&range=A1%3AE4&output=html';
            });
        }
        initialized = true;
    };

    this.isInitialized = function () {
        return initialized;
    };

    this.loadData = function (data) { };

    this.refresh = function () { };

}