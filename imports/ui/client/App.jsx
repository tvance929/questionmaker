import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Questions } from '../../api/questions';
import Question from './Question.jsx';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            hideCompleted : false,
            text: '',
            _id: '',
        };

        this.onEditQuestion = this.onEditQuestion.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.onContentChanged = this.onContentChanged.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        const { text, content, _id } = this.state;

        if (_id === '') {
           Questions.insert({ text, content, createdAt: new Date(), });
        }
        else {
            Questions.update(_id, { $set : { text, content }});
        }

        this.setState({
            text: '',
            content: '',
            _id: ''
        });
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    onEditQuestion(questionId) {
        const question = Questions.findOne(questionId);
        this.setState({
            text: question.text,
            content: question.content,
            _id: questionId,
        });
    }

    onTextChanged(event) {
        this.setState({
            text: event.target.value,
        });
    }

    onContentChanged(event) {
        this.setState({
            content: event.target.value,
        });
    }

    renderQuestions() {
        let filteredQuestions = this.props.questions;

        if (this.state.hideCompleted) {
            filteredQuestions = filteredQuestions.filter(question => !question.checked);
        }

        return filteredQuestions.map((question) => (
                <Question
                    key={question._id}
                    question={question}
                    onEditQuestion={this.onEditQuestion}
                />
        ));
    }

    render() {
        return (
             <div className="container">
                 <header>
                     <h1>Collaborative Question Maker. </h1>
                     <label className="hide-completed">
                     <input type="checkbox" readonly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
                                           Hide Locked Questions
                     </label>
                     <h5>Questions locked = {this.props.lockedCount}</h5>
                     <form className="new-question" onSubmit={this.handleSubmit.bind(this)}>
                         <input type="text" ref="textInput" placeholder="Type a new question." value={this.state.text } onChange={this.onTextChanged}  />
                         <input type="text" ref="textContent" placeholder="Type new content." value={this.state.content} onChange={this.onContentChanged} />
                         <input type="submit" id="formSubmit" />
                      </form>
                      <p className="emphasis">Hit Enter to submit.</p>
                 </header>

                 <ul>
                     {this.renderQuestions()}
                 </ul>
             </div>);
    }
}

App.propTypes = {
    questions: PropTypes.array.isRequired,
    lockedCount : PropTypes.number.isRequired,
};

export default createContainer(() => {
    return {
        questions: Questions.find({}, { sort: { createdAt : -1 } }).fetch(),
        lockedCount : Questions.find({checked: {$ne: false } }).count(),
    };
}, App);
