var RAW_DATA_COL = {
    KEY: ["key"],
    SUMMARY: ["fields", "summary"],
    EVENTS: [
        {jiraField: ["fields", "customfield_11729"], label: 'Backlog', correction: -1},
        {jiraField: ["fields", "customfield_11730"], label: 'Analysis', correction: -0.5},
        {jiraField: ["fields", "customfield_11731"], label: 'Development', correction: -0.5},
        {jiraField: ["fields", "customfield_11732"], label: 'Ready To Release', correction: -1},
        {jiraField: ["fields", "fixVersions", 0, "releaseDate"], label: 'Released', correction: -1}
    ],
    FILTERS: [
        {jiraField: ["fields", "issuetype", "name"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Type'},
        {jiraField: ["fields", "customfield_10621","value"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Effort'},
        {jiraField: ["fields", "customfield_11010","value"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Value'},
        {jiraField: ["fields", "project","key"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Project'},
        {jiraField: ["fields", "customfield_11729"], dataType: "date", filterType: 'DateRangeFilter', label: 'Creation'},
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
    jql: "Workstream=Traffic%20and%20cf%5B11729%5D%20is%20not%20null%20and%20value%20is%20not%20null",
    fields: "id,key,project,summary,fixVersions,assignee,issuetype,custom,customfield_11729,customfield_11730,customfield_11731,customfield_11732,customfield_10621,customfield_11010"
}