var RAW_DATA_URL = '14-OdukK3LA9KNa0u-6T0Xl6qgQYmzoFSipIWV0UuEfA';

var RAW_DATA_COL = {
    PROJECT: 0,
    REF: 1,
    EVENTS: [
        {columnIndex: 5, label: 'Backlog', correction: -1},
        {columnIndex: 6, label: 'Analysis', correction: -0.5},
        {columnIndex: 7, label: 'Development', correction: -0.5},
        {columnIndex: 8, label: 'Ready To Release', correction: -1},
        {jiraField: ["fields", "fixVersions", 0, "releaseDate"], label: 'Released', correction: -1}
    ],
    FILTERS: [
        {columnIndex: 2, filterType: 'CategoryFilter', label: 'Type'},
        {columnIndex: 3, filterType: 'CategoryFilter', label: 'Effort'},
        {columnIndex: 4, filterType: 'CategoryFilter', label: 'Value'},
        {columnIndex: 0, filterType: 'CategoryFilter', label: 'Project'},
        {columnIndex: 5, filterType: 'DateRangeFilter', label: 'Creation'},
        {jiraField: ["fields", "fixVersions", 0, "releaseDate"], filterType: 'DateRangeFilter', label: 'Release'},
        {jiraField: ["fields", "fixVersions", 0, "name"], filterType: 'CategoryFilter', label: 'Version'}
    ]
};

var REPORT_CONFIG = {
    first_entry: "2015-06",
    projection: [
        {position: 0, filterLabel: "Type"},
        {position: 1, filterLabel: "Effort"}
    ]
}

var JIRA_DATA = "jira-data.json"