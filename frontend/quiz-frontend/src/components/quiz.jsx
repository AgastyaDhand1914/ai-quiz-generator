import React, { useState } from 'react';
import Question from './question';

const Quiz = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (questionKey, selectedOption) => {
    setSelectedAnswers(prev => ({ ...prev, [questionKey]: selectedOption }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    Object.entries(questions).forEach(([key, q]) => {
      if (selectedAnswers[key] && selectedAnswers[key] === q.answer) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  return (
    <>
        {
            questions && Object.entries(questions).map(([key, q]) => (
                <Question 
                  question={q} 
                  id={`Q${key}`} 
                  key={key}
                  qKey={key}
                  selected={selectedAnswers[key]}
                  onSelect={handleOptionSelect}
                  disabled={submitted}
                />
            ))
        }
        {!submitted && (
          <button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length !== Object.keys(questions).length}>
            Submit
          </button>
        )}
        {submitted && (
          <div>
            <h3>Your Score: {score} / {Object.keys(questions).length}</h3>
          </div>
        )}
    </>
  )
}

export default Quiz