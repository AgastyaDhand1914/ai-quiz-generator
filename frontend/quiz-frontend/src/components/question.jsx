import React from 'react'

const Question = ({question, id}) => {
  return (
    <>
        <h3>{id}: {question.question}</h3>
        { 
            Object.entries(question.options).map(([option, content], index) => (
                <h5 key={index}>{option}. {content}</h5>
            ))
        }
    </>
  )
}

export default Question