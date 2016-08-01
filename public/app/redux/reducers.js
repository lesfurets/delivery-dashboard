import { combineReducers } from 'redux'

const rawData = (state = null, action) => {
    switch (action.type) {
        case 'SET_RAW_DATA':
            return action.rawData
        default:
            return state
    }
}

const appReducer = combineReducers({
    rawData
})

export default appReducer