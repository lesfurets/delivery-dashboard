const RAW_DATA_COL = {
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

const REPORT_CONFIG = {
    first_entry: "2015-04",
    projection: [
        {position: 0, label: "Type", filterLabel: "Type"},
        {position: 1, label: "Effort", filterLabel: "Effort"}
    ]
}

const JIRA_DATA = {
    jql: "Workstream=Digital%20and%20cf%5B11729%5D%20is%20not%20null%20and%20value%20is%20not%20null",
    fields: "id,key,project,summary,fixVersions,assignee,issuetype,custom,customfield_11729,customfield_11730,customfield_11731,customfield_11732,customfield_10621,customfield_11010"
}

const MAP_SCATTER_DOT = function(task) {
    switch(task.filters[1]){
      case "XS":
        return 'point { size: 3; shape-type: circle; fill-color: #4CAF50; }';
      case "S":
        return 'point { size: 3; shape-type: circle; fill-color: #0091EA; }';
      case "M":
        return 'point { size: 3; shape-type: circle; fill-color: #311B92; }';
      case "L":
        return 'point { size: 3; shape-type: circle; fill-color: #B71C1C; }';
      default:
        return 'point { size: 3; shape-type: circle; fill-color: #000000; }';
    }
}