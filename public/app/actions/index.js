import jiraParser from '../api/jiraParser'

export const fetchDataAction = (data) => {
    return {
        type: 'SET_RAW_DATA',
        rawData: jiraParser(data)
    }
}