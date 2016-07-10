const rawData = (state = "Test", action) => {
    console.log(state)
    switch (action.type) {
        case 'SET_RAW_DATA':
            return action.rawData
        default:
            return state
    }
}

export default rawData