import React from 'react'
import Option from './option'

const Question = ({ question, id, qKey, selected, onSelect, disabled }) => {
  return (
    <>
        <h3>{id}: {question.question}</h3>
        { 
            Object.entries(question.options).map(([option, content], index) => (
                <Option
                  key={index}
                  selected={selected === option}
                  disabled={disabled}
                  onClick={() => onSelect(qKey, option)}
                >
                  {option}. {content}
                </Option>
            ))
        }
    </>
  )
}

export default Question