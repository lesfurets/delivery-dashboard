import { parseJiraJson } from '../core/data/taskData'

export const fetchDataAction = (data) => {
    return {
        type: 'SET_TASK_LIST',
        taskList: parseJiraJson(data)
    }
}