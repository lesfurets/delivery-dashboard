import { combineReducers } from 'redux'

const taskList = (state = [], action) => {
    switch (action.type) {
        case 'SET_TASK_LIST':
            return action.taskList
        default:
            return state
    }
}

const appReducer = combineReducers({
    taskList
})

export default appReducer