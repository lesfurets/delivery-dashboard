var RAW_DATA_URL = '14-OdukK3LA9KNa0u-6T0Xl6qgQYmzoFSipIWV0UuEfA';

var RAW_DATA_COL = {
    PROJECT: 0,
    REF: 1,
    EVENTS: [
        {jiraField: ["fields", "customfield_11729"], label: 'Backlog', correction: -1},
        {jiraField: ["fields", "customfield_11730"], label: 'Analysis', correction: -0.5},
        {jiraField: ["fields", "customfield_11731"], label: 'Development', correction: -0.5},
        {jiraField: ["fields", "customfield_11732"], label: 'Ready To Release', correction: -1},
        {jiraField: ["fields", "fixVersions", 0, "releaseDate"], label: 'Released', correction: -1}
    ],
    FILTERS: [
        {columnIndex: 2, dataType: "string" ,filterType: 'CategoryFilter', label: 'Type'},
        {columnIndex: 3, dataType: "string" ,filterType: 'CategoryFilter', label: 'Effort'},
        {columnIndex: 4, dataType: "string" ,filterType: 'CategoryFilter', label: 'Value'},
        {columnIndex: 0, dataType: "string" ,filterType: 'CategoryFilter', label: 'Project'},
        {columnIndex: 5, dataType: "date", filterType: 'DateRangeFilter', label: 'Creation'},
        {jiraField: ["fields", "fixVersions", 0, "releaseDate"], dataType: "date", filterType: 'DateRangeFilter', label: 'Release'},
        {jiraField: ["fields", "fixVersions", 0, "name"], dataType: "string" , filterType: 'CategoryFilter', label: 'Version'},
        {jiraField: ["fields", "assignee", "key"], dataType: "string" , filterType: 'CategoryFilter', label: 'Assignee'}
    ]
};

var REPORT_CONFIG = {
    first_entry: "2015-06",
    projection: [
        {position: 0, filterLabel: "Type"},
        {position: 1, filterLabel: "Effort"}
    ]
}

var JIRA_DATA = {
    jql: "Workstream=Traffic",
    fields: "id,key,summary,fixVersions,assignee,custom,customfield_11729,customfield_11730,customfield_11731,customfield_11732"
}