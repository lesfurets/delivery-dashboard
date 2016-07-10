import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import rawData from './rawData'

const todoApp = combineReducers({
    todos,
    visibilityFilter,
    rawData
})

export default todoApp