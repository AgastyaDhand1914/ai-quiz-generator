import React from 'react'
import Option from './option'
import './question.css'

const Question = ({ question, id, qKey, selected, correctAnswer, onSelect, disabled, submitted }) => {
  return (
    <>
      <div className="question-text">{id}: {question.question}</div>
      <div className="options-container">
        {Object.entries(question.options).map(([option, content], index) => (
          <Option
            key={index}
            selected={selected === option}
            disabled={disabled}
            onClick={() => onSelect(qKey, option)}
            isCorrect={option === correctAnswer}
            submitted={submitted}
          >
            {option}. {content}
          </Option>
        ))}
      </div>
    </>
  )
}

export default Question