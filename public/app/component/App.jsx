import React from 'react';

function QuestionLoader(element, driveKey) {
    this.load = function() {
        var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/" + driveKey + "/gviz/tq?headers=1");
        // var query = new google.visualization.Query("https://docs.google.com/spreadsheets/d/" + "12BILxgrTxuB4wcn4wker42-q9Kn6-KHyvpt9cOHOvD4" + "/gviz/tq?headers=1");
        query.send(function (response) {
            var driveData = response.getDataTable();
            var driveQuestions = [];
            for (var i = 0; i < driveData.getNumberOfRows(); i++) {
                driveQuestions.push({id:i+1, label:driveData.getValue(i,1)});
            }
            element.setState({
              questions: driveQuestions
            });
        });
    }
}

class App extends React.Component {
    constructor(){
		super();
		this.state = {
			questions: [ {id:0, label:"Loading questions ..."} ]
		}
	}
    componentDidMount() {
        let questionLoader = new QuestionLoader(this, this.props.driveKey);
        questionLoader.load();
        setInterval(questionLoader.load, 5000);
    }
    render(){
        let row = this.state.questions.map(question => {
            return <QuestionPanel key={question.id} data={question}/>
        })
        return (
            <div className="question-list">
                {row}
            </div>
        )
    }
}

class QuestionPanel extends React.Component {
    constructor(){
		super();
		this.state = {
			active: true
		}
        this.update = this.update.bind(this);
	}
    update(e){
        this.setState({active: !this.state.active});
    }
    render(){
        let statusClass = this.state.active ? "card active" : "card inactive";
    	return (
            <div className={statusClass} onClick={this.update}>
                <div className="card-content">
                    {this.props.data.id} ) {this.props.data.label}
                </div>
            </div>
        )
    }
}

export default App
