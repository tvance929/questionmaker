import React, { Component, PropTypes } from 'react';
import { Questions } from '../../api/questions.js';

export default class Question extends Component {
    toggleLocked() {
        event.preventDefault();
        Questions.update(this.props.question._id,
            { $set : { locked : !this.props.question.locked }}
        );
    }

    deleteThisTask() {
        Questions.remove(this.props.question._id);
    }

    setSelected() {
        this.props.onEditQuestion(this.props.question._id);
    }

    render() {
        const questionClassName = this.props.question.locked ? 'locked' : '';

        return (
            <li className={questionClassName}>
                <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                    &times;
                </button>
                <span className="icon">
                    <img src="/lock.png" onClick={this.toggleLocked.bind(this)} />
                    { !this.props.question.locked && <img src="/pencil.png"  onClick={this.setSelected.bind(this)}/>}
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