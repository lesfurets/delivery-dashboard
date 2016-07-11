const rawData = (state = "Test", action) => {
    switch (action.type) {
        case 'SET_RAW_DATA':
            return action.rawData
        default:
            return state
    }
}

export default rawData