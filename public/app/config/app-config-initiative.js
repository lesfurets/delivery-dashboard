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
        {jiraField: ["fields", "project","key"], dataType: "string" ,filterType: 'CategoryFilter', label: 'Project'},
        {jiraField: ["fields", "customfield_11729"], dataType: "date", filterType: 'DateRangeFilter', label: 'Creation'},
        {jiraField: ["fields", "fixVersions", 0, "releaseDate"], dataType: "date", filterType: 'DateRangeFilter', label: 'Release'},
    ]
};

const REPORT_CONFIG = {
    first_entry: "2015-06",
    projection: {position: 0, filterLabel: "Type"}
}

const JIRA_DATA = {
    jql: "project%20in%20(AMX)%20AND%20issuetype%20in%20(Initiative)",
    fields: "id,key,summary,fixVersions,assignee,custom,customfield_11729,customfield_11730,customfield_11731,customfield_11732"
}