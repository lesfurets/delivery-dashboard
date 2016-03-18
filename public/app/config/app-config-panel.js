var RAW_DATA_URL = '1fVsJzro7YZPAKOAMZQ3TKhEO7SXWSjQRAKYuVHtgaZY';

var RAW_DATA_COL = {
    PROJECT: 0,
    REF: 1,
    EVENTS: [
        {columnIndex: 6, label: 'Backlog', correction: - 1},
        {columnIndex: 7, label: 'Analysis', correction: - 0.5},
        {columnIndex: 8, label: 'Development', correction: - 0.5},
        {columnIndex: 9, label: 'Ready to release', correction: - 1},
        {columnIndex: 10, label: 'Released', correction: - 1}
    ],
    FILTERS: [
        {columnIndex: 2, filterType: 'CategoryFilter'},
        {columnIndex: 3, filterType: 'CategoryFilter'},
        {columnIndex: 4, filterType: 'CategoryFilter'},
        {columnIndex: 5, filterType: 'CategoryFilter'},
        //{columnIndex: 13, filterType: 'CategoryFilter'},
        {columnIndex: 6, filterType: 'DateRangeFilter'},
        {columnIndex: 10, filterType: 'DateRangeFilter'}
    ]
};