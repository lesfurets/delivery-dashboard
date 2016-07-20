import {parseJiraData} from '../api/taskData'

export const fetchDataAction = (data) => {
    return {
        type: 'SET_RAW_DATA',
        rawData: parseJiraData(data)
    }
}