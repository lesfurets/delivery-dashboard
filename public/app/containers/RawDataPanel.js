import React from 'react'
import { connect } from 'react-redux'
import { fetchDataAction } from '../actions'

 class RawDataPanel extends React.Component {
    render() {
        this.props.fetchData("Yattaaaaaa")
        return (
            <div>
                <p> Here is the test : {this.props.rawData} </p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rawData: state.rawData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (data) => {
            dispatch(fetchDataAction(data))
        }
    }
}

RawDataPanel = connect(mapStateToProps, mapDispatchToProps)(RawDataPanel)

export default RawDataPanel