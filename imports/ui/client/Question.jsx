import React, { Component, PropTypes } from 'react';
import { Questions } from '../../api/questions.js';

class Question extends Component {
    constructor(props) {
        super(props);

        this.toggleLocked = this.toggleLocked.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.setSelected = this.setSelected.bind(this);
    }

    toggleLocked() {
        event.preventDefault();
        Questions.update(this.props.question._id,
            { $set : { locked : !this.props.question.locked }}
        );
    }

    deleteQuestion() {
        Questions.remove(this.props.question._id);
    }

    setSelected() {
        this.props.onEditQuestion(this.props.question._id);
    }

    render() {
        const questionClassName = this.props.question.locked ? 'locked' : '';

        return (
            <li className={questionClassName}>
                <button className="delete" onClick={this.deleteQuestion}>
                    &times;
                </button>
                <span className="icon">
                    { this.props.question.locked && <img src="/unlock.png" onClick={this.toggleLocked} /> }
                    { !this.props.question.locked && <img src="/lock.png" onClick={this.toggleLocked} />}
                    { !this.props.question.locked && <img src="/pencil.png"  onClick={this.setSelected}/>}
                </span>
                <span className="text qText"><em>{this.props.question.text}</em><br/>{this.props.question.content}</span>
            </li>
        );
    }
}

Question.propTypes = {
    question: PropTypes.object.isRequired,
    onEditQuestion: PropTypes.func.isRequired,
}

export default Question;
